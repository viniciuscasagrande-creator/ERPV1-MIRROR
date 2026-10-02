export type TipoRelatorio =
  | 'DRE_EVENTO'
  | 'VENDAS_PERIODO'
  | 'REPASSES_PRODUTORES'
  | 'FISCAL_NFSE'
  | 'CONCILIACAO_MDR'
  | 'AUDITORIA_COMPLIANCE';

export interface RelatorioFiltrosDto {
  tipo: TipoRelatorio;
  eventId?: string;
  producerId?: string;
  dataInicio?: string;
  dataFim?: string;
  competencia?: string;
}

export interface RelatorioDreEvento {
  eventoId: string;
  eventoNome: string;
  producerNome: string;
  dataEvento: string | Date;
  statusFinanceiro: string;
  vendasBrutas: number;
  cancelamentosEstornos: number;
  receitaLiquidaIngressos: number;
  taxasMdrGateway: number;
  comissaoDisk: number;
  taxasServicoDisk: number;
  retencoesTributarias: number;
  valorLiquidoProdutor: number;
  receitaTotalDisk: number;
  ingressosVendidos: number;
  ticketMedio: number;
}

export interface RelatorioVendasPeriodoItem {
  data: string;
  eventoNome: string;
  canal: string;
  metodoPagamento: string;
  ingressos: number;
  totalBruto: number;
  taxas: number;
  totalLiquido: number;
}

export interface RelatorioRepasseItem {
  id: string;
  codigoBordero: string;
  eventoNome: string;
  producerNome: string;
  valorBruto: number;
  taxasComissoesDisk: number;
  retencoes: number;
  valorRepasseLiquido: number;
  status: string;
  pagoEm?: string | Date | null;
}
