export enum StatusEvento {
  PUBLICADO = 'PUBLICADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  REALIZADO = 'REALIZADO',
  CANCELADO = 'CANCELADO',
  ENCERRADO = 'ENCERRADO',
}

export enum StatusFinanceiroEvento {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  AGUARDANDO_CONCILIACAO = 'AGUARDANDO_CONCILIACAO',
  APURADO = 'APURADO',
  LIQUIDADO = 'LIQUIDADO',
  FECHADO = 'FECHADO',
}

export interface EventFinancialSummary {
  vendasBrutas: number | string;
  cancelamentos: number | string;
  estornos: number | string;
  taxasMdrGateway: number | string;
  comissaoDisk: number | string;
  taxasServicoDisk: number | string;
  retencoesTributarias: number | string;
  valorLiquidoProdutor: number | string;
  ingressosVendidos: number;
  ingressosCancelados: number;
}

export interface EventClosingChecklist {
  vendasConferidas: boolean;
  cancelamentosConferidos: boolean;
  estornosConferidos: boolean;
  gatewayConciliado: boolean;
  bancoConciliado: boolean;
  financeiroApurado: boolean;
  contabilidadeProcessada: boolean;
  repasseCalculado: boolean;
  repasseAprovado: boolean;
  eventoFechado: boolean;
  observacoes?: string | null;
  fechadoPor?: string | null;
  fechadoEm?: string | null;
}

export interface EventSummary {
  id: string;
  nome: string;
  categoria: string;
  dataEvento: string;
  local: string;
  cidade: string;
  estado: string;
  capacidadeTotal: number;
  status: StatusEvento;
  statusFinanceiro: StatusFinanceiroEvento;
  producerId: string;
  producerName?: string;
  financialSummary?: EventFinancialSummary;
  closingChecklist?: EventClosingChecklist;
  totalTicketsSold?: number;
  grossSales?: number;
  netProducer?: number;
  createdAt: string;
  updatedAt: string;
}
