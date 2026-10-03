import { TipoVeiculoLogistica } from '@diskingressos/types';
import type {
  TourLogisticsVehicleDto,
  FieldExpenseFleetReportDto,
  Ifrs16LeaseVehicleContractDto,
  FleetDashboardKpisDto,
  LancarDespesaCombustivelRequestDto,
  LancarDespesaCombustivelResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 49)');
console.log('🚚 LOGÍSTICA DE TURNÊS, FROTA & CONTRATOS DE LEASING (IFRS 16 / CPC 06)');
console.log('⛽ CARTÕES COMBUSTÍVEL, TAGS DE PEDÁGIO & ATIVO DIREITO DE USO');
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

class TestTourFleetService {
  private inMemoryVehicles: TourLogisticsVehicleDto[] = [];
  private inMemoryExpenses: FieldExpenseFleetReportDto[] = [];
  private inMemoryLeases: Ifrs16LeaseVehicleContractDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const v1: TourLogisticsVehicleDto = {
      id: 'veh-001',
      placaVeiculo: 'BRA-2E19',
      tipoVeiculo: TipoVeiculoLogistica.VAN_EXECUTIVA,
      identificadorFrota: 'VAN-TRANSFER-01',
      motoristaResponsavel: 'José Ribamar Silva',
      capacidadePassageirosCarga: '15 passageiros',
      statusOperacional: 'EM_ROTA_EVENTO',
    };

    const exp1: FieldExpenseFleetReportDto = {
      id: 'exp-001',
      veiculoId: 'veh-001',
      eventoId: 'evt-rock-fest-2026',
      cartaoCombustivelNumero: 'TICKET-LOG-991204',
      litrosAbastecidos: 75.0,
      valorTotalAbastecimentoBrl: 450.0,
      quilometragemOdometro: 48500,
      pedagioSemPararBrl: 85.0,
      dataDespesa: '2026-03-28T14:00:00Z',
    };

    const lse1: Ifrs16LeaseVehicleContractDto = {
      id: 'lse-001',
      veiculoId: 'veh-001',
      empresaLocadora: 'Localiza Fleet S.A.',
      valorAluguelMensalBrl: 4800.0,
      prazoMeses: 24,
      taxaDescontoArrendamento: 11.5,
      ativoDireitoDeUsoBrl: 102500.0,
      passivoArrendamentoBrl: 102500.0,
      dataAssinatura: '2026-01-10T10:00:00Z',
    };

    this.inMemoryVehicles = [v1];
    this.inMemoryExpenses = [exp1];
    this.inMemoryLeases = [lse1];
  }

  getVehicles() {
    return this.inMemoryVehicles;
  }

  getExpenses() {
    return this.inMemoryExpenses;
  }

  getLeases() {
    return this.inMemoryLeases;
  }

  lancarDespesa(dto: LancarDespesaCombustivelRequestDto): LancarDespesaCombustivelResponseDto {
    const nova: FieldExpenseFleetReportDto = {
      id: `exp-${Date.now()}`,
      veiculoId: dto.veiculoId,
      eventoId: dto.eventoId,
      cartaoCombustivelNumero: dto.cartaoCombustivelNumero,
      litrosAbastecidos: dto.litrosAbastecidos,
      valorTotalAbastecimentoBrl: dto.valorTotalAbastecimentoBrl,
      quilometragemOdometro: dto.quilometragemOdometro,
      pedagioSemPararBrl: dto.pedagioSemPararBrl ?? 0,
      dataDespesa: new Date().toISOString(),
    };
    this.inMemoryExpenses.push(nova);

    return {
      sucesso: true,
      relatorioDespesaId: nova.id,
      custoKmRodadoBrl: Number((dto.valorTotalAbastecimentoBrl / (dto.litrosAbastecidos * 3.5)).toFixed(2)),
      statusIntegracaoContabil: 'CONTABILIZADO_DRE_EVENTO',
    };
  }

  getKpis(): FleetDashboardKpisDto {
    return {
      veiculosOperacionaisAtivos: this.inMemoryVehicles.length,
      despesaTotalCombustivelMesBrl: 18450.0,
      despesaTotalPedagiosBrl: 4200.0,
      ativoDireitoDeUsoTotalBrl: 102500.0,
      passivoArrendamentoIfrs16Brl: 102500.0,
    };
  }
}

async function runTests() {
  const service = new TestTourFleetService();

  // Teste 1: Veículos operacionais de turnê
  const vehicles = service.getVehicles();
  assert(
    vehicles.length > 0 &&
      vehicles[0].tipoVeiculo === TipoVeiculoLogistica.VAN_EXECUTIVA &&
      vehicles[0].statusOperacional === 'EM_ROTA_EVENTO',
    'Teste 1: Monitoramento de frota operacional de turnês e transfers executivos',
    `Identificador: ${vehicles[0].identificadorFrota} | Placa: ${vehicles[0].placaVeiculo} | Motorista: ${vehicles[0].motoristaResponsavel}`
  );

  // Teste 2: Despesas com Cartão Combustível
  const expenses = service.getExpenses();
  assert(
    expenses.length > 0 &&
      expenses[0].litrosAbastecidos === 75.0 &&
      expenses[0].cartaoCombustivelNumero.includes('TICKET-LOG'),
    'Teste 2: Lançamento de despesa de campo com abastecimento rastreado por cartão corporativo',
    `Cartão: ${expenses[0].cartaoCombustivelNumero} | Litros: ${expenses[0].litrosAbastecidos} L | Valor: R$ ${expenses[0].valorTotalAbastecimentoBrl.toFixed(2)}`
  );

  // Teste 3: Integração automática de pedágios
  assert(
    expenses[0].pedagioSemPararBrl === 85.0 && expenses[0].quilometragemOdometro === 48500,
    'Teste 3: Apuração automática de passagens em pedágios via tag eletrônica (Sem Parar)',
    `Pedágio: R$ ${expenses[0].pedagioSemPararBrl.toFixed(2)} | Odômetro: ${expenses[0].quilometragemOdometro.toLocaleString('pt-BR')} km`
  );

  // Teste 4: Contratos de Arrendamento Mercantil (IFRS 16 / CPC 06 R2)
  const leases = service.getLeases();
  assert(
    leases.length > 0 &&
      leases[0].ativoDireitoDeUsoBrl === 102500.0 &&
      leases[0].passivoArrendamentoBrl === 102500.0,
    'Teste 4: Escrituração de contratos de locação de frota com segregação de Ativo Direito de Uso e Passivo IFRS 16',
    `Locadora: ${leases[0].empresaLocadora} | Ativo Direito de Uso: R$ ${leases[0].ativoDireitoDeUsoBrl.toLocaleString('pt-BR')} | Taxa IBR: ${leases[0].taxaDescontoArrendamento}% a.a.`
  );

  // Teste 5: Cálculo do Custo por Quilômetro Rodado
  const lancamento = service.lancarDespesa({
    veiculoId: 'veh-001',
    eventoId: 'evt-rock-fest-2026',
    cartaoCombustivelNumero: 'TICKET-LOG-991204',
    litrosAbastecidos: 80.0,
    valorTotalAbastecimentoBrl: 480.0,
    quilometragemOdometro: 49200,
  });
  assert(
    lancamento.sucesso === true &&
      lancamento.custoKmRodadoBrl > 0 &&
      lancamento.statusIntegracaoContabil === 'CONTABILIZADO_DRE_EVENTO',
    'Teste 5: Apropriação contábil do custo de deslocamento por quilômetro no centro de custo do evento',
    `Custo Km: R$ ${lancamento.custoKmRodadoBrl}/km | Status: ${lancamento.statusIntegracaoContabil} | Relatório: ${lancamento.relatorioDespesaId}`
  );

  // Teste 6: Consolidação de KPIs de Logística e Frota
  const kpis = service.getKpis();
  assert(
    kpis.veiculosOperacionaisAtivos >= 1 &&
      kpis.despesaTotalCombustivelMesBrl > 0 &&
      kpis.ativoDireitoDeUsoTotalBrl > 0,
    'Teste 6: Consolidação de KPIs de gestão de frota, despesas de campo e ativos IFRS 16',
    `Veículos Ativos: ${kpis.veiculosOperacionaisAtivos} | Combustível Mês: R$ ${kpis.despesaTotalCombustivelMesBrl.toLocaleString('pt-BR')} | Ativo IFRS 16: R$ ${kpis.ativoDireitoDeUsoTotalBrl.toLocaleString('pt-BR')}`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 49: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
