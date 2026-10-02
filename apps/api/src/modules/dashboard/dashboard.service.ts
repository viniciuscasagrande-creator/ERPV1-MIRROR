import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(producerId?: string) {
    const eventWhere: any = {};
    const saleWhere: any = { status: 'APROVADO' };

    if (producerId) {
      eventWhere.producerId = producerId;
      saleWhere.event = { producerId };
    }

    const [
      approvedSales,
      refunds,
      events,
      payments,
      saleItems,
    ] = await Promise.all([
      this.prisma.sale.findMany({
        where: saleWhere,
        include: { payments: true },
      }),
      this.prisma.refund.findMany({
        where: producerId ? { sale: { event: { producerId } } } : {},
      }),
      this.prisma.event.findMany({
        where: eventWhere,
        include: {
          producer: { select: { nomeFantasia: true } },
          financialSummary: true,
          closingChecklist: true,
        },
        orderBy: { dataEvento: 'desc' },
      }),
      this.prisma.payment.findMany({
        where: producerId ? { sale: { event: { producerId } } } : {},
      }),
      this.prisma.saleItem.findMany({
        where: { sale: saleWhere },
      }),
    ]);

    let receitaBruta = 0;
    let receitaLiquida = 0;
    let taxasServico = 0;
    let taxasMdr = 0;
    let totalIngressosVendidos = 0;

    approvedSales.forEach((s) => {
      receitaBruta += Number(s.totalBruto);
      receitaLiquida += Number(s.totalLiquido);
      taxasServico += Number(s.totalTaxas);
    });

    saleItems.forEach((it) => {
      totalIngressosVendidos += it.quantidade;
    });

    payments.forEach((p) => {
      if (p.status === 'APROVADO') {
        taxasMdr += Number(p.taxaMdrValor);
      }
    });

    let comissaoDisk = 0;
    let valoresARepassar = 0;
    let eventosAtivos = 0;
    let eventosAguardandoFechamento = 0;

    events.forEach((e) => {
      if (e.status !== 'ENCERRADO') eventosAtivos++;
      if (
        e.statusFinanceiro === 'AGUARDANDO_CONCILIACAO' ||
        e.statusFinanceiro === 'APURADO'
      ) {
        eventosAguardandoFechamento++;
      }

      if (e.financialSummary) {
        comissaoDisk += Number(e.financialSummary.comissaoDisk);
        valoresARepassar += Number(e.financialSummary.valorLiquidoProdutor);
      }
    });

    let estornosValor = 0;
    refunds.forEach((r) => {
      estornosValor += Number(r.valorEstorno);
    });

    // Distribuição por Canal de Venda
    const canaisMap: Record<string, { valor: number; ingressos: number }> = {
      ONLINE: { valor: 0, ingressos: 0 },
      POS: { valor: 0, ingressos: 0 },
      PDV: { valor: 0, ingressos: 0 },
      TOTEM: { valor: 0, ingressos: 0 },
    };

    approvedSales.forEach((s) => {
      if (canaisMap[s.canal]) {
        canaisMap[s.canal].valor += Number(s.totalBruto);
      }
    });

    const distribuicaoCanais = Object.keys(canaisMap).map((k) => ({
      canal: k,
      valor: canaisMap[k].valor,
      ingressos: canaisMap[k].ingressos,
    }));

    // Distribuição por Método de Pagamento
    const pagMap: Record<string, number> = {};
    let totalPago = 0;
    payments.forEach((p) => {
      const v = Number(p.valorPago);
      pagMap[p.metodo] = (pagMap[p.metodo] || 0) + v;
      totalPago += v;
    });

    const distribuicaoPagamento = Object.keys(pagMap).map((metodo) => ({
      metodo,
      valor: pagMap[metodo],
      percent: totalPago > 0 ? (pagMap[metodo] / totalPago) * 100 : 0,
    }));

    // Eventos Recentes com progresso de checklist de fechamento
    const eventosRecentes = events.slice(0, 5).map((e) => {
      const cl = e.closingChecklist;
      let completedGates = 0;
      const totalGates = 10;
      if (cl) {
        if (cl.vendasConferidas) completedGates++;
        if (cl.cancelamentosConferidos) completedGates++;
        if (cl.estornosConferidos) completedGates++;
        if (cl.gatewayConciliado) completedGates++;
        if (cl.bancoConciliado) completedGates++;
        if (cl.financeiroApurado) completedGates++;
        if (cl.contabilidadeProcessada) completedGates++;
        if (cl.repasseCalculado) completedGates++;
        if (cl.repasseAprovado) completedGates++;
        if (cl.eventoFechado) completedGates++;
      }

      return {
        id: e.id,
        nome: e.nome,
        produtor: e.producer.nomeFantasia,
        data: e.dataEvento.toISOString(),
        vendasBrutas: e.financialSummary ? Number(e.financialSummary.vendasBrutas) : 0,
        liquidoProdutor: e.financialSummary
          ? Number(e.financialSummary.valorLiquidoProdutor)
          : 0,
        statusFinanceiro: e.statusFinanceiro,
        fechamentoConcluidoPercent: Math.round((completedGates / totalGates) * 100),
      };
    });

    return {
      receitaBruta,
      receitaLiquida,
      taxasMdr,
      comissaoDisk,
      taxasServico,
      estornosValor,
      estornosQuantidade: refunds.length,
      totalVendasQuantidade: approvedSales.length,
      totalIngressosVendidos,
      valoresARepassar,
      valoresAReceber: receitaLiquida - estornosValor,
      eventosAtivos,
      eventosAguardandoFechamento,
      distribuicaoCanais,
      distribuicaoPagamento,
      eventosRecentes,
    };
  }
}
