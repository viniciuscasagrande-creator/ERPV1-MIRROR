export enum MarketingChannel {
  META_ADS = 'META_ADS',
  GOOGLE_ADS = 'GOOGLE_ADS',
  TIKTOK_ADS = 'TIKTOK_ADS',
  EMAIL_MARKETING = 'EMAIL_MARKETING',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
}

export enum CampaignStatus {
  ATIVA = 'ATIVA',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  OTIMIZANDO = 'OTIMIZANDO',
}

export enum CouponDiscountType {
  PERCENTUAL = 'PERCENTUAL',
  VALOR_FIXO = 'VALOR_FIXO',
  ISENCAO_TAXA = 'ISENCAO_TAXA',
}

export enum AttributionModelType {
  FIRST_CLICK = 'FIRST_CLICK',
  LAST_CLICK = 'LAST_CLICK',
  LINEAR = 'LINEAR',
  TIME_DECAY = 'TIME_DECAY',
  DATA_DRIVEN_AI = 'DATA_DRIVEN_AI',
}

export interface MarketingCampaignDto {
  id: string;
  codigoCampanha: string;
  nomeCampanha: string;
  canal: MarketingChannel;
  eventId?: string;
  nomeEvento: string;
  status: CampaignStatus;
  orcamentoTotal: number;
  valorInvestido: number;
  impressoes: number;
  cliques: number;
  ingressosVendidos: number;
  receitaGerada: number;
  roasCalculado: number;
  cpaMedio: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  dataInicio: string;
  dataFim?: string;
}

export interface MarketingCouponDto {
  id: string;
  codigoCupom: string;
  descricao: string;
  eventId?: string;
  nomeEvento?: string;
  tipoDesconto: CouponDiscountType;
  valorDesconto: number;
  limiteUsosGlobal: number;
  usosAtuais: number;
  limitePorCpf: number;
  valorMinimoPedido: number;
  receitaTotalGerada: number;
  descontoTotalConcedido: number;
  status: 'ATIVO' | 'ESGOTADO' | 'EXPIRADO' | 'PAUSADO';
  validoAte: string;
}

export interface MarketingPromoterAffiliateDto {
  id: string;
  codigoPromoter: string;
  nomePromoter: string;
  email: string;
  telefoneWhatsapp: string;
  chavePix: string;
  tipoComissao: 'PERCENTUAL' | 'FIXO_POR_INGRESSO';
  taxaComissao: number;
  slugLink: string;
  ingressosVendidos: number;
  volumeVendasBRL: number;
  comissaoTotalAcumulada: number;
  comissaoPaga: number;
  comissaoPendente: number;
  status: 'ATIVO' | 'SUSPENSO';
}

export interface MarketingPixelCapiLogDto {
  id: string;
  eventIdTrace: string;
  plataformaDestino: 'META_CAPI' | 'GOOGLE_ENHANCED' | 'TIKTOK_EVENTS';
  tipoEvento: 'Purchase' | 'InitiateCheckout' | 'AddToCart' | 'ViewContent';
  valorTransacao: number;
  moeda: string;
  statusEnvio: string;
  deduplicacaoScore: number;
  respostaPayloadHash: string;
  timestampEvento: string;
}

export interface MarketingOverviewMetricsDto {
  totalInvestidoAds: number;
  totalReceitaAtribuida: number;
  roasGlobal: number;
  totalIngressosVendidos: number;
  cpaGlobalMedio: number;
  campanhasAtivas: number;
  cuponsAtivos: number;
  promotersAtivos: number;
  capiServerSuccessRate: number;
}
