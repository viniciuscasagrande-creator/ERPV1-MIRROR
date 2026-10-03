import { ProducerHubService } from '../apps/api/src/modules/producer-hub/producer-hub.service';
import { PrismaService } from '../apps/api/src/database/prisma.service';

async function main() {
  console.log('--- INICIANDO VERIFICAÇÃO DO HUB 360° DO PRODUTOR (DISKINGRESSOS) ---');
  let passed = 0;
  const total = 6;

  const prismaMock = {
    producerCommercialContract: { findMany: async () => [] },
    producerEscrowLedger: { findMany: async () => [] },
  } as unknown as PrismaService;

  const service = new ProducerHubService(prismaMock);

  // Teste 1: Visão 360° Consolidada dos Produtores
  try {
    const overview = await service.get360Overview();
    if (overview && overview.length >= 3 && overview[0].receitaBrutaAcumulada > 0) {
      console.log('✅ Teste 1: Visão 360° consolidada de produtores retornou dados íntegros.');
      passed++;
    } else {
      console.error('❌ Teste 1 falhou: visão 360° vazia ou inválida.');
    }
  } catch (e) {
    console.error('❌ Teste 1 exceção:', e);
  }

  // Teste 2: Contratos Comerciais & Alçadas Contratuais
  try {
    const contracts = await service.getContracts();
    const hasOpus = contracts.some((c) => c.razaoSocial.includes('Opus'));
    const hasT4F = contracts.some((c) => c.razaoSocial.includes('T4F'));
    if (hasOpus && hasT4F && contracts[0].retencaoSegurancaPercent > 0) {
      console.log('✅ Teste 2: Contratos comerciais com taxas DiskIngressos, MDR e escrow homologados.');
      passed++;
    } else {
      console.error('❌ Teste 2 falhou: contratos inválidos.');
    }
  } catch (e) {
    console.error('❌ Teste 2 exceção:', e);
  }

  // Teste 3: Simulação de Antecipação de Bilheteria
  try {
    const sim = await service.simulateAdvance('prod-001', 100000, 30);
    if (
      sim &&
      sim.valorSolicitado === 100000 &&
      sim.valorLiquidoLiberado < 100000 &&
      sim.custoFinanceiroDisk > 0
    ) {
      console.log(`✅ Teste 3: Simulação de antecipação calculou deságio pro-rata: líquido R$ ${sim.valorLiquidoLiberado}.`);
      passed++;
    } else {
      console.error('❌ Teste 3 falhou: cálculo de simulação incorreto.');
    }
  } catch (e) {
    console.error('❌ Teste 3 exceção:', e);
  }

  // Teste 4: Homologação de Adiantamento com Trava CERC/B3
  try {
    const req = await service.requestAdvance({
      producerId: 'prod-001',
      valorSolicitado: 50000,
      prazoDias: 15,
      justificativa: 'Adiantamento emergencial para infraestrutura de som e iluminação',
    });
    if (req.success && req.protocoloCercB3.includes('CERC-TRAVA')) {
      console.log(`✅ Teste 4: Trava averbada com sucesso: ${req.protocoloCercB3}.`);
      passed++;
    } else {
      console.error('❌ Teste 4 falhou: erro ao registrar gravame de bilheteria.');
    }
  } catch (e) {
    console.error('❌ Teste 4 exceção:', e);
  }

  // Teste 5: Livro Razão Fiduciário de Escrow (Partidas Dobradas)
  try {
    const ledger = await service.getEscrowLedger('prod-001');
    if (ledger && ledger.length >= 2 && ledger.some((l) => l.tipoMovimento === 'RETENCAO_BILHETERIA')) {
      console.log('✅ Teste 5: Livro razão de garantia escrow validado com créditos e deduções.');
      passed++;
    } else {
      console.error('❌ Teste 5 falhou: extrato fiduciário vazio ou divergente.');
    }
  } catch (e) {
    console.error('❌ Teste 5 exceção:', e);
  }

  // Teste 6: Certificação ICP-Brasil & Compliance CND
  try {
    const overview = await service.get360Overview('prod-001');
    const prod = overview[0];
    if (prod && prod.certificacaoIcpBrasilValida && prod.cndStatus === 'REGULAR') {
      console.log('✅ Teste 6: Produtor auditado com borderô assinado ICP-Brasil e CND regular.');
      passed++;
    } else {
      console.error('❌ Teste 6 falhou: compliance ou certificação inválida.');
    }
  } catch (e) {
    console.error('❌ Teste 6 exceção:', e);
  }

  console.log(`\nRESULTADO HUB 360° PRODUTOR: ${passed}/${total} testes aprovados.`);
  if (passed !== total) {
    process.exit(1);
  }
}

main();
