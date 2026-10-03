/**
 * Tipos e Interfaces da Fase 42: Royalties Internacionais, Withholding Tax & Fechamento de Câmbio
 */

export interface ArtistRoyaltyAgreementDto {
  id: string;
  codigoContrato: string;
  artistaNome: string;
  agenciaInternacional: string;
  paisOrigemIso: string; // USA, GBR, DEU
  possuiTratadoDuplaTrib: boolean;
  moedaContratual: string; // USD, EUR, GBP
  valorCacheMoedaOrigem: number;
  statusContrato: string;
  criadoEm: string;
}

export interface InternationalWithholdingTaxDto {
  id: string;
  contratoId: string;
  codigoRetencao: string;
  aliquotaIrrfPercent: number; // 15% ou 25%
  valorIrrfRetidoBrl: number;
  aliquotaCidePercent: number; // 10%
  valorCideDevidoBrl: number;
  darfIrrfNumero: string;
  darfCideNumero: string;
  dataCalculo: string;
}

export interface ForeignRemittanceOrderDto {
  id: string;
  codigoRemessa: string;
  contratoId: string;
  bancoCambioIspb: string;
  taxaCambioPtaxBrl: number;
  valorLiquidoEnviadoMoeda: number;
  swiftReference: string;
  statusRemessa: string;
  dataEfetivacao: string;
}

export interface ArtistRoyaltyDashboardKpisDto {
  totalContratosInternacionais: number;
  volumeTotalRemessasUsd: number;
  tributosRetidosFonteBrl: number; // IRRF + CIDE
  remessasSwiftLiquidadas: number;
  taxaMediaPtaxPraticadaBrl: number;
}

export interface CalcularWithholdingTaxRequestDto {
  contratoId: string;
  valorCacheMoedaOrigem: number;
  moeda: string;
  cotacaoPtaxBrl: number;
  possuiTratadoDuplaTrib: boolean;
}

export interface CalcularWithholdingTaxResponseDto {
  codigoRetencao: string;
  valorBrutoBrl: number;
  aliquotaIrrfPercent: number;
  valorIrrfBrl: number;
  aliquotaCidePercent: number;
  valorCideBrl: number;
  valorLiquidoRemessaBrl: number;
  valorLiquidoRemessaMoeda: number;
}
