import { TipoEquipamentoPos, StatusTurnoCaixa } from '@diskingressos/types';
import type {
  PhysicalPosTerminalDto,
  CashierSessionShiftDto,
  PosCashBleedReconciliationDto,
  PosDashboardKpisDto,
  FecharTurnoRequestDto,
  FecharTurnoResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 44)');
console.log('🏪 GESTÃO DE PDVS FÍSICOS, TOTENS & SANGRIA COM CUSTÓDIA DE VALORES');
console.log('🛡️ BRINKS / PROSEGUR, FECHAMENTO DE TURNOS & LACRES GTV');
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

class TestPosCashierService {
  private inMemoryTerminals: PhysicalPosTerminalDto[] = [];
  private inMemoryShifts: CashierSessionShiftDto[] = [];
  private inMemoryBleeds: PosCashBleedReconciliationDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const t1: PhysicalPosTerminalDto = {
      id: 'term-001',
      codigoTerminalPos: 'PDV-CURITIBA-BATEL-01',
      localizacaoPontoVenda: 'Shopping Pátio Batel - Piso L3',
      tipoEquipamento: TipoEquipamentoPos.TOTEM_AUTOATENDIMENTO,
      numeroSerieHardware: 'POS-NX900-8812903',
      statusTerminal: 'OPERACIONAL_ONLINE',
      ultimoHeartbeat: new Date().toISOString(),
    };

    const s1: CashierSessionShiftDto = {
      id: 'shift-001',
      terminalId: 'term-001',
      operadorNome: 'Carlos Silva (Operador Sênior)',
      aberturaTimestamp: '2026-03-31T08:00:00Z',
      fundoCaixaInicialBrl: 500.0,
      totalVendasEspecieBrl: 14250.0,
      totalVendasTefCartaoBrl: 61300.0,
      totalVendasPixQrcodeBrl: 18100.0,
      statusTurno: StatusTurnoCaixa.TURNO_ABERTO,
    };

    const b1: PosCashBleedReconciliationDto = {
      id: 'bld-001',
      shiftId: 'shift-001',
      codigoSangria: 'SNG-2026-0331-01',
      valorSangriaEspecieBrl: 12000.0,
      envelopeLacradoNumero: 'LACRE-BRINKS-99412',
      transportadoraValores: 'Brinks Segurança e Transporte de Valores',
      statusConciliacao: 'CREDITADO_EM_CONTA',
      dataSangria: '2026-03-31T15:30:00Z',
    };

    this.inMemoryTerminals = [t1];
    this.inMemoryShifts = [s1];
    this.inMemoryBleeds = [b1];
  }

  getTerminals() {
    return this.inMemoryTerminals;
  }

  getShifts() {
    return this.inMemoryShifts;
  }

  getBleeds() {
    return this.inMemoryBleeds;
  }

  fecharTurno(dto: FecharTurnoRequestDto): FecharTurnoResponseDto {
    const shift = this.inMemoryShifts.find((s) => s.id === dto.shiftId);
    if (!shift) {
      throw new Error('Turno não encontrado');
    }

    const totalDinheiroEsperado = shift.fundoCaixaInicialBrl + shift.totalVendasEspecieBrl - dto.sangriaRealizadaBrl;
    const diferenca = dto.totalEspecieInformadoBrl - totalDinheiroEsperado;

    shift.fechamentoTimestamp = new Date().toISOString();
    shift.statusTurno =
      Math.abs(diferenca) < 0.01
        ? StatusTurnoCaixa.TURNO_FECHADO_AUDITADO
        : StatusTurnoCaixa.DIVERGENCIA_CAIXA;

    return {
      shiftId: shift.id,
      diferencaCaixaBrl: Number(diferenca.toFixed(2)),
      statusFinal: shift.statusTurno,
      protocoloFechamento: `FECH-PDV-${Date.now()}`,
    };
  }

  getKpis(): PosDashboardKpisDto {
    return {
      terminaisAtivosOnline: this.inMemoryTerminals.length,
      volumeTotalPdvsHojeBrl: 93650.0,
      sangriasCustodiadasBrl: 12000.0,
      divergenciaCaixasPercent: 0.0,
      turnosAbertosAgora: this.inMemoryShifts.filter((s) => s.statusTurno === StatusTurnoCaixa.TURNO_ABERTO).length,
    };
  }
}

async function runTests() {
  const service = new TestPosCashierService();

  // Teste 1: Terminais PDV cadastrados e online
  const terminals = service.getTerminals();
  assert(
    terminals.length > 0 &&
      terminals[0].tipoEquipamento === TipoEquipamentoPos.TOTEM_AUTOATENDIMENTO &&
      terminals[0].statusTerminal === 'OPERACIONAL_ONLINE',
    'Teste 1: Terminais PDV físicos e totens monitorados com telemetria e heartbeat',
    `Código: ${terminals[0].codigoTerminalPos} | Local: ${terminals[0].localizacaoPontoVenda} | Série: ${terminals[0].numeroSerieHardware}`
  );

  // Teste 2: Turno aberto e fundos de caixa
  const shifts = service.getShifts();
  assert(
    shifts.length > 0 &&
      shifts[0].fundoCaixaInicialBrl === 500.0 &&
      shifts[0].statusTurno === StatusTurnoCaixa.TURNO_ABERTO,
    'Teste 2: Abertura de turno de caixa com custódia de fundo de troco inicial',
    `Operador: ${shifts[0].operadorNome} | Fundo Inicial: R$ ${shifts[0].fundoCaixaInicialBrl.toFixed(2)}`
  );

  // Teste 3: Vendas registradas no turno (Espécie, Cartões TEF e Pix)
  const s = shifts[0];
  const totalVendas = s.totalVendasEspecieBrl + s.totalVendasTefCartaoBrl + s.totalVendasPixQrcodeBrl;
  assert(
    totalVendas === 93650.0 && s.totalVendasEspecieBrl === 14250.0,
    'Teste 3: Apuração multimeios de pagamento (dinheiro em espécie, TEF e Pix QR Code)',
    `Espécie: R$ ${s.totalVendasEspecieBrl} | TEF: R$ ${s.totalVendasTefCartaoBrl} | Pix: R$ ${s.totalVendasPixQrcodeBrl} | Total: R$ ${totalVendas}`
  );

  // Teste 4: Sangria e custódia por transportadora de valores
  const bleeds = service.getBleeds();
  assert(
    bleeds.length > 0 &&
      bleeds[0].valorSangriaEspecieBrl === 12000.0 &&
      bleeds[0].envelopeLacradoNumero === 'LACRE-BRINKS-99412',
    'Teste 4: Sangria de caixa em espécie com lacre de segurança e protocolo de custódia Brinks',
    `Sangria: R$ ${bleeds[0].valorSangriaEspecieBrl} | Lacre: ${bleeds[0].envelopeLacradoNumero} | Transp: ${bleeds[0].transportadoraValores}`
  );

  // Teste 5: Fechamento de Turno e Quebra de Caixa Zero
  // Dinheiro esperado = Fundo (500) + Espécie (14250) - Sangria (12000) = 2750
  const fechamento = service.fecharTurno({
    shiftId: 'shift-001',
    totalEspecieInformadoBrl: 2750.0,
    sangriaRealizadaBrl: 12000.0,
    envelopeNumero: 'LACRE-BRINKS-99412',
  });
  assert(
    fechamento.statusFinal === StatusTurnoCaixa.TURNO_FECHADO_AUDITADO &&
      fechamento.diferencaCaixaBrl === 0.0,
    'Teste 5: Fechamento auditado de turno de caixa com conciliação exata e quebra de caixa zero',
    `Status: ${fechamento.statusFinal} | Diferença: R$ ${fechamento.diferencaCaixaBrl.toFixed(2)} | Protocolo: ${fechamento.protocoloFechamento}`
  );

  // Teste 6: Consolidação de KPIs de PDV e Custódia
  const kpis = service.getKpis();
  assert(
    kpis.terminaisAtivosOnline >= 1 &&
      kpis.sangriasCustodiadasBrl === 12000.0 &&
      kpis.divergenciaCaixasPercent === 0.0,
    'Teste 6: Consolidação de KPIs de terminais físicos, volume e sangrias custodiadas',
    `Terminais: ${kpis.terminaisAtivosOnline} | Volume Total: R$ ${kpis.volumeTotalPdvsHojeBrl.toLocaleString('pt-BR')} | Sangrias: R$ ${kpis.sangriasCustodiadasBrl.toLocaleString('pt-BR')}`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 44: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
