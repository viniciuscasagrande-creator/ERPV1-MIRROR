/**
 * Tipos e Interfaces da Fase 22: Motor de IA para Fluxo de Caixa Preditivo, Precificação Dinâmica & Score
 * Projeção de Séries Temporais, Yield Management de Ingressos, Credit Scoring e Cash Sweep (CDI)
 */

export enum RatingProdutor {
  AAA = 'AAA', // Score 850-1000: Limite até 75% da bilheteria futura
  AA = 'AA',   // Score 700-849: Limite até 50%
  A = 'A',     // Score 550-699: Limite até 35%
  B = 'B',     // Score 400-549: Limite restrito a 20% com garantia
  C = 'C',     // Score < 400: Bloqueado p/ antecipações
}

export enum StatusRecomendacaoPreco {
  SUGERIDO = 'SUGERIDO',
  APLICADO = 'APLICADO',
  REJEITADO = 'REJEITADO',
}

export enum NivelRiscoLiquidez {
  BAIXO = 'BAIXO',
  MODERADO = 'MODERADO',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO',
}

export enum StatusAnaliseScore {
  HOMOLOGADO = 'HOMOLOGADO',
  EM_REVISAO = 'EM_REVISAO',
  BLOQUEADO = 'BLOQUEADO',
}

export interface AiCashFlowForecastDto {
  id: string;
  codigoPrevisao: string; // Ex: PRV-2026-001
  horizonteDias: number; // 30, 60, 90
  dataInicio: string;
  dataFim: string;
  saldoInicial: number;
  receitaPrevistaTotal: number;
  despesaPrevistaTotal: number;
  saldoProjetadoFinal: number;
  gapLiquidezIdentificado: boolean;
  dataGapPrevista?: string | null;
  valorGapPrevisto: number;
  probabilidadeConfianca: number; // 94.5%
  acoesRecomendadas: string;
  geradoEm: string;
}

export interface DynamicPricingRuleDto {
  id: string;
  eventId: string;
  eventNome: string;
  loteId: string;
  loteNome: string;
  precoOriginal: number;
  precoSugeridoIa: number;
  velocidadeVendasHora: number;
  percentualOcupacao: number;
  elasticidadePrecoDemanda: number;
  motivoRecomendacao: string;
  status: StatusRecomendacaoPreco;
  aplicadoEm?: string | null;
  createdAt: string;
}

export interface ProducerCreditScoreDto {
  id: string;
  producerId: string;
  producerNome: string;
  documentoFiscal: string;
  scorePontuacao: number; // 0 a 1000
  rating: RatingProdutor;
  limiteAntecipacaoMaximo: number;
  percentualMaximoRecebiveis: number;
  historicoEventosRealizados: number;
  taxaOcupacaoMediaPercent: number;
  indiceChargebackPercent: number;
  status: StatusAnaliseScore;
  ultimaAnaliseEm: string;
}

export interface TreasuryCashSweepDto {
  id: string;
  codigoAplicacao: string;
  contaBancariaId: string;
  bancoNome: string;
  saldoAplicado: number;
  taxaRendimentoPercentCdi: number; // 100.00%
  rendimentoAcumulado: number;
  status: 'APLICADO' | 'RESGATADO_AUTOMATICO';
  dataAplicacao: string;
  dataResgate?: string | null;
}

export interface AiTreasuryKpisDto {
  saldoProjetado90Dias: number;
  gapsLiquidezEvitadosCount: number;
  aumentoReceitaYieldPercent: number; // Ex: +14.8% com precificação dinâmica
  volumeCashSweepAplicado: number;
  rendimentoFinanceiroTotal: number;
  scoreMedioProdutores: number;
}

export interface SimularCurvaVendasRequestDto {
  eventoId?: string;
  loteId?: string;
  capacidadeTotal: number;
  diasAteEvento: number;
  precoLoteAtual: number;
  vendasNasUltimas24h: number;
  percentualVendido: number;
}

export interface SimularCurvaVendasResponseDto {
  velocidadeVendasHora: number;
  percentualOcupacaoAtual: number;
  precoOtimizadoSugerido: number;
  incrementoReceitaEstimado: number;
  recomendacaoAcao: 'VIRAR_LOTE_ANTECIPADO' | 'MANTER_PRECO' | 'PROMOVER_LOTE_FLASH';
  justificativaIa: string;
}
