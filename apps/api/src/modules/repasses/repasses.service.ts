import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { ApproveSettlementDto, ExecuteSettlementDto } from './dto/settlement-actions.dto';
import { StatusRepasse } from '@prisma/client';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';
import { EventsGateway } from '../events-gateway/events.gateway';

@Injectable()
export class RepassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll(
    filters: {
      producerId?: string;
      eventId?: string;
      status?: StatusRepasse;
      search?: string;
    },
    user?: JwtPayload,
  ) {
    const where: any = {};

    // Isolamento multi-tenant: produtor vê somente seus próprios repasses
    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.producerId = user.producerId || 'none';
    } else if (filters.producerId) {
      where.producerId = filters.producerId;
    }

    if (filters.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { codigo: { contains: filters.search, mode: 'insensitive' } },
        { producer: { nomeFantasia: { contains: filters.search, mode: 'insensitive' } } },
        { event: { nome: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const items = await this.prisma.producerSettlement.findMany({
      where,
      include: {
        producer: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            bancoNome: true,
            agencia: true,
            contaCorrente: true,
            chavePix: true,
          },
        },
        event: {
          select: {
            id: true,
            nome: true,
            dataEvento: true,
          },
        },
        solicitadoPor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        aprovadoPor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((s) => ({
      id: s.id,
      codigo: s.codigo,
      producerId: s.producerId,
      producerNome: s.producer.nomeFantasia,
      producerCnpj: s.producer.cnpj,
      eventId: s.eventId,
      eventNome: s.event.nome,
      valorBrutoApurado: Number(s.valorBrutoApurado),
      retencaoSeguranca: Number(s.retencaoSeguranca),
      valorSolicitado: Number(s.valorSolicitado),
      valorLiquido: Number(s.valorLiquido),
      status: s.status,
      solicitadoPorId: s.solicitadoPorId,
      solicitadoPorNome: s.solicitadoPor.nome,
      solicitadoEm: s.solicitadoEm.toISOString(),
      aprovadoPorId: s.aprovadoPorId,
      aprovadoPorNome: s.aprovadoPor?.nome || null,
      aprovadoEm: s.aprovadoEm ? s.aprovadoEm.toISOString() : null,
      pagoEm: s.pagoEm ? s.pagoEm.toISOString() : null,
      autenticacaoBancaria: s.autenticacaoBancaria,
      bancoDestino: s.bancoDestino,
      chavePix: s.chavePix,
      observacoes: s.observacoes,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  }

  async getKpis(eventId?: string, user?: JwtPayload) {
    const where: any = {};

    if (user?.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      where.producerId = user.producerId || 'none';
    } else if (eventId) {
      where.eventId = eventId;
    }

    const settlements = await this.prisma.producerSettlement.findMany({ where });

    let totalSolicitado = 0;
    let totalAprovado = 0;
    let totalPago = 0;
    let totalPendente = 0;
    let totalRetencaoSeguranca = 0;

    for (const s of settlements) {
      const v = Number(s.valorLiquido);
      const ret = Number(s.retencaoSeguranca);
      totalSolicitado += Number(s.valorSolicitado);
      totalRetencaoSeguranca += ret;

      if (s.status === StatusRepasse.PAGO) {
        totalPago += v;
      } else if (s.status === StatusRepasse.APROVADO || s.status === StatusRepasse.AGENDADO) {
        totalAprovado += v;
      } else if (s.status === StatusRepasse.SOLICITADO || s.status === StatusRepasse.EM_ANALISE) {
        totalPendente += v;
      }
    }

    return {
      totalSolicitado,
      totalAprovado,
      totalPago,
      totalPendente,
      totalRetencaoSeguranca,
      contagemRepasses: settlements.length,
    };
  }

  async calculateEventLiquid(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        financialSummary: true,
        producer: true,
        settlements: {
          where: {
            status: { in: [StatusRepasse.PAGO, StatusRepasse.APROVADO, StatusRepasse.AGENDADO, StatusRepasse.SOLICITADO] },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const summary = event.financialSummary;
    const vendasBrutas = Number(summary?.vendasBrutas || 0);
    const cancelamentos = Number(summary?.cancelamentos || 0);
    const estornos = Number(summary?.estornos || 0);
    const taxasMdrGateway = Number(summary?.taxasMdrGateway || 0);
    const comissaoDisk = Number(summary?.comissaoDisk || 0);
    const retencoesTributarias = Number(summary?.retencoesTributarias || 0);
    const valorLiquidoApurado = Number(summary?.valorLiquidoProdutor || 0);

    // Soma repasses já realizados ou em esteira
    const totalRepassesComprometidos = event.settlements.reduce(
      (acc, s) => acc + Number(s.valorSolicitado),
      0,
    );

    const saldoDisponivel = Math.max(0, valorLiquidoApurado - totalRepassesComprometidos);

    return {
      eventId: event.id,
      eventNome: event.nome,
      producerId: event.producerId,
      producerNome: event.producer.nomeFantasia,
      chavePix: event.producer.chavePix,
      bancoNome: event.producer.bancoNome,
      agencia: event.producer.agencia,
      contaCorrente: event.producer.contaCorrente,
      dre: {
        vendasBrutas,
        cancelamentos,
        estornos,
        taxasMdrGateway,
        comissaoDisk,
        retencoesTributarias,
        valorLiquidoApurado,
        totalRepassesComprometidos,
        saldoDisponivel,
      },
    };
  }

  async create(dto: CreateSettlementDto, user: JwtPayload) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: {
        producer: true,
        financialSummary: true,
        settlements: {
          where: {
            status: { in: [StatusRepasse.PAGO, StatusRepasse.APROVADO, StatusRepasse.AGENDADO, StatusRepasse.SOLICITADO] },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Regra de segurança: produtor só pode solicitar repasse do seu próprio evento
    if (user.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      if (user.producerId !== event.producerId) {
        throw new ForbiddenException('Acesso negado: este evento pertence a outro produtor');
      }
    }

    const valorApurado = Number(event.financialSummary?.valorLiquidoProdutor || 0);
    const comprometido = event.settlements.reduce((acc, s) => acc + Number(s.valorSolicitado), 0);
    const disponivel = valorApurado - comprometido;

    if (dto.valorSolicitado > disponivel && disponivel > 0) {
      throw new BadRequestException(
        `Valor solicitado (R$ ${dto.valorSolicitado.toFixed(2)}) excede o saldo líquido apurado disponível (R$ ${disponivel.toFixed(2)})`,
      );
    }

    const retencao = dto.retencaoSeguranca || 0;
    const valorLiquido = dto.valorSolicitado - retencao;

    const count = await this.prisma.producerSettlement.count();
    const anoAtual = new Date().getFullYear();
    const codigo = `REP-${anoAtual}-${String(count + 1).padStart(6, '0')}`;

    const settlement = await this.prisma.producerSettlement.create({
      data: {
        codigo,
        producerId: event.producerId,
        eventId: event.id,
        valorBrutoApurado: valorApurado,
        retencaoSeguranca: retencao,
        valorSolicitado: dto.valorSolicitado,
        valorLiquido,
        status: StatusRepasse.SOLICITADO,
        solicitadoPorId: user.sub,
        bancoDestino: `${event.producer.bancoNome || 'Banco'} Ag: ${event.producer.agencia || '-'} CC: ${event.producer.contaCorrente || '-'}`,
        chavePix: event.producer.chavePix,
        observacoes: dto.observacoes || 'Solicitação de repasse gerada via portal/ERP',
      },
      include: {
        producer: true,
        event: true,
      },
    });

    // Notifica em tempo real via Socket.IO
    this.eventsGateway.emitSettlementUpdated({
      settlementId: settlement.id,
      codigo: settlement.codigo,
      producerId: settlement.producerId,
      eventId: settlement.eventId,
      status: settlement.status,
      valorLiquido: Number(settlement.valorLiquido),
      updatedAt: settlement.updatedAt.toISOString(),
    });

    return settlement;
  }

  async approve(id: string, dto: ApproveSettlementDto, user: JwtPayload) {
    if (user.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      throw new ForbiddenException('Produtores não possuem permissão de aprovação financeira');
    }

    const settlement = await this.prisma.producerSettlement.findUnique({
      where: { id },
    });

    if (!settlement) {
      throw new NotFoundException('Repasse não encontrado');
    }

    if (settlement.status === StatusRepasse.PAGO) {
      throw new BadRequestException('Não é possível alterar o status de um repasse já pago');
    }

    const novoStatus = dto.aprovado ? StatusRepasse.APROVADO : StatusRepasse.REJEITADO;

    const updated = await this.prisma.producerSettlement.update({
      where: { id },
      data: {
        status: novoStatus,
        aprovadoPorId: user.sub,
        aprovadoEm: new Date(),
        observacoes: dto.motivo
          ? `${settlement.observacoes || ''} | ${dto.aprovado ? 'Aprovado' : 'Rejeitado'}: ${dto.motivo}`
          : settlement.observacoes,
      },
    });

    this.eventsGateway.emitSettlementUpdated({
      settlementId: updated.id,
      codigo: updated.codigo,
      producerId: updated.producerId,
      eventId: updated.eventId,
      status: updated.status,
      valorLiquido: Number(updated.valorLiquido),
      updatedAt: updated.updatedAt.toISOString(),
    });

    return updated;
  }

  async execute(id: string, dto: ExecuteSettlementDto, user: JwtPayload) {
    if (user.roles.includes(PerfilUsuario.PRODUTOR) && !user.roles.includes(PerfilUsuario.ADMIN)) {
      throw new ForbiddenException('Apenas gestores financeiros podem executar repasses');
    }

    const settlement = await this.prisma.producerSettlement.findUnique({
      where: { id },
      include: {
        producer: true,
        event: true,
      },
    });

    if (!settlement) {
      throw new NotFoundException('Repasse não encontrado');
    }

    if (settlement.status !== StatusRepasse.APROVADO) {
      throw new BadRequestException('Apenas repasses com status APROVADO podem ser executados');
    }

    const updated = await this.prisma.producerSettlement.update({
      where: { id },
      data: {
        status: StatusRepasse.PAGO,
        pagoEm: new Date(),
        autenticacaoBancaria: dto.autenticacaoBancaria,
        observacoes: dto.observacoes
          ? `${settlement.observacoes || ''} | Executado: ${dto.observacoes}`
          : settlement.observacoes,
      },
    });

    // Registra SAÍDA no Fluxo de Caixa
    const ultimoSaldo = await this.prisma.financialTransaction.findFirst({
      orderBy: { dataLancamento: 'desc' },
      select: { saldoApos: true },
    });
    const saldoAnterior = ultimoSaldo ? Number(ultimoSaldo.saldoApos) : 100000;
    const valorRepasse = Number(settlement.valorLiquido);

    await this.prisma.financialTransaction.create({
      data: {
        tipo: 'SAIDA',
        descricao: `Repasse Produtor (${settlement.codigo}) - ${settlement.producer.nomeFantasia} | Evento: ${settlement.event.nome}`,
        valor: valorRepasse,
        categoria: 'REPASSE_PRODUTOR',
        referenciaTipo: 'REPASSE',
        referenciaId: settlement.id,
        contaBancaria: 'Conta Movimento Itaú',
        saldoApos: saldoAnterior - valorRepasse,
      },
    });

    this.eventsGateway.emitSettlementUpdated({
      settlementId: updated.id,
      codigo: updated.codigo,
      producerId: updated.producerId,
      eventId: updated.eventId,
      status: updated.status,
      valorLiquido: Number(updated.valorLiquido),
      updatedAt: updated.updatedAt.toISOString(),
    });

    return updated;
  }
}
