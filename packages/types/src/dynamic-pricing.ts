/**
 * Tipos e Interfaces da Fase 41: Precificação Dinâmica & Yield Management Preditivo com IA
 */

export enum SetorIngressoDynamic {
  PISTA_PREMIUM = 'PISTA_PREMIUM',
  CAMAROTE_OPEN_BAR = 'CAMAROTE_OPEN_BAR',
  ARQUIBANCADA = 'ARQUIBANCADA',
  MESA_VIP = 'MESA_VIP',
}

export enum StatusPoliticaDynamic {
  ATIVA_OPERACIONAL = 'ATIVA_OPERACIONAL',
  PAUSADA_MANUAL = 'PAUSADA_MANUAL',
  FINALIZADA_ESGOTADO = 'FINALIZADA_ESGOTADO',
}

export interface DynamicPricingPolicyDto {
  id: string;
  codigoPolitica: string;
  eventoId: string;
  setorIngresso: SetorIngressoDynamic;
  precoBaseBrl: number;
  precoPisoMinimoBrl: number;
  precoTetoMaximoBrl: number;
  fatorElasticidadeIa: number;
  statusPolitica: StatusPoliticaDynamic;
  criadoEm: string;
}

export interface DynamicTicketBatchPriceDto {
  id: string;
  politicaId: string;
  loteNumero: number;
  precoAtualVigenteBrl: number;
  percentualAgio: number;
  ingressosDisponiveis: number;
  velocidadeVendasMinuto: number;
  atualizadoEm: string;
}

export interface PriceSurgeAuditLogDto {
  id: string;
  codigoSurgeLog: string;
  eventoId: string;
  precoAnteriorBrl: number;
  precoNovoBrl: number;
  motivoGatilhoIa: string;
  autorizadoPor: string;
  timestampGatilho: string;
}

export interface DynamicPricingDashboardKpisDto {
  totalPoliticasAtivas: number;
  receitaIncrementalAgioBrl: number;
  fatorMedioOcupacaoPercent: number;
  disparosSurgePricingHoje: number;
  ticketMedioDinamicoBrl: number;
}

export interface SimularAjusteDinamicoRequestDto {
  politicaId: string;
  velocidadeVendasMinuto: number;
  percentualEstoqueRestante: number;
}

export interface SimularAjusteDinamicoResponseDto {
  politicaId: string;
  precoRecomendadoBrl: number;
  percentualVariacao: number;
  motivoAjuste: string;
  dentroDasTravas: boolean;
}
