export interface BiFinancialKPIs {
  gmvTotal: number;
  receitaLiquidaDisk: number;
  takeRateMedio: number;
  ticketMedioIngresso: number;
  custoMedioMdr: number;
  margemContribuicao: number;
  totalIngressosVendidos: number;
  taxaCancelamentoEstorno: number;
}

export interface SalesByChannel {
  canal: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

export interface SalesByPaymentMethod {
  metodo: string;
  quantidade: number;
  valor: number;
  percentual: number;
  taxaMdrMedia: number;
}

export interface TopProducerMetrics {
  producerId: string;
  producerNome: string;
  totalVendido: number;
  totalComissaoDisk: number;
  eventosRealizados: number;
  ticketMedio: number;
}

export interface TopEventMetrics {
  eventId: string;
  eventoNome: string;
  dataEvento: string | Date;
  producerNome: string;
  vendasBrutas: number;
  comissaoDisk: number;
  taxasDisk: number;
  lucroBrutoDisk: number;
  status: string;
}

export interface SalesVelocityCurvePoint {
  periodo: string;
  vendasBrutas: number;
  ingressos: number;
}
