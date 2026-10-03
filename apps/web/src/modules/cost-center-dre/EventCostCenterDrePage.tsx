import React, { useState } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Building2,
  DollarSign,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ArrowRight,
  Clock,
  Hash,
  Scale,
  RefreshCw,
} from 'lucide-react';
import {
  CategoriaEspetaculoCostCenter,
  TipoAtividadeAbc,
  StatusCentroCusto,
} from '@diskingressos/types';
import type {
  EventCostCenterDto,
  CostDriverAllocationDto,
  EventDreStatementDto,
  CostCenterDashboardKpisDto,
  SimularRateioAbcResponseDto,
} from '@diskingressos/types';

export const EventCostCenterDrePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dre' | 'centros' | 'simulador' | 'atividades'>('dre');

  // KPIs
  const [kpis] = useState<CostCenterDashboardKpisDto>({
    totalCentrosCustoAtivos: 18,
    volumeReceitaTotalCentrosBrl: 14250000.0,
    custosDiretosTotaisBrl: 6420000.0,
    custosIndiretosRateadosAbcBrl: 245000.0,
    margemContribuicaoMediaPercent: 53.2,
    lucroLiquidoConsolidadoCentrosBrl: 1542000.0,
  });

  // Centros de Custo
  const [centros] = useState<EventCostCenterDto[]>([
    {
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
    },
    {
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
    },
    {
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
    },
  ]);

  const [selectedCcId, setSelectedCcId] = useState<string>('cc-001');

  // DREs
  const [dres] = useState<Record<string, EventDreStatementDto>>({
    'cc-001': {
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
      auditHashSha256: '9f8e4a7d6b3c2e1f0a5b8c9d4e7f2a1b3c5e8d9a4b7c2e1f0a9b8c7d6e5f4a3b',
      geradoEm: '2026-04-01T11:30:00Z',
    },
    'cc-002': {
      id: 'dre-002',
      centroCustoId: 'cc-002',
      codigoDre: 'DRE-EVT-2026-0043',
      periodoCompetencia: '2026-04',
      receitaBrutaBilheteriaBrl: 3200000.0,
      impostosDeducoesBrl: 339200.0,
      receitaLiquidaBilheteriaBrl: 2860800.0,
      custosDiretosEspetaculoBrl: 1420000.0,
      margemContribuicaoBrl: 1440800.0,
      custosIndiretosAbcBrl: 18450.0,
      resultadoOperacionalEbitdaBrl: 1422350.0,
      repasseLiquidoProdutorBrl: 1100000.0,
      lucroLiquidoPlataformaBrl: 322350.0,
      margemLiquidaPercent: 10.07,
      auditHashSha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      geradoEm: '2026-04-01T11:45:00Z',
    },
    'cc-003': {
      id: 'dre-003',
      centroCustoId: 'cc-003',
      codigoDre: 'DRE-EVT-2026-0044',
      periodoCompetencia: '2026-04',
      receitaBrutaBilheteriaBrl: 950000.0,
      impostosDeducoesBrl: 100700.0,
      receitaLiquidaBilheteriaBrl: 849300.0,
      custosDiretosEspetaculoBrl: 380000.0,
      margemContribuicaoBrl: 469300.0,
      custosIndiretosAbcBrl: 8200.0,
      resultadoOperacionalEbitdaBrl: 461100.0,
      repasseLiquidoProdutorBrl: 360000.0,
      lucroLiquidoPlataformaBrl: 101100.0,
      margemLiquidaPercent: 10.64,
      auditHashSha256: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      geradoEm: '2026-04-01T11:50:00Z',
    },
  });

  // Alocações ABC
  const [alocacoes] = useState<CostDriverAllocationDto[]>([
    {
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
    },
    {
      id: 'rat-002',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0082',
      nomeAtividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
      direcionadorCustoNome: 'HORAS_HOMEM_ATENDIMENTO_VIP',
      quantidadeConsumida: 120,
      custoUnitarioBrl: 75.0,
      custoTotalAlocadoBrl: 9000.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:05:00Z',
    },
    {
      id: 'rat-003',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0083',
      nomeAtividade: TipoAtividadeAbc.SEGURANCA_ANTIFRAUDE,
      direcionadorCustoNome: 'VERIFICACOES_BIOMETRICAS_SENTINEL',
      quantidadeConsumida: 24800,
      custoUnitarioBrl: 0.18,
      custoTotalAlocadoBrl: 4464.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:10:00Z',
    },
  ]);

  // Simulador
  const [simHorasSac, setSimHorasSac] = useState<number>(150);
  const [simTransacoes, setSimTransacoes] = useState<number>(45000);
  const [simCpuHoras, setSimCpuHoras] = useState<number>(240);
  const [simResult, setSimResult] = useState<SimularRateioAbcResponseDto | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimularRateio = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const custoHoraSuporte = 75.0;
      const custoPorTransacao = 0.42;
      const custoHoraCpu = 1.85;

      const totalSuporte = Number((simHorasSac * custoHoraSuporte).toFixed(2));
      const totalTransacoes = Number((simTransacoes * custoPorTransacao).toFixed(2));
      const totalCloud = Number((simCpuHoras * custoHoraCpu).toFixed(2));
      const totalRateado = Number((totalSuporte + totalTransacoes + totalCloud).toFixed(2));

      const dreAtual = dres[selectedCcId] || dres['cc-001'];
      const novaMargemContribuicao = Number((dreAtual.receitaLiquidaBilheteriaBrl - dreAtual.custosDiretosEspetaculoBrl).toFixed(2));
      const novoLucroLiquido = Number((novaMargemContribuicao - totalRateado - dreAtual.repasseLiquidoProdutorBrl).toFixed(2));
      const novaMargemPercent = Number(((novoLucroLiquido / dreAtual.receitaLiquidaBilheteriaBrl) * 100).toFixed(2));

      setSimResult({
        centroCustoId: selectedCcId,
        codigoRateio: `RAT-ABC-SIM-${Date.now().toString().slice(-4)}`,
        custoTotalRateadoBrl: totalRateado,
        detalhesAtividades: [
          {
            atividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
            direcionador: 'HORAS_HOMEM_SAC',
            quantidade: simHorasSac,
            custoUnitarioBrl: custoHoraSuporte,
            totalAlocadoBrl: totalSuporte,
          },
          {
            atividade: TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL,
            direcionador: 'TRANSACOES_GATEWAY',
            quantidade: simTransacoes,
            custoUnitarioBrl: custoPorTransacao,
            totalAlocadoBrl: totalTransacoes,
          },
          {
            atividade: TipoAtividadeAbc.INFRAESTRUTURA_PLATAFORMA,
            direcionador: 'HORAS_CPU_RAM_K8S',
            quantidade: simCpuHoras,
            custoUnitarioBrl: custoHoraCpu,
            totalAlocadoBrl: totalCloud,
          },
        ],
        dreImpactada: {
          receitaLiquidaBrl: dreAtual.receitaLiquidaBilheteriaBrl,
          novaMargemContribuicaoBrl: novaMargemContribuicao,
          novoLucroLiquidoBrl: novoLucroLiquido,
          novaMargemLiquidaPercent: novaMargemPercent,
        },
      });
      setIsSimulating(false);
    }, 350);
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const activeDre = dres[selectedCcId] || dres['cc-001'];
  const activeCc = centros.find((c) => c.id === selectedCcId) || centros[0];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-700/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Art. 187 Lei 6.404/76 & NBC TG 26 (CPC 26)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Custeio ABC Matricial Ativo
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <PieChart className="w-8 h-8 text-emerald-400" />
              DRE & Balancete por Centro de Custo de Evento
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Demonstração analítica do resultado em tempo real por espetáculo, turnê e festival com alocação matricial de custos indiretos (Activity-Based Costing), apuração da margem de contribuição e conciliação de repasse fiduciário.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('simulador')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Simular Rateio ABC
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Centros de Custo Ativos</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{kpis.totalCentrosCustoAtivos} Eventos</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% conciliados no razão</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Receita Bruta Bilheteria</span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-300">
              {formatCurrency(kpis.volumeReceitaTotalCentrosBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Custos diretos: {formatCurrency(kpis.custosDiretosTotaisBrl)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Rateio Indireto ABC</span>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-300">
              {formatCurrency(kpis.custosIndiretosRateadosAbcBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-400/80">
              <Scale className="w-3.5 h-3.5" />
              <span>Nuvem, SAC e Antifraude</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Margem Média Contribuição</span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-300">{kpis.margemContribuicaoMediaPercent}%</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400/80">
              <span>Lucro líquido: {formatCurrency(kpis.lucroLiquidoConsolidadoCentrosBrl)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Centro de Custo */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-slate-400">Centro de Custo Ativo:</span>
          <select
            value={selectedCcId}
            onChange={(e) => setSelectedCcId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
          >
            {centros.map((cc) => (
              <option key={cc.id} value={cc.id}>
                {cc.codigoCentroCusto} — {cc.nomeCentroCusto} ({cc.categoriaEspetaculo})
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs font-mono text-emerald-400">
          Status: {activeCc.statusCentroCusto} | Saldo: {formatCurrency(activeCc.saldoAtualContabilBrl)}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dre')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'dre'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          DRE Gerencial do Evento
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4" />
          Simulador de Rateio ABC
        </button>
        <button
          onClick={() => setActiveTab('centros')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'centros'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Centros de Custo & Balancete ({centros.length})
        </button>
        <button
          onClick={() => setActiveTab('atividades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'atividades'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          Matriz de Alocações ABC ({alocacoes.length})
        </button>
      </div>

      {/* TAB 1: DRE Gerencial por Evento */}
      {activeTab === 'dre' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {activeDre.codigoDre}
                </span>
                <span className="text-xs text-slate-400">Competência: {activeDre.periodoCompetencia}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeCc.nomeCentroCusto}</h2>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-mono text-slate-400">HASH DE AUDITORIA FORENSE SHA-256</div>
              <div className="text-xs font-mono text-emerald-400 truncate max-w-sm">
                {activeDre.auditHashSha256}
              </div>
            </div>
          </div>

          {/* Linhas da DRE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Linha da Demonstração de Resultado (Art. 187)</th>
                  <th className="py-3 px-4 text-right">Valor Contábil (R$)</th>
                  <th className="py-3 px-4 text-right">Análise Vertical (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {/* 1. Receita Bruta */}
                <tr className="bg-slate-800/20">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span>(+) RECEITA BRUTA DE BILHETERIA</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    {formatCurrency(activeDre.receitaBrutaBilheteriaBrl)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-300">100.0%</td>
                </tr>

                {/* 2. Deduções Tributárias */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-400 pl-8">
                    (-) Deduções Tributárias (CBS 3.52% + IBS 7.08% / Eventos)
                  </td>
                  <td className="py-2.5 px-4 text-right text-rose-400">
                    - {formatCurrency(activeDre.impostosDeducoesBrl)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {((activeDre.impostosDeducoesBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 3. Receita Líquida */}
                <tr className="bg-slate-800/40 font-semibold text-white">
                  <td className="py-3 px-4">(=) RECEITA LÍQUIDA DE BILHETERIA</td>
                  <td className="py-3 px-4 text-right text-blue-300">
                    {formatCurrency(activeDre.receitaLiquidaBilheteriaBrl)}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-300">
                    {((activeDre.receitaLiquidaBilheteriaBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 4. Custos Diretos */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-400 pl-8">
                    (-) Custos Diretos Operacionais (Rider, Arena, Estrutura, Geradores)
                  </td>
                  <td className="py-2.5 px-4 text-right text-rose-400">
                    - {formatCurrency(activeDre.custosDiretosEspetaculoBrl)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {((activeDre.custosDiretosEspetaculoBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 5. Margem de Contribuição */}
                <tr className="bg-emerald-950/20 font-bold text-emerald-300">
                  <td className="py-3 px-4">(=) MARGEM DE CONTRIBUIÇÃO DIRETA DO EVENTO</td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {formatCurrency(activeDre.margemContribuicaoBrl)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {((activeDre.margemContribuicaoBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 6. Custos Indiretos ABC */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-400 pl-8">
                    (-) Custos Indiretos Corporativos Rateados via Custeio ABC (Nuvem, SAC, Antifraude)
                  </td>
                  <td className="py-2.5 px-4 text-right text-purple-400">
                    - {formatCurrency(activeDre.custosIndiretosAbcBrl)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {((activeDre.custosIndiretosAbcBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(2)}%
                  </td>
                </tr>

                {/* 7. EBITDA */}
                <tr className="bg-slate-800/30 font-semibold text-white">
                  <td className="py-3 px-4">(=) RESULTADO OPERACIONAL DO EVENTO (EBITDA)</td>
                  <td className="py-3 px-4 text-right text-indigo-300">
                    {formatCurrency(activeDre.resultadoOperacionalEbitdaBrl)}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-300">
                    {((activeDre.resultadoOperacionalEbitdaBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 8. Repasse Fiduciário do Produtor */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-400 pl-8">
                    (-) Repasse Fiduciário Líquido ao Produtor Homologado
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">
                    - {formatCurrency(activeDre.repasseLiquidoProdutorBrl)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400">
                    {((activeDre.repasseLiquidoProdutorBrl / activeDre.receitaBrutaBilheteriaBrl) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 9. Lucro Líquido da Plataforma */}
                <tr className="bg-emerald-950/40 border-t-2 border-emerald-600 font-extrabold text-white text-sm">
                  <td className="py-3.5 px-4 text-emerald-300">(=) RESULTADO LÍQUIDO DISKINGRESSOS NO EVENTO</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 text-base">
                    {formatCurrency(activeDre.lucroLiquidoPlataformaBrl)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 text-base">
                    {activeDre.margemLiquidaPercent}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Simulador de Rateio ABC */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Direcionadores de Consumo de Recursos
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste os direcionadores de custo ABC para simular a alocação de despesas indiretas no centro de custo.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Horas de Atendimento Especializado SAC (R$ 75,00/h)
                </label>
                <input
                  type="number"
                  value={simHorasSac}
                  onChange={(e) => setSimHorasSac(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Transações em Gateway / Checkout (R$ 0,42/tx)
                </label>
                <input
                  type="number"
                  value={simTransacoes}
                  onChange={(e) => setSimTransacoes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consumo de Infraestrutura Nuvem Kubernetes (R$ 1,85/h CPU)
                </label>
                <input
                  type="number"
                  value={simCpuHoras}
                  onChange={(e) => setSimCpuHoras(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSimularRateio}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200"
                >
                  {isSimulating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isSimulating ? 'Calculando Rateio...' : 'Calcular Alocação Matricial ABC'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Demonstrativo de Impacto Contábil na DRE
              </h2>
              <p className="text-xs text-slate-400">
                Resultado apurado com base no consumo efetivo de atividades corporativas pelo espetáculo.
              </p>
            </div>

            {simResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Custo Total Rateado ABC</div>
                    <div className="text-xl font-bold text-purple-400 mt-1">
                      {formatCurrency(simResult.custoTotalRateadoBrl)}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Novo Lucro Líquido Plataforma</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {formatCurrency(simResult.dreImpactada.novoLucroLiquidoBrl)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Margem líquida pós-rateio: {simResult.dreImpactada.novaMargemLiquidaPercent}%
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 rounded-xl border border-slate-700/60 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Detalhamento por Atividade (Activity-Based Costing)
                  </div>
                  <div className="space-y-2">
                    {simResult.detalhesAtividades.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded bg-slate-900/60 border border-slate-800"
                      >
                        <div>
                          <div className="font-semibold text-white">{d.atividade}</div>
                          <div className="text-[11px] text-slate-400">
                            {d.quantidade} unid. x {formatCurrency(d.custoUnitarioBrl)}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-purple-300">
                          {formatCurrency(d.totalAlocadoBrl)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Alocação em conformidade com o Pronunciamento Técnico CPC 26 e Princípio da Competência.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <PieChart className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">
                  Preencha os dados dos direcionadores e clique em "Calcular Alocação Matricial ABC".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Centros de Custo */}
      {activeTab === 'centros' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Estrutura de Centros de Custo por Evento</h2>
            <p className="text-xs text-slate-400">
              Mapeamento de cada evento no Plano de Contas com segregação de saldos e controle contábil.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Código Centro Custo</th>
                  <th className="py-3 px-4">Nome do Evento / Espetáculo</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Saldo Contábil</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {centros.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{c.codigoCentroCusto}</td>
                    <td className="py-3 px-4 font-sans text-slate-200">{c.nomeCentroCusto}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                        {c.categoriaEspetaculo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCurrency(c.saldoAtualContabilBrl)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {c.statusCentroCusto}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <button
                        onClick={() => {
                          setSelectedCcId(c.id);
                          setActiveTab('dre');
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                      >
                        Abrir DRE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Matriz de Alocações ABC */}
      {activeTab === 'atividades' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Catálogo de Atividades e Direcionadores de Custo (ABC)</h2>
            <p className="text-xs text-slate-400">
              Mapeamento de custos corporativos indiretos absorvidos proporcionalmente pelo volume de cada espetáculo.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Código Rateio</th>
                  <th className="py-3 px-4">Atividade Corporativa</th>
                  <th className="py-3 px-4">Direcionador de Custo</th>
                  <th className="py-3 px-4">Qtd Consumida</th>
                  <th className="py-3 px-4">Custo Unitário</th>
                  <th className="py-3 px-4">Total Alocado</th>
                  <th className="py-3 px-4">Competência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {alocacoes.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{a.codigoRateio}</td>
                    <td className="py-3 px-4 font-sans text-slate-200">{a.nomeAtividade}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{a.direcionadorCustoNome}</td>
                    <td className="py-3 px-4 text-slate-300">{a.quantidadeConsumida.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4 text-slate-300">{formatCurrency(a.custoUnitarioBrl)}</td>
                    <td className="py-3 px-4 font-bold text-purple-400">
                      {formatCurrency(a.custoTotalAlocadoBrl)}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{a.mesCompetencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
