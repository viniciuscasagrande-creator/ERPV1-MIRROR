/**
 * Tipos e Interfaces da Fase 24: Gateway Global Multi-Moeda, Conversão Spot e Compliance Cambial
 * Legislação: Resoluções Bacen 277/2022, Decreto 6.306/07 (IOF Câmbio) e Norma Contábil NBC TG 02 / IAS 21
 */

export enum MoedaEstrangeira {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BRL = 'BRL',
}

export enum StatusVendaInternacional {
  COTADO = 'COTADO',
  TRAVADO_SPOT = 'TRAVADO_SPOT',
  LIQUIDADO_BORDERO = 'LIQUIDADO_BORDERO',
  CANCELADO = 'CANCELADO',
}

export enum StatusHedgeCambial {
  ATIVO = 'ATIVO',
  LIQUIDADO = 'LIQUIDADO',
  EXPIRADO = 'EXPIRADO',
}

export enum TipoVariacaoCambial {
  ATIVA_RECEITA = 'ATIVA_RECEITA',
  PASSIVA_DESPESA = 'PASSIVA_DESPESA',
}

export interface CurrencyExchangeRateDto {
  id: string;
  moedaOrigem: MoedaEstrangeira;
  moedaDestino: string;
  taxaPtaxOficial: number;
  spreadPercent: number;
  taxaEfetivaSpot: number;
  dataHoraCotacao: string;
  fonteCotacao: string;
  ativa: boolean;
}

export interface InternationalTicketSaleDto {
  id: string;
  codigoTransacao: string;
  vendaId?: string | null;
  eventoId: string;
  eventoNome: string;
  paisComprador: string;
  moedaEstrangeira: MoedaEstrangeira;
  valorMoedaEstrangeira: number;
  taxaCambioAplicada: number;
  aliquotaIofPercent: number;
  valorIofBrl: number;
  valorTotalBrl: number;
  valorLiquidoProdutorBrl: number;
  spreadReceitaDiskBrl: number;
  statusCambial: StatusVendaInternacional;
  dataTransacao: string;
}

export interface FxHedgeContractDto {
  id: string;
  codigoContratoHedge: string;
  eventoId: string;
  eventoNome: string;
  produtorId: string;
  moedaProtegida: MoedaEstrangeira;
  volumeMoedaProtegido: number;
  taxaCambioTravadaSpot: number;
  valorBrlGarantido: number;
  instituicaoFinanceira: string;
  dataAbertura: string;
  dataLiquidacaoPrevista: string;
  status: StatusHedgeCambial;
}

export interface FxAccountingEntryDto {
  id: string;
  codigoLancamento: string;
  eventoId?: string | null;
  tipoVariacao: TipoVariacaoCambial;
  moedaOrigem: MoedaEstrangeira;
  taxaCotacaoInicial: number;
  taxaLiquidacao: number;
  valorDiferencaBrl: number;
  contaContabilDebito: string;
  contaContabilCredito: string;
  historicoContabil: string;
  dataLancamento: string;
}

export interface SimularCotacaoInternacionalRequestDto {
  valorBrl: number;
  moedaDesejada: MoedaEstrangeira;
  tipoCartao?: 'INTERNACIONAL_CREDITO' | 'CONTA_GLOBAL_DEBITO';
}

export interface SimularCotacaoInternacionalResponseDto {
  valorOriginalBrl: number;
  moedaDesejada: MoedaEstrangeira;
  taxaPtax: number;
  spreadPercent: number;
  taxaSpotFinal: number;
  valorMoedaEstrangeira: number;
  aliquotaIofPercent: number;
  valorIofBrl: number;
  custoTotalEstimadoBrl: number;
}

export interface GlobalFxKpisDto {
  volumeTotalUsdEquivalente: number;
  receitaSpreadCambialBrl: number;
  totalIofRecolhidoBrl: number;
  volumeHedgeTravadoUsd: number;
  paisesAtendidosCount: number;
  taxaConversaoCheckoutFxPercent: number;
}
