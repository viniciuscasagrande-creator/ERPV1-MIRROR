import { AdsTelemetryService } from '../apps/api/src/modules/marketing/ads-telemetry.service';
import { PrismaService } from '../apps/api/src/database/prisma.service';

async function main() {
  console.log('--- INICIANDO VERIFICAÇÃO DA TELEMETRIA DE ADS (DISKINGRESSOS INTERNO) ---');
  let passed = 0;
  const total = 6;

  const prismaMock = {} as unknown as PrismaService;
  const service = new AdsTelemetryService(prismaMock);

  // Teste 1: Visão Geral de Telemetria e Saúde Global
  try {
    const ov = await service.getOverview();
    if (
      ov &&
      ov.scoreSaudeGeral >= 95.0 &&
      ov.canaisMonitoradosAtivos >= 6 &&
      ov.latenciaMediaGlobalMs < 60 &&
      ov.taxaEntregaGlobalCapi >= 99.0
    ) {
      console.log(`✅ Teste 1: Visão geral da telemetria validada (Score: ${ov.scoreSaudeGeral}%, Latência: ${ov.latenciaMediaGlobalMs}ms).`);
      passed++;
    } else {
      console.error('❌ Teste 1 falhou: visão geral inválida.');
    }
  } catch (e) {
    console.error('❌ Teste 1 exceção:', e);
  }

  // Teste 2: Métricas de Rede (Meta, Google, TikTok, Spotify, Pinterest, X)
  try {
    const networks = await service.getNetworkMetrics();
    const hasMeta = networks.some((n) => n.canalNetwork === 'META_ADS');
    const hasGoogle = networks.some((n) => n.canalNetwork === 'GOOGLE_ADS_GA4');
    const hasTikTok = networks.some((n) => n.canalNetwork === 'TIKTOK_ADS');
    const hasSpotify = networks.some((n) => n.canalNetwork === 'SPOTIFY_ADS');
    if (hasMeta && hasGoogle && hasTikTok && hasSpotify && networks.length === 6) {
      console.log(`✅ Teste 2: Telemetria de ${networks.length} redes de anúncios carregadas com status operacional.`);
      passed++;
    } else {
      console.error('❌ Teste 2 falhou: redes ausentes na telemetria.');
    }
  } catch (e) {
    console.error('❌ Teste 2 exceção:', e);
  }

  // Teste 3: Entrega Server-Side CAPI e Deduplicação Score
  try {
    const networks = await service.getNetworkMetrics();
    const metaNet = networks.find((n) => n.canalNetwork === 'META_ADS')!;
    if (metaNet.taxaEntregaServerSideCapi >= 99.0 && metaNet.taxaDeduplicacaoScore >= 9.0) {
      console.log(`✅ Teste 3: Meta CAPI operando com taxa de entrega de ${metaNet.taxaEntregaServerSideCapi}% e score de deduplicação ${metaNet.taxaDeduplicacaoScore}/10.`);
      passed++;
    } else {
      console.error('❌ Teste 3 falhou: entrega ou deduplicação abaixo do esperado.');
    }
  } catch (e) {
    console.error('❌ Teste 3 exceção:', e);
  }

  // Teste 4: Stream em Tempo Real de Eventos de Telemetria
  try {
    const events = await service.getLiveEvents();
    if (events.length >= 3 && events.some((ev) => ev.tipoEvento === 'Purchase') && events[0].latenciaDisparoMs > 0) {
      console.log(`✅ Teste 4: Stream ao vivo capturou ${events.length} eventos de anúncios com latência registrada.`);
      passed++;
    } else {
      console.error('❌ Teste 4 falhou: stream de eventos vazio.');
    }
  } catch (e) {
    console.error('❌ Teste 4 exceção:', e);
  }

  // Teste 5: Alertas de Anomalias de Telemetria
  try {
    const alerts = await service.getAnomalies();
    if (alerts.length >= 1 && alerts.some((a) => a.severidade === 'ALERTA')) {
      console.log(`✅ Teste 5: Detector de anomalias identificou ${alerts.length} alertas pendentes de investigação.`);
      passed++;
    } else {
      console.error('❌ Teste 5 falhou: nenhum alerta detectado.');
    }
  } catch (e) {
    console.error('❌ Teste 5 exceção:', e);
  }

  // Teste 6: Resolução de Anomalia de Telemetria
  try {
    const alerts = await service.getAnomalies();
    const alertId = alerts[0].id;
    const res = await service.resolveAnomaly(alertId, 'Engenheiro de Dados Sênior DiskIngressos');
    if (res.success && res.status === 'RESOLVIDO' && res.resolvidoPor) {
      console.log(`✅ Teste 6: Anomalia ${alertId} resolvida com sucesso com trilha de auditoria.`);
      passed++;
    } else {
      console.error('❌ Teste 6 falhou: erro ao resolver anomalia.');
    }
  } catch (e) {
    console.error('❌ Teste 6 exceção:', e);
  }

  console.log(`\nRESULTADO TELEMETRIA DE ADS: ${passed}/${total} testes aprovados.`);
  if (passed !== total) {
    process.exit(1);
  }
}

main();
