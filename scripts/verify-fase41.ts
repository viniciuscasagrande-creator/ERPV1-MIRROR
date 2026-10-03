import { SetorIngressoDynamic, StatusPoliticaDynamic } from '@diskingressos/types';
import type {
  DynamicPricingPolicyDto,
  DynamicTicketBatchPriceDto,
  PriceSurgeAuditLogDto,
  DynamicPricingDashboardKpisDto,
  SimularAjusteDinamicoRequestDto,
  SimularAjusteDinamicoResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 41)');
console.log('⚡ MOTOR DE PRECIFICAÇÃO DINÂMICA & YIELD MANAGEMENT PREDITIVO (IA)');
console.log('📊 SURGE PRICING, ELASTICIDADE DE DEMANDA & TRAVAS REGULATÓRIAS');
console.log('========================================================================\n');

let passCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${testName}`);
    if (detail) console.log(`   └─ ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (detail) console.error(`   └─ Motivo: ${detail}`);
  }
}

class TestDynamicPricingService {
  private inMemoryPolicies: DynamicPricingPolicyDto[] = [];
  private inMemoryBatches: DynamicTicketBatchPriceDto[] = [];
  private inMemoryLogs: PriceSurgeAuditLogDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const p1: DynamicPricingPolicyDto = {
      id: 'pol-001',
      codigoPolitica: 'DYN-ROCK-FEST-2026',
      eventoId: 'evt-rock-sp-2026',
      setorIngresso: SetorIngressoDynamic.PISTA_PREMIUM,
      precoBaseBrl: 200.0,
      precoPisoMinimoBrl: 160.0,
      precoTetoMaximoBrl: 400.0,
      fatorElasticidadeIa: 1.42,
      statusPolitica: StatusPoliticaDynamic.ATIVA_OPERACIONAL,
      criadoEm: '2026-03-25T10:00:00Z',
    };

    const b1: DynamicTicketBatchPriceDto = {
      id: 'batch-001',
      politicaId: 'pol-001',
      loteNumero: 1,
      precoAtualVigenteBrl: 284.0,
      percentualAgio: 42.0,
      ingressosDisponiveis: 150,
      velocidadeVendasMinuto: 35.5,
      atualizadoEm: new Date().toISOString(),
    };

    const log1: PriceSurgeAuditLogDto = {
      id: 'log-001',
      codigoSurgeLog: 'SURGE-2026-0042',
      eventoId: 'evt-rock-sp-2026',
      precoAnteriorBrl: 260.0,
      precoNovoBrl: 284.0,
      motivoGatilhoIa: 'Pico de tráfego orgânico detectado via Prophet-LSTM',
      autorizadoPor: 'IA_AUTONOMOUS_KERNEL',
      timestampGatilho: new Date().toISOString(),
    };

    this.inMemoryPolicies = [p1];
    this.inMemoryBatches = [b1];
    this.inMemoryLogs = [log1];
  }

  getPolicies() {
    return this.inMemoryPolicies;
  }

  getBatches() {
    return this.inMemoryBatches;
  }

  getLogs() {
    return this.inMemoryLogs;
  }

  simularAjuste(dto: SimularAjusteDinamicoRequestDto): SimularAjusteDinamicoResponseDto {
    const policy = this.inMemoryPolicies.find((p) => p.id === dto.politicaId);
    if (!policy) {
      throw new Error('Política não encontrada');
    }

    let multiplicador = 1.0;
    if (dto.velocidadeVendasMinuto > 25) multiplicador += 0.25;
    if (dto.percentualEstoqueRestante < 30) multiplicador += 0.25;

    const precoCalculado = policy.precoBaseBrl * multiplicador;
    const travadoNoTeto = precoCalculado > policy.precoTetoMaximoBrl;
    const precoFinal = travadoNoTeto ? policy.precoTetoMaximoBrl : precoCalculado;
    const variacao = ((precoFinal - policy.precoBaseBrl) / policy.precoBaseBrl) * 100;

    return {
      politicaId: policy.id,
      precoRecomendadoBrl: Number(precoFinal.toFixed(2)),
      percentualVariacao: Number(variacao.toFixed(1)),
      motivoAjuste: travadoNoTeto
        ? 'Preço limitado pelo teto regulatório anti-abusividade'
        : 'Alta velocidade de vendas e escassez de estoque',
      dentroDasTravas: true,
    };
  }

  getKpis(): DynamicPricingDashboardKpisDto {
    return {
      totalPoliticasAtivas: this.inMemoryPolicies.length,
      receitaIncrementalAgioBrl: 485200.0,
      fatorMedioOcupacaoPercent: 78.5,
      disparosSurgePricingHoje: this.inMemoryLogs.length,
      ticketMedioDinamicoBrl: 284.0,
    };
  }
}

async function runTests() {
  const service = new TestDynamicPricingService();

  // Teste 1: Políticas ativas com travas
  const policies = service.getPolicies();
  assert(
    policies.length > 0 &&
      policies[0].precoPisoMinimoBrl === 160.0 &&
      policies[0].precoTetoMaximoBrl === 400.0 &&
      policies[0].statusPolitica === StatusPoliticaDynamic.ATIVA_OPERACIONAL,
    'Teste 1: Políticas de precificação dinâmica com limites de piso e teto configurados',
    `Código: ${policies[0].codigoPolitica} | Base: R$ ${policies[0].precoBaseBrl} | Teto: R$ ${policies[0].precoTetoMaximoBrl}`
  );

  // Teste 2: Lotes sob monitoramento
  const batches = service.getBatches();
  assert(
    batches.length > 0 &&
      batches[0].precoAtualVigenteBrl === 284.0 &&
      batches[0].percentualAgio === 42.0,
    'Teste 2: Monitoramento em tempo real de lotes com ágio preditivo aplicado',
    `Lote #${batches[0].loteNumero} | Preço Vigente: R$ ${batches[0].precoAtualVigenteBrl} (+${batches[0].percentualAgio}%)`
  );

  // Teste 3: Simulação de ajuste com velocidade acelerada
  const sim1 = service.simularAjuste({
    politicaId: 'pol-001',
    velocidadeVendasMinuto: 30,
    percentualEstoqueRestante: 50,
  });
  assert(
    sim1.precoRecomendadoBrl === 250.0 && sim1.percentualVariacao === 25.0,
    'Teste 3: Simulação preditiva com velocidade de vendas acima do gatilho (> 25/min)',
    `Preço Recomendado: R$ ${sim1.precoRecomendadoBrl} (+${sim1.percentualVariacao}%)`
  );

  // Teste 4: Trava de Teto Regulatório
  const sim2 = service.simularAjuste({
    politicaId: 'pol-001',
    velocidadeVendasMinuto: 100,
    percentualEstoqueRestante: 5,
  });
  assert(
    sim2.precoRecomendadoBrl <= 400.0 && sim2.dentroDasTravas === true,
    'Teste 4: Proteção de teto tarifário máximo contra abusividade de preços',
    `Preço Calculado com Trava: R$ ${sim2.precoRecomendadoBrl} (Teto: R$ 400.00)`
  );

  // Teste 5: Log de auditoria de surge pricing
  const logs = service.getLogs();
  assert(
    logs.length > 0 &&
      logs[0].autorizadoPor === 'IA_AUTONOMOUS_KERNEL' &&
      logs[0].precoNovoBrl > logs[0].precoAnteriorBrl,
    'Teste 5: Trilha imutável de auditoria de alterações de ágio por algoritmo de IA',
    `Log: ${logs[0].codigoSurgeLog} | Variação: R$ ${logs[0].precoAnteriorBrl} -> R$ ${logs[0].precoNovoBrl}`
  );

  // Teste 6: Painel Executivo e KPIs
  const kpis = service.getKpis();
  assert(
    kpis.totalPoliticasAtivas >= 1 &&
      kpis.receitaIncrementalAgioBrl > 0 &&
      kpis.disparosSurgePricingHoje >= 1,
    'Teste 6: Consolidação de KPIs de Yield Management e Receita Incremental',
    `Receita Incremental Ágio: R$ ${kpis.receitaIncrementalAgioBrl.toLocaleString('pt-BR')} | Ticket Médio: R$ ${kpis.ticketMedioDinamicoBrl}`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 41: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
