import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StatusRecebivel, MetodoPagamento } from '@prisma/client';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';

@Injectable()
export class ContasReceberService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: {
      eventId?: string;
      status?: StatusRecebivel;
      adquirente?: string;
      dataInicio?: string;
      dataFim?: string;
      search?: string;
    },
    user?: JwtPayload,
  ) {
    const where: any = {};

    // Isolamento multi-tenant: produtor só visualiza recebíveis dos seus próprios eventos
    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.event = { producerId: user.producerId || 'none' };
    } else if (filters.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.adquirente) {
      where.adquirente = { contains: filters.adquirente, mode: 'insensitive' };
    }

    if (filters.dataInicio || filters.dataFim) {
      where.dataVencimento = {};
      if (filters.dataInicio) {
        where.dataVencimento.gte = new Date(filters.dataInicio);
      }
      if (filters.dataFim) {
        where.dataVencimento.lte = new Date(filters.dataFim);
      }
    }

    if (filters.search) {
      where.OR = [
        { transacaoRef: { contains: filters.search, mode: 'insensitive' } },
        { adquirente: { contains: filters.search, mode: 'insensitive' } },
        { event: { nome: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const items = await this.prisma.accountReceivable.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            nome: true,
            producer: {
              select: {
                id: true,
                nomeFantasia: true,
              },
            },
          },
        },
      },
      orderBy: { dataVencimento: 'asc' },
    });

    return items.map((r) => ({
      id: r.id,
      eventId: r.eventId,
      eventNome: r.event?.nome,
      producerNome: r.event?.producer?.nomeFantasia,
      adquirente: r.adquirente,
      metodo: r.metodo,
      transacaoRef: r.transacaoRef,
      valorBruto: Number(r.valorBruto),
      taxaMdr: Number(r.taxaMdr),
      valorLiquido: Number(r.valorLiquido),
      dataVencimento: r.dataVencimento.toISOString(),
      dataRecebimento: r.dataRecebimento ? r.dataRecebimento.toISOString() : null,
      status: r.status,
      antecipado: r.antecipado,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async getKpis(eventId?: string, user?: JwtPayload) {
    const where: any = {};

    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.event = { producerId: user.producerId || 'none' };
    } else if (eventId) {
      where.eventId = eventId;
    }

    const receivables = await this.prisma.accountReceivable.findMany({ where });

    let totalBruto = 0;
    let totalLiquido = 0;
    let totalMdr = 0;
    let totalRecebido = 0;
    let totalAVencer = 0;
    let totalVencido = 0;
    let totalAntecipado = 0;

    const now = new Date();

    for (const r of receivables) {
      const bruto = Number(r.valorBruto);
      const liq = Number(r.valorLiquido);
      const mdr = Number(r.taxaMdr);

      totalBruto += bruto;
      totalLiquido += liq;
      totalMdr += mdr;

      if (r.status === StatusRecebivel.RECEBIDO) {
        totalRecebido += liq;
      } else if (r.status === StatusRecebivel.ANTECIPADO) {
        totalAntecipado += liq;
        totalRecebido += liq;
      } else if (r.status === StatusRecebivel.A_VENCER) {
        if (new Date(r.dataVencimento) < now) {
          totalVencido += liq;
        } else {
          totalAVencer += liq;
        }
      } else if (r.status === StatusRecebivel.VENCIDO) {
        totalVencido += liq;
      }
    }

    return {
      totalBruto,
      totalLiquido,
      totalMdr,
      totalRecebido,
      totalAVencer,
      totalVencido,
      totalAntecipado,
      contagemTitulos: receivables.length,
    };
  }

  async antecipar(id: string, user: JwtPayload) {
    const receivable = await this.prisma.accountReceivable.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!receivable) {
      throw new NotFoundException('Recebível não encontrado');
    }

    if (receivable.status === StatusRecebivel.RECEBIDO || receivable.status === StatusRecebivel.ANTECIPADO) {
      throw new BadRequestException('Título já liquidado ou antecipado');
    }

    // Taxa de antecipação contratual padrão: 1.8%
    const taxaAntecipacao = Number(receivable.valorLiquido) * 0.018;
    const valorLiquidoFinal = Number(receivable.valorLiquido) - taxaAntecipacao;

    const updated = await this.prisma.accountReceivable.update({
      where: { id },
      data: {
        status: StatusRecebivel.ANTECIPADO,
        antecipado: true,
        dataRecebimento: new Date(),
        valorLiquido: valorLiquidoFinal,
      },
    });

    // Registra lançamento no Fluxo de Caixa
    const ultimoSaldo = await this.prisma.financialTransaction.findFirst({
      orderBy: { dataLancamento: 'desc' },
      select: { saldoApos: true },
    });
    const saldoAnterior = ultimoSaldo ? Number(ultimoSaldo.saldoApos) : 100000;

    await this.prisma.financialTransaction.create({
      data: {
        tipo: 'ENTRADA',
        descricao: `Antecipação ${receivable.adquirente} - Ref: ${receivable.transacaoRef}`,
        valor: valorLiquidoFinal,
        categoria: 'ANTECIPACAO_CARTAO',
        referenciaTipo: 'RECEBIVEL',
        referenciaId: receivable.id,
        contaBancaria: 'Conta Movimento Itaú',
        saldoApos: saldoAnterior + valorLiquidoFinal,
      },
    });

    return updated;
  }

  async baixar(id: string, user: JwtPayload) {
    const receivable = await this.prisma.accountReceivable.findUnique({
      where: { id },
    });

    if (!receivable) {
      throw new NotFoundException('Recebível não encontrado');
    }

    if (receivable.status === StatusRecebivel.RECEBIDO) {
      throw new BadRequestException('Recebível já foi baixado');
    }

    const updated = await this.prisma.accountReceivable.update({
      where: { id },
      data: {
        status: StatusRecebivel.RECEBIDO,
        dataRecebimento: new Date(),
      },
    });

    // Registra entrada no fluxo de caixa
    const ultimoSaldo = await this.prisma.financialTransaction.findFirst({
      orderBy: { dataLancamento: 'desc' },
      select: { saldoApos: true },
    });
    const saldoAnterior = ultimoSaldo ? Number(ultimoSaldo.saldoApos) : 100000;

    await this.prisma.financialTransaction.create({
      data: {
        tipo: 'ENTRADA',
        descricao: `Liquidação Gateway ${receivable.adquirente} - Ref: ${receivable.transacaoRef}`,
        valor: Number(receivable.valorLiquido),
        categoria: 'RECEBIMENTO_GATEWAY',
        referenciaTipo: 'RECEBIVEL',
        referenciaId: receivable.id,
        contaBancaria: 'Conta Movimento Itaú',
        saldoApos: saldoAnterior + Number(receivable.valorLiquido),
      },
    });

    return updated;
  }
}
