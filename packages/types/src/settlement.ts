export enum StatusRepasse {
  SOLICITADO = 'SOLICITADO',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  AGENDADO = 'AGENDADO',
  PAGO = 'PAGO',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
}

export interface ProducerSettlement {
  id: string;
  codigo: string; // Ex: 'REP-2026-000129'
  producerId: string;
  producerNome: string;
  producerCnpj: string;
  eventId: string;
  eventNome: string;
  valorBrutoApurado: number;
  retencaoSeguranca: number;
  valorSolicitado: number;
  valorLiquido: number;
  status: StatusRepasse;
  solicitadoPorId: string;
  solicitadoPorNome: string;
  solicitadoEm: string;
  aprovadoPorId?: string | null;
  aprovadoPorNome?: string | null;
  aprovadoEm?: string | null;
  pagoEm?: string | null;
  autenticacaoBancaria?: string | null;
  bancoDestino: string;
  chavePix?: string | null;
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettlementDto {
  eventId: string;
  valorSolicitado: number;
  retencaoSeguranca?: number;
  observacoes?: string;
}

export interface ApproveSettlementDto {
  aprovado: boolean;
  motivo?: string;
}

export interface ExecuteSettlementDto {
  autenticacaoBancaria: string;
  observacoes?: string;
}

export interface SettlementFilterDto {
  producerId?: string;
  eventId?: string;
  status?: StatusRepasse;
}

export interface SettlementKpis {
  totalSolicitado: number;
  totalAprovado: number;
  totalPago: number;
  totalPendente: number;
  totalRetencaoSeguranca: number;
  contagemRepasses: number;
}
