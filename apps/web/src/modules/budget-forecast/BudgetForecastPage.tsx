import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  CategoriaOrcamentaria,
  StatusVarianciaOrcamentaria,
} from '@diskingressos/types';
import type {
  CorporateBudgetDto,
  BudgetLineItemDto,
  ForecastVarianceRecordDto,
  BudgetDashboardKpisDto,
} from '@diskingressos/types';

export const BudgetForecastPage: React.FC = () => {
  const [kpis] = useState<BudgetDashboardKpisDto>({
    orcamentoTotalAnoBrl: 8500000.0,
    executadoAcumuladoBrl: 2450000.0,
    varianciaConsolidadaPercent: -4.2,
    totalLinhasOrcamentarias: 42,
    linhasEmAlertaEstouro: 3,
    economiaProjetadaRollingBrl: 350000.0,
  });

  const [activeTab, setActiveTab] = useState<'budget' | 'forecast' | 'simulator'>('budget');

  const [budgetItems] = useState<BudgetLineItemDto[]>([
    {
      id: 'bli-001',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CAPEX_INFRAESTRUTURA,
      centroCustoCodigo: 'CC-TECH-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 450000.0,
      valorRealizadoBrl: 420000.0,
      varianciaPercentual: -6.67,
      statusVariancia: StatusVarianciaOrcamentaria.SOBRECAPACIDADE_ECONOMIA,
    },
    {
      id: 'bli-002',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CUSTO_TRANSACIONAL_GATEWAYS,
      centroCustoCodigo: 'CC-OPS-GATEWAY',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 180000.0,
      valorRealizadoBrl: 175000.0,
      varianciaPercentual: -2.78,
      statusVariancia: StatusVarianciaOrcamentaria.DENTRO_DA_META,
    },
    {
      id: 'bli-003',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.OPEX_MARKETING_DIGITAL,
      centroCustoCodigo: 'CC-MKT-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 90000.0,
      valorRealizadoBrl: 105000.0,
      varianciaPercentual: 16.67,
      statusVariancia: StatusVarianciaOrcamentaria.ALERTA_ESTOURO,
    },
    {
      id: 'bli-004',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.OPEX_PESSOAL_OPERACAO,
      centroCustoCodigo: 'CC-RH-OP',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 320000.0,
      valorRealizadoBrl: 312000.0,
      varianciaPercentual: -2.5,
      statusVariancia: StatusVarianciaOrcamentaria.DENTRO_DA_META,
    },
  ]);

  const [forecastMonths] = useState([
    { mes: 'Mai/2026', receita: 3200000, opex: 1400000, ebitda: 1800000, margem: 56.25 },
    { mes: 'Jun/2026', receita: 4100000, opex: 1650000, ebitda: 2450000, margem: 59.75 },
    { mes: 'Jul/2026 (Festival)', receita: 5800000, opex: 2100000, ebitda: 3700000, margem: 63.79 },
    { mes: 'Ago/2026', receita: 3900000, opex: 1550000, ebitda: 2350000, margem: 60.25 },
  ]);

  // Simulador de Cenários
  const [simReceita, setSimReceita] = useState<number>(10);
  const [simOpex, setSimOpex] = useState<number>(5);
  const [simResultado, setSimResultado] = useState<{ ebitda: number; margem: number }>({
    ebitda: 2695000,
    margem: 58.4,
  });

  const handleSimular = () => {
    const baseEbitda = 2450000;
    const ganhoReceita = baseEbitda * (simReceita / 100);
    const custoExtra = baseEbitda * 0.45 * (simOpex / 100);
    const novoEbitda = baseEbitda + ganhoReceita - custoExtra;
    setSimResultado({
      ebitda: novoEbitda,
      margem: Number(((novoEbitda / (baseEbitda * 1.5)) * 100).toFixed(1)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              FASE 35 • ROLLING FORECAST & BUDGET VS ACTUAL
            </span>
            <span className="text-xs text-slate-500">Governança IBGC & Lei 6.404/76</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Planejamento Orçamentário & Forecast Preditivo por IA
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Controle de variância orçamentária CAPEX/OPEX, projeções estocásticas rolling a 12 meses e matriz de risco.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Orçamento Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.orcamentoTotalAnoBrl / 1000000).toFixed(2)}M
          </div>
          <span className="text-xs text-slate-500">Aprovado pelo Conselho</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Executado Acumulado</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.executadoAcumuladoBrl / 1000000).toFixed(2)}M
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">28.8% do exercício</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Variância Geral</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {kpis.varianciaConsolidadaPercent}%
          </div>
          <span className="text-xs text-emerald-600 font-medium">Economia sobre orçamento</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Linhas Ativas</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {kpis.totalLinhasOrcamentarias}
          </div>
          <span className="text-xs text-slate-500">Centros de Custo</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Alertas Estouro</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {kpis.linhasEmAlertaEstouro}
          </div>
          <span className="text-xs text-amber-600 font-medium">Desvio &gt; 15%</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Economia Projetada</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            R$ {(kpis.economiaProjetadaRollingBrl / 1000).toFixed(0)}k
          </div>
          <span className="text-xs text-purple-600 font-medium">Rolling 12M</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('budget')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'budget'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Matriz Budget vs. Actual
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'forecast'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Rolling Forecast por IA
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'simulator'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Simulador de Estresse Orçamentário
        </button>
      </div>

      {/* Tab 1: Matriz Budget vs Actual */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Linhas Orçamentárias por Centro de Custo & Desvio Percentual
            </h2>
            <span className="text-xs text-slate-500">Mês de Competência: 2026-04</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Centro de Custo</th>
                  <th className="p-3">Valor Orçado</th>
                  <th className="p-3">Valor Realizado</th>
                  <th className="p-3">Variância</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {budgetItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">
                      {item.categoria}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {item.centroCustoCodigo}
                    </td>
                    <td className="p-3 text-slate-900 dark:text-slate-200">
                      R$ {item.valorOrcadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      R$ {item.valorRealizadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          item.varianciaPercentual <= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {item.varianciaPercentual <= 0 ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        {item.varianciaPercentual > 0 ? `+${item.varianciaPercentual}%` : `${item.varianciaPercentual}%`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          item.statusVariancia === StatusVarianciaOrcamentaria.SOBRECAPACIDADE_ECONOMIA
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.statusVariancia === StatusVarianciaOrcamentaria.DENTRO_DA_META
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {item.statusVariancia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rolling Forecast */}
      {activeTab === 'forecast' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Projeção Estocástica Rolling Forecast (Próximos Meses)
              </h2>
              <p className="text-xs text-slate-500">
                Modelo estocástico ponderado por IA com confiança de 96.8% e sazonalidade de eventos ao vivo.
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-xs font-semibold rounded-full">
              Motor IA Preditivo Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {forecastMonths.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.mes}</div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Receita Proj.:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    R$ {(m.receita / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>OPEX Proj.:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    R$ {(m.opex / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-medium text-emerald-600">EBITDA:</span>
                  <span className="text-sm font-bold text-emerald-600">
                    R$ {(m.ebitda / 1000000).toFixed(2)}M ({m.margem}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Simulador */}
      {activeTab === 'simulator' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Simulador Interativo de Sensibilidade e Estresse Orçamentário
            </h2>
            <p className="text-xs text-slate-500">
              Ajuste choques de demanda ou contingências de despesas para calcular em tempo real o impacto no EBITDA corporativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Variação de Receita de Bilheteria (%)</span>
                  <span className="text-emerald-600 font-bold">{simReceita > 0 ? `+${simReceita}%` : `${simReceita}%`}</span>
                </label>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={simReceita}
                  onChange={(e) => setSimReceita(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Variação de Despesas Operacionais OPEX (%)</span>
                  <span className="text-rose-600 font-bold">{simOpex > 0 ? `+${simOpex}%` : `${simOpex}%`}</span>
                </label>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  value={simOpex}
                  onChange={(e) => setSimOpex(Number(e.target.value))}
                  className="w-full mt-2 accent-rose-600"
                />
              </div>

              <button
                onClick={handleSimular}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                Recalcular Projeção Instantânea
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Resultado Projetado do Cenário
              </span>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  R$ {simResultado.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  Margem EBITDA Projetada: {simResultado.margem}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Cenário sustentável com preservação de alçadas de capital de giro corporativo.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
