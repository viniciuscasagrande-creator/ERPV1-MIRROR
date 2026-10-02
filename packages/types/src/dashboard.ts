export interface DashboardKpis {
  receitaBruta: number;
  receitaLiquida: number;
  taxasMdr: number;
  comissaoDisk: number;
  taxasServico: number;
  estornosValor: number;
  estornosQuantidade: number;
  totalVendasQuantidade: number;
  totalIngressosVendidos: number;
  valoresARepassar: number;
  valoresAReceber: number;
  eventosAtivos: number;
  eventosAguardandoFechamento: number;
  distribuicaoCanais: Array<{ canal: string; valor: number; ingressos: number }>;
  distribuicaoPagamento: Array<{ metodo: string; valor: number; percent: number }>;
  eventosRecentes: Array<{
    id: string;
    nome: string;
    produtor: string;
    data: string;
    vendasBrutas: number;
    liquidoProdutor: number;
    statusFinanceiro: string;
    fechamentoConcluidoPercent: number;
  }>;
}
