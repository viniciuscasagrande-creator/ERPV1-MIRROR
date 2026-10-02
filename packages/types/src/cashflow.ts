export enum TipoTransacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

export interface FinancialTransaction {
  id: string;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  dataLancamento: string;
  categoria: string;
  referenciaTipo?: string | null; // RECEBIVEL, REPASSE, CONTA_PAGAR
  referenciaId?: string | null;
  contaBancaria: string;
  saldoApos: number;
  createdAt: string;
}

export interface CashFlowDayProjection {
  data: string;
  entradas: number;
  saidas: number;
  saldoProjetado: number;
}

export interface CashFlowSummary {
  saldoAtual: number;
  entradasMes: number;
  saidasMes: number;
  saldoProjetado30d: number;
  contasReceberProximas: number;
  contasPagarProximas: number;
  repassesPendentes: number;
  projecaoProximosDias: CashFlowDayProjection[];
  ultimasTransacoes: FinancialTransaction[];
}
