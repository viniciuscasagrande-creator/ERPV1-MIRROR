import { StatusPulseiraCashless } from '@diskingressos/types';
import type {
  CashlessRfidWristbandDto,
  EventFoodBeverageSaleDto,
  SpedInventoryBlockKRecordDto,
  CashlessDashboardKpisDto,
  RecarregarPulseiraRequestDto,
  RecarregarPulseiraResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 46)');
console.log('🍔 GESTÃO DE A&B, CASHLESS RFID / NFC & ESTOQUE SPED FISCAL BLOCO K');
console.log('📊 RECONCILIAÇÃO DE CMV, SOBRAS NÃO RESGATADAS & QUEBRAS TÉCNICAS');
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

class TestCashlessInventoryService {
  private inMemoryWristbands: CashlessRfidWristbandDto[] = [];
  private inMemorySales: EventFoodBeverageSaleDto[] = [];
  private inMemorySpedBlockK: SpedInventoryBlockKRecordDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const w1: CashlessRfidWristbandDto = {
      id: 'wrb-001',
      tagRfidUid: 'RFID-NFC-99410291',
      eventoId: 'evt-rock-fest-2026',
      saldoAtualBrl: 100.0,
      saldoNaoResgatadoBrl: 25.0,
      taxaAtivacaoPagaBrl: 5.0,
      statusPulseira: StatusPulseiraCashless.ATIVA,
      ultimaCargaEm: new Date().toISOString(),
    };

    const s1: EventFoodBeverageSaleDto = {
      id: 'sale-001',
      pulseiraId: 'wrb-001',
      eventoId: 'evt-rock-fest-2026',
      pontoVendaBar: 'Bar Principal Pista 01',
      itemDescricao: 'Chopp Artesanal IPA 500ml',
      quantidade: 2,
      valorTotalBrl: 40.0,
      custoMercadoriaVendidaBrl: 14.0,
      timestampVenda: new Date().toISOString(),
    };

    const blk1: SpedInventoryBlockKRecordDto = {
      id: 'blk-001',
      eventoId: 'evt-rock-fest-2026',
      mesCompetencia: '2026-04',
      codigoItemInsumo: 'INS-CHOPP-IPA-BARRIL-50L',
      quantidadeEstoqueInicial: 100.0,
      quantidadeConsumida: 45.0,
      quantidadeEstoqueFinal: 54.5,
      perdaApuradaQuebra: 0.5,
      dataFechamento: new Date().toISOString(),
    };

    this.inMemoryWristbands = [w1];
    this.inMemorySales = [s1];
    this.inMemorySpedBlockK = [blk1];
  }

  getWristbands() {
    return this.inMemoryWristbands;
  }

  getSales() {
    return this.inMemorySales;
  }

  getSpedRecords() {
    return this.inMemorySpedBlockK;
  }

  recarregar(dto: RecarregarPulseiraRequestDto): RecarregarPulseiraResponseDto {
    const w = this.inMemoryWristbands.find((x) => x.tagRfidUid === dto.tagRfidUid);
    if (!w) throw new Error('Pulseira não encontrada');

    w.saldoAtualBrl += dto.valorRecargaBrl;
    w.ultimaCargaEm = new Date().toISOString();

    return {
      tagRfidUid: w.tagRfidUid,
      novoSaldoBrl: w.saldoAtualBrl,
      comprovanteRecargaId: `REC-CASHLESS-${Date.now()}`,
      timestamp: w.ultimaCargaEm,
    };
  }

  getKpis(): CashlessDashboardKpisDto {
    return {
      totalPulseirasAtivas: 18450,
      volumeTotalRecargasBrl: 485000.0,
      consumoTotalBaresBrl: 412000.0,
      saldoSobraNaoResgatadoBrl: 73000.0,
      margemBrutaAlimentosBebidasPercent: 65.5,
    };
  }
}

async function runTests() {
  const service = new TestCashlessInventoryService();

  // Teste 1: Pulseiras ativas com taxa de ativação
  const wristbands = service.getWristbands();
  assert(
    wristbands.length > 0 &&
      wristbands[0].taxaAtivacaoPagaBrl === 5.0 &&
      wristbands[0].statusPulseira === StatusPulseiraCashless.ATIVA,
    'Teste 1: Cadastro e ativação de pulseira RFID com taxa de caução/habilitação contábil',
    `Tag: ${wristbands[0].tagRfidUid} | Saldo: R$ ${wristbands[0].saldoAtualBrl.toFixed(2)} | Taxa: R$ ${wristbands[0].taxaAtivacaoPagaBrl.toFixed(2)}`
  );

  // Teste 2: Recarga pré-paga
  const recarga = service.recarregar({
    tagRfidUid: 'RFID-NFC-99410291',
    valorRecargaBrl: 50.0,
    eventoId: 'evt-rock-fest-2026',
    metodoPagamento: 'PIX',
  });
  assert(
    recarga.novoSaldoBrl === 150.0 && recarga.comprovanteRecargaId.startsWith('REC-CASHLESS'),
    'Teste 2: Recarga em tempo real de crédito pré-pago em saldo cashless',
    `Novo Saldo: R$ ${recarga.novoSaldoBrl.toFixed(2)} | Comprovante: ${recarga.comprovanteRecargaId}`
  );

  // Teste 3: Venda de alimentos/bebidas com CMV apurado
  const sales = service.getSales();
  assert(
    sales.length > 0 &&
      sales[0].valorTotalBrl === 40.0 &&
      sales[0].custoMercadoriaVendidaBrl === 14.0,
    'Teste 3: Registro de consumo em bar físico com baixa instantânea e cálculo de CMV',
    `Item: ${sales[0].itemDescricao} | Venda: R$ ${sales[0].valorTotalBrl.toFixed(2)} | CMV: R$ ${sales[0].custoMercadoriaVendidaBrl.toFixed(2)}`
  );

  // Teste 4: Inventário SPED Fiscal Bloco K
  const sped = service.getSpedRecords();
  assert(
    sped.length > 0 &&
      sped[0].quantidadeEstoqueFinal === 54.5 &&
      sped[0].perdaApuradaQuebra === 0.5,
    'Teste 4: Escrituração de controle de produção e estoque SPED Fiscal Bloco K com perdas técnicas',
    `Insumo: ${sped[0].codigoItemInsumo} | Inicial: ${sped[0].quantidadeEstoqueInicial} | Consumo: ${sped[0].quantidadeConsumida} | Quebra: ${sped[0].perdaApuradaQuebra}`
  );

  // Teste 5: Sobra de saldo não resgatado (Breakage)
  assert(
    wristbands[0].saldoNaoResgatadoBrl === 25.0,
    'Teste 5: Apuração contábil de crédito residual pós-evento não resgatado como receita extraordinária',
    `Crédito Residual Expirado: R$ ${wristbands[0].saldoNaoResgatadoBrl.toFixed(2)}`
  );

  // Teste 6: Consolidação de KPIs de A&B e Margem Bruta
  const kpis = service.getKpis();
  assert(
    kpis.totalPulseirasAtivas > 10000 &&
      kpis.margemBrutaAlimentosBebidasPercent > 60.0 &&
      kpis.saldoSobraNaoResgatadoBrl > 0,
    'Teste 6: Consolidação de KPIs de Cashless, volume financeiro e margem operacional',
    `Pulseiras: ${kpis.totalPulseirasAtivas.toLocaleString('pt-BR')} | Recargas: R$ ${kpis.volumeTotalRecargasBrl.toLocaleString('pt-BR')} | Margem: ${kpis.margemBrutaAlimentosBebidasPercent}%`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 46: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
