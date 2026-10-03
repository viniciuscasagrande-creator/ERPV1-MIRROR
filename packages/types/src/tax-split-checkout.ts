/**
 * Tipos e Interfaces da Fase 32: Split Payment Tributário Inteligente no Checkout
 * Reforma Tributária 2026 (PLP 68/2024, EC 132/2023 & Comitê Gestor IBS/CBS)
 */

export enum StatusExecucaoSplitCheckout {
  PROCESSANDO = 'PROCESSANDO',
  HOMOLOGADO_BACEN = 'HOMOLOGADO_BACEN',
  REJEITADO_COMITE = 'REJEITADO_COMITE',
}

export enum RegimeTributarioDual {
  TRANSICAO_TESTE_2026 = 'TRANSICAO_TESTE_2026',
  PADRAO_DEFINITIVO = 'PADRAO_DEFINITIVO',
}

export enum TipoInsumoCreditoIbsCbs {
  LOCACAO_ARENA = 'LOCACAO_ARENA',
  SOM_ILUMINACAO = 'SOM_ILUMINACAO',
  SEGURANCA_PRIVADA = 'SEGURANCA_PRIVADA',
  GERADORES_ENERGIA = 'GERADORES_ENERGIA',
  BOMBEIROS_CIVIS = 'BOMBEIROS_CIVIS',
}

export interface TaxSplitCheckoutExecutionDto {
  id: string;
  codigoSplit: string;
  pedidoId: string;
  numeroIngressos: number;
  valorTotalTransacaoBrl: number;
  basePropriaComissaoBrl: number;
  baseRepasseProdutorBrl: number;
  aliquotaCbsPercent: number;
  aliquotaIbsPercent: number;
  valorCbsRetidoBrl: number;
  valorIbsRetidoBrl: number;
  valorLiquidoDiskIngressosBrl: number;
  valorLiquidoProdutorBrl: number;
  protocoloComiteGestorIbs: string;
  statusSplit: StatusExecucaoSplitCheckout;
  tempoProcessamentoMs: number;
  metodoPagamento: string;
  dataLiquidacao: string;
}

export interface TaxCreditAccumulatorDto {
  id: string;
  codigoCredito: string;
  fornecedorNome: string;
  fornecedorCnpj: string;
  numeroNfeRef: string;
  tipoInsumoEvento: TipoInsumoCreditoIbsCbs;
  valorTotalInsumoBrl: number;
  creditoCbsApropriadoBrl: number;
  creditoIbsApropriadoBrl: number;
  statusApropriacao: string;
  dataApropriacao: string;
}

export interface TaxSplitFiscalParamDto {
  versaoNormaRegulamentar: string;
  aliquotaCbsPercent: number;
  aliquotaIbsEstadualPercent: number;
  aliquotaIbsMunicipalPercent: number;
  modoTransitorio2026: boolean;
  splitPaymentAutomaticoAtivo: boolean;
}

export interface CalcularSplitTributarioRequestDto {
  valorIngressoBrl: number;
  taxaConvenienciaBrl: number;
  quantidadeIngressos: number;
  regime?: RegimeTributarioDual;
}

export interface CalcularSplitTributarioResponseDto {
  valorTotalTransacaoBrl: number;
  baseTributavelDiskBrl: number;
  baseRepasseProdutorBrl: number;
  valorCbsRetidoBrl: number;
  valorIbsRetidoBrl: number;
  valorLiquidoDiskBrl: number;
  valorLiquidoProdutorBrl: number;
  aliquotaEfetivaRetencaoPercent: number;
}

export interface TaxSplitDashboardKpisDto {
  volumeRetidoCbsIbsTotalBrl: number;
  taxaRetencaoMediaEfetivaPercent: number;
  creditosNaoCumulatividadeTotalBrl: number;
  taxaSucessoProtocolosComitePercent: number;
  totalTransacoesComSplit: number;
}
