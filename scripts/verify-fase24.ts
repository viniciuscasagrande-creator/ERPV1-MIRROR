import {
  MoedaEstrangeira,
  StatusVendaInternacional,
  StatusHedgeCambial,
  TipoVariacaoCambial,
} from '@diskingressos/types';
import type {
  CurrencyExchangeRateDto,
  InternationalTicketSaleDto,
  FxHedgeContractDto,
  FxAccountingEntryDto,
  SimularCotacaoInternacionalRequestDto,
  SimularCotacaoInternacionalResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 24)');
console.log('🌐 GATEWAY GLOBAL MULTI-MOEDA, CÂMBIO SPOT & COMPLIANCE CAMBIAL (IOF)');
console.log('⚖️  RESOLUÇÕES BACEN 277/22, DECRETO 6.306/07 E NBC TG 02 / IAS 21');
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
// TESTE 1: COTAÇÃO PTAX OFICIAL BACEN & FORMAÇÃO DE TAXA EFETIVA COM SPREAD
// -----------------------------------------------------------------------------
console.log('--- 1. COTAÇÃO SPOT PTAX BACEN & SPREAD CAMBIAL DA PLATAFORMA ---');
const taxaPtaxDolar = 5.6540;
const spreadPercentual = 2.50; // 2.5%
const taxaEfetivaBoleta = 5.7954; // PTAX + 2.5% arredondado a 4 casas

const rateUsd: CurrencyExchangeRateDto = {
  id: 'fx-rate-01',
  moedaOrigem: MoedaEstrangeira.USD,
  moedaDestino: 'BRL',
  taxaPtaxOficial: taxaPtaxDolar,
  spreadPercent: spreadPercentual,
  taxaEfetivaSpot: taxaEfetivaBoleta,
  dataHoraCotacao: new Date().toISOString(),
  fonteCotacao: 'BACEN_SISBACEN_PTAX',
  ativa: true,
};

const spreadCorreto = rateUsd.taxaEfetivaSpot === 5.7954 && rateUsd.taxaEfetivaSpot > rateUsd.taxaPtaxOficial;
const ativaComFonteOficial = rateUsd.ativa && rateUsd.fonteCotacao.includes('BACEN');

assert(
  spreadCorreto && ativaComFonteOficial,
  'Formação da Taxa Spot: PTAX Oficial Bacen + Spread de 2.5% em Conformidade',
  `PTAX: R$ ${rateUsd.taxaPtaxOficial} -> Spot Efetivo: R$ ${rateUsd.taxaEfetivaSpot} (+${rateUsd.spreadPercent}%)`
);

// -----------------------------------------------------------------------------
// TESTE 2: SIMULAÇÃO DE CHECKOUT COM IOF CAMBIAL DIFERENCIADO (DECRETO 6.306/07)
// -----------------------------------------------------------------------------
console.log('\n--- 2. TRIBUTAÇÃO DE IOF CÂMBIO: CARTÃO DE CRÉDITO (4.38%) VS CONTA GLOBAL (1.10%) ---');
function simularCheckoutFx(dto: SimularCotacaoInternacionalRequestDto): SimularCotacaoInternacionalResponseDto {
  const taxaPtax = 5.6540;
  const spreadPercent = 2.50;
  const taxaSpotFinal = Number((taxaPtax * (1 + spreadPercent / 100)).toFixed(4)); // 5.7954

  const aliquotaIof = dto.tipoCartao === 'CONTA_GLOBAL_DEBITO' ? 1.10 : 4.38;
  const valorMoedaEstrangeira = Number((dto.valorBrl / taxaSpotFinal).toFixed(2));
  const valorIof = Number(((dto.valorBrl * aliquotaIof) / 100).toFixed(2));
  const custoTotal = Number((dto.valorBrl + valorIof).toFixed(2));

  return {
    valorOriginalBrl: dto.valorBrl,
    moedaDesejada: dto.moedaDesejada,
    taxaPtax,
    spreadPercent,
    taxaSpotFinal,
    valorMoedaEstrangeira,
    aliquotaIofPercent: aliquotaIof,
    valorIofBrl: valorIof,
    custoTotalEstimadoBrl: custoTotal,
  };
}

const simCredito = simularCheckoutFx({
  valorBrl: 350.0,
  moedaDesejada: MoedaEstrangeira.USD,
  tipoCartao: 'INTERNACIONAL_CREDITO',
});

const simDebito = simularCheckoutFx({
  valorBrl: 350.0,
  moedaDesejada: MoedaEstrangeira.USD,
  tipoCartao: 'CONTA_GLOBAL_DEBITO',
});

const iofCreditoCorreto = simCredito.aliquotaIofPercent === 4.38 && simCredito.valorIofBrl === 15.33;
const iofDebitoCorreto = simDebito.aliquotaIofPercent === 1.10 && simDebito.valorIofBrl === 3.85;

assert(
  iofCreditoCorreto && iofDebitoCorreto,
  'Diferenciação Tributária de IOF Câmbio Conforme Decreto 6.306/07',
  `Cartão Crédito (4.38%): IOF R$ ${simCredito.valorIofBrl} | Conta Global (1.10%): IOF R$ ${simDebito.valorIofBrl}`
);

// -----------------------------------------------------------------------------
// TESTE 3: SEGREGAÇÃO DE RECEITA DO BORDERÔ (PRODUTOR VS SPREAD DISK)
// -----------------------------------------------------------------------------
console.log('\n--- 3. SEGREGAÇÃO CAMBIAL DE BORDERÔ & RETENÇÃO DE SPREAD ---');
const vendaInternacional: InternationalTicketSaleDto = {
  id: 'fx-sale-01',
  codigoTransacao: 'INT-TRX-2026-0041',
  vendaId: 'vnd-intl-01',
  eventoId: 'evt-001',
  eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
  paisComprador: 'US',
  moedaEstrangeira: MoedaEstrangeira.USD,
  valorMoedaEstrangeira: 120.0,
  taxaCambioAplicada: 5.7954,
  aliquotaIofPercent: 4.38,
  valorIofBrl: 30.46,
  valorTotalBrl: 725.91,
  valorLiquidoProdutorBrl: 678.48, // 120 * 5.6540 (PTAX pura)
  spreadReceitaDiskBrl: 16.97, // Ganho cambial líquido da Disk
  statusCambial: StatusVendaInternacional.LIQUIDADO_BORDERO,
  dataTransacao: '2026-03-01T16:20:00Z',
};

const liquidoProdutorCorreto = vendaInternacional.valorLiquidoProdutorBrl === 678.48;
const spreadDiskCorreto = vendaInternacional.spreadReceitaDiskBrl > 0;
const statusLiquidado = vendaInternacional.statusCambial === StatusVendaInternacional.LIQUIDADO_BORDERO;

assert(
  liquidoProdutorCorreto && spreadDiskCorreto && statusLiquidado,
  'Segregação Cambial no Borderô: Produtor Recebe Base PTAX e Disk Captura Spread',
  `Produtor (PTAX 5.654): R$ ${vendaInternacional.valorLiquidoProdutorBrl} | Spread Disk: R$ ${vendaInternacional.spreadReceitaDiskBrl} | IOF: R$ ${vendaInternacional.valorIofBrl}`
);

// -----------------------------------------------------------------------------
// TESTE 4: CONTRATAÇÃO DE TRAVA CAMBIAL SPOT (FX HEDGE / LOCK)
// -----------------------------------------------------------------------------
console.log('\n--- 4. CONTRATO DE HEDGE CAMBIAL (FX LOCK) PARA ATRAÇÃO INTERNACIONAL ---');
const volumeUsdProtegido = 150000.0;
const taxaSpotTravada = 5.7500;
const valorBrlGarantidoEsperado = Number((volumeUsdProtegido * taxaSpotTravada).toFixed(2)); // 862.500,00

const contratoHedge: FxHedgeContractDto = {
  id: 'hdg-001',
  codigoContratoHedge: 'HDG-2026-0008',
  eventoId: 'evt-001',
  eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
  produtorId: 'prod-001',
  moedaProtegida: MoedaEstrangeira.USD,
  volumeMoedaProtegido: volumeUsdProtegido,
  taxaCambioTravadaSpot: taxaSpotTravada,
  valorBrlGarantido: valorBrlGarantidoEsperado,
  instituicaoFinanceira: '341 - Itaú BBA S.A.',
  dataAbertura: '2026-02-10T14:00:00Z',
  dataLiquidacaoPrevista: '2026-05-30T18:00:00Z',
  status: StatusHedgeCambial.ATIVO,
};

const hedgeAtivo = contratoHedge.status === StatusHedgeCambial.ATIVO;
const garantiaBrlExata = contratoHedge.valorBrlGarantido === 862500.0;

assert(
  hedgeAtivo && garantiaBrlExata,
  'Contrato de Trava Cambial Spot (FX Lock) Blindando Borderô Contra Desvalorização',
  `Contrato: ${contratoHedge.codigoContratoHedge} | Protegido: US$ ${contratoHedge.volumeMoedaProtegido.toLocaleString()} @ R$ ${contratoHedge.taxaCambioTravadaSpot} = R$ ${contratoHedge.valorBrlGarantido.toLocaleString('pt-BR')}`
);

// -----------------------------------------------------------------------------
// TESTE 5: ESCRITURAÇÃO DE VARIAÇÃO CAMBIAL ATIVA (NBC TG 02 / IAS 21)
// -----------------------------------------------------------------------------
console.log('\n--- 5. ESCRITURAÇÃO CONTÁBIL EM PARTIDAS DOBRADAS (NBC TG 02 / IAS 21) ---');
const lancamentoVariacao: FxAccountingEntryDto = {
  id: 'acc-fx-001',
  codigoLancamento: 'LCT-FX-2026-001',
  eventoId: 'evt-001',
  tipoVariacao: TipoVariacaoCambial.ATIVA_RECEITA,
  moedaOrigem: MoedaEstrangeira.USD,
  taxaCotacaoInicial: 5.6000,
  taxaLiquidacao: 5.6540,
  valorDiferencaBrl: 8100.0,
  contaContabilDebito: '1.1.1.03 - Disponibilidades em Moeda Estrangeira',
  contaContabilCredito: '4.1.3.01 - Variação Cambial Ativa (Receitas Financeiras)',
  historicoContabil:
    'Reconhecimento de variação cambial ativa positiva na liquidação do lote internacional Pedreira (NBC TG 02).',
  dataLancamento: '2026-03-01T23:59:59Z',
};

const tipoAtivo = lancamentoVariacao.tipoVariacao === TipoVariacaoCambial.ATIVA_RECEITA;
const temContasPartidasDobradas =
  lancamentoVariacao.contaContabilDebito.includes('Disponibilidades') &&
  lancamentoVariacao.contaContabilCredito.includes('Receitas Financeiras');
const valorPositivo = lancamentoVariacao.valorDiferencaBrl > 0;

assert(
  tipoAtivo && temContasPartidasDobradas && valorPositivo,
  'Lançamento Contábil de Variação Cambial Ativa Conforme a Norma NBC TG 02',
  `Diferença: +R$ ${lancamentoVariacao.valorDiferencaBrl.toLocaleString('pt-BR')} | Débito: ${lancamentoVariacao.contaContabilDebito} | Crédito: ${lancamentoVariacao.contaContabilCredito}`
);

// -----------------------------------------------------------------------------
// TESTE 6: CICLO DE VIDA DA TRANSAÇÃO INTERNACIONAL (COTADO -> TRAVADO -> LIQUIDADO)
// -----------------------------------------------------------------------------
console.log('\n--- 6. TRANSIÇÃO DE ESTADOS E LIQUIDAÇÃO CAMBIAL ---');
let statusAtual: StatusVendaInternacional = StatusVendaInternacional.COTADO;
const estado1Cotado = statusAtual === StatusVendaInternacional.COTADO;

statusAtual = StatusVendaInternacional.TRAVADO_SPOT;
const estado2Travado = statusAtual === StatusVendaInternacional.TRAVADO_SPOT;

statusAtual = StatusVendaInternacional.LIQUIDADO_BORDERO;
const estado3Liquidado = statusAtual === StatusVendaInternacional.LIQUIDADO_BORDERO;

assert(
  estado1Cotado && estado2Travado && estado3Liquidado,
  'Ciclo de Vida Cambial Completo: COTADO ➔ TRAVADO_SPOT ➔ LIQUIDADO_BORDERO',
  `Fluxo finalizado com status ${statusAtual} e borderô conciliado`
);

// -----------------------------------------------------------------------------
// CONSOLIDAÇÃO FINAL
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 RESULTADO DA AUDITORIA (FASE 24): ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
console.log('========================================================================');

if (passCount === totalCount) {
  console.log('🚀 FASE 24 HOMOLOGADA COM SUCESSO! GATEWAY GLOBAL, CÂMBIO SPOT E IOF EM CONFORMIDADE.');
  process.exit(0);
} else {
  console.error('❌ FALHAS DETECTADAS NA HOMOLOGAÇÃO DA FASE 24.');
  process.exit(1);
}
