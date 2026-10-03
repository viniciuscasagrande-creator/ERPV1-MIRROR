/**
 * Tipos e Interfaces da Fase 40: Suíte Soberana de Auditoria Contínua & War Room da Diretoria / CFO
 * Zero-Trust Financial Kernel, Kill-Switch Patrimonial & Certificação SOC 1 / ISAE 3402 Type II
 */

export enum StatusKernelSoberano {
  SOBERANO_EQUILIBRADO = 'SOBERANO_EQUILIBRADO',
  ALERTA_DIVERGENCIA_RESIDUAL = 'ALERTA_DIVERGENCIA_RESIDUAL',
  QUARENTENA_PATRIMONIAL_KILL_SWITCH = 'QUARENTENA_PATRIMONIAL_KILL_SWITCH',
}

export interface ZeroTrustAuditKernelDto {
  id: string;
  codigoCicloKernel: string;
  timestampExecucao: string;
  totalRegrasAuditadas: number;
  regrasConformes: number;
  violacoesCriticas: number;
  integridadeContabilScore: number; // 99.99%
  statusKernel: StatusKernelSoberano;
  hashGlobalMptSha256: string; // Merkle Patricia Tree Root Hash
}

export interface PatrimonialKillSwitchEventDto {
  id: string;
  eventoKillSwitchId: string;
  motivoAcionamento: string;
  ativo: boolean;
  acionadoPor: string;
  dataAcionamento?: string;
  quarentenaPatrimonialStatus: string;
}

export interface Isae3402ComplianceDossierDto {
  id: string;
  codigoDossie: string;
  anoPeriodoAuditoria: string; // 2026-Q1
  auditorResponsavel: string;
  statusHomologacao: string;
  hashAssinaturaAuditoria: string;
  emitidoEm: string;
}

export interface WarRoomDashboardKpisDto {
  scoreIntegridadePatrimonialPercent: number;
  totalFasesConformes: number; // 40 de 40
  totalRegrasContabeisValidadas: number;
  saldoConsolidadoSegregadoBrl: number;
  tempoMedioAuditoriaKernelMs: number;
  statusKillSwitchGeral: 'ARMADO_OPERACIONAL' | 'ATIVADO_BLOQUEIO';
}

export interface DispararAuditoriaKernelRequestDto {
  profundidadeVerificacao: 'RAPIDA' | 'COMPLETA_40_FASES';
  validarMerkleTree: boolean;
}

export interface DispararAuditoriaKernelResponseDto {
  codigoCicloKernel: string;
  scoreIntegridade: number;
  regrasConformes: number;
  totalRegras: number;
  merkleRootHash: string;
  status: StatusKernelSoberano;
  duracaoMs: number;
}
