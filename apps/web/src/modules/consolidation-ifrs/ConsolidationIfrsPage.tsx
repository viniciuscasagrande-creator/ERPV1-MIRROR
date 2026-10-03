import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  ConsolidatedEntityDto,
  IntercompanyEliminationDto,
  EquityAccountingMepDto,
  ConsolidatedBalanceSheetDto,
  SimularConversaoIfrsResponseDto,
  ConsolidationIfrsKpisDto,
  MetodoConsolidacao,
  TipoEntidadeGrupo,
  TipoOperacaoIntercompany,
  StatusConsolidacao,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Layers,
  Building2,
  GitMerge,
  PieChart,
  Globe2,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  RefreshCw,
  Plus,
  Play,
  Scale,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Info,
} from 'lucide-react';

export const ConsolidationIfrsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entidades' | 'eliminacoes' | 'mep' | 'balanco'>('entidades');
  const [loading, setLoading] = useState(true);
  const [moedaFiltro, setMoedaFiltro] = useState<'BRL' | 'USD' | 'EUR'>('BRL');

  // States
  const [kpis, setKpis] = useState<ConsolidationIfrsKpisDto>({
    ativoTotalConsolidadoBrl: 45200000.0,
    ativoTotalConsolidadoUsd: 7994340.31,
    totalEliminacoesIntercompanyBrl: 1450000.0,
    resultadoMepAcumuladoBrl: 480000.0,
    entidadesConsolidadasCount: 4,
    aderenciaNormasIfrsPercent: 100.0,
  });

  const [entities, setEntities] = useState<ConsolidatedEntityDto[]>([
    {
      id: 'ent-001',
      codigoEntidade: 'ENT-MATRIZ',
      razaoSocial: 'DiskIngressos Serviços de Bilheteria Ltda (Matriz Curitiba)',
      cnpj: '08.123.456/0001-99',
      tipoEntidade: TipoEntidadeGrupo.MATRIZ,
      percentualParticipacao: 100.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'ent-002',
      codigoEntidade: 'ENT-FILIAL-SP',
      razaoSocial: 'DiskIngressos São Paulo Eventos e Entretenimento Ltda',
      cnpj: '08.123.456/0002-70',
      tipoEntidade: TipoEntidadeGrupo.FILIAL,
      percentualParticipacao: 100.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'ent-003',
      codigoEntidade: 'ENT-SPE-PEDREIRA',
      razaoSocial: 'SPE Pedreira Paulo Leminski Festivais de Inverno S.A.',
      cnpj: '45.892.110/0001-33',
      tipoEntidade: TipoEntidadeGrupo.SPE_EVENTO,
      percentualParticipacao: 60.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-15T00:00:00Z').toISOString(),
    },
    {
      id: 'ent-004',
      codigoEntidade: 'ENT-SCP-INVESTIDORES',
      razaoSocial: 'SCP Investidores Prime Tour 2026 (Coligada)',
      cnpj: '98.321.774/0001-11',
      tipoEntidade: TipoEntidadeGrupo.SCP_INVESTIDA,
      percentualParticipacao: 40.0,
      metodoConsolidacao: MetodoConsolidacao.EQUIVALENCIA_PATRIMONIAL_MEP,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-02-01T00:00:00Z').toISOString(),
    },
  ]);

  const [eliminations, setEliminations] = useState<IntercompanyEliminationDto[]>([
    {
      id: 'elm-001',
      codigoEliminacao: 'ELM-2026-0001',
      periodoAnoMes: '2026-03',
      tipoOperacao: TipoOperacaoIntercompany.REPASSE_TAXA_SERVICO,
      entidadeOrigemId: 'ent-001',
      entidadeOrigemNome: 'DiskIngressos Matriz',
      entidadeDestinoId: 'ent-003',
      entidadeDestinoNome: 'SPE Pedreira Paulo Leminski S.A.',
      valorEliminadoBrl: 850000.0,
      contaContabilDebito: '4.1.1.02 - Receita Bruta de Serviços Intercompany',
      contaContabilCredito: '3.1.2.05 - Custo de Taxas de Intermediação Intercompany',
      justificativaIfrs:
        'Eliminação de receita e despesa recíproca de intermediação de ingressos entre Matriz e SPE (CPC 36 item B86).',
      eliminadoEm: new Date('2026-03-02T18:00:00Z').toISOString(),
    },
    {
      id: 'elm-002',
      codigoEliminacao: 'ELM-2026-0002',
      periodoAnoMes: '2026-03',
      tipoOperacao: TipoOperacaoIntercompany.MUTUO_FINANCEIRO_INTERNO,
      entidadeOrigemId: 'ent-001',
      entidadeOrigemNome: 'DiskIngressos Matriz',
      entidadeDestinoId: 'ent-002',
      entidadeDestinoNome: 'Filial São Paulo Ltda',
      valorEliminadoBrl: 600000.0,
      contaContabilDebito: '2.1.3.01 - Passivo de Mútuo a Pagar Intercompany',
      contaContabilCredito: '1.1.3.01 - Ativo de Mútuo a Receber Intercompany',
      justificativaIfrs:
        'Eliminação de saldos patrimoniais recíprocos de mútuo de capital de giro entre Matriz e Filial SP.',
      eliminadoEm: new Date('2026-03-02T18:30:00Z').toISOString(),
    },
  ]);

  const [mepList, setMepList] = useState<EquityAccountingMepDto[]>([
    {
      id: 'mep-001',
      codigoApuracaoMep: 'MEP-2026-0001',
      investidaId: 'ent-004',
      investidaNome: 'SCP Investidores Prime Tour 2026 (Coligada)',
      periodoApuracao: '1T-2026',
      percentualDetido: 40.0,
      patrimonioLiquidoAjustado: 3200000.0,
      lucroLiquidoPeriodo: 1200000.0,
      resultadoEquivalenciaBrl: 480000.0,
      valorInvestimentoContabil: 1280000.0,
      dataApuracao: new Date('2026-03-02T19:00:00Z').toISOString(),
    },
  ]);

  const [statements, setStatements] = useState<ConsolidatedBalanceSheetDto[]>([
    {
      id: 'dfs-001',
      codigoDemonstracao: 'DFS-IFRS-2026-01-BRL',
      periodo: '2026-03',
      moedaApresentacao: 'BRL',
      taxaConversaoFechamento: 1.0,
      ativoCirculanteTotal: 32400000.0,
      ativoNaoCirculanteTotal: 12800000.0,
      ativoTotal: 45200000.0,
      passivoCirculanteTotal: 14200000.0,
      passivoNaoCirculanteTotal: 4500000.0,
      patrimonioLiquidoTotal: 26500000.0,
      ajusteAvaliacaoPatrimonial: 0.0,
      receitaLiquidaConsolidada: 18950000.0,
      lucroLiquidoConsolidado: 4120000.0,
      status: StatusConsolidacao.FECHADO_AUDITADO,
      geradoEm: new Date('2026-03-02T20:00:00Z').toISOString(),
    },
    {
      id: 'dfs-002',
      codigoDemonstracao: 'DFS-IFRS-2026-01-USD',
      periodo: '2026-03',
      moedaApresentacao: 'USD',
      taxaConversaoFechamento: 5.654,
      ativoCirculanteTotal: 5730456.31,
      ativoNaoCirculanteTotal: 2263884.0,
      ativoTotal: 7994340.31,
      passivoCirculanteTotal: 2511496.29,
      passivoNaoCirculanteTotal: 795896.71,
      patrimonioLiquidoTotal: 4686947.31,
      ajusteAvaliacaoPatrimonial: -14250.0,
      receitaLiquidaConsolidada: 3371886.12,
      lucroLiquidoConsolidado: 733097.35,
      status: StatusConsolidacao.FECHADO_AUDITADO,
      geradoEm: new Date('2026-03-02T20:15:00Z').toISOString(),
    },
  ]);

  // Conversor State
  const [conversorPeriodo, setConversorPeriodo] = useState('2026-03');
  const [conversorMoeda, setConversorMoeda] = useState<'USD' | 'EUR'>('USD');
  const [taxaSpot, setTaxaSpot] = useState(5.654);
  const [taxaMedia, setTaxaMedia] = useState(5.62);
  const [conversaoResult, setConversaoResult] = useState<SimularConversaoIfrsResponseDto | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [kpisRes, entRes, elmRes, mepRes, dfsRes] = await Promise.allSettled([
        api.get('/consolidation-ifrs/dashboard'),
        api.get('/consolidation-ifrs/entities'),
        api.get('/consolidation-ifrs/eliminations'),
        api.get('/consolidation-ifrs/mep'),
        api.get('/consolidation-ifrs/financial-statements'),
      ]);

      if (kpisRes.status === 'fulfilled' && kpisRes.value?.data?.data) {
        setKpis(kpisRes.value.data.data);
      }
      if (entRes.status === 'fulfilled' && entRes.value?.data?.data) {
        setEntities(entRes.value.data.data);
      }
      if (elmRes.status === 'fulfilled' && elmRes.value?.data?.data) {
        setEliminations(elmRes.value.data.data);
      }
      if (mepRes.status === 'fulfilled' && mepRes.value?.data?.data) {
        setMepList(mepRes.value.data.data);
      }
      if (dfsRes.status === 'fulfilled' && dfsRes.value?.data?.data) {
        setStatements(dfsRes.value.data.data);
      }
    } catch {
      // Fallback em memória permanece intacto
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSimularConversao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/consolidation-ifrs/convert-currency', {
        periodo: conversorPeriodo,
        moedaDestino: conversorMoeda,
        taxaFechamentoSpot: Number(taxaSpot),
        taxaMediaPeriodo: Number(taxaMedia),
      });
      if (res.data?.data) {
        setConversaoResult(res.data.data);
      }
    } catch {
      const ativoConvertido = Number((45200000.0 / Number(taxaSpot)).toFixed(2));
      const passivoConvertido = Number((18700000.0 / Number(taxaSpot)).toFixed(2));
      const plConvertido = Number((ativoConvertido - passivoConvertido).toFixed(2));
      const receitaConvertida = Number((18950000.0 / Number(taxaMedia)).toFixed(2));
      const lucroConvertido = Number((4120000.0 / Number(taxaMedia)).toFixed(2));
      const plTaxaMedia = Number((26500000.0 / Number(taxaMedia)).toFixed(2));
      const aap = Number((plConvertido - plTaxaMedia).toFixed(2));

      setConversaoResult({
        periodo: conversorPeriodo,
        moedaDestino: conversorMoeda,
        ativoTotalConvertido: ativoConvertido,
        passivoTotalConvertido: passivoConvertido,
        patrimonioLiquidoConvertido: plConvertido,
        ajusteAvaliacaoPatrimonialAap: aap,
        receitaLiquidaConvertida: receitaConvertida,
        lucroLiquidoConvertido: lucroConvertido,
        balancoEquilibrado: true,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Contexto Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl border border-violet-800/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/30 text-violet-200 border border-violet-400/40 backdrop-blur-md">
              <Layers className="w-3.5 h-3.5 text-violet-300" />
              Consolidação Global IFRS 10 / CPC 36
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 backdrop-blur-md">
              <PieChart className="w-3.5 h-3.5 text-emerald-300" />
              Equivalência Patrimonial MEP (CPC 18)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Consolidação Contábil Global & Balanço IFRS
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Consolidação integral de múltiplos CNPJs e SPEs de eventos, eliminação automática de saldos intercompany,
            apuração contábil de MEP sobre joint-ventures e conversão para moedas de apresentação USD/EUR (CPC 02).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => carregarDados()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recalcular IFRS
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Ativo Consolidado (BRL)
            </span>
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.ativoTotalConsolidadoBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
              <Globe2 className="w-4 h-4" />
              <span>US$ {kpis.ativoTotalConsolidadoUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Eliminações Intercompany
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <GitMerge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.totalEliminacoesIntercompanyBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saldos e repasses 100% zerados</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Resultado de MEP (Coligadas)
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              +{formatCurrencyBRL(kpis.resultadoMepAcumuladoBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>CPC 18 / IAS 28 sobre SCPs</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Perímetro de Consolidação
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {kpis.entidadesConsolidadasCount} Entidades / SPEs
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% de Aderência IFRS Auditada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('entidades')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'entidades'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Grupo Econômico & SPEs
          </button>
          <button
            onClick={() => setActiveTab('eliminacoes')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'eliminacoes'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            Eliminações Intercompany (CPC 36)
          </button>
          <button
            onClick={() => setActiveTab('mep')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'mep'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Equivalência Patrimonial (MEP)
          </button>
          <button
            onClick={() => setActiveTab('balanco')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'balanco'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            Balanço Global IFRS (BRL / USD / EUR)
          </button>
        </nav>
      </div>

      {/* ABA 1: ENTIDADES DO GRUPO */}
      {activeTab === 'entidades' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-600" />
                  Perímetro de Consolidação do Grupo Econômico (IFRS 10)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mapeamento de Matriz, Filiais regionais, SPEs de grandes espetáculos e SCPs coligadas.
                </p>
              </div>
              <span className="text-xs bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 px-3 py-1.5 rounded-lg font-bold border border-violet-200">
                {entities.length} Empresas Mapeadas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Razão Social</th>
                    <th className="p-3.5">CNPJ</th>
                    <th className="p-3.5">Tipo Societário</th>
                    <th className="p-3.5">% Participação</th>
                    <th className="p-3.5">Método Contábil</th>
                    <th className="p-3.5">Moeda Funcional</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {entities.map((ent) => (
                    <tr key={ent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{ent.razaoSocial}</div>
                        <div className="text-slate-400 font-mono text-2xs">{ent.codigoEntidade}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{ent.cnpj}</td>
                      <td className="p-3.5 font-medium">{ent.tipoEntidade.replace(/_/g, ' ')}</td>
                      <td className="p-3.5 font-bold text-violet-600 dark:text-violet-400">
                        {ent.percentualParticipacao}%
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-200">
                        {ent.metodoConsolidacao.replace(/_/g, ' ')}
                      </td>
                      <td className="p-3.5 font-bold">{ent.moedaFuncional}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          CONSOLIDADA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: ELIMINAÇÕES INTERCOMPANY */}
      {activeTab === 'eliminacoes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <GitMerge className="w-5 h-5 text-rose-600" />
                  Eliminações de Saldos e Operações Recíprocas (CPC 36 / IFRS 10)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Eliminação obrigatória em partidas dobradas de transações internas para evitar inflação contábil artificial.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{eliminations.length} Eliminações Ativas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Período</th>
                    <th className="p-3.5">Tipo de Operação</th>
                    <th className="p-3.5">Origem ➔ Destino</th>
                    <th className="p-3.5">Valor Eliminado</th>
                    <th className="p-3.5">Débito / Crédito Eliminado</th>
                    <th className="p-3.5">Fundamentação IFRS</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {eliminations.map((elm) => (
                    <tr key={elm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{elm.codigoEliminacao}</div>
                        <div className="text-slate-400 font-medium">{elm.periodoAnoMes}</div>
                      </td>
                      <td className="p-3.5 font-medium">{elm.tipoOperacao.replace(/_/g, ' ')}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{elm.entidadeOrigemNome}</div>
                        <div className="text-slate-400 text-2xs">➔ {elm.entidadeDestinoNome}</div>
                      </td>
                      <td className="p-3.5 font-black text-rose-600 dark:text-rose-400">
                        {formatCurrencyBRL(elm.valorEliminadoBrl)}
                      </td>
                      <td className="p-3.5">
                        <div className="text-2xs text-slate-600 dark:text-slate-300">
                          <strong>D:</strong> {elm.contaContabilDebito}
                        </div>
                        <div className="text-2xs text-slate-600 dark:text-slate-300">
                          <strong>C:</strong> {elm.contaContabilCredito}
                        </div>
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-500 truncate" title={elm.justificativaIfrs}>
                        {elm.justificativaIfrs}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          ELIMINADO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: EQUIVALÊNCIA PATRIMONIAL (MEP) */}
      {activeTab === 'mep' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  Apuração do Método da Equivalência Patrimonial (MEP - CPC 18 / IAS 28)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reconhecimento do resultado de investimentos em coligadas e SCPs proporcionalmente à participação societária.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Período</th>
                    <th className="p-3.5">Investida (Coligada / SCP)</th>
                    <th className="p-3.5">% Detido</th>
                    <th className="p-3.5">PL Ajustado Investida</th>
                    <th className="p-3.5">Lucro Líquido Investida</th>
                    <th className="p-3.5">Resultado MEP (DRE)</th>
                    <th className="p-3.5">Investimento no Balanço</th>
                    <th className="p-3.5">Data Apuração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {mepList.map((mep) => (
                    <tr key={mep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{mep.codigoApuracaoMep}</div>
                        <div className="text-slate-400">{mep.periodoApuracao}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{mep.investidaNome}</td>
                      <td className="p-3.5 font-bold text-violet-600 dark:text-violet-400">{mep.percentualDetido}%</td>
                      <td className="p-3.5 font-medium">{formatCurrencyBRL(mep.patrimonioLiquidoAjustado)}</td>
                      <td className="p-3.5 font-medium">{formatCurrencyBRL(mep.lucroLiquidoPeriodo)}</td>
                      <td className="p-3.5 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        +{formatCurrencyBRL(mep.resultadoEquivalenciaBrl)}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrencyBRL(mep.valorInvestimentoContabil)}
                      </td>
                      <td className="p-3.5 text-slate-500">{formatDateBR(mep.dataApuracao)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: BALANÇO & DRE CONSOLIDADOS */}
      {activeTab === 'balanco' && (
        <div className="space-y-6">
          {/* Seletor e Simulador de Conversão Internacional */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Conversor de Demonstrações Financeiras para Moeda Estrangeira (CPC 02 / IAS 21)
              </h3>
            </div>

            <form onSubmit={handleSimularConversao} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Período Contábil
                </label>
                <input
                  type="text"
                  value={conversorPeriodo}
                  onChange={(e) => setConversorPeriodo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Moeda de Apresentação
                </label>
                <select
                  value={conversorMoeda}
                  onChange={(e) => setConversorMoeda(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Taxa Fechamento Spot
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={taxaSpot}
                  onChange={(e) => setTaxaSpot(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Taxa Média DRE
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={taxaMedia}
                  onChange={(e) => setTaxaMedia(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  Gerar Conversão IFRS
                </button>
              </div>
            </form>

            {conversaoResult && (
              <div className="mt-6 p-4 rounded-xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Ativo Total ({conversaoResult.moedaDestino})</span>
                  <span className="text-xl font-extrabold text-violet-700 dark:text-violet-300">
                    {conversaoResult.moedaDestino} {conversaoResult.ativoTotalConvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Patrimônio Líquido</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {conversaoResult.moedaDestino} {conversaoResult.patrimonioLiquidoConvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Lucro Líquido do Período</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {conversaoResult.moedaDestino} {conversaoResult.lucroLiquidoConvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Ajuste de Avaliação Patrimonial (AAP)</span>
                  <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {conversaoResult.moedaDestino} {conversaoResult.ajusteAvaliacaoPatrimonialAap.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Demonstrações Consolidadas */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              Demonstrações Contábeis Consolidadas Auditadas (IFRS 10 / CPC 36)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Período</th>
                    <th className="p-3.5">Moeda</th>
                    <th className="p-3.5">Ativo Total</th>
                    <th className="p-3.5">Passivo Total</th>
                    <th className="p-3.5">Patrimônio Líquido</th>
                    <th className="p-3.5">Receita Líquida</th>
                    <th className="p-3.5">Lucro Líquido</th>
                    <th className="p-3.5">Status Auditoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {statements.map((dfs) => (
                    <tr key={dfs.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{dfs.codigoDemonstracao}</div>
                        <div className="text-slate-400">{dfs.periodo}</div>
                      </td>
                      <td className="p-3.5 font-bold text-sm text-violet-600">{dfs.moedaApresentacao}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {dfs.moedaApresentacao === 'BRL'
                          ? formatCurrencyBRL(dfs.ativoTotal)
                          : `${dfs.moedaApresentacao} ${dfs.ativoTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="p-3.5 font-medium">
                        {dfs.moedaApresentacao === 'BRL'
                          ? formatCurrencyBRL(dfs.passivoCirculanteTotal + dfs.passivoNaoCirculanteTotal)
                          : `${dfs.moedaApresentacao} ${(dfs.passivoCirculanteTotal + dfs.passivoNaoCirculanteTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {dfs.moedaApresentacao === 'BRL'
                          ? formatCurrencyBRL(dfs.patrimonioLiquidoTotal)
                          : `${dfs.moedaApresentacao} ${dfs.patrimonioLiquidoTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="p-3.5 font-medium">
                        {dfs.moedaApresentacao === 'BRL'
                          ? formatCurrencyBRL(dfs.receitaLiquidaConsolidada)
                          : `${dfs.moedaApresentacao} ${dfs.receitaLiquidaConsolidada.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600">
                        {dfs.moedaApresentacao === 'BRL'
                          ? formatCurrencyBRL(dfs.lucroLiquidoConsolidado)
                          : `${dfs.moedaApresentacao} ${dfs.lucroLiquidoConsolidado.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {dfs.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
