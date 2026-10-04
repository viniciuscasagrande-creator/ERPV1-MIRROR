export enum UtmChannelType {
  META_ADS = 'META_ADS',
  GOOGLE_ADS_GA4 = 'GOOGLE_ADS_GA4',
  TIKTOK_ADS = 'TIKTOK_ADS',
  SPOTIFY_ADS = 'SPOTIFY_ADS',
  PINTEREST_ADS = 'PINTEREST_ADS',
  X_TWITTER_ADS = 'X_TWITTER_ADS',
  LINKEDIN_ADS = 'LINKEDIN_ADS',
  INFLUENCER_PROMOTER = 'INFLUENCER_PROMOTER',
  QRCODE_OFFLINE = 'QRCODE_OFFLINE',
  CRM_EMAIL_PUSH = 'CRM_EMAIL_PUSH',
  PROGRAMMATIC_DSP = 'PROGRAMMATIC_DSP',
}

export enum TelemetryConnectionStatus {
  OPERACIONAL_NORMAL = 'OPERACIONAL_NORMAL',
  INSTABILIDADE = 'INSTABILIDADE',
  DEGRADADO = 'DEGRADADO',
  CRITICO = 'CRITICO',
}

export enum AnomalySeverity {
  CRITICA = 'CRITICA',
  ALERTA = 'ALERTA',
  INFORMATIVA = 'INFORMATIVA',
}

export interface UtmTrackingCampaignLinkDto {
  id: string;
  codigoIdentificador: string;
  nomeCampanha: string;
  canalOrigem: UtmChannelType;
  eventId?: string;
  nomeEvento: string;
  loteSetor?: string;
  urlDestinoOriginal: string;
  urlParametrizadaCompleta: string;
  urlEncurtada: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  parametrosExtrasJson?: string;
  qrCodeDataUri?: string;
  totalCliques: number;
  totalConversoes: number;
  receitaGeradaBRL: number;
  taxaConversaoPercent: number;
  statusLink: 'ATIVO' | 'PAUSADO' | 'ARQUIVADO';
  criadoPor: string;
  createdAt: string;
}

export interface CreateUtmLinkRequestDto {
  nomeCampanha: string;
  canalOrigem: UtmChannelType;
  eventId?: string;
  nomeEvento: string;
  loteSetor?: string;
  urlDestinoOriginal: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  promoterId?: string;
}

export interface ValidateUtmResultDto {
  valido: boolean;
  scoreQualidade: number; // 0 a 100
  urlAnalisada: string;
  parametrosDetectados: Record<string, string>;
  avisos: string[];
  compatibilidadeGa4: boolean;
  compatibilidadeMetaCapi: boolean;
  compatibilidadeTikTokEvents: boolean;
  compatibilidadeSpotifyAds: boolean;
  sugestoesMelhoria: string[];
}

export interface AdsNetworkTelemetryMetricDto {
  id: string;
  canalNetwork: UtmChannelType;
  nomeExibicao: string;
  statusConexao: TelemetryConnectionStatus;
  latenciaMediaMs: number;
  taxaEntregaServerSideCapi: number; // %
  taxaDeduplicacaoScore: number; // 0-10
  taxaMatchingAttIosPercent: number; // %
  eventosProcessados24h: number;
  falhasDisparo24h: number;
  gastoMonitorado24hBRL: number;
  roasEmTempoReal: number;
  ultimoHealthPing: string;
}

export interface AdsTelemetryLiveEventDto {
  id: string;
  eventTraceId: string;
  canalNetwork: string;
  tipoEvento: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  valorMonetario: number;
  httpStatus: number;
  latenciaDisparoMs: number;
  payloadSnippet: string;
  ipOrigemHash: string;
  navegadorDispositivo: string;
  statusEntrega: string;
  timestampEvento: string;
}

export interface AdsTelemetryAnomalyAlertDto {
  id: string;
  codigoAlerta: string;
  canalNetwork: string;
  severidade: AnomalySeverity;
  tipoAnomalia: string;
  descricao: string;
  valorDetectado: string;
  valorEsperado: string;
  acaoRecomendada: string;
  status: 'PENDENTE' | 'EM_INVESTIGACAO' | 'RESOLVIDO';
  resolvidoPor?: string;
  resolvidoEm?: string;
  timestampAlerta: string;
}

export interface AdsTelemetryOverviewDto {
  scoreSaudeGeral: number; // ex: 98.4%
  canaisMonitoradosAtivos: number;
  latenciaMediaGlobalMs: number;
  taxaEntregaGlobalCapi: number;
  eventosProcessados24hTotal: number;
  gastoMonitoradoTotal24hBRL: number;
  receitaAtribuidaTotal24hBRL: number;
  roasBlendedRealTime: number;
  alertasAtivosPendentes: number;
  distribuicaoTrafegoDispositivos: {
    iosSafariAtt: number;
    androidChrome: number;
    desktopWeb: number;
    inAppInstagram: number;
    inAppTikTok: number;
    outros: number;
  };
}
