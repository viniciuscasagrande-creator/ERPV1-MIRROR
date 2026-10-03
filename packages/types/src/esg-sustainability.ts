/**
 * Tipos e Interfaces da Fase 26: Governança de Sustentabilidade (ESG),
 * Inventário de Pegada de Carbono (GHG Protocol Escopos 1, 2 e 3) & Borderô Verde
 * Normas: GHG Protocol Corporate Standard, Resolução CVM 193/2023 & IFRS S1 e S2
 */

export enum PadraoCertificacaoCarbono {
  VERRA_VCS = 'VERRA_VCS',
  GOLD_STANDARD = 'GOLD_STANDARD',
  B3_CBIOMOB = 'B3_CBIOMOB',
  REDD_PLUS = 'REDD_PLUS',
}

export enum StatusInventarioCarbono {
  EM_APURACAO = 'EM_APURACAO',
  AUDITADO_TERCEIROS = 'AUDITADO_TERCEIROS',
  NEUTRALIZADO = 'NEUTRALIZADO',
}

export enum StatusCompensacaoVerde {
  RETIDO = 'RETIDO',
  APLICADO = 'APLICADO',
  CERTIFICADO_EMITIDO = 'CERTIFICADO_EMITIDO',
}

export enum StatusRelatorioEsg {
  DRAFT = 'DRAFT',
  PUBLICADO_CVM_193 = 'PUBLICADO_CVM_193',
  AUDITADO = 'AUDITADO',
}

export enum BiomaProjetoCarbono {
  MATA_ATLANTICA = 'MATA_ATLANTICA',
  AMAZONIA = 'AMAZONIA',
  CERRADO = 'CERRADO',
  CAATINGA = 'CAATINGA',
  PANTANAL = 'PANTANAL',
}

export interface EventCarbonFootprintDto {
  id: string;
  eventoId: string;
  codigoInventario: string;
  nomeEvento: string;
  periodoReferencia: string;
  publicoPresenteTotal: number;
  totalIngressosEmitidos: number;
  escopo1KgCo2e: number;
  escopo2KgCo2e: number;
  escopo3KgCo2e: number;
  totalKgCo2e: number;
  totalToneladasCo2e: number;
  fatorMedioPorIngressoKg: number;
  statusInventario: StatusInventarioCarbono;
  auditadoPor?: string;
  criadoEm: string;
}

export interface CarbonCreditOffsetDto {
  id: string;
  codigoCertificado: string;
  padraoCertificacao: PadraoCertificacaoCarbono;
  projetoNome: string;
  bioma: BiomaProjetoCarbono;
  numeroSerieSerial: string;
  toneladasDisponiveis: number;
  toneladasCompensadas: number;
  precoPorToneladaBrl: number;
  custoTotalBrl: number;
  status: 'RESERVADO' | 'LIQUIDADO_BORDERO' | 'APOSENTADO_REGISTRO';
  urlRegistroPublico?: string;
  dataAposentadoria?: string;
  criadoEm: string;
}

export interface GreenBorderoEntryDto {
  id: string;
  codigoRetencaoVerde: string;
  borderoFechamentoId: string;
  eventoId: string;
  eventoNome?: string;
  produtorId: string;
  produtorNome?: string;
  taxaVerdePorIngressoBrl: number;
  totalIngressosCompensados: number;
  totalRetidoSustentabilidadeBrl: number;
  toneladasCompensadas: number;
  statusCompensacao: StatusCompensacaoVerde;
  contaContabilDebito: string;
  contaContabilCredito: string;
  dataLancamento: string;
  certificadoSerial?: string;
}

export interface EsgReportIfrsDto {
  id: string;
  codigoRelatorio: string;
  anoFiscal: number;
  trimestre: string;
  totalEmissoesGeradasTCo2e: number;
  totalCompensadoTCo2e: number;
  taxaNeutralizacaoPercent: number;
  investimentoSocioambientalBrl: number;
  residuosDesviadosAterroPercent: number;
  eventosComSeloVerde: number;
  statusRelatorio: StatusRelatorioEsg;
  publicadoEm?: string;
  criadoEm: string;
}

export interface CalcularPegadaEventoRequestDto {
  eventoId: string;
  nomeEvento: string;
  publicoPresenteTotal: number;
  totalIngressosEmitidos: number;
  litrosDieselGeradores: number; // Fator ~ 2.68 kg CO2e / litro diesel
  consumoKwhArena: number; // Fator Grid SIN Brasil ~ 0.088 kg CO2e / kWh
  distanciaMediaKmPublico: number; // Deslocamento modal misto ~ 0.12 kg CO2e / km
  quilosResiduosGerados: number; // Aterro ~ 0.58 kg CO2e / kg resíduo
}

export interface CalcularPegadaEventoResponseDto {
  eventoId: string;
  nomeEvento: string;
  escopo1KgCo2e: number;
  escopo2KgCo2e: number;
  escopo3KgCo2e: number;
  totalKgCo2e: number;
  totalToneladasCo2e: number;
  fatorMedioPorIngressoKg: number;
  creditosNecessariosToneladas: number;
  custoEstimadoCompensacaoBrl: number;
  taxaSugeridaPorIngressoBrl: number;
}

export interface EsgDashboardKpisDto {
  totalEmissoesMapeadasTCo2e: number;
  totalEmissoesNeutralizadasTCo2e: number;
  taxaNeutralizacaoGlobalPercent: number;
  investimentoVerdeAcumuladoBrl: number;
  eventosAuditadosCount: number;
  creditosDisponiveisToneladas: number;
}
