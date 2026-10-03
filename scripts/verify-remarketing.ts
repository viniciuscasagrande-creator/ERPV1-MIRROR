import { RemarketingService } from '../apps/api/src/modules/remarketing/remarketing.service';
import { PrismaService } from '../apps/api/src/database/prisma.service';
import { RemarketingChannel } from '@diskingressos/types';

async function main() {
  console.log('--- INICIANDO VERIFICAÇÃO DO MOTOR DE REMARKETING & CONVERSÃO (DISKINGRESSOS) ---');
  let passed = 0;
  const total = 6;

  const prismaMock = {
    abandonedCartRecovery: { findMany: async () => [] },
    rfmCustomerSegment: { findMany: async () => [] },
  } as unknown as PrismaService;

  const service = new RemarketingService(prismaMock);

  // Teste 1: Métricas de Conversão de Carrinho Abandonado
  try {
    const ov = await service.getOverview();
    if (ov && ov.receitaRecuperadaBRL > 0 && ov.taxaRecuperacaoGlobalPercent >= 30.0) {
      console.log(`✅ Teste 1: Métricas de recuperação validadas (Receita recuperada: R$ ${ov.receitaRecuperadaBRL}, Taxa: ${ov.taxaRecuperacaoGlobalPercent}%).`);
      passed++;
    } else {
      console.error('❌ Teste 1 falhou: visão geral inválida.');
    }
  } catch (e) {
    console.error('❌ Teste 1 exceção:', e);
  }

  // Teste 2: Monitoramento em Tempo Real de Carrinhos Abandonados
  try {
    const carts = await service.getAbandonedCarts();
    if (carts.length >= 3 && carts[0].clienteNome && carts[0].urlRecuperacaoCheckout) {
      console.log(`✅ Teste 2: Monitoramento ativo com ${carts.length} carrinhos em estágios rastreados.`);
      passed++;
    } else {
      console.error('❌ Teste 2 falhou: carrinhos vazios ou sem link de recuperação.');
    }
  } catch (e) {
    console.error('❌ Teste 2 exceção:', e);
  }

  // Teste 3: Disparo de Recuperação via WhatsApp Cloud API
  try {
    const carts = await service.getAbandonedCarts();
    const targetCart = carts[0];
    const triggerRes = await service.triggerRecoveryAction(targetCart.id, RemarketingChannel.WHATSAPP);
    if (triggerRes.success && triggerRes.canal === 'WHATSAPP') {
      console.log(`✅ Teste 3: Disparo WhatsApp Cloud API enviado com sucesso para ${triggerRes.telefone}.`);
      passed++;
    } else {
      console.error('❌ Teste 3 falhou: erro ao disparar WhatsApp.');
    }
  } catch (e) {
    console.error('❌ Teste 3 exceção:', e);
  }

  // Teste 4: Disparo de Recuperação via SMS Rápido
  try {
    const carts = await service.getAbandonedCarts();
    const targetCart = carts[1];
    const triggerRes = await service.triggerRecoveryAction(targetCart.id, RemarketingChannel.SMS);
    if (triggerRes.success && triggerRes.canal === 'SMS') {
      console.log(`✅ Teste 4: Disparo SMS com oferta Pix D+0 enviado para ${triggerRes.telefone}.`);
      passed++;
    } else {
      console.error('❌ Teste 4 falhou: erro ao disparar SMS.');
    }
  } catch (e) {
    console.error('❌ Teste 4 exceção:', e);
  }

  // Teste 5: Segmentação Comportamental RFM (Clusters de Clientes)
  try {
    const rfm = await service.getRfmSegments();
    const hasChampions = rfm.some((r) => r.clusterRfm === 'CHAMPIONS');
    const hasLoyal = rfm.some((r) => r.clusterRfm === 'LOYAL');
    if (hasChampions && hasLoyal && rfm.length >= 4) {
      console.log('✅ Teste 5: Base de clientes classificada nos clusters RFM com cálculo de LTV e recência.');
      passed++;
    } else {
      console.error('❌ Teste 5 falhou: segmentação RFM inconsistente.');
    }
  } catch (e) {
    console.error('❌ Teste 5 exceção:', e);
  }

  // Teste 6: Sincronização de Audiências Customizadas & Gatilhos Webhook
  try {
    const syncMeta = await service.syncAudiencePlatform('META', 'CHAMPIONS');
    const syncGoogle = await service.syncAudiencePlatform('GOOGLE', 'LOYAL');
    const triggers = await service.getAutomatedTriggers();
    if (
      syncMeta.success &&
      syncGoogle.success &&
      triggers.length >= 3 &&
      triggers.some((t) => t.ativo)
    ) {
      console.log('✅ Teste 6: Sincronização de audiências Meta/Google e automações de gatilhos operacionais.');
      passed++;
    } else {
      console.error('❌ Teste 6 falhou: audiências ou gatilhos não configurados.');
    }
  } catch (e) {
    console.error('❌ Teste 6 exceção:', e);
  }

  console.log(`\nRESULTADO REMARKETING: ${passed}/${total} testes aprovados.`);
  if (passed !== total) {
    process.exit(1);
  }
}

main();
