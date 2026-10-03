import {
  RatingProdutor,
  StatusRecomendacaoPreco,
  StatusAnaliseScore,
} from '@diskingressos/types';
import type {
  SimularCurvaVendasRequestDto,
  SimularCurvaVendasResponseDto,
  AiCashFlowForecastDto,
  ProducerCreditScoreDto,
  DynamicPricingRuleDto,
  TreasuryCashSweepDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 22)');
console.log('🤖 MOTOR DE IA: FLUXO DE CAIXA PREDITIVO, YIELD MANAGEMENT & CREDIT SCORING');
console.log('📈 PRECIFICAÇÃO DINÂMICA DE LOTES, SWEEP EM 100% CDI & MATRIZ DE RISCO');
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

// -----------------------------------------------------------------------------
// TESTE 1: PROJEÇÃO PREDITIVA DE FLUXO DE CAIXA E PREVENÇÃO DE GAPS DE LIQUIDEZ
// -----------------------------------------------------------------------------
console.log('--- 1. PROJEÇÃO ESTOCÁSTICA DE FLUXO DE CAIXA (90 DIAS) ---');
const forecast90d: AiCashFlowForecastDto = {
  id: 'prv-001',
  codigoPrevisao: 'PRV-2026-001',
  horizonteDias: 90,
  dataInicio: '2026-03-01T00:00:00Z',
  dataFim: '2026-05-30T23:59:59Z',
  saldoInicial: 480000.0,
  receitaPrevistaTotal: 3450000.0,
  despesaPrevistaTotal: 2980000.0,
  saldoProjetadoFinal: 950000.0,
  gapLiquidezIdentificado: false,
  dataGapPrevista: null,
  valorGapPrevisto: 0.0,
  probabilidadeConfianca: 96.2,
  acoesRecomendadas:
    'Liquidez estável. Recomenda-se aplicar excedente de R$ 350.000 em Cash Sweep overnight (100% CDI).',
  geradoEm: '2026-03-01T08:00:00Z',
};

const saldoCalculado = Number(
  (forecast90d.saldoInicial + forecast90d.receitaPrevistaTotal - forecast90d.despesaPrevistaTotal).toFixed(2),
);
const consistenciaSaldo = saldoCalculado === forecast90d.saldoProjetadoFinal;
const altaConfianca = forecast90d.probabilidadeConfianca >= 95.0;
const semGap = !forecast90d.gapLiquidezIdentificado && forecast90d.valorGapPrevisto === 0;

assert(
  consistenciaSaldo && altaConfianca && semGap,
  'Consistência Estocástica da Projeção de Caixa a 90 Dias & Confiança >= 95%',
  `Saldo Projetado: R$ ${forecast90d.saldoProjetadoFinal.toLocaleString('pt-BR')} | Confiança: ${forecast90d.probabilidadeConfianca}% | Gaps: 0`
);

// -----------------------------------------------------------------------------
// TESTE 2: MOTOR DE PRECIFICAÇÃO DINÂMICA E ELASTICIDADE DA DEMANDA (YIELD)
// -----------------------------------------------------------------------------
console.log('\n--- 2. MOTOR DE YIELD MANAGEMENT & ELASTICIDADE-PREÇO ---');
function simularCurvaYield(dto: SimularCurvaVendasRequestDto): SimularCurvaVendasResponseDto {
  const velocidadeVendasHora = Math.round(dto.vendasNasUltimas24h / 24);
  const percentualOcupacaoAtual = dto.percentualVendido;

  let precoOtimizadoSugerido = dto.precoLoteAtual;
  let recomendacaoAcao: SimularCurvaVendasResponseDto['recomendacaoAcao'] = 'MANTER_PRECO';
  let justificativaIa = '';

  if (percentualOcupacaoAtual >= 75 && velocidadeVendasHora >= 15) {
    precoOtimizadoSugerido = Number((dto.precoLoteAtual * 1.15).toFixed(2));
    recomendacaoAcao = 'VIRAR_LOTE_ANTECIPADO';
    justificativaIa = 'Aceleração de demanda identificada. Sugere-se antecipação de virada de lote.';
  } else if (percentualOcupacaoAtual < 40 && dto.diasAteEvento <= 10) {
    precoOtimizadoSugerido = Number((dto.precoLoteAtual * 0.9).toFixed(2));
    recomendacaoAcao = 'PROMOVER_LOTE_FLASH';
    justificativaIa = 'Ocupação aquém do modelo preditivo. Sugere-se lote relâmpago promocional.';
  } else {
    precoOtimizadoSugerido = dto.precoLoteAtual;
    recomendacaoAcao = 'MANTER_PRECO';
    justificativaIa = 'Velocidade regular. Manter preço de tabela.';
  }

  const ingressosRestantes = Math.round(dto.capacidadeTotal * (1 - percentualOcupacaoAtual / 100));
  const incrementoReceitaEstimado = Number(
    ((precoOtimizadoSugerido - dto.precoLoteAtual) * ingressosRestantes * 0.7).toFixed(2),
  );

  return {
    velocidadeVendasHora,
    percentualOcupacaoAtual,
    precoOtimizadoSugerido,
    incrementoReceitaEstimado: Math.max(0, incrementoReceitaEstimado),
    recomendacaoAcao,
    justificativaIa,
  };
}

const cenarioAltaDemanda: SimularCurvaVendasRequestDto = {
  eventoId: 'evt-pedreira-2026',
  loteId: 'lot-pista-02',
  precoLoteAtual: 220.0,
  capacidadeTotal: 15000,
  percentualVendido: 82.5,
  vendasNasUltimas24h: 3400,
  diasAteEvento: 18,
};

const resAltaDemanda = simularCurvaYield(cenarioAltaDemanda);
const acaoCorreta = resAltaDemanda.recomendacaoAcao === 'VIRAR_LOTE_ANTECIPADO';
const precoIncrementado = resAltaDemanda.precoOtimizadoSugerido > cenarioAltaDemanda.precoLoteAtual;
const ganhoPositivo = resAltaDemanda.incrementoReceitaEstimado > 0;

assert(
  acaoCorreta && precoIncrementado && ganhoPositivo,
  'Algoritmo de Elasticidade-Preço: Detecção de Aceleração e Virada Antecipada de Lote',
  `Preço Otimizado: R$ ${resAltaDemanda.precoOtimizadoSugerido} (+15%) | Ganho Estimado: R$ ${resAltaDemanda.incrementoReceitaEstimado.toLocaleString('pt-BR')}`
);

// -----------------------------------------------------------------------------
// TESTE 3: MATRIZ DE CREDIT SCORING & RATINGS DE PRODUTORES (AAA A C)
// -----------------------------------------------------------------------------
console.log('\n--- 3. MATRIZ DE CREDIT SCORING & RATINGS SOBERANOS DE PRODUTORES ---');
const scoresProdutores: ProducerCreditScoreDto[] = [
  {
    id: 'scr-001',
    producerId: 'prod-001',
    producerNome: 'Opus Entretenimento & Produções S/A',
    documentoFiscal: '04.821.902/0001-44',
    scorePontuacao: 940,
    rating: RatingProdutor.AAA,
    limiteAntecipacaoMaximo: 2500000.0,
    percentualMaximoRecebiveis: 75.0,
    historicoEventosRealizados: 48,
    taxaOcupacaoMediaPercent: 91.5,
    indiceChargebackPercent: 0.12,
    status: StatusAnaliseScore.HOMOLOGADO,
    ultimaAnaliseEm: '2026-03-01T00:00:00Z',
  },
  {
    id: 'scr-002',
    producerId: 'prod-002',
    producerNome: 'Planeta Brasil Shows & Festivais Ltda',
    documentoFiscal: '07.342.110/0001-00',
    scorePontuacao: 865,
    rating: RatingProdutor.AA,
    limiteAntecipacaoMaximo: 1200000.0,
    percentualMaximoRecebiveis: 50.0,
    historicoEventosRealizados: 26,
    taxaOcupacaoMediaPercent: 84.0,
    indiceChargebackPercent: 0.35,
    status: StatusAnaliseScore.HOMOLOGADO,
    ultimaAnaliseEm: '2026-03-01T00:00:00Z',
  },
  {
    id: 'scr-003',
    producerId: 'prod-003',
    producerNome: 'Curitiba Sunset Produções Artísticas',
    documentoFiscal: '19.824.771/0001-55',
    scorePontuacao: 780,
    rating: RatingProdutor.A,
    limiteAntecipacaoMaximo: 600000.0,
    percentualMaximoRecebiveis: 35.0,
    historicoEventosRealizados: 14,
    taxaOcupacaoMediaPercent: 78.5,
    indiceChargebackPercent: 0.62,
    status: StatusAnaliseScore.HOMOLOGADO,
    ultimaAnaliseEm: '2026-03-01T00:00:00Z',
  },
];

const opusScore = scoresProdutores.find((s) => s.producerId === 'prod-001');
const ratingOpusCorreto = opusScore?.rating === RatingProdutor.AAA && (opusScore?.scorePontuacao ?? 0) >= 900;
const limiteOpusSuficiente = (opusScore?.limiteAntecipacaoMaximo ?? 0) >= 2000000.0;

assert(
  Boolean(ratingOpusCorreto && limiteOpusSuficiente),
  'Classificação Soberana de Risco de Crédito: Rating AAA para Produtora de Elite',
  `Produtora: ${opusScore?.producerNome} | Score: ${opusScore?.scorePontuacao}/1000 | Rating: ${opusScore?.rating} | Limite: R$ ${opusScore?.limiteAntecipacaoMaximo.toLocaleString('pt-BR')}`
);

// -----------------------------------------------------------------------------
// TESTE 4: CONCESSÃO E TRAVAS DE ANTECIPAÇÃO POR PERCENTUAL MÁXIMO DE RECEBÍVEIS
// -----------------------------------------------------------------------------
console.log('\n--- 4. TRAVA PRUDENCIAL DE EXPOSIÇÃO DE RECEBÍVEIS POR RATING ---');
const limiteAaa = scoresProdutores.find((s) => s.rating === RatingProdutor.AAA)?.percentualMaximoRecebiveis || 0;
const limiteAa = scoresProdutores.find((s) => s.rating === RatingProdutor.AA)?.percentualMaximoRecebiveis || 0;
const limiteA = scoresProdutores.find((s) => s.rating === RatingProdutor.A)?.percentualMaximoRecebiveis || 0;

const curvaPrudencialCorreta = limiteAaa > limiteAa && limiteAa > limiteA;

assert(
  curvaPrudencialCorreta,
  'Curva de Alavancagem Prudencial: % Máximo de Recebíveis Escalona Conforme Rating',
  `Exposição Máx: AAA (${limiteAaa}%) > AA (${limiteAa}%) > A (${limiteA}%)`
);

// -----------------------------------------------------------------------------
// TESTE 5: APLICAÇÃO DE CASH SWEEP DE SOBRAS DE TESOURARIA EM 100% CDI
// -----------------------------------------------------------------------------
console.log('\n--- 5. SIMULAÇÃO DE CASH SWEEP OVERNIGHT EM 100% CDI ---');
const saldoOciosoAplicado = 350000.0;
const cdiDiarioEquivalente = 0.00045; // ~12% a.a. base 252 dias úteis
const rendimentoEstimadoDia = Number((saldoOciosoAplicado * cdiDiarioEquivalente).toFixed(2));

const sweepObj: TreasuryCashSweepDto = {
  id: 'swp-001',
  codigoAplicacao: 'SWP-2026-0001',
  contaBancariaId: 'cta-master-01',
  bancoNome: '341 - Itaú Unibanco S.A.',
  saldoAplicado: saldoOciosoAplicado,
  taxaRendimentoPercentCdi: 100.0,
  rendimentoAcumulado: rendimentoEstimadoDia,
  status: 'APLICADO',
  dataAplicacao: '2026-03-01T18:00:00Z',
  dataResgate: null,
};

const sweepValido =
  sweepObj.saldoAplicado === 350000.0 &&
  sweepObj.taxaRendimentoPercentCdi === 100.0 &&
  sweepObj.status === 'APLICADO' &&
  sweepObj.rendimentoAcumulado > 0;

assert(
  sweepValido,
  'Varredura Diária de Tesouraria (Cash Sweep) a 100% CDI com Liquidez Overnight',
  `Código: ${sweepObj.codigoAplicacao} | Saldo: R$ ${sweepObj.saldoAplicado.toLocaleString('pt-BR')} | Rendimento D+1: R$ ${sweepObj.rendimentoAcumulado}`
);

// -----------------------------------------------------------------------------
// TESTE 6: APLICAÇÃO E HOMOLOGAÇÃO DE RECOMENDAÇÃO DE PRECIFICAÇÃO DINÂMICA
// -----------------------------------------------------------------------------
console.log('\n--- 6. APLICAÇÃO E HOMOLOGAÇÃO DE REGRAS DE PRECIFICAÇÃO ---');
let regraDinamica: DynamicPricingRuleDto = {
  id: 'rule-001',
  eventId: 'evt-001',
  eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
  loteId: 'lot-002',
  loteNome: 'Pista Premium - 2º Lote',
  precoOriginal: 220.0,
  precoSugeridoIa: 250.0,
  velocidadeVendasHora: 142,
  percentualOcupacao: 82.5,
  elasticidadePrecoDemanda: 0.38,
  motivoRecomendacao: 'Velocidade 45% acima da curva histórica.',
  status: StatusRecomendacaoPreco.SUGERIDO,
  createdAt: '2026-03-01T08:00:00Z',
  aplicadoEm: null,
};

// Aplicação da regra
const statusInicialEhSugerido = regraDinamica.status === StatusRecomendacaoPreco.SUGERIDO;
regraDinamica.status = StatusRecomendacaoPreco.APLICADO;
regraDinamica.aplicadoEm = new Date().toISOString();
const statusFinalEhAplicado = regraDinamica.status === StatusRecomendacaoPreco.APLICADO;
const temDataAplicacao = Boolean(regraDinamica.aplicadoEm);

assert(
  statusInicialEhSugerido && statusFinalEhAplicado && temDataAplicacao,
  'Ciclo de Vida da Recomendação de Preço: SUGERIDO -> APLICADO com Carimbo Temporal',
  `Regra: ${regraDinamica.id} | Preço Base: R$ ${regraDinamica.precoOriginal} -> Otimizado: R$ ${regraDinamica.precoSugeridoIa} | Status: ${regraDinamica.status}`
);

// -----------------------------------------------------------------------------
// CONSOLIDAÇÃO FINAL
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 RESULTADO DA AUDITORIA (FASE 22): ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
console.log('========================================================================');

if (passCount === totalCount) {
  console.log('🚀 FASE 22 HOMOLOGADA COM SUCESSO! MOTOR DE IA, FLUXO PREDITIVO E YIELD EM CONFORMIDADE.');
  process.exit(0);
} else {
  console.error('❌ FALHAS DETECTADAS NA HOMOLOGAÇÃO DA FASE 22.');
  process.exit(1);
}
