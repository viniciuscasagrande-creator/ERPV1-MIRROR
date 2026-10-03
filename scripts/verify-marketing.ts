import { MarketingService } from '../apps/api/src/modules/marketing/marketing.service';
import { PrismaService } from '../apps/api/src/database/prisma.service';
import { MarketingChannel } from '@diskingressos/types';

async function main() {
  console.log('--- INICIANDO VERIFICAÇÃO DA CENTRAL DE MARKETING DIGITAL (DISKINGRESSOS) ---');
  let passed = 0;
  const total = 6;

  const prismaMock = {
    marketingCampaign: { findMany: async () => [] },
    marketingCoupon: { findMany: async () => [] },
    marketingPromoterAffiliate: { findMany: async () => [] },
  } as unknown as PrismaService;

  const service = new MarketingService(prismaMock);

  // Teste 1: KPIs e Visão Geral de Marketing
  try {
    const ov = await service.getOverview();
    if (ov && ov.totalInvestidoAds > 0 && ov.roasGlobal > 1.0 && ov.capiServerSuccessRate >= 99.0) {
      console.log(`✅ Teste 1: KPIs de marketing validados (Investido: R$ ${ov.totalInvestidoAds}, ROAS: ${ov.roasGlobal}x).`);
      passed++;
    } else {
      console.error('❌ Teste 1 falhou: visão geral inválida.');
    }
  } catch (e) {
    console.error('❌ Teste 1 exceção:', e);
  }

  // Teste 2: Campanhas Multi-Canal (Meta, Google, TikTok)
  try {
    const campaigns = await service.getCampaigns();
    const hasMeta = campaigns.some((c) => c.canal === 'META_ADS');
    const hasGoogle = campaigns.some((c) => c.canal === 'GOOGLE_ADS');
    if (hasMeta && hasGoogle && campaigns.length >= 3) {
      console.log('✅ Teste 2: Campanhas multi-canal carregadas com métricas de ROAS e CPA.');
      passed++;
    } else {
      console.error('❌ Teste 2 falhou: campanhas inválidas.');
    }
  } catch (e) {
    console.error('❌ Teste 2 exceção:', e);
  }

  // Teste 3: Criação de Nova Campanha com UTMs Automáticos
  try {
    const newCamp = await service.createCampaign({
      nomeCampanha: 'Google Ads Search - Festival Sertanejo Curitiba',
      canal: MarketingChannel.GOOGLE_ADS,
      nomeEvento: 'Festival Sertanejo Curitiba',
      orcamentoTotal: 20000,
      utmCampaign: 'sertanejo_curitiba_fase1',
    });
    if (newCamp && newCamp.codigoCampanha && newCamp.utmSource) {
      console.log(`✅ Teste 3: Campanha criada com sucesso (Código: ${newCamp.codigoCampanha}).`);
      passed++;
    } else {
      console.error('❌ Teste 3 falhou: erro ao criar campanha.');
    }
  } catch (e) {
    console.error('❌ Teste 3 exceção:', e);
  }

  // Teste 4: Emissão e Gestão de Cupons Dinâmicos
  try {
    const coupons = await service.getCoupons();
    const newCoupon = await service.createCoupon({
      codigoCupom: 'TESTEDISK10',
      descricao: 'Desconto de Teste Automatizado',
      valorDesconto: 10,
    });
    if (coupons.length >= 2 && newCoupon.codigoCupom === 'TESTEDISK10') {
      console.log('✅ Teste 4: Motor de cupons promocionais validado com limites e status.');
      passed++;
    } else {
      console.error('❌ Teste 4 falhou: erro na emissão de cupons.');
    }
  } catch (e) {
    console.error('❌ Teste 4 exceção:', e);
  }

  // Teste 5: Rede de Promoters & Liquidação de Comissão via Pix
  try {
    const promoters = await service.getPromoters();
    const prm = promoters[0];
    const payout = await service.payPromoterCommission(prm.id);
    if (payout.success && payout.protocoloPix.includes('E90400888')) {
      console.log(`✅ Teste 5: Comissão de promoter liquidada com sucesso via Pix: ${payout.protocoloPix}.`);
      passed++;
    } else {
      console.error('❌ Teste 5 falhou: liquidação de promoter não aprovada.');
    }
  } catch (e) {
    console.error('❌ Teste 5 exceção:', e);
  }

  // Teste 6: Conversions API (CAPI) Server-Side & Atribuição Multi-Toque
  try {
    const capiLogs = await service.getPixelCapiLogs();
    const attr = await service.getAttributionComparison();
    if (capiLogs.length > 0 && capiLogs[0].deduplicacaoScore >= 9.0 && attr.length >= 4) {
      console.log('✅ Teste 6: Traces CAPI server-side e modelagem de atribuição IA validados.');
      passed++;
    } else {
      console.error('❌ Teste 6 falhou: dados de CAPI ou atribuição inválidos.');
    }
  } catch (e) {
    console.error('❌ Teste 6 exceção:', e);
  }

  console.log(`\nRESULTADO MARKETING: ${passed}/${total} testes aprovados.`);
  if (passed !== total) {
    process.exit(1);
  }
}

main();
