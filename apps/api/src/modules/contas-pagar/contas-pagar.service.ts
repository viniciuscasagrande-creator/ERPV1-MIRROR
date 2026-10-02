import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { StatusContaPagar, CategoriaDespesa } from '@prisma/client';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';

@Injectable()
export class ContasPagarService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: {
      status?: StatusContaPagar;
      categoria?: CategoriaDespesa;
      eventId?: string;
      dataInicio?: string;
      dataFim?: string;
      search?: string;
    },
    user?: JwtPayload,
  ) {
    const where: any = {};

    // Segurança Multi-tenant: Produtor apenas vê contas a pagar ligadas aos seus próprios eventos
    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.event = { producerId: user.producerId || 'none' };
    } else if (filters.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.categoria) {
      where.categoria = filters.categoria;
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
        { descricao: { contains: filters.search, mode: 'insensitive' } },
        { fornecedorNome: { contains: filters.search, mode: 'insensitive' } },
        { fornecedorCpfCnpj: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.accountPayable.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: { dataVencimento: 'asc' },
    });

    return items.map((p) => ({
      id: p.id,
      descricao: p.descricao,
      categoria: p.categoria,
      fornecedorNome: p.fornecedorNome,
      fornecedorCpfCnpj: p.fornecedorCpfCnpj,
      valor: Number(p.valor),
      dataVencimento: p.dataVencimento.toISOString(),
      dataPagamento: p.dataPagamento ? p.dataPagamento.toISOString() : null,
      status: p.status,
      formaPagamento: p.formaPagamento,
      comprovanteRef: p.comprovanteRef,
      aprovadoPor: p.aprovadoPor,
      eventId: p.eventId,
      eventNome: p.event?.nome,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  async getKpis(eventId?: string, user?: JwtPayload) {
    const where: any = {};

    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.event = { producerId: user.producerId || 'none' };
    } else if (eventId) {
      where.eventId = eventId;
    }

    const payables = await this.prisma.accountPayable.findMany({ where });

    let totalPagar = 0;
    let totalPago = 0;
    let totalAberto = 0;
    let totalAtrasado = 0;
    let totalAgendado = 0;

    const now = new Date();

    for (const p of payables) {
      const v = Number(p.valor);
      totalPagar += v;

      if (p.status === StatusContaPagar.PAGO) {
        totalPago += v;
      } else if (p.status === StatusContaPagar.AGENDADO) {
        totalAgendado += v;
      } else if (p.status === StatusContaPagar.EM_ABERTO) {
        if (new Date(p.dataVencimento) < now) {
          totalAtrasado += v;
        } else {
          totalAberto += v;
        }
      } else if (p.status === StatusContaPagar.ATRASADO) {
        totalAtrasado += v;
      }
    }

    return {
      totalPagar,
      totalPago,
      totalAberto,
      totalAtrasado,
      totalAgendado,
      contagemTitulos: payables.length,
    };
  }

  async create(dto: CreatePayableDto, user: JwtPayload) {
    if (user.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      throw new ForbiddenException('Produtores não possuem permissão para lançar contas a pagar corporativas');
    }

    const created = await this.prisma.accountPayable.create({
      data: {
        descricao: dto.descricao,
        categoria: dto.categoria,
        fornecedorNome: dto.fornecedorNome,
        fornecedorCpfCnpj: dto.fornecedorCpfCnpj,
        valor: dto.valor,
        dataVencimento: new Date(dto.dataVencimento),
        formaPagamento: dto.formaPagamento || 'PIX',
        eventId: dto.eventId || null,
        status: StatusContaPagar.EM_ABERTO,
      },
    });

    return created;
  }

  async pay(id: string, comprovanteRef: string | undefined, user: JwtPayload) {
    const payable = await this.prisma.accountPayable.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException('Conta a pagar não encontrada');
    }

    if (payable.status === StatusContaPagar.PAGO) {
      throw new BadRequestException('Esta obrigação já foi liquidada');
    }

    const updated = await this.prisma.accountPayable.update({
      where: { id },
      data: {
        status: StatusContaPagar.PAGO,
        dataPagamento: new Date(),
        comprovanteRef: comprovanteRef || `COMP-${Date.now().toString().slice(-8)}`,
        aprovadoPor: user.email,
      },
    });

    // Registra débito no Fluxo de Caixa
    const ultimoSaldo = await this.prisma.financialTransaction.findFirst({
      orderBy: { dataLancamento: 'desc' },
      select: { saldoApos: true },
    });
    const saldoAnterior = ultimoSaldo ? Number(ultimoSaldo.saldoApos) : 100000;
    const valorPago = Number(payable.valor);

    await this.prisma.financialTransaction.create({
      data: {
        tipo: 'SAIDA',
        descricao: `Pagamento ${payable.categoria}: ${payable.descricao} (${payable.fornecedorNome})`,
        valor: valorPago,
        categoria: payable.categoria,
        referenciaTipo: 'CONTA_PAGAR',
        referenciaId: payable.id,
        contaBancaria: 'Conta Movimento Itaú',
        saldoApos: saldoAnterior - valorPago,
      },
    });

    return updated;
  }

  async schedule(id: string, user: JwtPayload) {
    const payable = await this.prisma.accountPayable.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException('Conta a pagar não encontrada');
    }

    return this.prisma.accountPayable.update({
      where: { id },
      data: {
        status: StatusContaPagar.AGENDADO,
        aprovadoPor: user.email,
      },
    });
  }

  async cancel(id: string, user: JwtPayload) {
    const payable = await this.prisma.accountPayable.findUnique({
      where: { id },
    });

    if (!payable) {
      throw new NotFoundException('Conta a pagar não encontrada');
    }

    if (payable.status === StatusContaPagar.PAGO) {
      throw new BadRequestException('Não é possível cancelar uma conta já paga');
    }

    return this.prisma.accountPayable.update({
      where: { id },
      data: {
        status: StatusContaPagar.CANCELADO,
      },
    });
  }
}
