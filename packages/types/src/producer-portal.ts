export interface ProducerEventSummary {
  id: string;
  nome: string;
  dataEvento: string | Date;
  local: string;
  cidade: string;
  status: string;
  statusFinanceiro: string;
  ingressosVendidos: number;
  capacidadeTotal: number;
  vendasBrutas: number;
  comissaoDisk: number;
  valorLiquidoProdutor: number;
  batches?: {
    id: string;
    nome: string;
    preco: number;
    vendidos: number;
    total: number;
  }[];
}

export interface ProducerSettlementItem {
  id: string;
  codigoBordero: string;
  eventoId: string;
  eventoNome: string;
  valorBrutoApurado: number;
  comissaoRetida: number;
  taxasRetidas: number;
  retencaoSeguranca: number;
  valorLiquido: number;
  status: string;
  solicitadoEm: string | Date;
  aprovadoEm?: string | Date | null;
  pagoEm?: string | Date | null;
  autenticacaoBancaria?: string | null;
  bancoDestino: string;
  chavePix?: string | null;
}

export interface ProducerNfseItem {
  id: string;
  numeroNota: string;
  dataEmissao: string | Date;
  eventoNome?: string | null;
  discriminacao: string;
  valorServicos: number;
  valorIss: number;
  valorLiquido: number;
  codigoVerificacao?: string | null;
  status: string;
  xmlContent?: string | null;
}

export interface ProducerBankData {
  bancoNome: string;
  bancoCodigo: string;
  agencia: string;
  contaCorrente: string;
  chavePix: string;
}

export interface ProducerPortalDashboard {
  producerId: string;
  produtorNome: string;
  produtorCnpj: string;
  totalVendasBrutas: number;
  totalIngressosVendidos: number;
  totalCancelamentosEstornos: number;
  totalComissoesRetidasDisk: number;
  totalTaxasServicoDisk: number;
  totalRetencoesTributarias: number;
  totalLiquidoDisponivel: number;
  saldoARepassar: number;
  totalRepassado: number;
  totalEventos: number;
  proximosRepasses: ProducerSettlementItem[];
  eventosRecentes: ProducerEventSummary[];
  dadosBancarios: ProducerBankData;
}
