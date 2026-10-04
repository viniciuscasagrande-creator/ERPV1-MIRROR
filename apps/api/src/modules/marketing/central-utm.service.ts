import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  UtmChannelType,
  UtmTrackingCampaignLinkDto,
  CreateUtmLinkRequestDto,
  ValidateUtmResultDto,
} from '@diskingressos/types';

@Injectable()
export class CentralUtmService {
  private readonly logger = new Logger(CentralUtmService.name);

  private inMemoryLinks: UtmTrackingCampaignLinkDto[] = [
    {
      id: 'utm-001',
      codigoIdentificador: 'UTM-2026-META-VMX01',
      nomeCampanha: 'Meta Ads - VillaMix Lote 1 Instagram Stories Feed',
      canalOrigem: UtmChannelType.META_ADS,
      eventId: 'evt-001',
      nomeEvento: 'VillaMix Festival Curitiba',
      loteSetor: 'Camarote Prime - Lote 1',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/villamix-curitiba-2026',
      urlParametrizadaCompleta:
        'https://diskingressos.com.br/evento/villamix-curitiba-2026?utm_source=facebook_instagram&utm_medium=paid_social&utm_campaign=villamix_lote1_stories&utm_content=video_animado_30s',
      urlEncurtada: 'https://dsk.ing/vmx-meta-01',
      utmSource: 'facebook_instagram',
      utmMedium: 'paid_social',
      utmCampaign: 'villamix_lote1_stories',
      utmContent: 'video_animado_30s',
      qrCodeDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23fff"/><text x="10" y="50" font-size="12">QR-VMX01</text></svg>',
      totalCliques: 24800,
      totalConversoes: 1840,
      receitaGeradaBRL: 230000.0,
      taxaConversaoPercent: 7.42,
      statusLink: 'ATIVO',
      criadoPor: 'Performance Ads DiskIngressos',
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'utm-002',
      codigoIdentificador: 'UTM-2026-TIKTOK-SPARK',
      nomeCampanha: 'TikTok Ads Spark - Comédia Arena Vídeos Virais',
      canalOrigem: UtmChannelType.TIKTOK_ADS,
      eventId: 'evt-003',
      nomeEvento: 'Noite de Comédia Arena',
      loteSetor: 'Plateia Central - Lote 1',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/comedia-arena-curitiba',
      urlParametrizadaCompleta:
        'https://diskingressos.com.br/evento/comedia-arena-curitiba?utm_source=tiktok&utm_medium=spark_video&utm_campaign=comedia_standup_humor&utm_content=corte_piada_viral',
      urlEncurtada: 'https://dsk.ing/tt-comedia',
      utmSource: 'tiktok',
      utmMedium: 'spark_video',
      utmCampaign: 'comedia_standup_humor',
      utmContent: 'corte_piada_viral',
      qrCodeDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23fff"/><text x="10" y="50" font-size="12">QR-TIKTOK</text></svg>',
      totalCliques: 38900,
      totalConversoes: 1120,
      receitaGeradaBRL: 89600.0,
      taxaConversaoPercent: 2.88,
      statusLink: 'ATIVO',
      criadoPor: 'Social Ads Team',
      createdAt: '2026-03-12T14:00:00Z',
    },
    {
      id: 'utm-003',
      codigoIdentificador: 'UTM-2026-SPOTIFY-AUDIO',
      nomeCampanha: 'Spotify Ads Studio - Rock Curitiba Stadium Playlist Patrocinada',
      canalOrigem: UtmChannelType.SPOTIFY_ADS,
      eventId: 'evt-002',
      nomeEvento: 'Rock Curitiba Stadium',
      loteSetor: 'Pista Premium - Lote 1',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/rock-curitiba-stadium-2026',
      urlParametrizadaCompleta:
        'https://diskingressos.com.br/evento/rock-curitiba-stadium-2026?utm_source=spotify&utm_medium=audio_podcast_ads&utm_campaign=rock_stadium_audio_spot&utm_content=spot_30s_locucao_metal',
      urlEncurtada: 'https://dsk.ing/spt-rock',
      utmSource: 'spotify',
      utmMedium: 'audio_podcast_ads',
      utmCampaign: 'rock_stadium_audio_spot',
      utmContent: 'spot_30s_locucao_metal',
      qrCodeDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23fff"/><text x="10" y="50" font-size="12">QR-SPOTIFY</text></svg>',
      totalCliques: 15400,
      totalConversoes: 980,
      receitaGeradaBRL: 156800.0,
      taxaConversaoPercent: 6.36,
      statusLink: 'ATIVO',
      criadoPor: 'Audio Ads DiskIngressos',
      createdAt: '2026-03-15T09:00:00Z',
    },
    {
      id: 'utm-004',
      codigoIdentificador: 'UTM-2026-GOOGLE-GA4',
      nomeCampanha: 'Google Ads Search - Ingressos Oficiais Curitiba Busca Exata',
      canalOrigem: UtmChannelType.GOOGLE_ADS_GA4,
      eventId: 'evt-001',
      nomeEvento: 'VillaMix Festival Curitiba',
      loteSetor: 'Todos os Setores',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/villamix-curitiba-2026',
      urlParametrizadaCompleta:
        'https://diskingressos.com.br/evento/villamix-curitiba-2026?utm_source=google&utm_medium=cpc&utm_campaign=villamix_busca_exata&utm_term=ingressos+villamix+curitiba&gclid=EAIaIQobChMI...',
      urlEncurtada: 'https://dsk.ing/goog-vmx',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'villamix_busca_exata',
      utmTerm: 'ingressos+villamix+curitiba',
      qrCodeDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23fff"/><text x="10" y="50" font-size="12">QR-GOOG</text></svg>',
      totalCliques: 54100,
      totalConversoes: 4950,
      receitaGeradaBRL: 618750.0,
      taxaConversaoPercent: 9.15,
      statusLink: 'ATIVO',
      criadoPor: 'Google Search Master',
      createdAt: '2026-03-05T11:00:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  getChannelPresets() {
    return [
      {
        channel: UtmChannelType.META_ADS,
        name: 'Meta Ads (Facebook & Instagram)',
        defaultSource: 'facebook_instagram',
        defaultMedium: 'paid_social',
        recommendedMacros: '{{campaign.name}}, {{adset.name}}, {{ad.name}}',
        iconKey: 'facebook',
      },
      {
        channel: UtmChannelType.GOOGLE_ADS_GA4,
        name: 'Google Ads & Google Analytics 4 (GA4)',
        defaultSource: 'google',
        defaultMedium: 'cpc',
        recommendedMacros: '{campaignid}, {adgroupid}, {keyword}',
        iconKey: 'google',
      },
      {
        channel: UtmChannelType.TIKTOK_ADS,
        name: 'TikTok Ads Manager',
        defaultSource: 'tiktok',
        defaultMedium: 'spark_video',
        recommendedMacros: '__CAMPAIGN_NAME__, __AID_NAME__',
        iconKey: 'video',
      },
      {
        channel: UtmChannelType.SPOTIFY_ADS,
        name: 'Spotify Ads (Audio & Studio)',
        defaultSource: 'spotify',
        defaultMedium: 'audio_podcast_ads',
        recommendedMacros: 'playlist_rock, genre_targeting',
        iconKey: 'music',
      },
      {
        channel: UtmChannelType.PINTEREST_ADS,
        name: 'Pinterest Promoted Pins',
        defaultSource: 'pinterest',
        defaultMedium: 'promoted_pin',
        recommendedMacros: '{campaign_name}',
        iconKey: 'pin',
      },
      {
        channel: UtmChannelType.X_TWITTER_ADS,
        name: 'X Ads (Twitter)',
        defaultSource: 'twitter_x',
        defaultMedium: 'promoted_post',
        recommendedMacros: '{campaign_name}',
        iconKey: 'twitter',
      },
      {
        channel: UtmChannelType.LINKEDIN_ADS,
        name: 'LinkedIn Sponsored Content',
        defaultSource: 'linkedin',
        defaultMedium: 'sponsored_update',
        recommendedMacros: '{campaignname}',
        iconKey: 'linkedin',
      },
      {
        channel: UtmChannelType.INFLUENCER_PROMOTER,
        name: 'Promoters & Influenciadores VIP',
        defaultSource: 'promoter_network',
        defaultMedium: 'affiliate_link',
        recommendedMacros: 'promoter_id',
        iconKey: 'share-2',
      },
      {
        channel: UtmChannelType.QRCODE_OFFLINE,
        name: 'QR Code Offline (Outdoors / Totens / TV)',
        defaultSource: 'outdoor_totem',
        defaultMedium: 'qr_code_scan',
        recommendedMacros: 'local_painel',
        iconKey: 'qr-code',
      },
      {
        channel: UtmChannelType.CRM_EMAIL_PUSH,
        name: 'DiskIngressos CRM (E-mail & Push)',
        defaultSource: 'diskingressos_crm',
        defaultMedium: 'email_newsletter',
        recommendedMacros: 'segmento_ouro',
        iconKey: 'mail',
      },
      {
        channel: UtmChannelType.PROGRAMMATIC_DSP,
        name: 'Mídia Programática (DV360 / Taboola)',
        defaultSource: 'programmatic_dsp',
        defaultMedium: 'native_display',
        recommendedMacros: '{site_id}',
        iconKey: 'layers',
      },
    ];
  }

  async getLinks(): Promise<UtmTrackingCampaignLinkDto[]> {
    try {
      const dbLinks = await this.prisma.utmTrackingCampaignLink.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbLinks.length > 0) {
        return dbLinks.map((l) => ({
          id: l.id,
          codigoIdentificador: l.codigoIdentificador,
          nomeCampanha: l.nomeCampanha,
          canalOrigem: l.canalOrigem as UtmChannelType,
          eventId: l.eventId || undefined,
          nomeEvento: l.nomeEvento,
          loteSetor: l.loteSetor || undefined,
          urlDestinoOriginal: l.urlDestinoOriginal,
          urlParametrizadaCompleta: l.urlParametrizadaCompleta,
          urlEncurtada: l.urlEncurtada,
          utmSource: l.utmSource,
          utmMedium: l.utmMedium,
          utmCampaign: l.utmCampaign,
          utmTerm: l.utmTerm || undefined,
          utmContent: l.utmContent || undefined,
          parametrosExtrasJson: l.parametrosExtrasJson || undefined,
          qrCodeDataUri: l.qrCodeDataUri || undefined,
          totalCliques: l.totalCliques,
          totalConversoes: l.totalConversoes,
          receitaGeradaBRL: Number(l.receitaGeradaBRL),
          taxaConversaoPercent: Number(l.taxaConversaoPercent),
          statusLink: l.statusLink as any,
          criadoPor: l.criadoPor,
          createdAt: l.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory UTM links: ${e.message}`);
    }
    return this.inMemoryLinks;
  }

  async createLink(dto: CreateUtmLinkRequestDto): Promise<UtmTrackingCampaignLinkDto> {
    const slugRandom = Math.random().toString(36).substring(2, 7);
    const urlEncurtada = `https://dsk.ing/${slugRandom}`;

    const urlObj = new URL(
      dto.urlDestinoOriginal.startsWith('http')
        ? dto.urlDestinoOriginal
        : `https://${dto.urlDestinoOriginal}`,
    );

    const source = dto.utmSource || this.getDefaultSource(dto.canalOrigem);
    const medium = dto.utmMedium || this.getDefaultMedium(dto.canalOrigem);
    const campaign =
      dto.utmCampaign || dto.nomeCampanha.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', medium);
    urlObj.searchParams.set('utm_campaign', campaign);
    if (dto.utmTerm) urlObj.searchParams.set('utm_term', dto.utmTerm);
    if (dto.utmContent) urlObj.searchParams.set('utm_content', dto.utmContent);
    if (dto.promoterId) urlObj.searchParams.set('promoter_id', dto.promoterId);

    const urlParametrizada = urlObj.toString();
    const qrCodeMock = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23ffffff"/><text x="15" y="65" font-size="14" fill="%23e11d48">DSK-QR</text></svg>`;

    const newLink: UtmTrackingCampaignLinkDto = {
      id: `utm-${Date.now()}`,
      codigoIdentificador: `UTM-${Date.now().toString().slice(-6)}`,
      nomeCampanha: dto.nomeCampanha,
      canalOrigem: dto.canalOrigem,
      eventId: dto.eventId,
      nomeEvento: dto.nomeEvento,
      loteSetor: dto.loteSetor,
      urlDestinoOriginal: dto.urlDestinoOriginal,
      urlParametrizadaCompleta: urlParametrizada,
      urlEncurtada,
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmTerm: dto.utmTerm,
      utmContent: dto.utmContent,
      qrCodeDataUri: qrCodeMock,
      totalCliques: 0,
      totalConversoes: 0,
      receitaGeradaBRL: 0.0,
      taxaConversaoPercent: 0.0,
      statusLink: 'ATIVO',
      criadoPor: 'Performance Ads DiskIngressos',
      createdAt: new Date().toISOString(),
    };

    this.inMemoryLinks.unshift(newLink);
    return newLink;
  }

  validateUtm(urlToValidate: string): ValidateUtmResultDto {
    try {
      const parsed = new URL(
        urlToValidate.startsWith('http') ? urlToValidate : `https://${urlToValidate}`,
      );
      const params: Record<string, string> = {};
      parsed.searchParams.forEach((val, key) => {
        params[key] = val;
      });

      const avisos: string[] = [];
      const sugestoes: string[] = [];
      let score = 100;

      if (!params['utm_source']) {
        avisos.push('Parâmetro obrigatório utm_source ausente.');
        score -= 30;
      }
      if (!params['utm_medium']) {
        avisos.push('Parâmetro obrigatório utm_medium ausente.');
        score -= 25;
      }
      if (!params['utm_campaign']) {
        avisos.push('Parâmetro obrigatório utm_campaign ausente.');
        score -= 25;
      }

      if (params['utm_source'] && /[A-Z]/.test(params['utm_source'])) {
        sugestoes.push('Recomendado utilizar apenas letras minúsculas em utm_source para evitar fragmentação no GA4.');
        score -= 5;
      }
      if (params['utm_campaign'] && /\s/.test(params['utm_campaign'])) {
        sugestoes.push('Evite espaços em branco em utm_campaign. Prefira sublinhados (_) ou hífens (-).');
        score -= 5;
      }

      return {
        valido: Boolean(params['utm_source'] && params['utm_medium'] && params['utm_campaign']),
        scoreQualidade: Math.max(0, score),
        urlAnalisada: urlToValidate,
        parametrosDetectados: params,
        avisos,
        compatibilidadeGa4: Boolean(params['utm_source'] && params['utm_medium']),
        compatibilidadeMetaCapi: true,
        compatibilidadeTikTokEvents: true,
        compatibilidadeSpotifyAds: true,
        sugestoesMelhoria: sugestoes,
      };
    } catch (e) {
      return {
        valido: false,
        scoreQualidade: 0,
        urlAnalisada: urlToValidate,
        parametrosDetectados: {},
        avisos: ['URL inválida ou mal formatada.'],
        compatibilidadeGa4: false,
        compatibilidadeMetaCapi: false,
        compatibilidadeTikTokEvents: false,
        compatibilidadeSpotifyAds: false,
        sugestoesMelhoria: ['Insira uma URL válida iniciando com https://'],
      };
    }
  }

  private getDefaultSource(channel: UtmChannelType): string {
    switch (channel) {
      case UtmChannelType.META_ADS:
        return 'facebook_instagram';
      case UtmChannelType.GOOGLE_ADS_GA4:
        return 'google';
      case UtmChannelType.TIKTOK_ADS:
        return 'tiktok';
      case UtmChannelType.SPOTIFY_ADS:
        return 'spotify';
      case UtmChannelType.PINTEREST_ADS:
        return 'pinterest';
      case UtmChannelType.X_TWITTER_ADS:
        return 'twitter_x';
      case UtmChannelType.LINKEDIN_ADS:
        return 'linkedin';
      case UtmChannelType.INFLUENCER_PROMOTER:
        return 'promoter_network';
      case UtmChannelType.QRCODE_OFFLINE:
        return 'outdoor_totem';
      case UtmChannelType.CRM_EMAIL_PUSH:
        return 'diskingressos_crm';
      default:
        return 'ad_channel';
    }
  }

  private getDefaultMedium(channel: UtmChannelType): string {
    switch (channel) {
      case UtmChannelType.META_ADS:
        return 'paid_social';
      case UtmChannelType.GOOGLE_ADS_GA4:
        return 'cpc';
      case UtmChannelType.TIKTOK_ADS:
        return 'spark_video';
      case UtmChannelType.SPOTIFY_ADS:
        return 'audio_podcast_ads';
      case UtmChannelType.PINTEREST_ADS:
        return 'promoted_pin';
      case UtmChannelType.X_TWITTER_ADS:
        return 'promoted_post';
      case UtmChannelType.LINKEDIN_ADS:
        return 'sponsored_update';
      case UtmChannelType.INFLUENCER_PROMOTER:
        return 'affiliate_link';
      case UtmChannelType.QRCODE_OFFLINE:
        return 'qr_code_scan';
      case UtmChannelType.CRM_EMAIL_PUSH:
        return 'email_newsletter';
      default:
        return 'paid_traffic';
    }
  }
}
