/**
 * Tipos e Interfaces da Fase 29: Inteligência Regulamentar de IA Contábil
 * AI Agent Swarm, Fechamento "Zero-Touch", AI Copilot CFO & Análise Preditiva
 */

export enum StatusFechamentoAi {
  INICIADO = 'INICIADO',
  EM_ANALISE_SWARM = 'EM_ANALISE_SWARM',
  CONCILIADO_SUCESSO = 'CONCILIADO_SUCESSO',
  REQUER_APROVACAO_CFO = 'REQUER_APROVACAO_CFO',
  CONCLUIDO_TRAVADO = 'CONCLUIDO_TRAVADO',
}

export enum TipoAgenteSwarm {
  AGENTE_FISCAL_REFORMA = 'AGENTE_FISCAL_REFORMA',
  AGENTE_TESOURARIA_SPI_DREX = 'AGENTE_TESOURARIA_SPI_DREX',
  AGENTE_SOCIETARIO_IFRS_MEP = 'AGENTE_SOCIETARIO_IFRS_MEP',
  AGENTE_FIDC_RISCO_RWA = 'AGENTE_FIDC_RISCO_RWA',
  AGENTE_GOVERNANCA_SOD = 'AGENTE_GOVERNANCA_SOD',
}

export enum StatusValidacaoAgente {
  APROVADO_AUTO = 'APROVADO_AUTO',
  AJUSTADO_AUTO = 'AJUSTADO_AUTO',
  ALERTA_HUMANO = 'ALERTA_HUMANO',
}

export enum TipoInsightPreditivo {
  PROJECAO_EBITDA = 'PROJECAO_EBITDA',
  RISCO_LIQUIDEZ = 'RISCO_LIQUIDEZ',
  OTIMIZACAO_TRIBUTARIA = 'OTIMIZACAO_TRIBUTARIA',
  COBERTURA_FIDC = 'COBERTURA_FIDC',
}

export enum GrauUrgenciaInsight {
  BAIXO = 'BAIXO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO',
}

export interface AiClosingExecutionDto {
  id: string;
  codigoFechamento: string;
  periodoAnoMes: string;
  statusFechamento: StatusFechamentoAi;
  totalLancamentosAuditados: number;
  totalDiscrepanciasCorrigidas: number;
  tempoExecucaoSegundos: number;
  confiancaMediaPercent: number;
  iniciadoPor: string;
  concluidoEm?: string;
  criadoEm: string;
}

export interface AiAgentAuditLogDto {
  id: string;
  closingExecutionId: string;
  agenteEspecialista: TipoAgenteSwarm;
  moduloAuditado: string;
  statusValidacao: StatusValidacaoAgente;
  justificativaRaciocinio: string; // Chain of Thought
  normaRegulamentar: string;
  divergenciaBrl: number;
  ajusteRealizadoBrl: number;
  dataLog: string;
}

export interface AiCfoCopilotMessageDto {
  id: string;
  closingExecutionId?: string;
  usuarioId: string;
  perguntaUsuario: string;
  respostaCopilot: string;
  metricasCitadasJson?: string;
  sugestaoAcao?: string;
  dataHora: string;
}

export interface AiPredictiveBalanceInsightDto {
  id: string;
  periodoReferencia: string;
  tipoInsight: TipoInsightPreditivo;
  titulo: string;
  descricaoDetalhada: string;
  impactoEstimadoBrl: number;
  grauUrgencia: GrauUrgenciaInsight;
  acaoRecomendada: string;
  dataGeracao: string;
}

export interface ExecutarFechamentoZeroTouchRequestDto {
  periodoAnoMes: string;
  iniciadoPor: string;
  autoTravaCompetencia: boolean;
}

export interface ExecutarFechamentoZeroTouchResponseDto {
  fechamento: AiClosingExecutionDto;
  agentLogs: AiAgentAuditLogDto[];
  balancoEquilibrado: boolean;
  parecerCfoPronto: string;
}

export interface ConsultarCfoCopilotRequestDto {
  pergunta: string;
  periodoReferencia?: string;
}

export interface ConsultarCfoCopilotResponseDto {
  respostaTexto: string;
  dadosGrafico?: any;
  sugestaoAcao?: string;
  confiancaRespostaPercent: number;
}

export interface AiAutonomousClosingDashboardKpisDto {
  taxaAutomacaoZeroTouchPercent: number;
  tempoMedioFechamentoSegundos: number;
  totalDiscrepanciasCorrigidasAno: number;
  confiancaRegulatoriaMediaPercent: number;
  periodosFechadosCount: number;
}
