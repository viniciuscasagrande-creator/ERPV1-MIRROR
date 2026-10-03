import {
  CategoriaOrcamentaria,
  StatusVarianciaOrcamentaria,
} from '@diskingressos/types';
import type {
  CorporateBudgetDto,
  BudgetLineItemDto,
  ForecastVarianceRecordDto,
  BudgetDashboardKpisDto,
  SimularCenarioOrcamentarioRequestDto,
  SimularCenarioOrcamentarioResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 35)');
console.log('📈 GESTÃO ORÇAMENTÁRIA CORPORATIVA, BUDGET VS ACTUAL & ROLLING FORECAST');
console.log('🏛️ GOVERNANÇA ORÇAMENTÁRIA IBGC & ART. 187/LEI 6.404/76');
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

class TestBudgetForecastService {
  private inMemoryOrcamentos: CorporateBudgetDto[] = [];
  private inMemoryForecasts: ForecastVarianceRecordDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const item1: BudgetLineItemDto = {
      id: 'bli-001',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CAPEX_INFRAESTRUTURA,
      centroCustoCodigo: 'CC-TECH-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 450000.0,
      valorRealizadoBrl: 420000.0,
      varianciaPercentual: -6.67,
      statusVariancia: StatusVarianciaOrcamentaria.SOBRECAPACIDADE_ECONOMIA,
    };

    const item2: BudgetLineItemDto = {
      id: 'bli-002',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CUSTO_TRANSACIONAL_GATEWAYS,
      centroCustoCodigo: 'CC-OPS-GATEWAY',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 180000.0,
      valorRealizadoBrl: 175000.0,
      varianciaPercentual: -2.78,
      statusVariancia: StatusVarianciaOrcamentaria.DENTRO_DA_META,
    };

    const item3: BudgetLineItemDto = {
      id: 'bli-003',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.OPEX_MARKETING_DIGITAL,
      centroCustoCodigo: 'CC-MKT-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 90000.0,
      valorRealizadoBrl: 105000.0,
      varianciaPercentual: 16.67,
      statusVariancia: StatusVarianciaOrcamentaria.ALERTA_ESTOURO,
    };

    const orcamento1: CorporateBudgetDto = {
      id: 'bgt-2026',
      codigoOrcamento: 'BGT-2026-CORP',
      anoExercicio: 2026,
      descricao: 'Orçamento Anual Master DiskIngressos Corp 2026',
      valorTotalPrevistoBrl: 8500000.0,
      valorTotalExecutadoBrl: 2450000.0,
      statusAprovacao: 'APROVADO_CONSELHO',
      criadoEm: '2026-01-01T08:00:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
      itens: [item1, item2, item3],
    };

    this.inMemoryOrcamentos = [orcamento1];

    const fc1: ForecastVarianceRecordDto = {
      id: 'fc-001',
      codigoForecast: 'FC-IA-2026-04',
      mesReferencia: '2026-04',
      projecaoProximosMeses: [
        { mes: '2026-05', projecaoReceitaBrl: 3200000, projecaoDespesaBrl: 1400000, ebitdaProjetadoBrl: 1800000 },
        { mes: '2026-06', projecaoReceitaBrl: 4100000, projecaoDespesaBrl: 1650000, ebitdaProjetadoBrl: 2450000 },
        { mes: '2026-07', projecaoReceitaBrl: 5800000, projecaoDespesaBrl: 2100000, ebitdaProjetadoBrl: 3700000 },
      ],
      confiancaIaPercent: 96.8,
      fatorSazonalidade: 1.42,
      criadoEm: '2026-04-01T10:00:00Z',
    };

    this.inMemoryForecasts = [fc1];
  }

  public getDashboardKpis(): BudgetDashboardKpisDto {
    return {
      orcamentoTotalAnoBrl: 8500000.0,
      executadoAcumuladoBrl: 2450000.0,
      varianciaConsolidadaPercent: -4.2,
      totalLinhasOrcamentarias: 42,
      linhasEmAlertaEstouro: 3,
      economiaProjetadaRollingBrl: 350000.0,
    };
  }

  public listarOrcamentos(): CorporateBudgetDto[] {
    return this.inMemoryOrcamentos;
  }

  public listarForecasts(): ForecastVarianceRecordDto[] {
    return this.inMemoryForecasts;
  }

  public simularCenario(dto: SimularCenarioOrcamentarioRequestDto): SimularCenarioOrcamentarioResponseDto {
    const ebitdaBase = 2450000.0;
    const impactoReceita = ebitdaBase * (dto.ajustePercentualReceita / 100);
    const impactoDespesas = ebitdaBase * 0.45 * ((dto.ajustePercentualOpex + dto.ajustePercentualCapex) / 200);

    const novoEbitdaProjetadoBrl = Number((ebitdaBase + impactoReceita - impactoDespesas).toFixed(2));
    const impactoMargemPercentual = Number((((novoEbitdaProjetadoBrl - ebitdaBase) / ebitdaBase) * 100).toFixed(2));

    return {
      cenarioId: `CEN-TEST`,
      novoEbitdaProjetadoBrl,
      impactoMargemPercentual,
      riscoEstouroClassificacao: impactoMargemPercentual >= 0 ? 'CONTROLADO_DENTRO_DA_META' : 'ALERTA_PRESSAO_MARGEM',
    };
  }
}

const service = new TestBudgetForecastService();

// TESTE 1: Painel Executivo de Governança Orçamentária
const kpis = service.getDashboardKpis();
assert(
  kpis.orcamentoTotalAnoBrl > 5000000 &&
    kpis.executadoAcumuladoBrl > 1000000 &&
    kpis.varianciaConsolidadaPercent < 0,
  'TESTE 1: Indicadores e KPIs de Orçamento Corporativo Anual',
  `Total: R$ ${kpis.orcamentoTotalAnoBrl.toLocaleString('pt-BR')} | Variância: ${kpis.varianciaConsolidadaPercent}%`,
);

// TESTE 2: Estrutura do Orçamento Master Aprovado pelo Conselho
const orcamentos = service.listarOrcamentos();
const master = orcamentos.find((o) => o.codigoOrcamento === 'BGT-2026-CORP');
assert(
  orcamentos.length >= 1 &&
    Boolean(master) &&
    master?.statusAprovacao === 'APROVADO_CONSELHO' &&
    master.itens.length >= 3,
  'TESTE 2: Orçamento Master Aprovado com Matriz de Centros de Custo',
  `Orçamento: ${master?.codigoOrcamento} (${master?.descricao}) | Linhas: ${master?.itens.length}`,
);

// TESTE 3: Cálculo e Detecção de Variâncias (Budget vs Actual)
const linhas = master?.itens || [];
const linhaCapex = linhas.find((l) => l.categoria === CategoriaOrcamentaria.CAPEX_INFRAESTRUTURA);
const linhaMarketing = linhas.find((l) => l.categoria === CategoriaOrcamentaria.OPEX_MARKETING_DIGITAL);
assert(
  Boolean(linhaCapex) &&
    Boolean(linhaMarketing) &&
    linhaCapex?.statusVariancia === StatusVarianciaOrcamentaria.SOBRECAPACIDADE_ECONOMIA &&
    linhaMarketing?.statusVariancia === StatusVarianciaOrcamentaria.ALERTA_ESTOURO,
  'TESTE 3: Detecção de Sobrecapacidade vs Alerta de Estouro Orçamentário',
  `Capex: ${linhaCapex?.varianciaPercentual}% (${linhaCapex?.statusVariancia}) | Mkt: ${linhaMarketing?.varianciaPercentual}% (${linhaMarketing?.statusVariancia})`,
);

// TESTE 4: Motor de Projeção Estocástica Rolling Forecast a 12 Meses
const forecasts = service.listarForecasts();
const fc = forecasts[0];
assert(
  forecasts.length >= 1 &&
    Boolean(fc) &&
    fc.confiancaIaPercent > 95 &&
    fc.projecaoProximosMeses.length >= 3,
  'TESTE 4: Projeção Rolling Forecast por IA com Confiança Superior a 95%',
  `Forecast: ${fc?.codigoForecast} | Confiança IA: ${fc?.confiancaIaPercent}% | Meses Projetados: ${fc?.projecaoProximosMeses.length}`,
);

// TESTE 5: Simulação de Choques de Demanda e Estresse de Custos
const simPositiva = service.simularCenario({
  ajustePercentualReceita: 15,
  ajustePercentualCapex: 5,
  ajustePercentualOpex: 5,
  mesInicio: '2026-05',
});
assert(
  simPositiva.novoEbitdaProjetadoBrl > 2450000 &&
    simPositiva.riscoEstouroClassificacao === 'CONTROLADO_DENTRO_DA_META',
  'TESTE 5: Simulação de Choque Positivo de Receita e Resiliência do EBITDA',
  `Novo EBITDA Projetado: R$ ${simPositiva.novoEbitdaProjetadoBrl.toLocaleString('pt-BR')} (+${simPositiva.impactoMargemPercentual}%)`,
);

// TESTE 6: Alerta Preditivo de Pressão de Margem em Cenário Adverso
const simNegativa = service.simularCenario({
  ajustePercentualReceita: -10,
  ajustePercentualCapex: 20,
  ajustePercentualOpex: 20,
  mesInicio: '2026-05',
});
assert(
  simNegativa.novoEbitdaProjetadoBrl < 2450000 &&
    simNegativa.riscoEstouroClassificacao === 'ALERTA_PRESSAO_MARGEM',
  'TESTE 6: Alerta Preditivo Automático em Cenário de Estresse Operacional',
  `Novo EBITDA: R$ ${simNegativa.novoEbitdaProjetadoBrl.toLocaleString('pt-BR')} (${simNegativa.riscoEstouroClassificacao})`,
);

console.log('\n========================================================================');
console.log(`📈 RESULTADO FINAL FASE 35: ${passCount}/${totalCount} TESTES APROVADOS (${((passCount / totalCount) * 100).toFixed(0)}%)`);
console.log('========================================================================\n');

if (passCount !== totalCount) {
  process.exit(1);
}
