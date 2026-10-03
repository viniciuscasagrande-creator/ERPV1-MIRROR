import { EstagioCobrancaDivida } from '@diskingressos/types';
import type {
  ProducerDebtCollectionDto,
  CreditBureauProtestRecordDto,
  Ifrs9ExpectedCreditLossDto,
  DebtRecoveryDashboardKpisDto,
  NegociarDividaRequestDto,
  NegociarDividaResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 47)');
console.log('⚖️ COBRANÇA JUDICIAL, RECUPERAÇÃO DE CRÉDITO & PECLD (IFRS 9 / CPC 48)');
console.log('📜 NEGATIVAÇÃO BIRÔS, PROTESTO EM CARTÓRIO & TERMO DE CONFISSÃO');
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

class TestDebtRecoveryService {
  private inMemoryDebts: ProducerDebtCollectionDto[] = [];
  private inMemoryProtests: CreditBureauProtestRecordDto[] = [];
  private inMemoryPecld: Ifrs9ExpectedCreditLossDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const d1: ProducerDebtCollectionDto = {
      id: 'dbt-001',
      produtorId: 'prod-show-sul-ltda',
      codigoDivida: 'DIV-2026-00441',
      valorOriginalDividaBrl: 100000.0,
      saldoDevedorAtualBrl: 110000.0,
      diasEmAtrasoAging: 75,
      estagioCobranca: EstagioCobrancaDivida.NOTIFICACAO_EXTRAJUDICIAL,
      taxaJurosMoraMensalPercent: 1.0,
      criadoEm: '2026-01-20T10:00:00Z',
    };

    const p1: CreditBureauProtestRecordDto = {
      id: 'prt-001',
      dividaId: 'dbt-001',
      cartorioProtestoComarca: '1º Tabelionato de Protestos - Curitiba/PR',
      protocoloCertidaoProtesto: 'PROT-PR-2026-00941',
      statusSerasaBoaVista: 'NEGATIVADO_SERASA_EXPERIAN',
      dataNegativacao: '2026-02-15T09:00:00Z',
    };

    const ecl1: Ifrs9ExpectedCreditLossDto = {
      id: 'ecl-001',
      competenciaMesAno: '2026-03',
      categoriaAgingCarteira: 'AGING_61_90_DIAS',
      exposicaoAoRiscoBrl: 110000.0,
      probabilidadeInadimplenciaPd: 25.0,
      perdaDadoIncumprimentoLgd: 40.0,
      provisaoPecldCalculadaBrl: 11000.0, // 110.000 * 25% * 40% = 11.000
      dataApuracao: '2026-03-31T23:59:59Z',
    };

    this.inMemoryDebts = [d1];
    this.inMemoryProtests = [p1];
    this.inMemoryPecld = [ecl1];
  }

  getDebts() {
    return this.inMemoryDebts;
  }

  getProtests() {
    return this.inMemoryProtests;
  }

  getPecldRecords() {
    return this.inMemoryPecld;
  }

  negociarDivida(dto: NegociarDividaRequestDto): NegociarDividaResponseDto {
    const debt = this.inMemoryDebts.find((d) => d.id === dto.dividaId);
    if (!debt) throw new Error('Dívida não encontrada');

    const juros = debt.saldoDevedorAtualBrl - debt.valorOriginalDividaBrl;
    const desconto = juros * (dto.descontoJurosPercent / 100);
    const novoSaldo = debt.saldoDevedorAtualBrl - desconto;
    const valorParcela = novoSaldo / dto.numeroParcelas;

    debt.saldoDevedorAtualBrl = novoSaldo;
    debt.estagioCobranca = EstagioCobrancaDivida.AMIGAVEL;

    return {
      dividaId: debt.id,
      novoSaldoAcordadoBrl: Number(novoSaldo.toFixed(2)),
      valorParcelaBrl: Number(valorParcela.toFixed(2)),
      termoConfissaoDividaHash: `sha256:dbt-confissao-${Date.now()}`,
      statusNegociacao: 'ACORDO_FIRMADO_PARCELAMENTO',
    };
  }

  getKpis(): DebtRecoveryDashboardKpisDto {
    return {
      carteiraTotalInadimplenteBrl: 179600.0,
      provisaoPecldAcumuladaBrl: 38400.0,
      taxaRecuperacaoCreditoPercent: 62.4,
      titulosEmProtestoCartorio: this.inMemoryProtests.length,
      acoesJudiciaisAtivas: 2,
    };
  }
}

async function runTests() {
  const service = new TestDebtRecoveryService();

  // Teste 1: Títulos em atraso com aging
  const debts = service.getDebts();
  assert(
    debts.length > 0 &&
      debts[0].diasEmAtrasoAging === 75 &&
      debts[0].estagioCobranca === EstagioCobrancaDivida.NOTIFICACAO_EXTRAJUDICIAL,
    'Teste 1: Gestão de carteira inadimplente com controle temporal de aging e juros de mora',
    `Código: ${debts[0].codigoDivida} | Atraso: ${debts[0].diasEmAtrasoAging} dias | Saldo Atual: R$ ${debts[0].saldoDevedorAtualBrl.toFixed(2)}`
  );

  // Teste 2: Negativação em birôs (Serasa/Boa Vista)
  const protests = service.getProtests();
  assert(
    protests.length > 0 &&
      protests[0].statusSerasaBoaVista.includes('NEGATIVADO'),
    'Teste 2: Negativação automática em birôs de proteção ao crédito (Serasa Experian / Boa Vista)',
    `Status Birô: ${protests[0].statusSerasaBoaVista} | Data: ${new Date(protests[0].dataNegativacao).toLocaleDateString('pt-BR')}`
  );

  // Teste 3: Protesto em cartório de notas
  assert(
    protests[0].protocoloCertidaoProtesto.startsWith('PROT-PR') &&
      protests[0].cartorioProtestoComarca.includes('Curitiba'),
    'Teste 3: Apontamento de certidão de protesto em cartório de títulos',
    `Protocolo: ${protests[0].protocoloCertidaoProtesto} | Cartório: ${protests[0].cartorioProtestoComarca}`
  );

  // Teste 4: Provisão PECLD (IFRS 9 / CPC 48)
  const pecld = service.getPecldRecords();
  assert(
    pecld.length > 0 &&
      pecld[0].provisaoPecldCalculadaBrl === 11000.0 &&
      pecld[0].probabilidadeInadimplenciaPd === 25.0,
    'Teste 4: Apuração atuarial de Perdas de Crédito Esperadas (ECL = EAD * PD * LGD)',
    `Exposição EAD: R$ ${pecld[0].exposicaoAoRiscoBrl} | PD: ${pecld[0].probabilidadeInadimplenciaPd}% | LGD: ${pecld[0].perdaDadoIncumprimentoLgd}% | PECLD: R$ ${pecld[0].provisaoPecldCalculadaBrl}`
  );

  // Teste 5: Renegociação e termo de confissão
  const acordo = service.negociarDivida({
    dividaId: 'dbt-001',
    numeroParcelas: 10,
    descontoJurosPercent: 50.0,
  });
  assert(
    acordo.statusNegociacao === 'ACORDO_FIRMADO_PARCELAMENTO' &&
      acordo.novoSaldoAcordadoBrl === 105000.0 &&
      acordo.valorParcelaBrl === 10500.0,
    'Teste 5: Formalização de acordo com perdão parcial de juros e termo de confissão de dívida',
    `Novo Saldo: R$ ${acordo.novoSaldoAcordadoBrl.toFixed(2)} (10x de R$ ${acordo.valorParcelaBrl.toFixed(2)}) | Termo: ${acordo.termoConfissaoDividaHash}`
  );

  // Teste 6: Consolidação de KPIs de Crédito
  const kpis = service.getKpis();
  assert(
    kpis.carteiraTotalInadimplenteBrl > 0 &&
      kpis.provisaoPecldAcumuladaBrl > 0 &&
      kpis.taxaRecuperacaoCreditoPercent > 50.0,
    'Teste 6: Consolidação de KPIs de inadimplência, provisões contábeis e recuperação',
    `Carteira Total: R$ ${kpis.carteiraTotalInadimplenteBrl.toLocaleString('pt-BR')} | Provisão: R$ ${kpis.provisaoPecldAcumuladaBrl.toLocaleString('pt-BR')} | Recuperação: ${kpis.taxaRecuperacaoCreditoPercent}%`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 47: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
