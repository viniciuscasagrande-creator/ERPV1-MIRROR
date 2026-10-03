import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  CurrencyExchangeRateDto,
  InternationalTicketSaleDto,
  FxHedgeContractDto,
  FxAccountingEntryDto,
  SimularCotacaoInternacionalResponseDto,
  GlobalFxKpisDto,
  MoedaEstrangeira,
  StatusVendaInternacional,
  StatusHedgeCambial,
  TipoVariacaoCambial,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Globe2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRightLeft,
  Coins,
  Building2,
  Receipt,
  FileCheck2,
  Sparkles,
  RefreshCw,
  Lock,
  Percent,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Landmark,
} from 'lucide-react';

export const GlobalFxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cotacoes' | 'vendas' | 'hedge' | 'contabil'>('cotacoes');
  const [loading, setLoading] = useState(true);

  // States
  const [kpis, setKpis] = useState<GlobalFxKpisDto>({
    volumeTotalUsdEquivalente: 420000.0,
    receitaSpreadCambialBrl: 84500.0,
    totalIofRecolhidoBrl: 18450.0,
    volumeHedgeTravadoUsd: 150000.0,
    paisesAtendidosCount: 38,
    taxaConversaoCheckoutFxPercent: 92.4,
  });

  const [rates, setRates] = useState<CurrencyExchangeRateDto[]>([
    {
      id: 'fx-rate-01',
      moedaOrigem: MoedaEstrangeira.USD,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 5.654,
      spreadPercent: 2.5,
      taxaEfetivaSpot: 5.7954,
      dataHoraCotacao: new Date().toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    },
    {
      id: 'fx-rate-02',
      moedaOrigem: MoedaEstrangeira.EUR,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 6.128,
      spreadPercent: 2.5,
      taxaEfetivaSpot: 6.2812,
      dataHoraCotacao: new Date().toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    },
    {
      id: 'fx-rate-03',
      moedaOrigem: MoedaEstrangeira.GBP,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 7.185,
      spreadPercent: 2.8,
      taxaEfetivaSpot: 7.3862,
      dataHoraCotacao: new Date().toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    },
  ]);

  const [sales, setSales] = useState<InternationalTicketSaleDto[]>([
    {
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
      valorLiquidoProdutorBrl: 678.48,
      spreadReceitaDiskBrl: 16.97,
      statusCambial: StatusVendaInternacional.LIQUIDADO_BORDERO,
      dataTransacao: new Date('2026-03-01T16:20:00Z').toISOString(),
    },
    {
      id: 'fx-sale-02',
      codigoTransacao: 'INT-TRX-2026-0042',
      vendaId: 'vnd-intl-02',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      paisComprador: 'DE',
      moedaEstrangeira: MoedaEstrangeira.EUR,
      valorMoedaEstrangeira: 240.0,
      taxaCambioAplicada: 6.2812,
      aliquotaIofPercent: 4.38,
      valorIofBrl: 66.03,
      valorTotalBrl: 1573.52,
      valorLiquidoProdutorBrl: 1470.72,
      spreadReceitaDiskBrl: 36.77,
      statusCambial: StatusVendaInternacional.LIQUIDADO_BORDERO,
      dataTransacao: new Date('2026-03-02T10:15:00Z').toISOString(),
    },
  ]);

  const [hedges, setHedges] = useState<FxHedgeContractDto[]>([
    {
      id: 'hdg-001',
      codigoContratoHedge: 'HDG-2026-0008',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      produtorId: 'prod-001',
      moedaProtegida: MoedaEstrangeira.USD,
      volumeMoedaProtegido: 150000.0,
      taxaCambioTravadaSpot: 5.75,
      valorBrlGarantido: 862500.0,
      instituicaoFinanceira: '341 - Itaú BBA S.A.',
      dataAbertura: new Date('2026-02-10T14:00:00Z').toISOString(),
      dataLiquidacaoPrevista: new Date('2026-05-30T18:00:00Z').toISOString(),
      status: StatusHedgeCambial.ATIVO,
    },
  ]);

  const [accountingEntries, setAccountingEntries] = useState<FxAccountingEntryDto[]>([
    {
      id: 'acc-fx-001',
      codigoLancamento: 'LCT-FX-2026-001',
      eventoId: 'evt-001',
      tipoVariacao: TipoVariacaoCambial.ATIVA_RECEITA,
      moedaOrigem: MoedaEstrangeira.USD,
      taxaCotacaoInicial: 5.6,
      taxaLiquidacao: 5.654,
      valorDiferencaBrl: 8100.0,
      contaContabilDebito: '1.1.1.03 - Disponibilidades em Moeda Estrangeira',
      contaContabilCredito: '4.1.3.01 - Variação Cambial Ativa (Receitas Financeiras)',
      historicoContabil:
        'Reconhecimento de variação cambial ativa positiva na liquidação do lote internacional Pedreira (NBC TG 02).',
      dataLancamento: new Date('2026-03-01T23:59:59Z').toISOString(),
    },
  ]);

  // Simulador de Câmbio State
  const [simValorBrl, setSimValorBrl] = useState<number>(350);
  const [simMoeda, setSimMoeda] = useState<MoedaEstrangeira>(MoedaEstrangeira.USD);
  const [simTipoCartao, setSimTipoCartao] = useState<'INTERNACIONAL_CREDITO' | 'CONTA_GLOBAL_DEBITO'>('INTERNACIONAL_CREDITO');
  const [simResult, setSimResult] = useState<SimularCotacaoInternacionalResponseDto | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [kpisRes, ratesRes, salesRes, hedgesRes, accRes] = await Promise.allSettled([
        api.get('/global-fx/dashboard'),
        api.get('/global-fx/rates'),
        api.get('/global-fx/sales'),
        api.get('/global-fx/hedges'),
        api.get('/global-fx/accounting-entries'),
      ]);

      if (kpisRes.status === 'fulfilled' && kpisRes.value?.data?.data) {
        setKpis(kpisRes.value.data.data);
      }
      if (ratesRes.status === 'fulfilled' && ratesRes.value?.data?.data) {
        setRates(ratesRes.value.data.data);
      }
      if (salesRes.status === 'fulfilled' && salesRes.value?.data?.data) {
        setSales(salesRes.value.data.data);
      }
      if (hedgesRes.status === 'fulfilled' && hedgesRes.value?.data?.data) {
        setHedges(hedgesRes.value.data.data);
      }
      if (accRes.status === 'fulfilled' && accRes.value?.data?.data) {
        setAccountingEntries(accRes.value.data.data);
      }
    } catch {
      // Fallback em memória
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSimularCotacao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/global-fx/simulate-checkout', {
        valorBrl: Number(simValorBrl),
        moedaDesejada: simMoeda,
        tipoCartao: simTipoCartao,
      });
      if (res.data?.data) {
        setSimResult(res.data.data);
      }
    } catch {
      const rate = rates.find((r) => r.moedaOrigem === simMoeda);
      const taxaPtax = rate ? rate.taxaPtaxOficial : 5.654;
      const spreadPercent = rate ? rate.spreadPercent : 2.5;
      const taxaSpotFinal = Number((taxaPtax * (1 + spreadPercent / 100)).toFixed(4));
      const aliquotaIofPercent = simTipoCartao === 'CONTA_GLOBAL_DEBITO' ? 1.1 : 4.38;
      const valorMoedaEstrangeira = Number((simValorBrl / taxaSpotFinal).toFixed(2));
      const valorIofBrl = Number(((simValorBrl * aliquotaIofPercent) / 100).toFixed(2));
      const custoTotalEstimadoBrl = Number((simValorBrl + valorIofBrl).toFixed(2));

      setSimResult({
        valorOriginalBrl: simValorBrl,
        moedaDesejada: simMoeda,
        taxaPtax,
        spreadPercent,
        taxaSpotFinal,
        valorMoedaEstrangeira,
        aliquotaIofPercent,
        valorIofBrl,
        custoTotalEstimadoBrl,
      });
    }
  };

  const handleNovoHedge = async () => {
    try {
      const res = await api.post('/global-fx/hedges', {
        eventoId: 'evt-001',
        eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        produtorId: 'prod-001',
        moedaProtegida: MoedaEstrangeira.USD,
        volumeMoedaProtegido: 50000.0,
        taxaCambioTravadaSpot: 5.765,
        instituicaoFinanceira: '341 - Itaú BBA S.A.',
      });
      if (res.data?.data) {
        setHedges((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const novoHedge: FxHedgeContractDto = {
        id: `hdg-00${hedges.length + 1}`,
        codigoContratoHedge: `HDG-2026-000${hedges.length + 1}`,
        eventoId: 'evt-001',
        eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        produtorId: 'prod-001',
        moedaProtegida: MoedaEstrangeira.USD,
        volumeMoedaProtegido: 50000.0,
        taxaCambioTravadaSpot: 5.765,
        valorBrlGarantido: 288250.0,
        instituicaoFinanceira: '341 - Itaú BBA S.A.',
        dataAbertura: new Date().toISOString(),
        dataLiquidacaoPrevista: new Date(Date.now() + 90 * 86400000).toISOString(),
        status: StatusHedgeCambial.ATIVO,
      };
      setHedges((prev) => [novoHedge, ...prev]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Contexto Global */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-sky-950 via-blue-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-sky-800/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/30 text-sky-200 border border-sky-400/40 backdrop-blur-md">
              <Globe2 className="w-3.5 h-3.5 text-sky-300" />
              Multi-Moeda PTAX / Sisbacen
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              Trava Cambial (FX Lock)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Gateway Global Multi-Moeda & Câmbio FX
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Venda internacional de ingressos com precificação em USD, EUR e GBP, conversão cambial spot com
            tributação de IOF (Decreto 6.306/07), travas de hedge spot e escrituração conforme NBC TG 02 / IAS 21.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => carregarDados()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar PTAX
          </button>
          <button
            onClick={handleNovoHedge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition active:scale-95"
          >
            <Lock className="w-4 h-4" />
            Contratar Trava Cambial (Spot)
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Volume Internacional (USD)
            </span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              US$ {kpis.volumeTotalUsdEquivalente.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-sky-600 dark:text-sky-400">
              <span>{kpis.paisesAtendidosCount} Países Atendidos</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Receita de Spread Cambial
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.receitaSpreadCambialBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Percent className="w-4 h-4 text-emerald-500" />
              <span>Spread médio de 2.5% sobre PTAX</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              IOF Câmbio Recolhido
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.totalIofRecolhidoBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <span>Decreto 6.306/07 (1.1% e 4.38%)</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Volume em Trava Cambial
            </span>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
              US$ {kpis.volumeHedgeTravadoUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Hedge Spot 100% Coberto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('cotacoes')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'cotacoes'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Coins className="w-4 h-4" />
            Cotações Spot & Checkout
          </button>
          <button
            onClick={() => setActiveTab('vendas')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'vendas'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Vendas Internacionais
          </button>
          <button
            onClick={() => setActiveTab('hedge')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'hedge'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            Trava Cambial Spot (Hedge)
          </button>
          <button
            onClick={() => setActiveTab('contabil')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'contabil'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Variação Cambial (NBC TG 02)
          </button>
        </nav>
      </div>

      {/* ABA 1: COTAÇÕES SPOT & SIMULADOR DE CHECKOUT */}
      {activeTab === 'cotacoes' && (
        <div className="space-y-6">
          {/* Tabela de Cotações PTAX */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-sky-600" />
                  Grade de Câmbio Spot Oficial (PTAX Bacen + Spread)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Taxas alimentadas via Sisbacen com spread da plataforma para liquidação em D+0.
                </p>
              </div>
              <span className="text-xs bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 px-3 py-1.5 rounded-lg font-bold border border-sky-200">
                PTAX Bacen Oficial
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Moeda Estrangeira</th>
                    <th className="p-3.5">Cotação PTAX Oficial</th>
                    <th className="p-3.5">Spread Plataforma</th>
                    <th className="p-3.5">Taxa Efetiva Spot</th>
                    <th className="p-3.5">Fonte Regulamentar</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {rates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white text-sm">
                        {rate.moedaOrigem} / {rate.moedaDestino}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        R$ {rate.taxaPtaxOficial.toFixed(4)}
                      </td>
                      <td className="p-3.5 font-medium text-emerald-600">+{rate.spreadPercent}%</td>
                      <td className="p-3.5 font-bold text-sky-600 dark:text-sky-400 font-mono text-sm">
                        R$ {rate.taxaEfetivaSpot.toFixed(4)}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-2xs">{rate.fonteCotacao}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          ATIVA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simulador Interativo de Checkout com IOF */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Simulador de Checkout Internacional & Discriminação de IOF
              </h3>
            </div>

            <form onSubmit={handleSimularCotacao} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Valor do Ingresso (BRL)
                </label>
                <input
                  type="number"
                  value={simValorBrl}
                  onChange={(e) => setSimValorBrl(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Moeda do Comprador
                </label>
                <select
                  value={simMoeda}
                  onChange={(e) => setSimMoeda(e.target.value as MoedaEstrangeira)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={MoedaEstrangeira.USD}>Dólar Americano (USD)</option>
                  <option value={MoedaEstrangeira.EUR}>Euro (EUR)</option>
                  <option value={MoedaEstrangeira.GBP}>Libra Esterlina (GBP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Forma de Pagamento Internacional
                </label>
                <select
                  value={simTipoCartao}
                  onChange={(e) => setSimTipoCartao(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="INTERNACIONAL_CREDITO">Cartão Internacional (IOF 4.38%)</option>
                  <option value="CONTA_GLOBAL_DEBITO">Conta Global / Débito (IOF 1.10%)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  Calcular Câmbio & IOF
                </button>
              </div>
            </form>

            {simResult && (
              <div className="mt-6 p-4 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Preço em Moeda Estrangeira</span>
                  <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
                    {simResult.moedaDesejada} {simResult.valorMoedaEstrangeira.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Taxa Spot Efetiva</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    R$ {simResult.taxaSpotFinal.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">IOF Câmbio ({simResult.aliquotaIofPercent}%)</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrencyBRL(simResult.valorIofBrl)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Custo Total ao Comprador</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {formatCurrencyBRL(simResult.custoTotalEstimadoBrl)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: VENDAS INTERNACIONAIS */}
      {activeTab === 'vendas' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-600" />
                  Borderô de Vendas Internacionais de Ingressos
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{sales.length} Ingressos Globais</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Evento</th>
                    <th className="p-3.5">País</th>
                    <th className="p-3.5">Valor Original</th>
                    <th className="p-3.5">Taxa de Câmbio</th>
                    <th className="p-3.5">IOF (4.38%)</th>
                    <th className="p-3.5">Líquido Produtor (BRL)</th>
                    <th className="p-3.5">Spread Disk (BRL)</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{sale.codigoTransacao}</div>
                        <div className="text-slate-400 font-medium">{sale.eventoNome}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{sale.paisComprador}</td>
                      <td className="p-3.5 font-bold text-sky-600 dark:text-sky-400">
                        {sale.moedaEstrangeira} {sale.valorMoedaEstrangeira.toFixed(2)}
                      </td>
                      <td className="p-3.5 font-mono">R$ {sale.taxaCambioAplicada.toFixed(4)}</td>
                      <td className="p-3.5 font-medium text-indigo-600">{formatCurrencyBRL(sale.valorIofBrl)}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(sale.valorLiquidoProdutorBrl)}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrencyBRL(sale.spreadReceitaDiskBrl)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {sale.statusCambial}
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

      {/* ABA 3: TRAVA CAMBIAL SPOT (HEDGE) */}
      {activeTab === 'hedge' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" />
                  Contratos de Trava Cambial Spot (FX Lock / Hedge)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Proteção cambial para artistas internacionais contratados em moeda forte, blindando o borderô do produtor.
                </p>
              </div>
              <button
                onClick={handleNovoHedge}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                + Nova Trava Cambial
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Contrato / Evento</th>
                    <th className="p-3.5">Moeda & Volume Protegido</th>
                    <th className="p-3.5">Taxa Spot Travada</th>
                    <th className="p-3.5">Valor Garantido (BRL)</th>
                    <th className="p-3.5">Instituição Financeira</th>
                    <th className="p-3.5">Vencimento</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {hedges.map((hdg) => (
                    <tr key={hdg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{hdg.codigoContratoHedge}</div>
                        <div className="text-slate-400">{hdg.eventoNome}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {hdg.moedaProtegida} {hdg.volumeMoedaProtegido.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 font-bold text-teal-600 font-mono">
                        R$ {hdg.taxaCambioTravadaSpot.toFixed(4)}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(hdg.valorBrlGarantido)}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{hdg.instituicaoFinanceira}</td>
                      <td className="p-3.5 text-slate-500">{formatDateBR(hdg.dataLiquidacaoPrevista)}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                          {hdg.status}
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

      {/* ABA 4: ESCRITURAÇÃO NBC TG 02 */}
      {activeTab === 'contabil' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-indigo-600" />
                  Escrituração de Variações Cambiais (NBC TG 02 / IAS 21)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reconhecimento das variações cambiais ativas e passivas em contas de resultado financeiro com partidas dobradas.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Lançamento / Data</th>
                    <th className="p-3.5">Tipo de Variação</th>
                    <th className="p-3.5">Moeda</th>
                    <th className="p-3.5">Cotação Inicial vs Liquidada</th>
                    <th className="p-3.5">Diferença (BRL)</th>
                    <th className="p-3.5">Débito / Crédito</th>
                    <th className="p-3.5">Histórico Contábil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {accountingEntries.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{acc.codigoLancamento}</div>
                        <div className="text-slate-400 font-mono text-2xs">{formatDateBR(acc.dataLancamento)}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-2xs font-bold ${
                            acc.tipoVariacao === TipoVariacaoCambial.ATIVA_RECEITA
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {acc.tipoVariacao.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold">{acc.moedaOrigem}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {acc.taxaCotacaoInicial.toFixed(4)} ➔ {acc.taxaLiquidacao.toFixed(4)}
                      </td>
                      <td className="p-3.5 font-black text-emerald-600 dark:text-emerald-400">
                        + {formatCurrencyBRL(acc.valorDiferencaBrl)}
                      </td>
                      <td className="p-3.5">
                        <div className="text-2xs text-slate-600 dark:text-slate-300 font-medium">
                          <strong>D:</strong> {acc.contaContabilDebito}
                        </div>
                        <div className="text-2xs text-slate-600 dark:text-slate-300 font-medium">
                          <strong>C:</strong> {acc.contaContabilCredito}
                        </div>
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-500 truncate" title={acc.historicoContabil}>
                        {acc.historicoContabil}
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
