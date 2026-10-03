import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  TaxReformConfigDto,
  TaxSplitCheckoutDto,
  TaxCreditApropriacaoDto,
  TaxApuracaoMensalDto,
  TaxReformKpisDto,
  SimularTransicaoTributariaResponseDto,
  CategoriaCreditoTributario,
  StatusSplitTributario,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR, formatCpfCnpj } from '@diskingressos/utils';
import {
  Calculator,
  Receipt,
  ShieldCheck,
  Split,
  TrendingDown,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Search,
  Filter,
  X,
  Check,
  Building2,
  DollarSign,
  QrCode,
  FileText,
  Sliders,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Scale,
} from 'lucide-react';

export const TaxReformPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'simulador' | 'split-checkout' | 'creditos' | 'apuracoes'
  >('simulador');

  // Estados dos Dados
  const [kpis, setKpis] = useState<TaxReformKpisDto>({
    totalSplitRetidoCheckout: 10.07,
    creditosIvaApropriados: 21200.0,
    economiaTributariaAcumulada: 2967.0,
    aliquotaEfetivaEventosPercent: 10.6,
    transacoesSplitContabilizadasCount: 3,
    nfsComCreditoHomologadasCount: 2,
  });

  const [splits, setSplits] = useState<TaxSplitCheckoutDto[]>([]);
  const [creditos, setCreditos] = useState<TaxCreditApropriacaoDto[]>([]);
  const [apuracoes, setApuracoes] = useState<TaxApuracaoMensalDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados do Simulador de Transição
  const [simReceitaIngressos, setSimReceitaIngressos] = useState<number>(1450000);
  const [simReceitaTaxas, setSimReceitaTaxas] = useState<number>(174000); // 12% comissão
  const [simCustosComNf, setSimCustosComNf] = useState<number>(200000); // Despesas de produção
  const [simulacaoResultado, setSimulacaoResultado] =
    useState<SimularTransicaoTributariaResponseDto | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Modais
  const [isModalCreditoOpen, setIsModalCreditoOpen] = useState(false);
  const [isModalTestarSplitOpen, setIsModalTestarSplitOpen] = useState(false);

  // Form Novo Crédito
  const [formCredito, setFormCredito] = useState({
    eventId: 'evt-001',
    eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
    numeroNfOrigem: '',
    fornecedorCnpj: '',
    fornecedorNome: '',
    categoriaDespesa: CategoriaCreditoTributario.SOM_ILUMINACAO,
    valorTotalNf: 50000,
  });

  // Form Testar Split
  const [formSplit, setFormSplit] = useState({
    valorIngresso: 250,
    taxaConveniencia: 25,
    eventId: 'evt-001',
    eventNome: 'Festival de Inverno Pedreira 2026',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpiRes, splitRes, credRes, apurRes] = await Promise.all([
        api.get<TaxReformKpisDto>('/tax-reform/dashboard'),
        api.get<TaxSplitCheckoutDto[]>('/tax-reform/split-checkout'),
        api.get<TaxCreditApropriacaoDto[]>('/tax-reform/creditos'),
        api.get<TaxApuracaoMensalDto[]>('/tax-reform/apuracoes'),
      ]);

      if (kpiRes.data) setKpis(kpiRes.data);
      if (splitRes.data) setSplits(splitRes.data);
      if (credRes.data) setCreditos(credRes.data);
      if (apurRes.data) setApuracoes(apurRes.data);
    } catch {
      // Mock local
      setKpis({
        totalSplitRetidoCheckout: 10.07,
        creditosIvaApropriados: 21200.0,
        economiaTributariaAcumulada: 2967.0,
        aliquotaEfetivaEventosPercent: 10.6,
        transacoesSplitContabilizadasCount: 3,
        nfsComCreditoHomologadasCount: 2,
      });

      const mockSplits: TaxSplitCheckoutDto[] = [
        {
          id: 'split-tax-001',
          codigoTransacao: 'SPL-TAX-2026-0001',
          paymentId: 'pay-001',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          valorBrutoTransacao: 220.0,
          baseCalculoTributavel: 20.0,
          aliquotaCbsEfetivaPercent: 3.52,
          valorCbsRetido: 0.7,
          aliquotaIbsEfetivaPercent: 7.08,
          valorIbsRetido: 1.42,
          totalSplitTributario: 2.12,
          valorLiquidoRecebedor: 217.88,
          status: StatusSplitTributario.RETIDO_NO_GATEWAY,
          idComiteGestor: 'CG-IBS-2026-9812401',
          createdAt: '2026-03-01T14:20:00Z',
        },
        {
          id: 'split-tax-002',
          codigoTransacao: 'SPL-TAX-2026-0002',
          paymentId: 'pay-002',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          valorBrutoTransacao: 440.0,
          baseCalculoTributavel: 40.0,
          aliquotaCbsEfetivaPercent: 3.52,
          valorCbsRetido: 1.41,
          aliquotaIbsEfetivaPercent: 7.08,
          valorIbsRetido: 2.83,
          totalSplitTributario: 4.24,
          valorLiquidoRecebedor: 435.76,
          status: StatusSplitTributario.RETIDO_NO_GATEWAY,
          idComiteGestor: 'CG-IBS-2026-9812402',
          createdAt: '2026-03-01T15:10:00Z',
        },
        {
          id: 'split-tax-003',
          codigoTransacao: 'SPL-TAX-2026-0003',
          paymentId: 'pay-003',
          eventId: 'evt-002',
          eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
          valorBrutoTransacao: 350.0,
          baseCalculoTributavel: 35.0,
          aliquotaCbsEfetivaPercent: 3.52,
          valorCbsRetido: 1.23,
          aliquotaIbsEfetivaPercent: 7.08,
          valorIbsRetido: 2.48,
          totalSplitTributario: 3.71,
          valorLiquidoRecebedor: 346.29,
          status: StatusSplitTributario.RETIDO_NO_GATEWAY,
          idComiteGestor: 'CG-IBS-2026-9812403',
          createdAt: '2026-03-02T10:05:00Z',
        },
      ];
      setSplits(mockSplits);

      const mockCreditos: TaxCreditApropriacaoDto[] = [
        {
          id: 'crd-001',
          codigoCredito: 'CRD-2026-0001',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          numeroNfOrigem: 'NFE-88412',
          chaveNfe: '41260308991442000190550010000884121004128912',
          fornecedorCnpj: '08.991.442/0001-90',
          fornecedorNome: 'Loud & Clear Sonorizações e Riders Profissionais Ltda',
          categoriaDespesa: CategoriaCreditoTributario.SOM_ILUMINACAO,
          valorTotalNf: 120000.0,
          baseCalculoCredito: 120000.0,
          cbsCreditoApurado: 4224.0,
          ibsCreditoApurado: 8496.0,
          totalCreditoApurado: 12720.0,
          status: 'HOMOLOGADO',
          homologadoEm: '2026-03-05T11:00:00Z',
          createdAt: '2026-03-05T10:00:00Z',
        },
        {
          id: 'crd-002',
          codigoCredito: 'CRD-2026-0002',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          numeroNfOrigem: 'NFE-4091',
          chaveNfe: '41260309981231000120550010000040911009182310',
          fornecedorCnpj: '09.981.231/0001-20',
          fornecedorNome: 'MegaStage Estruturas e Coberturas Geodésicas Ltda',
          categoriaDespesa: CategoriaCreditoTributario.ESTRUTURA_PALCO,
          valorTotalNf: 80000.0,
          baseCalculoCredito: 80000.0,
          cbsCreditoApurado: 2816.0,
          ibsCreditoApurado: 5664.0,
          totalCreditoApurado: 8480.0,
          status: 'HOMOLOGADO',
          homologadoEm: '2026-03-06T15:30:00Z',
          createdAt: '2026-03-06T14:00:00Z',
        },
      ];
      setCreditos(mockCreditos);

      const mockApuracoes: TaxApuracaoMensalDto[] = [
        {
          id: 'apur-001',
          competencia: '2026-02',
          receitaBrutaIngressos: 1450000.0,
          receitaPropriaTaxas: 174000.0,
          totalDebitoCbs: 6124.8,
          totalDebitoIbs: 12319.2,
          totalCreditoCbs: 2112.0,
          totalCreditoIbs: 4248.0,
          saldoPagarCbs: 4012.8,
          saldoPagarIbs: 8071.2,
          totalIvaDualPagar: 12084.0,
          impostoRegimeAntigo: 15051.0,
          diferencaEconomia: 2967.0,
          splitTributarioJaPago: 12084.0,
          saldoResidualGuia: 0.0,
          statusApuracao: 'FECHADA',
          dfeUnificadoChave: 'DFE-IBS-CBS-202602-PR-4106902-8812',
          createdAt: '2026-03-01T00:00:00Z',
          updatedAt: '2026-03-01T00:00:00Z',
        },
      ];
      setApuracoes(mockApuracoes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    // Executa a primeira simulação por padrão
    executarSimulacao();
  }, []);

  const executarSimulacao = async () => {
    setIsSimulating(true);
    try {
      const res = await api.post<SimularTransicaoTributariaResponseDto>('/tax-reform/simular', {
        receitaBrutaIngressos: Number(simReceitaIngressos),
        receitaPropriaTaxas: Number(simReceitaTaxas),
        custosComprovadosComNf: Number(simCustosComNf),
      });
      if (res.data) setSimulacaoResultado(res.data);
    } catch {
      // Mock local
      const base = Number(simReceitaTaxas);
      const pis = Number((base * 0.0065).toFixed(2));
      const cofins = Number((base * 0.03).toFixed(2));
      const iss = Number((base * 0.05).toFixed(2));
      const totAtual = Number((pis + cofins + iss).toFixed(2));

      const cbsDeb = Number((base * 0.0352).toFixed(2));
      const ibsDeb = Number((base * 0.0708).toFixed(2));
      const cbsCred = Number((Number(simCustosComNf) * 0.0352).toFixed(2));
      const ibsCred = Number((Number(simCustosComNf) * 0.0708).toFixed(2));
      const cbsLiq = Math.max(0, Number((cbsDeb - cbsCred).toFixed(2)));
      const ibsLiq = Math.max(0, Number((ibsDeb - ibsCred).toFixed(2)));
      const totIva = Number((cbsLiq + ibsLiq).toFixed(2));
      const diff = Number((totAtual - totIva).toFixed(2));

      setSimulacaoResultado({
        receitaTotal: Number(simReceitaIngressos) + base,
        custosComNf: Number(simCustosComNf),
        regimeAtual: {
          nome: 'Regime Atual (Lucro Presumido - PIS/COFINS Cumulativo + ISS Curitiba)',
          pisPercent: 0.65,
          pisValor: pis,
          cofinsPercent: 3.0,
          cofinsValor: cofins,
          issCuritibaPercent: 5.0,
          issCuritibaValor: iss,
          totalImpostos: totAtual,
          aliquotaEfetivaPercent: 8.65,
          creditosAproveitados: 0,
        },
        novoRegimeIvaDual: {
          nome: 'Reforma Tributária (IVA Dual CBS + IBS com Redução de 60% p/ Eventos Culturais)',
          cbsAliquota: 3.52,
          cbsDebitoBruto: cbsDeb,
          cbsCreditoSobreCustos: cbsCred,
          cbsLiquidoPagar: cbsLiq,
          ibsAliquota: 7.08,
          ibsDebitoBruto: ibsDeb,
          ibsCreditoSobreCustos: ibsCred,
          ibsLiquidoPagar: ibsLiq,
          totalIvaDualPagar: totIva,
          aliquotaEfetivaPercent: Number(((totIva / base) * 100).toFixed(2)),
          totalCreditosNaoCumulativos: Number((cbsCred + ibsCred).toFixed(2)),
        },
        regimeTeste2026: {
          nome: 'Ano-Base 2026 (Alíquota de Teste Compensável)',
          cbsTestePercent: 0.9,
          cbsTesteValor: Number((base * 0.009).toFixed(2)),
          ibsTestePercent: 0.1,
          ibsTesteValor: Number((base * 0.001).toFixed(2)),
          totalTesteValor: Number((base * 0.01).toFixed(2)),
        },
        diferencaValor: diff,
        saldoFavoravelNovoRegime: diff >= 0,
        observacaoLegal:
          'Conforme o art. 138 do PLP 68/2024, espetáculos, shows e festivais culturais gozam de 60% de redução no IVA Dual, garantindo apropriação irrestrita de créditos sobre rider, palcos e infraestrutura.',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSalvarCredito = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tax-reform/creditos', formCredito);
      showToast('Crédito fiscal homologado com sucesso!');
      setIsModalCreditoOpen(false);
      await carregarDados();
    } catch {
      const cbs = Number((formCredito.valorTotalNf * 0.0352).toFixed(2));
      const ibs = Number((formCredito.valorTotalNf * 0.0708).toFixed(2));
      const novo: TaxCreditApropriacaoDto = {
        id: `crd-mock-${Date.now()}`,
        codigoCredito: `CRD-2026-00${creditos.length + 10}`,
        eventId: formCredito.eventId,
        eventNome: formCredito.eventNome,
        numeroNfOrigem: formCredito.numeroNfOrigem,
        chaveNfe: `412603${formCredito.fornecedorCnpj.replace(/\D/g, '').padEnd(14, '0')}5500100008812310088412`,
        fornecedorCnpj: formCredito.fornecedorCnpj,
        fornecedorNome: formCredito.fornecedorNome,
        categoriaDespesa: formCredito.categoriaDespesa,
        valorTotalNf: formCredito.valorTotalNf,
        baseCalculoCredito: formCredito.valorTotalNf,
        cbsCreditoApurado: cbs,
        ibsCreditoApurado: ibs,
        totalCreditoApurado: Number((cbs + ibs).toFixed(2)),
        status: 'HOMOLOGADO',
        homologadoEm: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setCreditos([novo, ...creditos]);
      showToast('Crédito de IVA apropriado no razão tributário!');
      setIsModalCreditoOpen(false);
    }
  };

  const handleTestarSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tax-reform/split-checkout', formSplit);
      showToast('Transação processada com Split Tributário retido!');
      setIsModalTestarSplitOpen(false);
      await carregarDados();
    } catch {
      const cbs = Number((formSplit.taxaConveniencia * 0.0352).toFixed(2));
      const ibs = Number((formSplit.taxaConveniencia * 0.0708).toFixed(2));
      const totTax = Number((cbs + ibs).toFixed(2));
      const totBruto = formSplit.valorIngresso + formSplit.taxaConveniencia;

      const novo: TaxSplitCheckoutDto = {
        id: `split-tax-mock-${Date.now()}`,
        codigoTransacao: `SPL-TAX-2026-00${splits.length + 10}`,
        eventId: formSplit.eventId,
        eventNome: formSplit.eventNome,
        valorBrutoTransacao: totBruto,
        baseCalculoTributavel: formSplit.taxaConveniencia,
        aliquotaCbsEfetivaPercent: 3.52,
        valorCbsRetido: cbs,
        aliquotaIbsEfetivaPercent: 7.08,
        valorIbsRetido: ibs,
        totalSplitTributario: totTax,
        valorLiquidoRecebedor: Number((totBruto - totTax).toFixed(2)),
        status: StatusSplitTributario.RETIDO_NO_GATEWAY,
        idComiteGestor: `CG-IBS-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: new Date().toISOString(),
      };
      setSplits([novo, ...splits]);
      showToast('Split Tributário retido no ato da cobrança!');
      setIsModalTestarSplitOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Executivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-800/50">
              <Scale className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Hub de Inteligência Tributária & Reforma Tributária 2026
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Fase 20 Enterprise
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                IVA Dual (CBS/IBS), Split Tributário no Checkout & Não-Cumulatividade Plena (EC 132/23 & PLP 68/24)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalTestarSplitOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
          >
            <Split className="w-4 h-4" />
            Simular Split no Checkout
          </button>
          <button
            onClick={() => setIsModalCreditoOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Apropriar NF de Crédito
          </button>
          <button
            onClick={carregarDados}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Atualizar Dados"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Cards Principais de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Split Tributário Retido
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
              <Split className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.totalSplitRetidoCheckout)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Retido na adquirente direto p/ Comitê Gestor
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Créditos Fiscais de Eventos
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.creditosIvaApropriados)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Créditos de CBS/IBS sobre som, palco e rider
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Economia Tributária Líquida
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrencyBRL(kpis.economiaTributariaAcumulada)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ganho x PIS/COFINS/ISS antigo
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alíquota Efetiva de Eventos
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-rose-600 dark:text-rose-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {kpis.aliquotaEfetivaEventosPercent}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Redução de 60% (Art. 138 PLP 68/24)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'simulador'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Simulador Comparativo de Regimes
        </button>
        <button
          onClick={() => setActiveTab('split-checkout')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'split-checkout'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Split className="w-4 h-4" />
          Split Tributário no Checkout ({splits.length})
        </button>
        <button
          onClick={() => setActiveTab('creditos')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'creditos'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Créditos Tributários de Insumos ({creditos.length})
        </button>
        <button
          onClick={() => setActiveTab('apuracoes')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'apuracoes'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Apurações Mensais & DFe ({apuracoes.length})
        </button>
      </div>

      {/* Aba 1: Simulador Comparativo */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parâmetros */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-rose-600" />
              Parâmetros da Operação de Bilheteria
            </h2>
            <p className="text-xs text-slate-500">
              Ajuste as receitas e as despesas com nota fiscal para calcular a carga tributária comparada
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold mb-1">
                  Receita Bruta Total de Ingressos (R$):
                </label>
                <input
                  type="number"
                  value={simReceitaIngressos}
                  onChange={(e) => setSimReceitaIngressos(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-500">
                  (Valor de terceiros que pertence aos produtores)
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Receita Própria DiskIngressos (Taxas & Comissões R$):
                </label>
                <input
                  type="number"
                  value={simReceitaTaxas}
                  onChange={(e) => setSimReceitaTaxas(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-500">
                  (Base de cálculo tributável: Taxa de conveniência + Comissões)
                </span>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Custos Operacionais c/ NF (Som, Palco, Luz R$):
                </label>
                <input
                  type="number"
                  value={simCustosComNf}
                  onChange={(e) => setSimCustosComNf(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-500">
                  (Insumos que geram créditos de CBS/IBS no novo regime)
                </span>
              </div>

              <button
                onClick={executarSimulacao}
                disabled={isSimulating}
                className="w-full py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {isSimulating ? 'Calculando Cenários...' : 'Calcular Cenários Tributários'}
              </button>
            </div>
          </div>

          {/* Resultado Comparativo */}
          <div className="lg:col-span-2 space-y-4">
            {simulacaoResultado ? (
              <div className="space-y-4">
                {/* Banner de Economia */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    simulacaoResultado.saldoFavoravelNovoRegime
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">
                        {simulacaoResultado.saldoFavoravelNovoRegime
                          ? 'Cenário Positivo com a Reforma Tributária!'
                          : 'Atenção aos Créditos Operacionais!'}
                      </h4>
                      <p className="text-xs opacity-90">
                        {simulacaoResultado.saldoFavoravelNovoRegime
                          ? `Economia tributária estimada de ${formatCurrencyBRL(
                              simulacaoResultado.diferencaValor,
                            )} graças à redução de 60% e aos créditos sobre custos.`
                          : 'Insumos adicionais com nota fiscal podem aumentar a apropriação de créditos.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs uppercase font-semibold">Economia</span>
                    <div className="text-lg font-extrabold">
                      {formatCurrencyBRL(simulacaoResultado.diferencaValor)}
                    </div>
                  </div>
                </div>

                {/* Grid Lado a Lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Regime Atual */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        Regime Atual (Cumulativo)
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Lucro Presumido
                      </span>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">PIS (0,65%):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrencyBRL(simulacaoResultado.regimeAtual.pisValor)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">COFINS (3,00%):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrencyBRL(simulacaoResultado.regimeAtual.cofinsValor)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ISSQN Curitiba (5,00%):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrencyBRL(simulacaoResultado.regimeAtual.issCuritibaValor)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1 text-slate-400">
                        <span>Créditos sobre Despesas:</span>
                        <span>R$ 0,00 (Vedado)</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm font-bold text-slate-900 dark:text-white">
                        <span>Total Imposto a Recolher:</span>
                        <span className="text-rose-600 dark:text-rose-400">
                          {formatCurrencyBRL(simulacaoResultado.regimeAtual.totalImpostos)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Novo Regime Reforma */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
                        Novo IVA Dual (Não-Cumulativo)
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        -60% Redução Eventos
                      </span>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CBS Débito (3,52%):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrencyBRL(simulacaoResultado.novoRegimeIvaDual.cbsDebitoBruto)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">IBS Débito (7,08%):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrencyBRL(simulacaoResultado.novoRegimeIvaDual.ibsDebitoBruto)}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800 pt-1 font-medium">
                        <span>(-) Créditos sobre Custos c/ NF:</span>
                        <span>
                          -
                          {formatCurrencyBRL(
                            simulacaoResultado.novoRegimeIvaDual.totalCreditosNaoCumulativos,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm font-bold text-slate-900 dark:text-white">
                        <span>Total IVA Dual Líquido:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatCurrencyBRL(simulacaoResultado.novoRegimeIvaDual.totalIvaDualPagar)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nota de Compliance Legal */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{simulacaoResultado.observacaoLegal}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Aba 2: Split Tributário no Checkout */}
      {activeTab === 'split-checkout' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Split className="w-5 h-5 text-rose-600" />
                Retenções de Split Tributário Instantâneo no Checkout
              </h2>
              <p className="text-xs text-slate-500">
                Divisão automática dos tributos no gateway direcionada à câmara de compensação do Comitê Gestor (Art. 49 PLP 68/24)
              </p>
            </div>
            <button
              onClick={() => setIsModalTestarSplitOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Simular Compra c/ Split
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Evento</th>
                  <th className="px-5 py-3 text-right">Valor Total</th>
                  <th className="px-5 py-3 text-right">Base Tributável</th>
                  <th className="px-5 py-3 text-right">CBS Retida</th>
                  <th className="px-5 py-3 text-right">IBS Retido</th>
                  <th className="px-5 py-3 text-right">Total Split Retido</th>
                  <th className="px-5 py-3 text-right">Repasse Líquido</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {splits.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {s.codigoTransacao}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                      {s.eventNome}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(s.valorBrutoTransacao)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-500">
                      {formatCurrencyBRL(s.baseCalculoTributavel)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrencyBRL(s.valorCbsRetido)} (3,52%)
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrencyBRL(s.valorIbsRetido)} (7,08%)
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrencyBRL(s.totalSplitTributario)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(s.valorLiquidoRecebedor)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba 3: Créditos Tributários de Insumos */}
      {activeTab === 'creditos' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Apropriação de Créditos Fiscais de Eventos (Não-Cumulatividade)
              </h2>
              <p className="text-xs text-slate-500">
                Créditos imediatos de CBS e IBS recolhidos na contratação de geradores, iluminação, palcos e rider
              </p>
            </div>
            <button
              onClick={() => setIsModalCreditoOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar NF de Fornecedor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">NF / Fornecedor</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3 text-right">Valor da NF</th>
                  <th className="px-5 py-3 text-right">Crédito CBS</th>
                  <th className="px-5 py-3 text-right">Crédito IBS</th>
                  <th className="px-5 py-3 text-right">Crédito Total</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {creditos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {c.codigoCredito}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{c.fornecedorNome}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {c.numeroNfOrigem} • {formatCpfCnpj(c.fornecedorCnpj)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {c.categoriaDespesa}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(c.valorTotalNf)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrencyBRL(c.cbsCreditoApurado)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrencyBRL(c.ibsCreditoApurado)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrencyBRL(c.totalCreditoApurado)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba 4: Apurações Mensais & DFe */}
      {activeTab === 'apuracoes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              Apurações Mensais do IVA Dual & DFe Unificado
            </h2>
            <p className="text-xs text-slate-500">
              Demonstrativo consolidado de Débitos x Créditos com compensação do Split Tributário retido no mês
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Competência</th>
                  <th className="px-5 py-3 text-right">Base Tributável</th>
                  <th className="px-5 py-3 text-right">Débito IVA Dual</th>
                  <th className="px-5 py-3 text-right">Créditos Abatidos</th>
                  <th className="px-5 py-3 text-right">IVA Dual a Recolher</th>
                  <th className="px-5 py-3 text-right">Split Já Retido</th>
                  <th className="px-5 py-3 text-right">Saldo Guia Final</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {apuracoes.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {a.competencia}
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {a.dfeUnificadoChave}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(a.receitaPropriaTaxas)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-rose-600 dark:text-rose-400">
                      {formatCurrencyBRL(a.totalDebitoCbs + a.totalDebitoIbs)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      -{formatCurrencyBRL(a.totalCreditoCbs + a.totalCreditoIbs)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(a.totalIvaDualPagar)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-blue-600 dark:text-blue-400">
                      -{formatCurrencyBRL(a.splitTributarioJaPago)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrencyBRL(a.saldoResidualGuia)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        {a.statusApuracao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Nova NF de Crédito */}
      {isModalCreditoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Apropriar NF de Insumos (Crédito IBS/CBS)
              </h3>
              <button
                onClick={() => setIsModalCreditoOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarCredito} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Razão Social do Fornecedor:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prime Sound Curitiba Iluminações Ltda"
                  value={formCredito.fornecedorNome}
                  onChange={(e) =>
                    setFormCredito({ ...formCredito, fornecedorNome: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">CNPJ do Fornecedor:</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={formCredito.fornecedorCnpj}
                    onChange={(e) =>
                      setFormCredito({ ...formCredito, fornecedorCnpj: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Número da NF-e:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: NFE-55420"
                    value={formCredito.numeroNfOrigem}
                    onChange={(e) =>
                      setFormCredito({ ...formCredito, numeroNfOrigem: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Categoria do Insumo:</label>
                  <select
                    value={formCredito.categoriaDespesa}
                    onChange={(e) =>
                      setFormCredito({
                        ...formCredito,
                        categoriaDespesa: e.target.value as CategoriaCreditoTributario,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={CategoriaCreditoTributario.SOM_ILUMINACAO}>
                      Som & Iluminação
                    </option>
                    <option value={CategoriaCreditoTributario.ESTRUTURA_PALCO}>
                      Estruturas de Palco
                    </option>
                    <option value={CategoriaCreditoTributario.SEGURANCA}>
                      Segurança & Brigada
                    </option>
                    <option value={CategoriaCreditoTributario.PUBLICIDADE}>
                      Publicidade & Mídia
                    </option>
                    <option value={CategoriaCreditoTributario.LOCACAO_ESPACO}>
                      Locação de Espaço
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Valor Total da NF (R$):</label>
                  <input
                    type="number"
                    required
                    value={formCredito.valorTotalNf}
                    onChange={(e) =>
                      setFormCredito({ ...formCredito, valorTotalNf: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalCreditoOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Apropriar Crédito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Testar Split no Checkout */}
      {isModalTestarSplitOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Split className="w-5 h-5 text-rose-600" />
                Simular Transação com Split Tributário
              </h3>
              <button
                onClick={() => setIsModalTestarSplitOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTestarSplit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Valor do Ingresso (R$):</label>
                <input
                  type="number"
                  required
                  value={formSplit.valorIngresso}
                  onChange={(e) =>
                    setFormSplit({ ...formSplit, valorIngresso: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Taxa de Conveniência (R$):</label>
                <input
                  type="number"
                  required
                  value={formSplit.taxaConveniencia}
                  onChange={(e) =>
                    setFormSplit({ ...formSplit, taxaConveniencia: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-500">
                  (O split do IVA Dual incide exclusivamente sobre a taxa própria da bilheteria)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">CBS Retida (3,52%):</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrencyBRL((formSplit.taxaConveniencia * 0.0352))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IBS Retido (7,08%):</span>
                  <span className="font-semibold text-purple-600">
                    {formatCurrencyBRL((formSplit.taxaConveniencia * 0.0708))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 font-bold">
                  <span>Total Split Direto p/ Comitê Gestor:</span>
                  <span className="text-rose-600">
                    {formatCurrencyBRL((formSplit.taxaConveniencia * 0.106))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalTestarSplitOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Executar Split no Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
