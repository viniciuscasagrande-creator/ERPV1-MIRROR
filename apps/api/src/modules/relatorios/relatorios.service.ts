import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  RelatorioDreEvento,
  RelatorioVendasPeriodoItem,
  RelatorioRepasseItem,
} from '@diskingressos/types';

@Injectable()
export class RelatoriosService {
  private readonly logger = new Logger(RelatoriosService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Relatório DRE Analítico e Fechamento por Evento
   */
  async getEventFinancialReport(eventId: string): Promise<RelatorioDreEvento> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        producer: true,
        financialSummary: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${eventId} não encontrado.`);
    }

    const fs = event.financialSummary;
    const vendasBrutas = Number(fs?.vendasBrutas || 0);
    const cancelamentosEstornos =
      Number(fs?.cancelamentos || 0) + Number(fs?.estornos || 0);
    const receitaLiquidaIngressos = vendasBrutas - cancelamentosEstornos;
    const taxasMdrGateway = Number(fs?.taxasMdrGateway || 0);
    const comissaoDisk = Number(fs?.comissaoDisk || 0);
    const taxasServicoDisk = Number(fs?.taxasServicoDisk || 0);
    const retencoesTributarias = Number(fs?.retencoesTributarias || 0);
    const valorLiquidoProdutor = Number(fs?.valorLiquidoProdutor || 0);
    const receitaTotalDisk = comissaoDisk + taxasServicoDisk;
    const ingressosVendidos = fs?.ingressosVendidos || 0;
    const ticketMedio =
      ingressosVendidos > 0 ? Math.round((vendasBrutas / ingressosVendidos) * 100) / 100 : 0;

    return {
      eventoId: event.id,
      eventoNome: event.nome,
      producerNome: event.producer.nomeFantasia || event.producer.razaoSocial,
      dataEvento: event.dataEvento,
      statusFinanceiro: event.statusFinanceiro,
      vendasBrutas,
      cancelamentosEstornos,
      receitaLiquidaIngressos,
      taxasMdrGateway,
      comissaoDisk,
      taxasServicoDisk,
      retencoesTributarias,
      valorLiquidoProdutor,
      receitaTotalDisk,
      ingressosVendidos,
      ticketMedio,
    };
  }

  /**
   * 2. Relatório de Vendas e Bilheteria por Período
   */
  async getPeriodSalesReport(dataInicio?: string, dataFim?: string): Promise<RelatorioVendasPeriodoItem[]> {
    const where: any = {};
    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) where.createdAt.gte = new Date(dataInicio);
      if (dataFim) where.createdAt.lte = new Date(dataFim);
    }

    const sales = await this.prisma.sale.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        event: { select: { nome: true } },
        items: true,
        payments: { select: { metodo: true } },
      },
    });

    return sales.map((s) => ({
      data: s.createdAt.toISOString(),
      eventoNome: s.event?.nome || 'Evento Avulso',
      canal: s.canal,
      metodoPagamento: s.payments[0]?.metodo || 'OUTRO',
      ingressos: s.items.reduce((acc, i) => acc + i.quantidade, 0),
      totalBruto: Number(s.totalBruto),
      taxas: Number(s.totalTaxas),
      totalLiquido: Number(s.totalLiquido),
    }));
  }

  /**
   * 3. Relatório de Repasses e Liquidações a Produtores (Borderôs)
   */
  async getSettlementsReport(producerId?: string): Promise<RelatorioRepasseItem[]> {
    const where: any = {};
    if (producerId) where.producerId = producerId;

    const settlements = await this.prisma.producerSettlement.findMany({
      where,
      orderBy: { solicitadoEm: 'desc' },
      include: {
        event: { select: { nome: true } },
        producer: { select: { nomeFantasia: true, razaoSocial: true } },
      },
    });

    return settlements.map((set) => ({
      id: set.id,
      codigoBordero: set.codigo,
      eventoNome: set.event?.nome || 'Evento',
      producerNome: set.producer.nomeFantasia || set.producer.razaoSocial,
      valorBruto: Number(set.valorBrutoApurado),
      taxasComissoesDisk: 0,
      retencoes: Number(set.retencaoSeguranca),
      valorRepasseLiquido: Number(set.valorLiquido),
      status: set.status,
      pagoEm: set.pagoEm,
    }));
  }

  /**
   * 4. Relatório Executivo de Auditoria & Compliance Financeiro
   */
  async getComplianceAuditReport() {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { criadoEm: 'desc' },
      take: 100,
      include: {
        usuario: { select: { nome: true, email: true, cargo: true } },
      },
    });

    // Detectar alertas de auditoria (divergências ou ações críticas)
    const alertas = [];

    // Checar se há lançamentos desequilibrados no diário
    const lancamentosDesequilibrados = await this.prisma.journalEntry.findMany({
      where: { equilibrado: false },
    });
    if (lancamentosDesequilibrados.length > 0) {
      alertas.push({
        nivel: 'CRITICO',
        mensagem: `Detectados ${lancamentosDesequilibrados.length} lançamentos contábeis com desvio de Débito/Crédito.`,
        origem: 'LIVRO_DIARIO',
      });
    }

    // Checar se há notas canceladas com valores vultosos (> R$ 10.000)
    const notasCanceladasGrandes = await this.prisma.fiscalInvoice.findMany({
      where: {
        status: 'CANCELADO',
        valorServicos: { gte: 10000 },
      },
    });
    if (notasCanceladasGrandes.length > 0) {
      alertas.push({
        nivel: 'ATENCAO',
        mensagem: `${notasCanceladasGrandes.length} nota(s) fiscal(is) cancelada(s) com valor superior a R$ 10.000,00.`,
        origem: 'FISCAL_NFSE',
      });
    }

    return {
      statusCompliance: alertas.length === 0 ? 'CONFORME' : 'ALERTA_REQUER_ATENCAO',
      totalLogsAnalisados: logs.length,
      alertas,
      logsRecentes: logs.map((l) => ({
        id: l.id,
        data: l.criadoEm,
        operador: l.usuario?.nome || 'Sistema Automático',
        cargo: l.usuario?.cargo || 'Bot',
        acao: l.acao,
        entidade: l.entidade,
        ip: l.ip,
        motivo: l.motivo,
        valorAnterior: l.valorAnterior ? JSON.parse(l.valorAnterior) : null,
        valorNovo: l.valorNovo ? JSON.parse(l.valorNovo) : null,
      })),
    };
  }
}
