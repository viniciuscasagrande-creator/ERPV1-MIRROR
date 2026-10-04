import { CentralUtmService } from '../apps/api/src/modules/marketing/central-utm.service';
import { PrismaService } from '../apps/api/src/database/prisma.service';
import { UtmChannelType } from '@diskingressos/types';

async function main() {
  console.log('--- INICIANDO VERIFICAÇÃO DA CENTRAL UTM MULTI-CANAL (DISKINGRESSOS) ---');
  let passed = 0;
  const total = 6;

  const prismaMock = {
    utmTrackingCampaignLink: { findMany: async () => [] },
  } as unknown as PrismaService;

  const service = new CentralUtmService(prismaMock);

  // Teste 1: Presets de Canais (Meta, TikTok, Spotify, Google GA4, Pinterest, etc.)
  try {
    const presets = service.getChannelPresets();
    const hasMeta = presets.some((p) => p.channel === UtmChannelType.META_ADS);
    const hasSpotify = presets.some((p) => p.channel === UtmChannelType.SPOTIFY_ADS);
    const hasTikTok = presets.some((p) => p.channel === UtmChannelType.TIKTOK_ADS);
    const hasGoogle = presets.some((p) => p.channel === UtmChannelType.GOOGLE_ADS_GA4);
    if (hasMeta && hasSpotify && hasTikTok && hasGoogle && presets.length >= 8) {
      console.log(`✅ Teste 1: Presets oficiais carregados para ${presets.length} canais de anúncio.`);
      passed++;
    } else {
      console.error('❌ Teste 1 falhou: presets incompletos.');
    }
  } catch (e) {
    console.error('❌ Teste 1 exceção:', e);
  }

  // Teste 2: Geração de Link UTM para Meta Ads
  try {
    const linkMeta = await service.createLink({
      nomeCampanha: 'Meta Ads - VillaMix Lote 2 Stories',
      canalOrigem: UtmChannelType.META_ADS,
      nomeEvento: 'VillaMix Festival Curitiba',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/villamix',
      utmCampaign: 'villamix_lote2_stories',
      utmContent: 'criativo_video_carrossel',
    });
    if (
      linkMeta &&
      linkMeta.urlParametrizadaCompleta.includes('utm_source=facebook_instagram') &&
      linkMeta.urlParametrizadaCompleta.includes('utm_medium=paid_social') &&
      linkMeta.urlEncurtada.startsWith('https://dsk.ing/')
    ) {
      console.log(`✅ Teste 2: Link UTM Meta Ads gerado com sucesso (${linkMeta.urlEncurtada}).`);
      passed++;
    } else {
      console.error('❌ Teste 2 falhou: link Meta Ads inválido.');
    }
  } catch (e) {
    console.error('❌ Teste 2 exceção:', e);
  }

  // Teste 3: Geração de Link UTM para Spotify Ads Studio
  try {
    const linkSpotify = await service.createLink({
      nomeCampanha: 'Spotify Ads Studio - Playlist Rock Stadium Curitiba',
      canalOrigem: UtmChannelType.SPOTIFY_ADS,
      nomeEvento: 'Rock Curitiba Stadium',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/rock-stadium',
      utmCampaign: 'rock_audio_spot_playlist',
      utmContent: 'spot_30s_locucao_metal',
    });
    if (
      linkSpotify &&
      linkSpotify.urlParametrizadaCompleta.includes('utm_source=spotify') &&
      linkSpotify.urlParametrizadaCompleta.includes('utm_medium=audio_podcast_ads')
    ) {
      console.log(`✅ Teste 3: Link UTM Spotify Ads gerado com sucesso com tags de áudio.`);
      passed++;
    } else {
      console.error('❌ Teste 3 falhou: link Spotify Ads inválido.');
    }
  } catch (e) {
    console.error('❌ Teste 3 exceção:', e);
  }

  // Teste 4: Geração de Link UTM para TikTok Ads Manager
  try {
    const linkTikTok = await service.createLink({
      nomeCampanha: 'TikTok Spark Ads - Comédia Arena Stand-up',
      canalOrigem: UtmChannelType.TIKTOK_ADS,
      nomeEvento: 'Noite de Comédia Arena',
      urlDestinoOriginal: 'https://diskingressos.com.br/evento/comedia-arena',
      utmCampaign: 'comedia_virais_arena',
      utmContent: 'corte_standup_15s',
    });
    if (
      linkTikTok &&
      linkTikTok.urlParametrizadaCompleta.includes('utm_source=tiktok') &&
      linkTikTok.urlParametrizadaCompleta.includes('utm_medium=spark_video')
    ) {
      console.log(`✅ Teste 4: Link UTM TikTok Ads gerado com sucesso.`);
      passed++;
    } else {
      console.error('❌ Teste 4 falhou: link TikTok Ads inválido.');
    }
  } catch (e) {
    console.error('❌ Teste 4 exceção:', e);
  }

  // Teste 5: Validador / Inspetor de URL Válida (Score 100)
  try {
    const testUrl =
      'https://diskingressos.com.br/evento/show?utm_source=google&utm_medium=cpc&utm_campaign=pesquisa_exata';
    const val = service.validateUtm(testUrl);
    if (val.valido && val.scoreQualidade >= 90 && val.compatibilidadeGa4 && val.compatibilidadeMetaCapi) {
      console.log(`✅ Teste 5: Validador aprovou URL correta com Score ${val.scoreQualidade}/100.`);
      passed++;
    } else {
      console.error('❌ Teste 5 falhou: auditoria de URL válida não passou.');
    }
  } catch (e) {
    console.error('❌ Teste 5 exceção:', e);
  }

  // Teste 6: Validador de URL Inválida (Sem utm_medium e com letras maiúsculas)
  try {
    const invalidUrl = 'https://diskingressos.com.br/evento/show?utm_source=FACEBOOK';
    const valInvalid = service.validateUtm(invalidUrl);
    if (!valInvalid.valido && valInvalid.avisos.length >= 2 && valInvalid.scoreQualidade < 70) {
      console.log(`✅ Teste 6: Validador detectou parâmetros ausentes e emitiu alertas (Score: ${valInvalid.scoreQualidade}/100).`);
      passed++;
    } else {
      console.error('❌ Teste 6 falhou: falha ao detectar erros na URL.');
    }
  } catch (e) {
    console.error('❌ Teste 6 exceção:', e);
  }

  console.log(`\nRESULTADO CENTRAL UTM: ${passed}/${total} testes aprovados.`);
  if (passed !== total) {
    process.exit(1);
  }
}

main();
