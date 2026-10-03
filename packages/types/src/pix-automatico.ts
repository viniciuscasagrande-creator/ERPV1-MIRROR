/**
 * Tipos e Interfaces da Fase 31: Pix Automático & Débito Recorrente (BCB 430/431)
 * Liquidação Instantânea via SPI, Split Quádruplo e Smart Retries por IA
 */

export enum StatusMandatoPix {
  PENDENTE_AUTORIZACAO = 'PENDENTE_AUTORIZACAO',
  ATIVO = 'ATIVO',
  PAUSADO = 'PAUSADO',
  CANCELADO_USUARIO = 'CANCELADO_USUARIO',
  REVOGADO_PSP = 'REVOGADO_PSP',
}

export enum PeriodicidadeMandato {
  SEMANAL = 'SEMANAL',
  MENSAL = 'MENSAL',
  TRIMESTRAL = 'TRIMESTRAL',
  ANUAL = 'ANUAL',
}

export enum StatusCobrancaPix {
  AGENDADA = 'AGENDADA',
  PROCESSANDO_SPI = 'PROCESSANDO_SPI',
  LIQUIDADA_SUCESSO = 'LIQUIDADA_SUCESSO',
  FALHA_SALDO_INSUFICIENTE = 'FALHA_SALDO_INSUFICIENTE',
  REJEITADA_PSP = 'REJEITADA_PSP',
}

export enum CanalAutorizacaoPix {
  APP_BANCARIO_QR = 'APP_BANCARIO_QR',
  OPEN_FINANCE_REDIRECT = 'OPEN_FINANCE_REDIRECT',
  WEBHOOK_PSP = 'WEBHOOK_PSP',
}

export interface PixAutomaticoMandatoDto {
  id: string;
  codigoMandato: string;
  clienteNome: string;
  clienteCpfCnpj: string;
  chavePix: string;
  ispbBancoParticipante: string;
  bancoNome: string;
  planoAssinaturaNome: string;
  valorLimitePorTransacaoBrl: number;
  periodicidade: PeriodicidadeMandato;
  statusMandato: StatusMandatoPix;
  diaVencimento: number;
  canalAutorizacao: CanalAutorizacaoPix;
  autorizadoEm?: string;
  canceladoEm?: string;
  motivoCancelamento?: string;
  criadoEm: string;
}

export interface PixAutomaticoCobrancaDto {
  id: string;
  codigoCobranca: string;
  mandatoId: string;
  clienteNome: string;
  valorCobradoBrl: number;
  competenciaMesAno: string;
  dataAgendada: string;
  dataLiquidacaoSpi?: string;
  endToEndIdBacen?: string;
  statusCobranca: StatusCobrancaPix;
  tempoLiquidacaoMs?: number;
  tentativasRealizadas: number;
  proximaRetentativaEm?: string;
  splitReceitaPropriaBrl: number;
  splitRepasseProdutorBrl: number;
  splitRetencaoFidcBrl: number;
  splitCompensacaoEsgBrl: number;
  lancamentoContabilRef?: string;
  criadoEm: string;
}

export interface PixAutomaticoDashboardKpisDto {
  volumeMensalLiquidadoBrl: number;
  totalMandatosAtivos: number;
  taxaSucessoPrimeiraTentativaPercent: number;
  taxaRecuperacaoSmartRetryPercent: number;
  tempoMedioLiquidacaoSpiMs: number;
}

export interface CriarMandatoPixRequestDto {
  clienteNome: string;
  clienteCpfCnpj: string;
  chavePix: string;
  bancoNome: string;
  ispbBancoParticipante: string;
  planoAssinaturaNome: string;
  valorLimitePorTransacaoBrl: number;
  periodicidade: PeriodicidadeMandato;
  diaVencimento: number;
}

export interface ExecutarCobrancaPixRequestDto {
  mandatoId: string;
  valorCobradoBrl: number;
  competenciaMesAno: string;
}

export interface SimularSmartRetryResponseDto {
  cobrancaId: string;
  horarioRecomendadoIa: string;
  probabilidadeSaldoSuficientePercent: number;
  motivoOtimizacao: string;
}
