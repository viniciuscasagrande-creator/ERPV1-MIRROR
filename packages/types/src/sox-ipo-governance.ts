/**
 * Tipos e Interfaces da Fase 50: Governança CVM / SEC para IPO & Dual-Listing (SOX 404 & PCAOB)
 */

export enum EfetividadeControleSox {
  EFICAZ_SEM_DEFICIENCIA = 'EFICAZ_SEM_DEFICIENCIA',
  DEFICIENCIA_SIGNIFICATIVA = 'DEFICIENCIA_SIGNIFICATIVA',
  DEFICIENCIA_MATERIAL = 'DEFICIENCIA_MATERIAL',
}

export interface SoxInternalControlMatrixDto {
  id: string;
  codigoControleSox: string;
  processoNegocio: string;
  descricaoControle: string;
  frequenciaTeste: string; // DIARIA, SEMANAL, MENSAL, ANUAL
  tipoControle: string; // AUTOMATIZADO, MANUAL
  efetividadeTeste: EfetividadeControleSox;
  testadoPor: string;
  dataUltimoTeste: string;
}

export interface AuditCommitteeReviewDossierDto {
  id: string;
  numeroAtaComite: string;
  membrosComitePresentes: string;
  relatorioAuditoriaIndependente: string;
  recomendacoesCfo: string;
  aprovadoParaConselho: boolean;
  dataReuniao: string;
}

export interface IpoDualListingReadinessEvaluationDto {
  id: string;
  periodoReferencia: string;
  indiceProntidaoB3Percent: number;
  indiceProntidaoSecNysePercent: number;
  statusFormularioReferenciaCvm: string;
  statusRegistrationFormF1Sec: string;
  auditorExternoIndependente: string;
  certificadoEm: string;
}

export interface SoxIpoDashboardKpisDto {
  scoreProntidaoIpoGeralPercent: number;
  controlesSoxAuditadosEficazes: number;
  totalDeficienciasSignificativas: number;
  deficienciasMateriaisSox: number;
  auditoriasBigFourConcluidas: number;
}

export interface TestarControleSoxRequestDto {
  codigoControleSox: string;
  amostraTestadaTamanho: number;
  desviosEncontrados: number;
  evidenciasUrl: string;
}

export interface TestarControleSoxResponseDto {
  codigoControleSox: string;
  efetividadeResultado: EfetividadeControleSox;
  aprovadoSox404: boolean;
  hashEvidenciaAuditSha256: string;
}
