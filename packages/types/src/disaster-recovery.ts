export enum BackupType {
  COMPLETO = 'COMPLETO',
  CONTABIL_LEGAL = 'CONTABIL_LEGAL',
  FISCAL_SPED = 'FISCAL_SPED',
  INCREMENTAL = 'INCREMENTAL',
}

export enum BackupStatus {
  EM_EXECUCAO = 'EM_EXECUCAO',
  CONCLUIDO = 'CONCLUIDO',
  FALHA = 'FALHA',
  RESTAURADO = 'RESTAURADO',
}

export enum StorageTarget {
  S3_COMPLIANT_COLD = 'S3_COMPLIANT_COLD',
  LOCAL_ENCRYPTED = 'LOCAL_ENCRYPTED',
  GLACIER = 'GLACIER',
}

export enum RestoreDestination {
  SANDBOX_AUDITORIA = 'SANDBOX_AUDITORIA',
  HOMOLOGACAO = 'HOMOLOGACAO',
  PRODUCAO = 'PRODUCAO',
}

export enum RestoreStatus {
  EM_EXECUCAO = 'EM_EXECUCAO',
  SUCESSO = 'SUCESSO',
  REJEITADO = 'REJEITADO',
}

export interface BackupTableDetailDto {
  nome: string;
  linhas: number;
  tamanhoKb: number;
}

export interface BackupSnapshotDto {
  id: string;
  codigoSnapshot: string;
  tipo: BackupType | string;
  tamanhoBytes: number;
  status: BackupStatus | string;
  checksumSha256: string;
  armazenamento: StorageTarget | string;
  retencaoAte: string;
  totalTabelas: number;
  totalLinhas: number;
  criadoPor?: string | null;
  createdAt: string;
  restoreLogsCount?: number;
  tabelasDetalhadas?: BackupTableDetailDto[];
}

export interface RestoreDrAuditLogDto {
  id: string;
  snapshotId: string;
  snapshotCodigo?: string;
  solicitadoPor: string;
  motivo: string;
  resultado: RestoreStatus | string;
  ambienteDestino: RestoreDestination | string;
  duracaoSegundos: number;
  ipOrigem?: string | null;
  createdAt: string;
}

export interface CreateBackupSnapshotDto {
  tipo: BackupType | string;
  armazenamento?: StorageTarget | string;
  descricao?: string;
}

export interface RequestRestoreDrDto {
  snapshotId: string;
  ambienteDestino: RestoreDestination | string;
  motivo: string;
  confirmacaoSeguranca: boolean;
}

export interface DisasterRecoveryMetricsDto {
  totalSnapshots: number;
  totalTamanhoBytes: number;
  totalTabelasProtegidas: number;
  conformidadeRetencao5Anos: boolean;
  rtoMedioMinutos: number;
  rpoHoras: number;
  ultimoBackupEm: string;
  proximoBackupAgendado: string;
}
