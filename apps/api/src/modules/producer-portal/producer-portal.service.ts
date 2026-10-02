import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ProducerPortalDashboard,
  ProducerEventSummary,
  ProducerSettlementItem,
  ProducerNfseItem,
  ProducerBankData,
  StatusRepasse,
} from '@diskingressos/types';

@Injectable()
export class ProducerPortalService {
  private readonly logger = new Logger(ProducerPortalService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dashboard Consolidado do Produtor (Isolamento Multi-Tenant Estrito)
   */
  async getDashboard(producerId: string): Promise<ProducerPortalDashboard> {
    const producer = await this.prisma.producer.findUnique({
      where: { id: producerId },
      include: {
        events: {
          include: {
            financialSummary: true,
            batches: {
              include: {
                ticketTypes: true,
              },
            },
          },
          orderBy: { dataEvento: 'desc' },
        },
        settlements: {
          include: {
            event: { select: { nome: true } },
          },
          orderBy: { solicitadoEm: 'desc' },
        },
      },
    });

    if (!producer) {
      throw new NotFoundException(`Produtor ${producerId} não encontrado.`);
    }

    let totalVendasBrutas = 0;
    let totalIngressosVendidos = 0;
    let totalCancelamentosEstornos = 0;
    let totalComissoesRetidasDisk = 0;
    let totalTaxasServicoDisk = 0;
    let totalRetencoesTributarias = 0;
    let totalLiquidoDisponivel = 0;

    const eventosRecentes: ProducerEventSummary[] = [];

    for (const ev of producer.events) {
      const fs = ev.financialSummary;
      const vb = Number(fs?.vendasBrutas || 0);
      const iv = fs?.ingressosVendidos || 0;
      const canc = Number(fs?.cancelamentos || 0) + Number(fs?.estornos || 0);
      const com = Number(fs?.comissaoDisk || 0);
      const tx = Number(fs?.taxasServicoDisk || 0);
      const ret = Number(fs?.retencoesTributarias || 0);
      const vl = Number(fs?.valorLiquidoProdutor || 0);

      totalVendasBrutas += vb;
      totalIngressosVendidos += iv;
      totalCancelamentosEstornos += canc;
      totalComissoesRetidasDisk += com;
      totalTaxasServicoDisk += tx;
      totalRetencoesTributarias += ret;
      totalLiquidoDisponivel += vl;

      eventosRecentes.push({
        id: ev.id,
        nome: ev.nome,
        dataEvento: ev.dataEvento,
        local: ev.local,
        cidade: ev.cidade,
        status: ev.status,
        statusFinanceiro: ev.statusFinanceiro,
        ingressosVendidos: iv,
        capacidadeTotal: ev.capacidadeTotal,
        vendasBrutas: vb,
        comissaoDisk: com,
        valorLiquidoProdutor: vl,
      });
    }

    // Repasses
    let totalRepassado = 0;
    const proximosRepasses: ProducerSettlementItem[] = [];

    for (const set of producer.settlements) {
      const vLiq = Number(set.valorLiquido);
      if (set.status === StatusRepasse.PAGO) {
        totalRepassado += vLiq;
      }

      proximosRepasses.push({
        id: set.id,
        codigoBordero: set.codigo,
        eventoId: set.eventId,
        eventoNome: set.event?.nome || 'Evento',
        valorBrutoApurado: Number(set.valorBrutoApurado),
        comissaoRetida: 0,
        taxasRetidas: 0,
        retencaoSeguranca: Number(set.retencaoSeguranca),
        valorLiquido: vLiq,
        status: set.status,
        solicitadoEm: set.solicitadoEm,
        aprovadoEm: set.aprovadoEm,
        pagoEm: set.pagoEm,
        autenticacaoBancaria: set.autenticacaoBancaria,
        bancoDestino: set.bancoDestino,
        chavePix: set.chavePix,
      });
    }

    const saldoARepassar = Math.max(0, totalLiquidoDisponivel - totalRepassado);

    const dadosBancarios: ProducerBankData = {
      bancoNome: producer.bancoNome || 'Banco Não Cadastrado',
      bancoCodigo: producer.bancoCodigo || '000',
      agencia: producer.agencia || '',
      contaCorrente: producer.contaCorrente || '',
      chavePix: producer.chavePix || producer.cnpj,
    };

    return {
      producerId: producer.id,
      produtorNome: producer.nomeFantasia || producer.razaoSocial,
      produtorCnpj: producer.cnpj,
      totalVendasBrutas: Math.round(totalVendasBrutas * 100) / 100,
      totalIngressosVendidos,
      totalCancelamentosEstornos: Math.round(totalCancelamentosEstornos * 100) / 100,
      totalComissoesRetidasDisk: Math.round(totalComissoesRetidasDisk * 100) / 100,
      totalTaxasServicoDisk: Math.round(totalTaxasServicoDisk * 100) / 100,
      totalRetencoesTributarias: Math.round(totalRetencoesTributarias * 100) / 100,
      totalLiquidoDisponivel: Math.round(totalLiquidoDisponivel * 100) / 100,
      saldoARepassar: Math.round(saldoARepassar * 100) / 100,
      totalRepassado: Math.round(totalRepassado * 100) / 100,
      totalEventos: producer.events.length,
      proximosRepasses: proximosRepasses.slice(0, 5),
      eventosRecentes: eventosRecentes.slice(0, 5),
      dadosBancarios,
    };
  }

  /**
   * Listar todos os eventos do Produtor com detalhes de lotes
   */
  async getEvents(producerId: string): Promise<ProducerEventSummary[]> {
    const events = await this.prisma.event.findMany({
      where: { producerId },
      include: {
        financialSummary: true,
        batches: {
          include: {
            ticketTypes: true,
          },
        },
      },
      orderBy: { dataEvento: 'desc' },
    });

    return events.map((ev) => {
      const fs = ev.financialSummary;
      const batches = ev.batches.map((b) => ({
        id: b.id,
        nome: b.nome,
        preco: Number(b.ticketTypes[0]?.precoUnitario || 0),
        vendidos: b.ticketTypes.reduce((acc, t) => acc + t.quantidadeVendida, 0),
        total: b.ticketTypes.reduce((acc, t) => acc + t.quantidadeTotal, 0),
      }));

      return {
        id: ev.id,
        nome: ev.nome,
        dataEvento: ev.dataEvento,
        local: ev.local,
        cidade: ev.cidade,
        status: ev.status,
        statusFinanceiro: ev.statusFinanceiro,
        ingressosVendidos: fs?.ingressosVendidos || 0,
        capacidadeTotal: ev.capacidadeTotal,
        vendasBrutas: Number(fs?.vendasBrutas || 0),
        comissaoDisk: Number(fs?.comissaoDisk || 0),
        valorLiquidoProdutor: Number(fs?.valorLiquidoProdutor || 0),
        batches,
      };
    });
  }

  /**
   * Obter Detalhes e Borderô de um Evento Específico (com barreira multi-tenant)
   */
  async getEventDetails(producerId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        financialSummary: true,
        closingChecklist: true,
        batches: {
          include: { ticketTypes: true },
        },
        settlements: {
          where: { producerId },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento ${eventId} não encontrado.`);
    }

    if (event.producerId !== producerId) {
      throw new ForbiddenException('Acesso negado: este evento não pertence à sua produtora.');
    }

    const fs = event.financialSummary;
    return {
      id: event.id,
      nome: event.nome,
      dataEvento: event.dataEvento,
      local: event.local,
      cidade: event.cidade,
      capacidadeTotal: event.capacidadeTotal,
      status: event.status,
      statusFinanceiro: event.statusFinanceiro,
      financialSummary: {
        vendasBrutas: Number(fs?.vendasBrutas || 0),
        cancelamentos: Number(fs?.cancelamentos || 0),
        estornos: Number(fs?.estornos || 0),
        taxasMdrGateway: Number(fs?.taxasMdrGateway || 0),
        comissaoDisk: Number(fs?.comissaoDisk || 0),
        taxasServicoDisk: Number(fs?.taxasServicoDisk || 0),
        retencoesTributarias: Number(fs?.retencoesTributarias || 0),
        valorLiquidoProdutor: Number(fs?.valorLiquidoProdutor || 0),
        ingressosVendidos: fs?.ingressosVendidos || 0,
        ingressosCancelados: fs?.ingressosCancelados || 0,
      },
      checklist: event.closingChecklist,
      batches: event.batches,
      settlements: event.settlements.map((s) => ({
        ...s,
        valorBrutoApurado: Number(s.valorBrutoApurado),
        retencaoSeguranca: Number(s.retencaoSeguranca),
        valorSolicitado: Number(s.valorSolicitado),
        valorLiquido: Number(s.valorLiquido),
      })),
    };
  }

  /**
   * Listar todos os repasses e borderôs do produtor
   */
  async getSettlements(producerId: string): Promise<ProducerSettlementItem[]> {
    const settlements = await this.prisma.producerSettlement.findMany({
      where: { producerId },
      include: {
        event: { select: { nome: true } },
      },
      orderBy: { solicitadoEm: 'desc' },
    });

    return settlements.map((set) => ({
      id: set.id,
      codigoBordero: set.codigo,
      eventoId: set.eventId,
      eventoNome: set.event?.nome || 'Evento',
      valorBrutoApurado: Number(set.valorBrutoApurado),
      comissaoRetida: 0,
      taxasRetidas: 0,
      retencaoSeguranca: Number(set.retencaoSeguranca),
      valorLiquido: Number(set.valorLiquido),
      status: set.status,
      solicitadoEm: set.solicitadoEm,
      aprovadoEm: set.aprovadoEm,
      pagoEm: set.pagoEm,
      autenticacaoBancaria: set.autenticacaoBancaria,
      bancoDestino: set.bancoDestino,
      chavePix: set.chavePix,
    }));
  }

  /**
   * Solicitar adiantamento / repasse parcial de evento em andamento
   */
  async solicitarAdiantamento(
    producerId: string,
    eventId: string,
    valorSolicitado: number,
    justificativa: string,
    userId: string
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        producer: true,
        financialSummary: true,
      },
    });

    if (!event || event.producerId !== producerId) {
      throw new ForbiddenException('Evento inválido ou não pertencente a este produtor.');
    }

    const valorDisponivel = Number(event.financialSummary?.valorLiquidoProdutor || 0);

    if (valorSolicitado <= 0) {
      throw new BadRequestException('O valor solicitado deve ser maior que zero.');
    }

    if (valorSolicitado > valorDisponivel) {
      throw new BadRequestException(
        `O valor solicitado (R$ ${valorSolicitado.toFixed(2)}) não pode ser superior ao saldo líquido apurado até o momento (R$ ${valorDisponivel.toFixed(2)}).`
      );
    }

    const count = await this.prisma.producerSettlement.count();
    const codigo = `REP-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const settlement = await this.prisma.producerSettlement.create({
      data: {
        codigo,
        producerId,
        eventId,
        valorBrutoApurado: valorSolicitado,
        retencaoSeguranca: 0,
        valorSolicitado,
        valorLiquido: valorSolicitado,
        status: StatusRepasse.SOLICITADO,
        solicitadoPorId: userId,
        bancoDestino: event.producer.bancoNome || 'Banco Cadastrado',
        chavePix: event.producer.chavePix,
        observacoes: `Solicitação de adiantamento realizada pelo produtor: ${justificativa}`,
      },
      include: {
        event: { select: { nome: true } },
      },
    });

    return {
      id: settlement.id,
      codigoBordero: settlement.codigo,
      eventoId: settlement.eventId,
      eventoNome: settlement.event?.nome || 'Evento',
      valorBrutoApurado: Number(settlement.valorBrutoApurado),
      comissaoRetida: 0,
      taxasRetidas: 0,
      retencaoSeguranca: 0,
      valorLiquido: Number(settlement.valorLiquido),
      status: settlement.status,
      solicitadoEm: settlement.solicitadoEm,
      bancoDestino: settlement.bancoDestino,
      chavePix: settlement.chavePix,
    };
  }

  /**
   * Listar Notas Fiscais (NFS-e) emitidas contra o Produtor
   */
  async getInvoices(producerId: string): Promise<ProducerNfseItem[]> {
    const producer = await this.prisma.producer.findUnique({
      where: { id: producerId },
    });

    if (!producer) {
      throw new NotFoundException(`Produtor ${producerId} não encontrado.`);
    }

    const invoices = await this.prisma.fiscalInvoice.findMany({
      where: {
        tomadorDoc: producer.cnpj,
      },
      include: {
        event: { select: { nome: true } },
      },
      orderBy: { dataEmissao: 'desc' },
    });

    return invoices.map((inv) => ({
      id: inv.id,
      numeroNota: inv.numeroNota,
      dataEmissao: inv.dataEmissao,
      eventoNome: inv.event?.nome || null,
      discriminacao: inv.discriminacao,
      valorServicos: Number(inv.valorServicos),
      valorIss: Number(inv.valorIss),
      valorLiquido: Number(inv.valorLiquido),
      codigoVerificacao: inv.codigoVerificacao,
      status: inv.status,
      xmlContent: inv.xmlContent,
    }));
  }

  /**
   * Atualizar Dados Bancários do Produtor para Repasses
   */
  async updateBankData(producerId: string, bankData: ProducerBankData) {
    const updated = await this.prisma.producer.update({
      where: { id: producerId },
      data: {
        bancoNome: bankData.bancoNome,
        bancoCodigo: bankData.bancoCodigo,
        agencia: bankData.agencia,
        contaCorrente: bankData.contaCorrente,
        chavePix: bankData.chavePix,
      },
    });

    return {
      bancoNome: updated.bancoNome || '',
      bancoCodigo: updated.bancoCodigo || '',
      agencia: updated.agencia || '',
      contaCorrente: updated.contaCorrente || '',
      chavePix: updated.chavePix || '',
    };
  }
}
