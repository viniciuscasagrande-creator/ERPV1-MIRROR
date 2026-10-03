export enum FinancialOperationType {
  REPASSE_PRODUTOR = 'REPASSE_PRODUTOR',
  ANTECIPACAO_RECEBIVEIS = 'ANTECIPACAO_RECEBIVEIS',
  LOTE_PAGAMENTO_CNAB = 'LOTE_PAGAMENTO_CNAB',
  AJUSTE_LEDGER = 'AJUSTE_LEDGER',
  DESVIO_TAXA_MDR = 'DESVIO_TAXA_MDR',
  ALTERACAO_DADOS_BANCARIOS = 'ALTERACAO_DADOS_BANCARIOS',
  REABERTURA_BORDERO = 'REABERTURA_BORDERO',
}

export enum ApprovalTier {
  FAIXA_A = 'FAIXA_A', // Até R$ 50.000,00
  FAIXA_B = 'FAIXA_B', // R$ 50.000,01 a R$ 250.000,00
  FAIXA_C = 'FAIXA_C', // Acima de R$ 250.000,00 (Dupla Aprovação Diretoria)
}

export enum ApprovalStatus {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
}

export enum QuarantineStatus {
  EM_QUARENTENA_48H = 'EM_QUARENTENA_48H',
  APROVADO_DIRETORIA = 'APROVADO_DIRETORIA',
  LIBERADO = 'LIBERADO',
  REJEITADO = 'REJEITADO',
}

export interface ApprovalAuthorityRuleDto {
  id: string;
  tipoOperacao: FinancialOperationType | string;
  faixaNome: ApprovalTier | string;
  descricao: string;
  valorMinimo: number;
  valorMaximo?: number | null;
  perfilMinimo: string;
  requerDuplaAprovacao: boolean;
  ativo: boolean;
}

export interface ApprovalRequestDto {
  id: string;
  codigo: string;
  tipoOperacao: FinancialOperationType | string;
  referenciaId?: string | null;
  referenciaDescricao?: string | null;
  valor: number;
  solicitadoPorId: string;
  solicitadoPorNome: string;
  status: ApprovalStatus | string;
  alcadaExigida: ApprovalTier | string;
  aprovador1Id?: string | null;
  aprovador1Nome?: string | null;
  aprovado1Em?: string | null;
  aprovador2Id?: string | null;
  aprovador2Nome?: string | null;
  aprovado2Em?: string | null;
  motivoRejeicao?: string | null;
  justificativaSolicitacao: string;
  createdAt: string;
  updatedAt: string;
  podeAprovarUsuarioAtual?: boolean;
  motivoBloqueioSoD?: string | null;
}

export interface SensitiveOperationAuditDto {
  id: string;
  codigoOperacao: string;
  tipoOperacao: FinancialOperationType | string;
  titulo: string;
  executadoPor: string;
  perfilExecutante: string;
  justificativa: string;
  statusQuarentena: QuarantineStatus | string;
  quarentenaExpiraEm?: string | null;
  detalhesPayload?: string | null;
  ipOrigem?: string | null;
  createdAt: string;
}

export interface CreateApprovalRequestDto {
  tipoOperacao: FinancialOperationType | string;
  referenciaId?: string;
  referenciaDescricao?: string;
  valor: number;
  justificativaSolicitacao: string;
}

export interface ReviewApprovalDto {
  aprovado: boolean;
  parecerOuMotivo: string;
}

export interface GovernanceKpisDto {
  totalAprovacoesPendentes: number;
  valorTotalPendente: number;
  operacoesEmQuarentena48h: number;
  conformidadeSodPercentual: number;
  solicitacoesAprovadasMes: number;
  tempoMedioAprovacaoHoras: number;
}
