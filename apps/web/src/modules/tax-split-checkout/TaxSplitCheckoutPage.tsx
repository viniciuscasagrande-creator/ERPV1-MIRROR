import React, { useState } from 'react';
import {
  Percent,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Check,
  Sliders,
  Scale,
  Zap,
} from 'lucide-react';
import {
  StatusExecucaoSplitCheckout,
  RegimeTributarioDual,
  TipoInsumoCreditoIbsCbs,
} from '@diskingressos/types';
import type {
  TaxSplitCheckoutExecutionDto,
  TaxCreditAccumulatorDto,
  TaxSplitFiscalParamDto,
  TaxSplitDashboardKpisDto,
  CalcularSplitTributarioResponseDto,
} from '@diskingressos/types';

export const TaxSplitCheckoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'splits' | 'simulador' | 'creditos' | 'parametros'>('splits');

  // KPIs
  const [kpis] = useState<TaxSplitDashboardKpisDto>({
    volumeRetidoCbsIbsTotalBrl: 1840500.0,
    taxaRetencaoMediaEfetivaPercent: 10.6,
    creditosNaoCumulatividadeTotalBrl: 385200.0,
    taxaSucessoProtocolosComitePercent: 100.0,
    totalTransacoesComSplit: 48290,
  });

  // Lista de Splits
  const [splits, setSplits] = useState<TaxSplitCheckoutExecutionDto[]>([
    {
      id: 'spt-001',
      codigoSplit: 'SPLIT-TAX-2026-0001',
      pedidoId: 'PED-CURITIBA-2026-9812',
      numeroIngressos: 2,
      valorTotalTransacaoBrl: 440.0,
      basePropriaComissaoBrl: 80.0,
      baseRepasseProdutorBrl: 360.0,
      aliquotaCbsPercent: 3.52,
      aliquotaIbsPercent: 7.08,
      valorCbsRetidoBrl: 2.82,
      valorIbsRetidoBrl: 5.66,
      valorLiquidoDiskIngressosBrl: 71.52,
      valorLiquidoProdutorBrl: 360.0,
      protocoloComiteGestorIbs: 'CG-IBS-2026-BR-091823',
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 295,
      metodoPagamento: 'PIX_AUTOMATICO_SPI',
      dataLiquidacao: '2026-04-01T10:15:30Z',
    },
    {
      id: 'spt-002',
      codigoSplit: 'SPLIT-TAX-2026-0002',
      pedidoId: 'PED-ROCKFEST-2026-4411',
      numeroIngressos: 4,
      valorTotalTransacaoBrl: 1100.0,
      basePropriaComissaoBrl: 200.0,
      baseRepasseProdutorBrl: 900.0,
      aliquotaCbsPercent: 3.52,
      aliquotaIbsPercent: 7.08,
      valorCbsRetidoBrl: 7.04,
      valorIbsRetidoBrl: 14.16,
      valorLiquidoDiskIngressosBrl: 178.8,
      valorLiquidoProdutorBrl: 900.0,
      protocoloComiteGestorIbs: 'CG-IBS-2026-BR-091824',
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 310,
      metodoPagamento: 'CARTAO_CREDITO_SPLIT',
      dataLiquidacao: '2026-04-01T11:22:15Z',
    },
    {
      id: 'spt-003',
      codigoSplit: 'SPLIT-TAX-2026-0003',
      pedidoId: 'PED-TEATRO-2026-1189',
      numeroIngressos: 1,
      valorTotalTransacaoBrl: 165.0,
      basePropriaComissaoBrl: 30.0,
      baseRepasseProdutorBrl: 135.0,
      aliquotaCbsPercent: 3.52,
      aliquotaIbsPercent: 7.08,
      valorCbsRetidoBrl: 1.06,
      valorIbsRetidoBrl: 2.12,
      valorLiquidoDiskIngressosBrl: 26.82,
      valorLiquidoProdutorBrl: 135.0,
      protocoloComiteGestorIbs: 'CG-IBS-2026-BR-091825',
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 280,
      metodoPagamento: 'DREX_CBDC_SETTLEMENT',
      dataLiquidacao: '2026-04-01T12:05:40Z',
    },
  ]);

  // Lista de Créditos
  const [creditos] = useState<TaxCreditAccumulatorDto[]>([
    {
      id: 'crd-001',
      codigoCredito: 'CRD-IBS-2026-0042',
      fornecedorNome: 'Pedreira Paulo Leminski Gestão de Arenas S.A.',
      fornecedorCnpj: '08.912.345/0001-90',
      numeroNfeRef: 'NF-e 41260408912345000190550010000429181928374651',
      tipoInsumoEvento: TipoInsumoCreditoIbsCbs.LOCACAO_ARENA,
      valorTotalInsumoBrl: 350000.0,
      creditoCbsApropriadoBrl: 12320.0,
      creditoIbsApropriadoBrl: 24780.0,
      statusApropriacao: 'HOMOLOGADO_SPED',
      dataApropriacao: '2026-03-25T14:00:00Z',
    },
    {
      id: 'crd-002',
      codigoCredito: 'CRD-IBS-2026-0043',
      fornecedorNome: 'Gabisom Áudio & Iluminação Profissional Ltda',
      fornecedorCnpj: '60.123.456/0001-22',
      numeroNfeRef: 'NF-e 35260460123456000122550010000182731928374652',
      tipoInsumoEvento: TipoInsumoCreditoIbsCbs.SOM_ILUMINACAO,
      valorTotalInsumoBrl: 180000.0,
      creditoCbsApropriadoBrl: 6336.0,
      creditoIbsApropriadoBrl: 12744.0,
      statusApropriacao: 'HOMOLOGADO_SPED',
      dataApropriacao: '2026-03-28T16:30:00Z',
    },
    {
      id: 'crd-003',
      codigoCredito: 'CRD-IBS-2026-0044',
      fornecedorNome: 'Starlight Geradores & Infraestrutura Ltda',
      fornecedorCnpj: '22.334.455/0001-88',
      numeroNfeRef: 'NF-e 41260322334455000188550010000091821928374653',
      tipoInsumoEvento: TipoInsumoCreditoIbsCbs.GERADORES_ENERGIA,
      valorTotalInsumoBrl: 95000.0,
      creditoCbsApropriadoBrl: 3344.0,
      creditoIbsApropriadoBrl: 6726.0,
      statusApropriacao: 'HOMOLOGADO_SPED',
      dataApropriacao: '2026-03-30T10:15:00Z',
    },
  ]);

  // Parâmetros Regulamentares
  const [params, setParams] = useState<TaxSplitFiscalParamDto>({
    versaoNormaRegulamentar: 'PLP 68/2024 & EC 132/2023 (Comitê Gestor IBS)',
    aliquotaCbsPercent: 3.52,
    aliquotaIbsEstadualPercent: 4.72,
    aliquotaIbsMunicipalPercent: 2.36,
    modoTransitorio2026: true,
    splitPaymentAutomaticoAtivo: true,
  });

  // Estado Simulador
  const [simIngressoValor, setSimIngressoValor] = useState<number>(250.0);
  const [simTaxaConveniencia, setSimTaxaConveniencia] = useState<number>(45.0);
  const [simQuantidade, setSimQuantidade] = useState<number>(2);
  const [simRegime, setSimRegime] = useState<RegimeTributarioDual>(RegimeTributarioDual.PADRAO_DEFINITIVO);
  const [simResult, setSimResult] = useState<CalcularSplitTributarioResponseDto | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Executa Simulação
  const handleSimularSplit = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const qtd = simQuantidade || 1;
      const baseRepasseProdutorBrl = Number((simIngressoValor * qtd).toFixed(2));
      const baseTributavelDiskBrl = Number((simTaxaConveniencia * qtd).toFixed(2));
      const valorTotalTransacaoBrl = Number((baseRepasseProdutorBrl + baseTributavelDiskBrl).toFixed(2));

      const aliqCbs = simRegime === RegimeTributarioDual.TRANSICAO_TESTE_2026 ? 0.90 : params.aliquotaCbsPercent;
      const aliqIbs = simRegime === RegimeTributarioDual.TRANSICAO_TESTE_2026
        ? 0.10
        : Number((params.aliquotaIbsEstadualPercent + params.aliquotaIbsMunicipalPercent).toFixed(2));

      const valorCbsRetidoBrl = Number(((baseTributavelDiskBrl * aliqCbs) / 100).toFixed(2));
      const valorIbsRetidoBrl = Number(((baseTributavelDiskBrl * aliqIbs) / 100).toFixed(2));
      const totalRetido = Number((valorCbsRetidoBrl + valorIbsRetidoBrl).toFixed(2));
      const valorLiquidoDiskBrl = Number((baseTributavelDiskBrl - totalRetido).toFixed(2));
      const valorLiquidoProdutorBrl = baseRepasseProdutorBrl;

      const aliquotaEfetivaRetencaoPercent =
        baseTributavelDiskBrl > 0
          ? Number(((totalRetido / baseTributavelDiskBrl) * 100).toFixed(2))
          : 0;

      const res: CalcularSplitTributarioResponseDto = {
        valorTotalTransacaoBrl,
        baseTributavelDiskBrl,
        baseRepasseProdutorBrl,
        valorCbsRetidoBrl,
        valorIbsRetidoBrl,
        valorLiquidoDiskBrl,
        valorLiquidoProdutorBrl,
        aliquotaEfetivaRetencaoPercent,
      };

      setSimResult(res);
      setIsSimulating(false);
    }, 400);
  };

  const handleSalvarSimuladoNaEsteira = () => {
    if (!simResult) return;
    const aliqCbs = simRegime === RegimeTributarioDual.TRANSICAO_TESTE_2026 ? 0.90 : params.aliquotaCbsPercent;
    const aliqIbs = simRegime === RegimeTributarioDual.TRANSICAO_TESTE_2026
      ? 0.10
      : Number((params.aliquotaIbsEstadualPercent + params.aliquotaIbsMunicipalPercent).toFixed(2));

    const novoSplit: TaxSplitCheckoutExecutionDto = {
      id: `spt-${Date.now()}`,
      codigoSplit: `SPLIT-TAX-2026-${(splits.length + 1).toString().padStart(4, '0')}`,
      pedidoId: `PED-SIM-${Date.now().toString().slice(-4)}`,
      numeroIngressos: simQuantidade,
      valorTotalTransacaoBrl: simResult.valorTotalTransacaoBrl,
      basePropriaComissaoBrl: simResult.baseTributavelDiskBrl,
      baseRepasseProdutorBrl: simResult.baseRepasseProdutorBrl,
      aliquotaCbsPercent: aliqCbs,
      aliquotaIbsPercent: aliqIbs,
      valorCbsRetidoBrl: simResult.valorCbsRetidoBrl,
      valorIbsRetidoBrl: simResult.valorIbsRetidoBrl,
      valorLiquidoDiskIngressosBrl: simResult.valorLiquidoDiskBrl,
      valorLiquidoProdutorBrl: simResult.valorLiquidoProdutorBrl,
      protocoloComiteGestorIbs: `CG-IBS-2026-BR-${Math.floor(100000 + Math.random() * 900000)}`,
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 290,
      metodoPagamento: 'PIX_AUTOMATICO_SPI',
      dataLiquidacao: new Date().toISOString(),
    };

    setSplits([novoSplit, ...splits]);
    setActiveTab('splits');
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Em Conformidade com PLP 68/2024 & EC 132/2023
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Comitê Gestor IBS Homologado
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Receipt className="w-8 h-8 text-indigo-400" />
              Split Payment Tributário Inteligente no Checkout
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Retenção e segregação atômica em milissegundos do IVA Dual (CBS Federal + IBS Subnacional) diretamente no momento da liquidação bancária via SPI/PIX Automático, garantindo a não-cumulatividade plena sobre insumos e a proteção do repasse fiduciário dos produtores.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('simulador')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Simular Checkout Split
            </button>
            <button
              onClick={() => setActiveTab('parametros')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200"
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              Configurar Alíquotas
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Splits Processados</span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{kpis.totalTransacoesComSplit.toLocaleString('pt-BR')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Taxa de sucesso: {kpis.taxaSucessoProtocolosComitePercent}%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Retenção IVA Dual (IBS/CBS)</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-300">
              {formatCurrency(kpis.volumeRetidoCbsIbsTotalBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Alíquota média efetiva: {kpis.taxaRetencaoMediaEfetivaPercent}%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Créditos Não-Cumulatividade</span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-300">
              {formatCurrency(kpis.creditosNaoCumulatividadeTotalBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400/90">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Insumos artísticos e arena</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Repasse Produtores</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400">
              Blindado 100%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sem bitributação de repasse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('splits')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'splits'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Esteira de Splits Homologados ({splits.length})
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4" />
          Simulador Dual IBS/CBS em Tempo Real
        </button>
        <button
          onClick={() => setActiveTab('creditos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'creditos'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Créditos Não-Cumulatividade de Insumos ({creditos.length})
        </button>
        <button
          onClick={() => setActiveTab('parametros')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'parametros'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Parâmetros Regulamentares Comitê Gestor
        </button>
      </div>

      {/* TAB 1: Splits em Tempo Real */}
      {activeTab === 'splits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Transações com Retenção Atômica</h2>
              <p className="text-xs text-slate-400">
                Fluxo em lote e individual do checkout com split instantâneo no SPI e envio de comprovante ao Comitê Gestor.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                API SPI: ONLINE (290ms)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3.5 px-4">Código / Pedido</th>
                  <th className="py-3.5 px-4">Valor Total</th>
                  <th className="py-3.5 px-4">Base DiskIngressos</th>
                  <th className="py-3.5 px-4">Retenção IVA Dual</th>
                  <th className="py-3.5 px-4">Repasse Produtor</th>
                  <th className="py-3.5 px-4">Líquido Plataforma</th>
                  <th className="py-3.5 px-4">Protocolo Comitê Gestor</th>
                  <th className="py-3.5 px-4">Status Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono text-xs">
                {splits.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{s.codigoSplit}</div>
                      <div className="text-slate-400 text-[11px] font-sans">{s.pedidoId} ({s.numeroIngressos} ing.)</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {formatCurrency(s.valorTotalTransacaoBrl)}
                    </td>
                    <td className="py-3 px-4 text-blue-300">
                      {formatCurrency(s.basePropriaComissaoBrl)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-indigo-400 font-semibold">
                        {formatCurrency(s.valorCbsRetidoBrl + s.valorIbsRetidoBrl)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        CBS: {formatCurrency(s.valorCbsRetidoBrl)} | IBS: {formatCurrency(s.valorIbsRetidoBrl)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      {formatCurrency(s.valorLiquidoProdutorBrl)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {formatCurrency(s.valorLiquidoDiskIngressosBrl)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 text-[10px]">
                        {s.protocoloComiteGestorIbs}
                      </span>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">{s.tempoProcessamentoMs}ms via {s.metodoPagamento}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Homologado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Simulador Dual IBS/CBS */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Parâmetros da Venda de Ingresso
              </h2>
              <p className="text-xs text-slate-400">
                Simule o split tributário para ingressos e taxas conforme o Art. 52 do PLP 68/2024.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Valor Facial do Ingresso (R$ unitário)
                </label>
                <input
                  type="number"
                  value={simIngressoValor}
                  onChange={(e) => setSimIngressoValor(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Taxa de Conveniência Plataforma (R$ unitário - Base Própria)
                </label>
                <input
                  type="number"
                  value={simTaxaConveniencia}
                  onChange={(e) => setSimTaxaConveniencia(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantidade Ingressos</label>
                  <input
                    type="number"
                    value={simQuantidade}
                    onChange={(e) => setSimQuantidade(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Regime Tributário Dual</label>
                  <select
                    value={simRegime}
                    onChange={(e) => setSimRegime(e.target.value as RegimeTributarioDual)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={RegimeTributarioDual.PADRAO_DEFINITIVO}>Regime Reduzido Eventos (10,60%)</option>
                    <option value={RegimeTributarioDual.TRANSICAO_TESTE_2026}>Transição Teste 2026 (1,00%)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSimularSplit}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200"
                >
                  {isSimulating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isSimulating ? 'Calculando Split...' : 'Executar Simulação de Split'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Demonstrativo de Repartição Tributária e Financeira
              </h2>
              <p className="text-xs text-slate-400">
                Segregação entre Conta de Destinação Fiduciária do Produtor e Sub-Conta da Receita Federal/Comitê IBS.
              </p>
            </div>

            {simResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Total do Carrinho</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatCurrency(simResult.valorTotalTransacaoBrl)}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Base DiskIngressos</div>
                    <div className="text-lg font-bold text-blue-400 mt-1">
                      {formatCurrency(simResult.baseTributavelDiskBrl)}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Base Produtor</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">
                      {formatCurrency(simResult.baseRepasseProdutorBrl)}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-4 space-y-3">
                  <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-indigo-400" />
                    Retenção Tributária Obrigatória no SPI (Dual IVA)
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      <div className="text-slate-400">CBS Federal (Retido)</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {formatCurrency(simResult.valorCbsRetidoBrl)}
                      </div>
                      <div className="text-[10px] text-slate-500">Destino: Conta Única do Tesouro Nacional</div>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      <div className="text-slate-400">IBS Subnacional (Retido)</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {formatCurrency(simResult.valorIbsRetidoBrl)}
                      </div>
                      <div className="text-[10px] text-slate-500">Destino: Comitê Gestor IBS (Estados/Municípios)</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-3">
                    <div className="text-xs text-emerald-400 font-semibold uppercase">Líquido Repasse Produtor</div>
                    <div className="text-xl font-bold text-emerald-300 mt-1">
                      {formatCurrency(simResult.valorLiquidoProdutorBrl)}
                    </div>
                    <div className="text-[10px] text-emerald-400/80 mt-1">
                      100% Repasse Líquido Integral sem Glosa
                    </div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-300 font-semibold uppercase">Líquido DiskIngressos</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {formatCurrency(simResult.valorLiquidoDiskBrl)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Margem líquida pós-split IVA no checkout
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200 mb-1">Fundamento Jurídico & Técnico:</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Segregação rigorosa de base imponível: incidência de IVA apenas sobre comissão da plataforma, preservando o repasse fiduciário do produtor sem bi-tributação (PLP 68/2024, Art. 52). Alíquota efetiva apurada: {simResult.aliquotaEfetivaRetencaoPercent}%.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSalvarSimuladoNaEsteira}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Registrar na Esteira de Produção
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">
                  Configure os valores ao lado e clique em "Executar Simulação de Split".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Créditos Não-Cumulatividade */}
      {activeTab === 'creditos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Acumulador de Créditos da Não-Cumulatividade</h2>
              <p className="text-xs text-slate-400">
                Créditos imediatos de IBS/CBS sobre despesas e insumos essenciais de espetáculos e operações (Art. 28 PLP 68/2024).
              </p>
            </div>
            <button
              onClick={() => alert('Formulário de credenciamento de NF-e de insumo aberto.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Lançar Insumo / NF-e
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3.5 px-4">Fornecedor / Insumo</th>
                  <th className="py-3.5 px-4">Tipo de Insumo</th>
                  <th className="py-3.5 px-4">Documento Fiscal</th>
                  <th className="py-3.5 px-4">Valor Base NF-e</th>
                  <th className="py-3.5 px-4">Crédito CBS</th>
                  <th className="py-3.5 px-4">Crédito IBS</th>
                  <th className="py-3.5 px-4">Total Crédito</th>
                  <th className="py-3.5 px-4">Status SPED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono text-xs">
                {creditos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-white">{c.fornecedorNome}</div>
                      <div className="text-slate-400 text-[11px]">{c.fornecedorCnpj} ({c.codigoCredito})</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                        {c.tipoInsumoEvento}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px] truncate max-w-xs">{c.numeroNfeRef}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {formatCurrency(c.valorTotalInsumoBrl)}
                    </td>
                    <td className="py-3 px-4 text-indigo-300">
                      {formatCurrency(c.creditoCbsApropriadoBrl)}
                    </td>
                    <td className="py-3 px-4 text-indigo-300">
                      {formatCurrency(c.creditoIbsApropriadoBrl)}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-400">
                      {formatCurrency(c.creditoCbsApropriadoBrl + c.creditoIbsApropriadoBrl)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {c.statusApropriacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Parâmetros Regulamentares */}
      {activeTab === 'parametros' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Parâmetros Regulamentares & Alíquotas do Comitê Gestor IBS/CBS
            </h2>
            <p className="text-xs text-slate-400">
              Regras e alíquotas de transição fiscal para eventos, entretenimento e intermediação digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300">Alíquota CBS Federal (%)</label>
              <input
                type="number"
                step="0.01"
                value={params.aliquotaCbsPercent}
                onChange={(e) => setParams({ ...params, aliquotaCbsPercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400">Regime com redução de 60% para entretenimento.</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300">Alíquota IBS Estadual (%)</label>
              <input
                type="number"
                step="0.01"
                value={params.aliquotaIbsEstadualPercent}
                onChange={(e) => setParams({ ...params, aliquotaIbsEstadualPercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400">Repartição estadual padrão de destino.</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300">Alíquota IBS Municipal (%)</label>
              <input
                type="number"
                step="0.01"
                value={params.aliquotaIbsMunicipalPercent}
                onChange={(e) => setParams({ ...params, aliquotaIbsMunicipalPercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-slate-400">Substituição do ISSQN de Curitiba / Municípios de Realização.</p>
            </div>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-white">Split Payment Automático Ativo no Checkout</div>
                <div className="text-xs text-slate-400">Retenção síncrona no ato do Pix/Cartão via BACEN SPI</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.splitPaymentAutomaticoAtivo}
                  onChange={(e) => setParams({ ...params, splitPaymentAutomaticoAtivo: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
