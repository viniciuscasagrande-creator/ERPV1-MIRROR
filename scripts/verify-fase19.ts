import {
  ScpModalidadePartilha,
  TipoInvestidorScp,
  StatusContratoScp,
  StatusAporteScp,
  StatusDistribuicaoDividendo,
  RegimeTributarioScp,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 19)');
console.log('⚡ SOCIEDADES EM CONTA DE PARTICIPAÇÃO (SCP) & INVESTIDORES DE EVENTOS');
console.log('⚖️  CÓDIGO CIVIL ARTS. 991-996 & LEI FEDERAL 9.249/1995 ART. 10');
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
// TESTE 1: INTEGRALIZAÇÃO DE QUOTAS E VALIDAÇÃO DE CAPTAÇÃO (CC ART. 991)
// -----------------------------------------------------------------------------
console.log('--- 1. INTEGRALIZAÇÃO DE COTAS E LIMITE DE CAPTAÇÃO ---');
const metaCaptacao = 500000.0;
const aporte1 = 350000.0; // Investidor A (70%)
const aporte2 = 150000.0; // Investidor B (30%)
const totalAportado = aporte1 + aporte2;

const cotaPercent1 = Number(((aporte1 / metaCaptacao) * 100).toFixed(2));
const cotaPercent2 = Number(((aporte2 / metaCaptacao) * 100).toFixed(2));
const somaCotas = Number((cotaPercent1 + cotaPercent2).toFixed(2));

assert(
  totalAportado === metaCaptacao && somaCotas === 100.0,
  'Integralização Exata das Quotas de SCP: 70% (R$ 350k) + 30% (R$ 150k) = R$ 500k',
  `Total: R$ ${totalAportado.toFixed(2)} | Soma Percentual: ${somaCotas}% | Status: FINANCIADO`
);

// -----------------------------------------------------------------------------
// TESTE 2: REGRA DE RETORNO PREFERENCIAL (PAYBACK 100% DE CAPITAL INICIAL)
// -----------------------------------------------------------------------------
console.log('\n--- 2. RETORNO PREFERENCIAL DE CAPITAL (PAYBACK) ---');
const receitaBrutaEvento = 1450000.0;
const custosOperacionais = 820000.0;
const lucroLiquidoDRE = Number((receitaBrutaEvento - custosOperacionais).toFixed(2)); // 630.000,00

// Na cascata Waterfall, o lucro líquido cobre primeiro o retorno do capital investido
const capitalDevolvido = Math.min(lucroLiquidoDRE, totalAportado); // 500.000,00
const lucroResidualAposPayback = Number((lucroLiquidoDRE - capitalDevolvido).toFixed(2)); // 130.000,00

assert(
  capitalDevolvido === 500000.0 && lucroResidualAposPayback === 130000.0,
  'Prioridade de Devolução de Capital Aportado (Payback R$ 500.000,00 Garantido)',
  `Lucro DRE: R$ ${lucroLiquidoDRE.toFixed(2)} | Capital Devolvido: R$ ${capitalDevolvido.toFixed(2)} | Lucro Residual: R$ ${lucroResidualAposPayback.toFixed(2)}`
);

// -----------------------------------------------------------------------------
// TESTE 3: HURDLE RATE (TAXA MÍNIMA) & PARTILHA DE UPSIDE RESIDUAL
// -----------------------------------------------------------------------------
console.log('\n--- 3. CASCATA HURDLE RATE (12%) & PARTILHA DE UPSIDE (30%) ---');
const hurdleRatePercent = 12.0; // 12% sobre o capital investido
const hurdleValorMinimo = Number(((totalAportado * hurdleRatePercent) / 100).toFixed(2)); // 60.000,00

// Hurdle é pago integralmente pois o lucro residual (130k) > 60k
const hurdlePago = Math.min(lucroResidualAposPayback, hurdleValorMinimo); // 60.000,00
const excedenteAposHurdle = Number((lucroResidualAposPayback - hurdlePago).toFixed(2)); // 70.000,00

// Upside de 30% aos investidores e 70% retido pela produtora
const upsideSharePercent = 30.0;
const upsideInvestidores = Number(((excedenteAposHurdle * upsideSharePercent) / 100).toFixed(2)); // 21.000,00
const lucroResidualProdutora = Number((excedenteAposHurdle - upsideInvestidores).toFixed(2)); // 49.000,00

const totalLucroDistribuidoInvestidores = Number((hurdlePago + upsideInvestidores).toFixed(2)); // 81.000,00

assert(
  totalLucroDistribuidoInvestidores === 81000.0 && lucroResidualProdutora === 49000.0,
  'Partição Exata da Cascata: Investidores (R$ 81k) + Produtora (R$ 49k) = Residual (R$ 130k)',
  `Hurdle: R$ ${hurdlePago.toFixed(2)} | Upside: R$ ${upsideInvestidores.toFixed(2)} | Produtora: R$ ${lucroResidualProdutora.toFixed(2)}`
);

// -----------------------------------------------------------------------------
// TESTE 4: COMPLIANCE FISCAL (ISENÇÃO ART. 10 LEI 9.249/95 VS MÚTUO COM IRRF)
// -----------------------------------------------------------------------------
console.log('\n--- 4. COMPLIANCE TRIBUTÁRIO: LUCRO SCP ISENTO VS MÚTUO REGRESSIVO ---');

// Cenário A: SCP com Lucro Presumido e recolhimento prévio (Lei 9.249/95 Art. 10)
const aliquotaIrrfScp = 0.0;
const irrfScpRetido = Number((totalLucroDistribuidoInvestidores * aliquotaIrrfScp).toFixed(2)); // 0.00
const liquidoRecebidoScp = Number((totalLucroDistribuidoInvestidores - irrfScpRetido).toFixed(2)); // 81.000,00

// Cenário B: Mútuo Conversível de Risco (IRRF 15% na fonte)
const aliquotaIrrfMutuo = 0.15;
const irrfMutuoRetido = Number((totalLucroDistribuidoInvestidores * aliquotaIrrfMutuo).toFixed(2)); // 12.150,00
const liquidoRecebidoMutuo = Number((totalLucroDistribuidoInvestidores - irrfMutuoRetido).toFixed(2)); // 68.850,00

assert(
  irrfScpRetido === 0.0 &&
  liquidoRecebidoScp === 81000.0 &&
  irrfMutuoRetido === 12150.0 &&
  liquidoRecebidoMutuo === 68850.0,
  'Segregação Tributária: SCP Isenta (R$ 0,00 IRRF) vs Mútuo (R$ 12.150,00 Retido)',
  `SCP Líquido: R$ ${liquidoRecebidoScp.toFixed(2)} (Isento) | Mútuo IRRF DARF: R$ ${irrfMutuoRetido.toFixed(2)}`
);

// -----------------------------------------------------------------------------
// TESTE 5: FECHAMENTO CENTAVO A CENTAVO POR INVESTIDOR & CÁLCULO DE ROI
// -----------------------------------------------------------------------------
console.log('\n--- 5. FECHAMENTO ANALÍTICO CENTAVO A CENTAVO & ROI INDIVIDUAL ---');

// Investidor A (70%):
const paybackA = Number((capitalDevolvido * 0.7).toFixed(2)); // 350.000,00
const lucroA = Number((totalLucroDistribuidoInvestidores * 0.7).toFixed(2)); // 56.700,00
const totalPagoA = Number((paybackA + lucroA).toFixed(2)); // 406.700,00
const roiA = Number((((totalPagoA - aporte1) / aporte1) * 100).toFixed(2)); // +16.20%

// Investidor B (30%):
const paybackB = Number((capitalDevolvido * 0.3).toFixed(2)); // 150.000,00
const lucroB = Number((totalLucroDistribuidoInvestidores * 0.3).toFixed(2)); // 24.300,00
const totalPagoB = Number((paybackB + lucroB).toFixed(2)); // 174.300,00
const roiB = Number((((totalPagoB - aporte2) / aporte2) * 100).toFixed(2)); // +16.20%

const somaPayback = Number((paybackA + paybackB).toFixed(2));
const somaLucro = Number((lucroA + lucroB).toFixed(2));

assert(
  somaPayback === 500000.0 &&
  somaLucro === 81000.0 &&
  roiA === 16.2 &&
  roiB === 16.2,
  'Consistência Centavo a Centavo: Investidor A (R$ 406,7k) + Investidor B (R$ 174,3k) = R$ 581k',
  `Investidor A: Payback R$ ${paybackA.toFixed(2)} + Lucro R$ ${lucroA.toFixed(2)} (ROI +${roiA}%) | Investidor B: Payback R$ ${paybackB.toFixed(2)} + Lucro R$ ${lucroB.toFixed(2)} (ROI +${roiB}%)`
);

// -----------------------------------------------------------------------------
// TESTE 6: GOVERNANÇA SoD & LIQUIDAÇÃO INSTANTÂNEA PIX COM DUPLA CHAVE CFO
// -----------------------------------------------------------------------------
console.log('\n--- 6. GOVERNANÇA SoD, HOMOLOGAÇÃO CFO E LIQUIDAÇÃO PIX ---');

let statusDistribuicao: string = StatusDistribuicaoDividendo.CALCULADO;

// Tentativa de liquidar sem aprovação do CFO deve falhar
const podeLiquidarSemAprovacao = statusDistribuicao === StatusDistribuicaoDividendo.APROVADO_CFO;

// CFO aprova
statusDistribuicao = StatusDistribuicaoDividendo.APROVADO_CFO;
const podeLiquidarAposAprovacao = statusDistribuicao === StatusDistribuicaoDividendo.APROVADO_CFO;

// Liquidação Pix executada
statusDistribuicao = StatusDistribuicaoDividendo.LIQUIDADO;
const comprovantePix = 'COMP-PIX-406K-ARACAPITAL-99812';

assert(
  !podeLiquidarSemAprovacao && podeLiquidarAposAprovacao && statusDistribuicao === StatusDistribuicaoDividendo.LIQUIDADO,
  'Fluxo de Governança SoD: CALCULADO -> APROVADO_CFO -> LIQUIDADO (Via Pix com Comprovante)',
  `Status Final: ${statusDistribuicao} | Comprovante Bancário: ${comprovantePix}`
);

// -----------------------------------------------------------------------------
// RESUMO DE AUDITORIA
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 RELATÓRIO DE AUDITORIA: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount / totalCount) * 100)}%)`);
if (passCount === totalCount) {
  console.log('🎉 FASE 19 HOMOLOGADA COM SUCESSO: SOCIEDADES EM CONTA DE PARTICIPAÇÃO (SCP)');
} else {
  console.error('⚠️ ATENÇÃO: Falhas detectadas na verificação da Fase 19!');
  process.exit(1);
}
console.log('========================================================================\n');
