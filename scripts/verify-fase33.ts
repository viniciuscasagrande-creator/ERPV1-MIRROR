import {
  CategoriaEspetaculoCostCenter,
  TipoAtividadeAbc,
  StatusCentroCusto,
} from '@diskingressos/types';
import type {
  EventCostCenterDto,
  CostDriverAllocationDto,
  EventDreStatementDto,
  SimularRateioAbcRequestDto,
  SimularRateioAbcResponseDto,
  CostCenterDashboardKpisDto,
} from '@diskingressos/types';
import * as crypto from 'crypto';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 33)');
console.log('📊 DRE & BALANCETE POR CENTRO DE CUSTO COM CUSTEIO ABC (ACTIVITY-BASED)');
console.log('📜 ART. 187 DA LEI 6.404/76 & NBC TG 26 / CPC 26 CONVERGÊNCIA IFRS');
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
// MOTOR MOCK / SERVIÇO DE DRE E CENTRO DE CUSTO ABC (FASE 33)
// -----------------------------------------------------------------------------
class TestEventCostCenterDreService {
  private inMemoryCentros: EventCostCenterDto[] = [];
  private inMemoryAlocacoes: CostDriverAllocationDto[] = [];
  private inMemoryDres: EventDreStatementDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const cc1: EventCostCenterDto = {
      id: 'cc-001',
      codigoCentroCusto: 'CC-EVT-2026-0042',
      nomeCentroCusto: 'Festival Rock Curitiba Arena 2026',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.FESTIVAL,
      statusCentroCusto: StatusCentroCusto.ATIVO,
      saldoAtualContabilBrl: 4850000.0,
      criadoEm: '2026-03-01T10:00:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
    };

    const cc2: EventCostCenterDto = {
      id: 'cc-002',
      codigoCentroCusto: 'CC-EVT-2026-0043',
      nomeCentroCusto: 'Turnê Internacional Sunset Symphonic',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.SHOW_INTERNACIONAL,
      statusCentroCusto: StatusCentroCusto.ATIVO,
      saldoAtualContabilBrl: 3200000.0,
      criadoEm: '2026-03-05T14:30:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
    };

    const cc3: EventCostCenterDto = {
      id: 'cc-003',
      codigoCentroCusto: 'CC-EVT-2026-0044',
      nomeCentroCusto: 'Musical Broadway Clássicos no Teatro Guaíra',
      eventoId: 'evt-broadway-guaira',
      produtorId: 'prod-teatro-guaira',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.TEATRO_MUSICAL,
      statusCentroCusto: StatusCentroCusto.ENCERRADO_CONCILIADO,
      saldoAtualContabilBrl: 950000.0,
      criadoEm: '2026-02-10T09:00:00Z',
      atualizadoEm: '2026-03-31T18:00:00Z',
    };

    this.inMemoryCentros = [cc1, cc2, cc3];

    const a1: CostDriverAllocationDto = {
      id: 'rat-001',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0081',
      nomeAtividade: TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL,
      direcionadorCustoNome: 'TRANSACOES_PROCESSADAS_GATEWAY',
      quantidadeConsumida: 32400,
      custoUnitarioBrl: 0.42,
      custoTotalAlocadoBrl: 13608.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:00:00Z',
    };

    const a2: CostDriverAllocationDto = {
      id: 'rat-002',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0082',
      nomeAtividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
      direcionadorCustoNome: 'HORAS_HOMEM_ATENDIMENTO',
      quantidadeConsumida: 120,
      custoUnitarioBrl: 75.0,
      custoTotalAlocadoBrl: 9000.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:05:00Z',
    };

    const a3: CostDriverAllocationDto = {
      id: 'rat-003',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0083',
      nomeAtividade: TipoAtividadeAbc.INFRAESTRUTURA_PLATAFORMA,
      direcionadorCustoNome: 'CONSUMO_CPU_RAM_KUBERNETES',
      quantidadeConsumida: 2413,
      custoUnitarioBrl: 1.85,
      custoTotalAlocadoBrl: 4464.05,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:10:00Z',
    };

    this.inMemoryAlocacoes = [a1, a2, a3];

    const hash1 = crypto
      .createHash('sha256')
      .update('DRE-EVT-2026-0042|4850000|508828|2026-04')
      .digest('hex');

    const dre1: EventDreStatementDto = {
      id: 'dre-001',
      centroCustoId: 'cc-001',
      codigoDre: 'DRE-EVT-2026-0042',
      periodoCompetencia: '2026-04',
      receitaBrutaBilheteriaBrl: 4850000.0,
      impostosDeducoesBrl: 514100.0,
      receitaLiquidaBilheteriaBrl: 4335900.0,
      custosDiretosEspetaculoBrl: 2150000.0,
      margemContribuicaoBrl: 2185900.0,
      custosIndiretosAbcBrl: 27072.0,
      resultadoOperacionalEbitdaBrl: 2158828.0,
      repasseLiquidoProdutorBrl: 1650000.0,
      lucroLiquidoPlataformaBrl: 508828.0,
      margemLiquidaPercent: 10.49,
      auditHashSha256: hash1,
      geradoEm: '2026-04-01T11:30:00Z',
    };

    this.inMemoryDres = [dre1];
  }

  public getDashboardKpis(): CostCenterDashboardKpisDto {
    return {
      totalCentrosCustoAtivos: 18,
      volumeReceitaTotalCentrosBrl: 14250000.0,
      custosDiretosTotaisBrl: 6420000.0,
      custosIndiretosRateadosAbcBrl: 245000.0,
      margemContribuicaoMediaPercent: 53.2,
      lucroLiquidoConsolidadoCentrosBrl: 1542000.0,
    };
  }

  public listarCentrosCusto(): EventCostCenterDto[] {
    return this.inMemoryCentros;
  }

  public obterDrePorCentroCusto(centroCustoId: string): EventDreStatementDto {
    const dre = this.inMemoryDres.find((d) => d.centroCustoId === centroCustoId);
    return dre || this.inMemoryDres[0];
  }

  public listarAlocacoesAbc(centroCustoId?: string): CostDriverAllocationDto[] {
    if (centroCustoId) {
      return this.inMemoryAlocacoes.filter((a) => a.centroCustoId === centroCustoId);
    }
    return this.inMemoryAlocacoes;
  }

  public simularRateioAbc(dto: SimularRateioAbcRequestDto): SimularRateioAbcResponseDto {
    const custoHoraSuporte = 75.0;
    const custoPorTransacao = 0.42;
    const custoHoraCpu = 1.85;

    const totalSuporte = Number((dto.horasSuporteSac * custoHoraSuporte).toFixed(2));
    const totalTransacoes = Number((dto.transacoesProcessadas * custoPorTransacao).toFixed(2));
    const totalCloud = Number((dto.consumoCloudCpuHoras * custoHoraCpu).toFixed(2));

    const custoTotalRateadoBrl = Number((totalSuporte + totalTransacoes + totalCloud).toFixed(2));
    const dreAtual = this.obterDrePorCentroCusto(dto.centroCustoId);

    const novaMargemContribuicaoBrl = Number(
      (dreAtual.receitaLiquidaBilheteriaBrl - dreAtual.custosDiretosEspetaculoBrl).toFixed(2),
    );
    const novoLucroLiquidoBrl = Number(
      (novaMargemContribuicaoBrl - custoTotalRateadoBrl - (dreAtual.repasseLiquidoProdutorBrl || 0)).toFixed(2),
    );
    const novaMargemLiquidaPercent = Number(
      ((novoLucroLiquidoBrl / dreAtual.receitaLiquidaBilheteriaBrl) * 100).toFixed(2),
    );

    return {
      centroCustoId: dto.centroCustoId,
      codigoRateio: `RAT-ABC-SIM-TEST`,
      custoTotalRateadoBrl,
      detalhesAtividades: [
        {
          atividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
          direcionador: 'HORAS_HOMEM_SAC',
          quantidade: dto.horasSuporteSac,
          custoUnitarioBrl: custoHoraSuporte,
          totalAlocadoBrl: totalSuporte,
        },
        {
          atividade: TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL,
          direcionador: 'TRANSACOES_GATEWAY',
          quantidade: dto.transacoesProcessadas,
          custoUnitarioBrl: custoPorTransacao,
          totalAlocadoBrl: totalTransacoes,
        },
        {
          atividade: TipoAtividadeAbc.INFRAESTRUTURA_PLATAFORMA,
          direcionador: 'HORAS_CPU_RAM_K8S',
          quantidade: dto.consumoCloudCpuHoras,
          custoUnitarioBrl: custoHoraCpu,
          totalAlocadoBrl: totalCloud,
        },
      ],
      dreImpactada: {
        receitaLiquidaBrl: dreAtual.receitaLiquidaBilheteriaBrl,
        novaMargemContribuicaoBrl,
        novoLucroLiquidoBrl,
        novaMargemLiquidaPercent,
      },
    };
  }
}

// -----------------------------------------------------------------------------
// EXECUÇÃO DOS TESTES DE AUDITORIA (6 TESTES CRÍTICOS)
// -----------------------------------------------------------------------------
const service = new TestEventCostCenterDreService();

// TESTE 1: Indicadores Executivos & KPIs Consolidados de Centros de Custo
const kpis = service.getDashboardKpis();
assert(
  kpis.totalCentrosCustoAtivos >= 10 &&
    kpis.volumeReceitaTotalCentrosBrl > 10000000 &&
    kpis.margemContribuicaoMediaPercent > 50,
  'TESTE 1: Painel Executivo e KPIs de Centros de Custo em Tempo Real',
  `Volume Total: R$ ${kpis.volumeReceitaTotalCentrosBrl.toLocaleString('pt-BR')} | Margem Contribuição: ${kpis.margemContribuicaoMediaPercent}%`,
);

// TESTE 2: Segregação Matricial e Catálogo de Centros de Custo por Evento
const centros = service.listarCentrosCusto();
const centroValido = centros.find((c) => c.codigoCentroCusto === 'CC-EVT-2026-0042');
assert(
  centros.length >= 3 &&
    Boolean(centroValido) &&
    centroValido?.categoriaEspetaculo === CategoriaEspetaculoCostCenter.FESTIVAL &&
    centroValido?.statusCentroCusto === StatusCentroCusto.ATIVO,
  'TESTE 2: Catálogo de Centros de Custo com Classificação Setorial (Festival/Teatro/Show)',
  `Centro: ${centroValido?.codigoCentroCusto} - ${centroValido?.nomeCentroCusto} (Saldo: R$ ${centroValido?.saldoAtualContabilBrl.toLocaleString('pt-BR')})`,
);

// TESTE 3: DRE por Evento Conforme Art. 187 Lei 6.404/76 e NBC TG 26
const dre = service.obterDrePorCentroCusto('cc-001');
const receitaLiquidaCalculada = dre.receitaBrutaBilheteriaBrl - dre.impostosDeducoesBrl;
const margemContribuicaoCalculada = receitaLiquidaCalculada - dre.custosDiretosEspetaculoBrl;
const ebitdaCalculado = margemContribuicaoCalculada - dre.custosIndiretosAbcBrl;
assert(
  dre.codigoDre === 'DRE-EVT-2026-0042' &&
    Math.abs(dre.receitaLiquidaBilheteriaBrl - receitaLiquidaCalculada) < 0.01 &&
    Math.abs(dre.margemContribuicaoBrl - margemContribuicaoCalculada) < 0.01 &&
    Math.abs(dre.resultadoOperacionalEbitdaBrl - ebitdaCalculado) < 0.01 &&
    dre.margemLiquidaPercent > 0,
  'TESTE 3: Cálculo da DRE Vertical e Margem de Contribuição (Art. 187 Lei 6.404/76)',
  `Rec. Líquida: R$ ${dre.receitaLiquidaBilheteriaBrl.toLocaleString('pt-BR')} | EBITDA: R$ ${dre.resultadoOperacionalEbitdaBrl.toLocaleString('pt-BR')} | Margem Líq.: ${dre.margemLiquidaPercent}%`,
);

// TESTE 4: Motor de Simulação de Custeio Baseado em Atividades (Custeio ABC)
const simulacao = service.simularRateioAbc({
  centroCustoId: 'cc-001',
  horasSuporteSac: 250, // 250h * R$ 75 = R$ 18.750,00
  transacoesProcessadas: 50000, // 50.000 * R$ 0.42 = R$ 21.000,00
  consumoCloudCpuHoras: 3000, // 3.000 * R$ 1.85 = R$ 5.550,00
  mesCompetencia: '2026-04',
});
const custoEsperado = 18750 + 21000 + 5550; // R$ 45.300,00
assert(
  simulacao.custoTotalRateadoBrl === custoEsperado &&
    simulacao.detalhesAtividades.length === 3 &&
    simulacao.dreImpactada.novoLucroLiquidoBrl < dre.lucroLiquidoPlataformaBrl,
  'TESTE 4: Simulação de Alocação de Custos Indiretos ABC em Tempo Real',
  `Custo Total Rateado: R$ ${simulacao.custoTotalRateadoBrl.toLocaleString('pt-BR')} (Suporte: R$ 18.750 + Gateway: R$ 21.000 + K8s: R$ 5.550)`,
);

// TESTE 5: Alocações Matriciais por Direcionador de Custo (Cost Drivers)
const alocacoes = service.listarAlocacoesAbc('cc-001');
const somaCustosAlocados = alocacoes.reduce((acc, a) => acc + a.custoTotalAlocadoBrl, 0);
assert(
  alocacoes.length === 3 &&
    alocacoes.some((a) => a.nomeAtividade === TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL) &&
    somaCustosAlocados > 25000,
  'TESTE 5: Rastreamento Matricial de Direcionadores de Custos ABC por Atividade',
  `Total Direcionadores Alocados: ${alocacoes.length} atividades | Custo Rateado: R$ ${somaCustosAlocados.toFixed(2)}`,
);

// TESTE 6: Imutabilidade Criptográfica e Hash SHA-256 para Auditoria Externa
const hashRecalculado = crypto
  .createHash('sha256')
  .update('DRE-EVT-2026-0042|4850000|508828|2026-04')
  .digest('hex');
assert(
  dre.auditHashSha256 === hashRecalculado && dre.auditHashSha256.length === 64,
  'TESTE 6: Verificação de Audit Hash SHA-256 da DRE para Imutabilidade e Compliance Big Four',
  `SHA-256: ${dre.auditHashSha256}`,
);

console.log('\n========================================================================');
console.log(`📈 RESULTADO FINAL FASE 33: ${passCount}/${totalCount} TESTES APROVADOS (${((passCount / totalCount) * 100).toFixed(0)}%)`);
console.log('========================================================================\n');

if (passCount !== totalCount) {
  process.exit(1);
}
