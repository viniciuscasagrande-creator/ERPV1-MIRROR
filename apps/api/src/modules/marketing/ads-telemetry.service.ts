import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  UtmChannelType,
  TelemetryConnectionStatus,
  AnomalySeverity,
  AdsNetworkTelemetryMetricDto,
  AdsTelemetryLiveEventDto,
  AdsTelemetryAnomalyAlertDto,
  AdsTelemetryOverviewDto,
} from '@diskingressos/types';

@Injectable()
export class AdsTelemetryService {
  private readonly logger = new Logger(AdsTelemetryService.name);

  private inMemoryMetrics: AdsNetworkTelemetryMetricDto[] = [
    {
      id: 'tel-001',
      canalNetwork: UtmChannelType.META_ADS,
      nomeExibicao: 'Meta Graph API & Conversions API (CAPI)',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 38,
      taxaEntregaServerSideCapi: 99.85,
      taxaDeduplicacaoScore: 9.6,
      taxaMatchingAttIosPercent: 86.4,
      eventosProcessados24h: 142500,
      falhasDisparo24h: 12,
      gastoMonitorado24hBRL: 38200.0,
      roasEmTempoReal: 11.19,
      ultimoHealthPing: new Date().toISOString(),
    },
    {
      id: 'tel-002',
      canalNetwork: UtmChannelType.GOOGLE_ADS_GA4,
      nomeExibicao: 'Google Ads & GA4 Measurement Protocol',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 29,
      taxaEntregaServerSideCapi: 99.92,
      taxaDeduplicacaoScore: 9.8,
      taxaMatchingAttIosPercent: 91.2,
      eventosProcessados24h: 189400,
      falhasDisparo24h: 4,
      gastoMonitorado24hBRL: 26400.0,
      roasEmTempoReal: 13.03,
      ultimoHealthPing: new Date().toISOString(),
    },
    {
      id: 'tel-003',
      canalNetwork: UtmChannelType.TIKTOK_ADS,
      nomeExibicao: 'TikTok Events API Server-to-Server',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 44,
      taxaEntregaServerSideCapi: 99.45,
      taxaDeduplicacaoScore: 9.2,
      taxaMatchingAttIosPercent: 79.8,
      eventosProcessados24h: 88200,
      falhasDisparo24h: 18,
      gastoMonitorado24hBRL: 9800.0,
      roasEmTempoReal: 7.27,
      ultimoHealthPing: new Date().toISOString(),
    },
    {
      id: 'tel-004',
      canalNetwork: UtmChannelType.SPOTIFY_ADS,
      nomeExibicao: 'Spotify Advertising Real-time Listener',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 35,
      taxaEntregaServerSideCapi: 99.7,
      taxaDeduplicacaoScore: 9.4,
      taxaMatchingAttIosPercent: 88.5,
      eventosProcessados24h: 31200,
      falhasDisparo24h: 2,
      gastoMonitorado24hBRL: 6500.0,
      roasEmTempoReal: 8.85,
      ultimoHealthPing: new Date().toISOString(),
    },
    {
      id: 'tel-005',
      canalNetwork: UtmChannelType.PINTEREST_ADS,
      nomeExibicao: 'Pinterest Conversion API',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 52,
      taxaEntregaServerSideCapi: 99.1,
      taxaDeduplicacaoScore: 9.0,
      taxaMatchingAttIosPercent: 82.0,
      eventosProcessados24h: 12400,
      falhasDisparo24h: 5,
      gastoMonitorado24hBRL: 2800.0,
      roasEmTempoReal: 5.4,
      ultimoHealthPing: new Date().toISOString(),
    },
    {
      id: 'tel-006',
      canalNetwork: UtmChannelType.X_TWITTER_ADS,
      nomeExibicao: 'X Ads Conversion Pixel v2',
      statusConexao: TelemetryConnectionStatus.OPERACIONAL_NORMAL,
      latenciaMediaMs: 48,
      taxaEntregaServerSideCapi: 98.9,
      taxaDeduplicacaoScore: 8.9,
      taxaMatchingAttIosPercent: 77.2,
      eventosProcessados24h: 9800,
      falhasDisparo24h: 8,
      gastoMonitorado24hBRL: 1900.0,
      roasEmTempoReal: 4.8,
      ultimoHealthPing: new Date().toISOString(),
    },
  ];

  private inMemoryLiveEvents: AdsTelemetryLiveEventDto[] = [
    {
      id: 'live-001',
      eventTraceId: 'trc-meta-9041b',
      canalNetwork: 'META_ADS',
      tipoEvento: 'Purchase',
      valorMonetario: 380.0,
      httpStatus: 200,
      latenciaDisparoMs: 36,
      payloadSnippet: '{"event_name":"Purchase","value":380.00,"currency":"BRL","event_id":"evt_88a"}',
      ipOrigemHash: 'sha256-189.28.xx.xx',
      navegadorDispositivo: 'iOS 18.2 Safari In-App Instagram',
      statusEntrega: 'CONFIRMADO_SERVER',
      timestampEvento: new Date(Date.now() - 15000).toISOString(),
    },
    {
      id: 'live-002',
      eventTraceId: 'trc-goog-8812c',
      canalNetwork: 'GOOGLE_ADS_GA4',
      tipoEvento: 'InitiateCheckout',
      valorMonetario: 760.0,
      httpStatus: 200,
      latenciaDisparoMs: 28,
      payloadSnippet: '{"client_id":"ga4_9921","items":[{"item_name":"VillaMix Camarote"}]}',
      ipOrigemHash: 'sha256-177.105.xx.xx',
      navegadorDispositivo: 'Android 14 Chrome Mobile',
      statusEntrega: 'CONFIRMADO_SERVER',
      timestampEvento: new Date(Date.now() - 45000).toISOString(),
    },
    {
      id: 'live-003',
      eventTraceId: 'trc-tt-7723d',
      canalNetwork: 'TIKTOK_ADS',
      tipoEvento: 'AddToCart',
      valorMonetario: 160.0,
      httpStatus: 200,
      latenciaDisparoMs: 42,
      payloadSnippet: '{"event":"AddToCart","properties":{"content_type":"ticket"}}',
      ipOrigemHash: 'sha256-186.211.xx.xx',
      navegadorDispositivo: 'iOS 18.1 TikTok Webview',
      statusEntrega: 'CONFIRMADO_SERVER',
      timestampEvento: new Date(Date.now() - 90000).toISOString(),
    },
    {
      id: 'live-004',
      eventTraceId: 'trc-spt-6611e',
      canalNetwork: 'SPOTIFY_ADS',
      tipoEvento: 'ViewContent',
      valorMonetario: 0.0,
      httpStatus: 200,
      latenciaDisparoMs: 33,
      payloadSnippet: '{"event_source":"spotify_audio_companion","campaign":"rock_stadium"}',
      ipOrigemHash: 'sha256-201.88.xx.xx',
      navegadorDispositivo: 'Windows 11 Chrome Desktop',
      statusEntrega: 'CONFIRMADO_SERVER',
      timestampEvento: new Date(Date.now() - 120000).toISOString(),
    },
  ];

  private inMemoryAnomalies: AdsTelemetryAnomalyAlertDto[] = [
    {
      id: 'alt-001',
      codigoAlerta: 'ALT-ATT-IOS-TIKTOK-01',
      canalNetwork: 'TIKTOK_ADS',
      severidade: AnomalySeverity.ALERTA,
      tipoAnomalia: 'MATCHING_ATT_IOS_BAIXO',
      descricao: 'Taxa de Advanced Matching no TikTok Events caiu para 79.8% devido a novas restrições iOS 18.2.',
      valorDetectado: '79.8%',
      valorEsperado: '>= 85.0%',
      acaoRecomendada: 'Habilitar envio forçado de External ID criptografado via CAPI Server-side.',
      status: 'PENDENTE',
      timestampAlerta: '2026-04-03T16:00:00Z',
    },
    {
      id: 'alt-002',
      codigoAlerta: 'ALT-LATENCIA-PINTEREST-02',
      canalNetwork: 'PINTEREST_ADS',
      severidade: AnomalySeverity.INFORMATIVA,
      tipoAnomalia: 'LATENCIA_CAPI_ELEVADA',
      descricao: 'Latência do endpoint Pinterest Conversion API subiu para 52ms durante horário de pico.',
      valorDetectado: '52ms',
      valorEsperado: '< 40ms',
      acaoRecomendada: 'Otimizar worker de fila Redis para disparo assíncrono em batch.',
      status: 'PENDENTE',
      timestampAlerta: '2026-04-03T17:30:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AdsTelemetryOverviewDto> {
    const totalEventos = this.inMemoryMetrics.reduce((acc, m) => acc + m.eventosProcessados24h, 0);
    const totalGasto = this.inMemoryMetrics.reduce((acc, m) => acc + m.gastoMonitorado24hBRL, 0);
    const receitaTotal = 1055700.0;
    const roasBlended = totalGasto > 0 ? Number((receitaTotal / totalGasto).toFixed(2)) : 0;
    const latenciaMedia = Math.round(
      this.inMemoryMetrics.reduce((acc, m) => acc + m.latenciaMediaMs, 0) /
        this.inMemoryMetrics.length,
    );
    const taxaCapi = Number(
      (
        this.inMemoryMetrics.reduce((acc, m) => acc + m.taxaEntregaServerSideCapi, 0) /
        this.inMemoryMetrics.length
      ).toFixed(2),
    );

    return {
      scoreSaudeGeral: 98.4,
      canaisMonitoradosAtivos: this.inMemoryMetrics.length,
      latenciaMediaGlobalMs: latenciaMedia,
      taxaEntregaGlobalCapi: taxaCapi,
      eventosProcessados24hTotal: totalEventos,
      gastoMonitoradoTotal24hBRL: totalGasto,
      receitaAtribuidaTotal24hBRL: receitaTotal,
      roasBlendedRealTime: roasBlended,
      alertasAtivosPendentes: this.inMemoryAnomalies.filter((a) => a.status === 'PENDENTE').length,
      distribuicaoTrafegoDispositivos: {
        iosSafariAtt: 44.5,
        androidChrome: 32.8,
        desktopWeb: 12.2,
        inAppInstagram: 6.5,
        inAppTikTok: 3.2,
        outros: 0.8,
      },
    };
  }

  async getNetworkMetrics(): Promise<AdsNetworkTelemetryMetricDto[]> {
    return this.inMemoryMetrics;
  }

  async getLiveEvents(): Promise<AdsTelemetryLiveEventDto[]> {
    return this.inMemoryLiveEvents;
  }

  async getAnomalies(): Promise<AdsTelemetryAnomalyAlertDto[]> {
    return this.inMemoryAnomalies;
  }

  async resolveAnomaly(alertId: string, resolvidoPor: string = 'Engenharia de Dados DiskIngressos') {
    const alert = this.inMemoryAnomalies.find((a) => a.id === alertId);
    if (!alert) {
      return { success: false, message: 'Alerta de telemetria não encontrado.' };
    }
    alert.status = 'RESOLVIDO';
    alert.resolvidoPor = resolvidoPor;
    alert.resolvidoEm = new Date().toISOString();
    return {
      success: true,
      alertId,
      status: alert.status,
      resolvidoPor: alert.resolvidoPor,
      mensagem: `Alerta de telemetria ${alert.codigoAlerta} marcado como resolvido.`,
    };
  }
}
