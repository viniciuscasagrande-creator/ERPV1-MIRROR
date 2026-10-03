/**
 * Tipos e Interfaces da Fase 30: Central de Observabilidade Executiva,
 * Digital Boardroom C-Level & Geração de Demonstrações Auditadas (CVM & Big Four)
 */

export enum TipoDemonstracaoDfp {
  DFP_ANUAL = 'DFP_ANUAL',
  ITR_TRIMESTRAL = 'ITR_TRIMESTRAL',
}

export enum StatusAuditoriaBigFour {
  EM_REVISAO = 'EM_REVISAO',
  PARECER_EMITIDO_SEM_RESSALVAS = 'PARECER_EMITIDO_SEM_RESSALVAS',
  HOMOLOGADO_CVM = 'HOMOLOGADO_CVM',
}

export enum CategoriaRiscoCorporativo {
  REGULATORIO = 'REGULATORIO',
  LIQUIDEZ = 'LIQUIDEZ',
  OPERACIONAL = 'OPERACIONAL',
  TRIBUTARIO = 'TRIBUTARIO',
  CIBERNETICO = 'CIBERNETICO',
}

export enum NivelRiscoHeatmap {
  BAIXO = 'BAIXO',
  MODERADO = 'MODERADO',
  ELEVADO = 'ELEVADO',
  CRITICO = 'CRITICO',
}

export interface ExecutiveBoardroomKpisDto {
  ebitdaLtmBrl: number;
  margemEbitdaPercent: number;
  receitaLiquidaLtmBrl: number;
  liquidezCorrente: number;
  liquidezSeca: number;
  patrimonioLiquidoConsolidadoBrl: number;
  tvlTokensDrexBrl: number;
  indiceSubordinacaoFidcPercent: number;
  saldoCompensacaoEsgTco2: number;
  scoreGovernancaGrc: number;
  cndFederalValida: boolean;
  cndEstadualValida: boolean;
  cndMunicipalValida: boolean;
  cndFgtsValida: boolean;
}

export interface DfpAuditPackageDto {
  id: string;
  codigoPacote: string;
  tipoDemonstracao: TipoDemonstracaoDfp;
  exercicioAno: number;
  periodoTrimestre?: number;
  statusAuditoria: StatusAuditoriaBigFour;
  auditorResponsavel: string;
  responsavelTecnicoCrc: string;
  hashIntegridadeSha256: string;
  balancoPatrimonialAtivoJson: string;
  balancoPatrimonialPassivoJson: string;
  dreConsolidadaJson: string;
  dfcFluxoCaixaJson: string;
  dmplMutacoesPlJson: string;
  dvaValorAdicionadoJson: string;
  notasExplicativasTexto: string;
  parecerAuditoresTexto: string;
  dataGeracao: string;
  homologadoEm?: string;
}

export interface CorporateRiskItemDto {
  id: string;
  codigoRisco: string;
  categoria: CategoriaRiscoCorporativo;
  titulo: string;
  descricaoRisco: string;
  probabilidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  impactoFinanceiro: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CATASTROFICO';
  nivelRisco: NivelRiscoHeatmap;
  estrategiaMitigacao: string;
  responsavelAlcada: string;
  statusMonitoramento: 'ATIVO' | 'MITIGADO' | 'SOB_CONTROLE';
  atualizadoEm: string;
}

export interface GerarPacoteDfpRequestDto {
  tipoDemonstracao: TipoDemonstracaoDfp;
  exercicioAno: number;
  periodoTrimestre?: number;
  auditorResponsavel: string;
  responsavelTecnicoCrc: string;
}

export interface GerarPacoteDfpResponseDto {
  pacote: DfpAuditPackageDto;
  hashIntegridadeSha256: string;
  conformidadeCvm: boolean;
  mensagemHomologacao: string;
}

export interface DigitalBoardroomStreamDataDto {
  timestamp: string;
  ingressosEmitidosMinuto: number;
  volumeTransacionadoMinutoBrl: number;
  taxaSucessoGatewaysPercent: number;
  statusPilotoDrex: string;
  statusFidcSubordinacao: string;
}
