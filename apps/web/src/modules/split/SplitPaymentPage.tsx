import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  GatewaySubaccountDto,
  GatewaySplitConfigDto,
  PaymentSplitTransactionDto,
  SplitPaymentKpisDto,
  SimularSplitResponseDto,
  GatewayProvider,
  StatusSubaccountKyc,
  StatusSplitTransaction,
  TipoRegraSplit,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR, formatCpfCnpj } from '@diskingressos/utils';
import {
  Split,
  Layers,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  Percent,
  RefreshCw,
  Plus,
  Search,
  Filter,
  X,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  ExternalLink,
  Sliders,
  HelpCircle,
} from 'lucide-react';

const GATEWAY_LABELS: Record<GatewayProvider, { name: string; badge: string }> = {
  [GatewayProvider.PAGARME_STONE]: {
    name: 'Stone Pagar.me v5',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
  },
  [GatewayProvider.CIELO]: {
    name: 'Cielo eCommerce 3.0',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  },
  [GatewayProvider.EREDE]: {
    name: 'Rede e.Rede Itaú',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
  },
  [GatewayProvider.PAGBANK]: {
    name: 'PagBank Split',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300',
  },
  [GatewayProvider.ASAAS]: {
    name: 'Asaas Marketplace',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
  },
};

const STATUS_TX_BADGES: Record<StatusSplitTransaction, { label: string; badge: string }> = {
  [StatusSplitTransaction.PROCESSADO]: {
    label: 'Processado / D+30',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  [StatusSplitTransaction.RETIDO_ESCROW]: {
    label: 'Retido em Escrow',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  [StatusSplitTransaction.LIQUIDADO]: {
    label: 'Liquidado na Subconta',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold',
  },
  [StatusSplitTransaction.ESTORNADO]: {
    label: 'Estornado Pro-Rata',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  [StatusSplitTransaction.CONTESTADO_CHARGEBACK]: {
    label: 'Chargeback / Débito',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
};

export const SplitPaymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transacoes' | 'simulador' | 'subcontas' | 'regras'>('transacoes');
  const [kpis, setKpis] = useState<SplitPaymentKpisDto | null>(null);
  const [transactions, setTransactions] = useState<PaymentSplitTransactionDto[]>([]);
  const [subaccounts, setSubaccounts] = useState<GatewaySubaccountDto[]>([]);
  const [configs, setConfigs] = useState<GatewaySplitConfigDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulador
  const [simEventoId, setSimEventoId] = useState('evt-001');
  const [simValorIngresso, setSimValorIngresso] = useState(150);
  const [simTaxaServico, setSimTaxaServico] = useState(15);
  const [simQtd, setSimQtd] = useState(1);
  const [simMetodo, setSimMetodo] = useState('CARTAO_CREDITO_1X');
  const [simProdutorMdr, setSimProdutorMdr] = useState(true);
  const [simResult, setSimResult] = useState<SimularSplitResponseDto | null>(null);
  const [simulando, setSimulando] = useState(false);

  // Modais
  const [showNovaSubcontaModal, setShowNovaSubcontaModal] = useState(false);
  const [showNovaRegraModal, setShowNovaRegraModal] = useState(false);
  const [showEstornoModal, setShowEstornoModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<PaymentSplitTransactionDto | null>(null);

  // Form Subconta
  const [novoProdutorNome, setNovoProdutorNome] = useState('');
  const [novoDocFiscal, setNovoDocFiscal] = useState('');
  const [novoGateway, setNovoGateway] = useState<GatewayProvider>(GatewayProvider.PAGARME_STONE);
  const [novoBanco, setNovoBanco] = useState('341 - Itaú Unibanco');
  const [novaAgencia, setNovaAgencia] = useState('');
  const [novaConta, setNovaConta] = useState('');
  const [novaChavePix, setNovaChavePix] = useState('');

  // Form Regra
  const [regraEventoNome, setRegraEventoNome] = useState('');
  const [regraComissao, setRegraComissao] = useState(12.0);
  const [regraTaxaFixa, setRegraTaxaFixa] = useState(5.0);
  const [regraSubcontaId, setRegraSubcontaId] = useState('');

  // Form Estorno
  const [motivoEstorno, setMotivoEstorno] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const applyDemoFallback = () => {
    setKpis({
      volumeTotalTransacionadoSplit: 1410.0,
      receitaPropriaRetidaDisk: 186.0,
      volumeLiquidadoProdutores: 1224.0,
      totalMdrAdquirentes: 39.01,
      subcontasHomologadas: 3,
      totalTransacoesProcessadas: 3,
      taxaMediaComissao: 11.5,
      indiceEstornosSplit: 0.0,
    });

    setSubaccounts([
      {
        id: 'sub-001',
        producerId: 'prod-001',
        producerNome: 'Opus Entretenimento Curitiba Ltda',
        gateway: GatewayProvider.PAGARME_STONE,
        recipientId: 're_stone_curitiba_opus_001',
        statusKyc: StatusSubaccountKyc.APROVADO,
        documentoFiscal: '04.821.902/0001-44',
        razaoSocial: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
        banco: '341 - Itaú Unibanco S.A.',
        agencia: '0084',
        conta: '55420-1',
        tipoChavePix: 'CNPJ',
        chavePix: '04821902000144',
        transferenciaAutomatica: true,
        periodicidadeLiquidacao: 'D+30_CREDITO',
        homologadoEm: new Date(Date.now() - 60 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: 'sub-002',
        producerId: 'prod-002',
        producerNome: 'Seven Live Entretenimento Brasil',
        gateway: GatewayProvider.CIELO,
        recipientId: 're_cielo_seven_live_992',
        statusKyc: StatusSubaccountKyc.APROVADO,
        documentoFiscal: '11.450.882/0001-90',
        razaoSocial: 'Seven Live Eventos e Espetáculos Brasil Ltda',
        banco: '237 - Banco Bradesco S.A.',
        agencia: '1240',
        conta: '99412-8',
        tipoChavePix: 'E-MAIL',
        chavePix: 'financeiro@sevenlive.com.br',
        transferenciaAutomatica: true,
        periodicidadeLiquidacao: 'D+30_CREDITO',
        homologadoEm: new Date(Date.now() - 45 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: 'sub-003',
        producerId: 'prod-003',
        producerNome: 'Curitiba Comedy Club Produções',
        gateway: GatewayProvider.EREDE,
        recipientId: 're_erede_curitiba_comedy_331',
        statusKyc: StatusSubaccountKyc.APROVADO,
        documentoFiscal: '22.901.334/0001-12',
        razaoSocial: 'Curitiba Comedy Club Produções Culturais Eireli',
        banco: '001 - Banco do Brasil S.A.',
        agencia: '3102',
        conta: '12880-3',
        tipoChavePix: 'ALEATORIA',
        chavePix: '8f749102-1209-4821-bca2-881290312984',
        transferenciaAutomatica: true,
        periodicidadeLiquidacao: 'D+1_PIX',
        homologadoEm: new Date(Date.now() - 10 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ]);

    setConfigs([
      {
        id: 'cfg-001',
        eventId: 'evt-001',
        eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        producerId: 'prod-001',
        subaccountId: 'sub-001',
        gateway: GatewayProvider.PAGARME_STONE,
        tipoDivisao: TipoRegraSplit.PERCENTUAL,
        comissaoDiskPercent: 12.0,
        taxaServicoFixa: 4.5,
        produtorMdrAbsorvido: true,
        produtorChargebackResponsavel: true,
        status: 'ATIVO',
        criadoPor: 'Diretoria Comercial',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'cfg-002',
        eventId: 'evt-002',
        eventNome: 'Turnê Titãs Encontro Arena da Baixada',
        producerId: 'prod-002',
        subaccountId: 'sub-002',
        gateway: GatewayProvider.CIELO,
        tipoDivisao: TipoRegraSplit.PERCENTUAL,
        comissaoDiskPercent: 10.0,
        taxaServicoFixa: 5.0,
        produtorMdrAbsorvido: true,
        produtorChargebackResponsavel: true,
        status: 'ATIVO',
        criadoPor: 'Diretoria Comercial',
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
    ]);

    setTransactions([
      {
        id: 'spl-tx-001',
        codigoTransacao: 'SPL-2026-000412',
        transacaoIdExterna: 'tid_cielo_991823901',
        paymentId: 'pay-001',
        saleId: 'ven-001',
        eventId: 'evt-001',
        eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        subaccountId: 'sub-001',
        gateway: GatewayProvider.PAGARME_STONE,
        metodoPagamento: 'CARTAO_CREDITO_1X',
        valorTotalBruto: 220.0,
        valorProdutor: 188.0,
        valorDiskIngressos: 32.0,
        valorMdrTotal: 6.16,
        mdrProdutor: 6.16,
        mdrDiskIngressos: 0.0,
        status: StatusSplitTransaction.LIQUIDADO,
        liquidadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'spl-tx-002',
        codigoTransacao: 'SPL-2026-000413',
        transacaoIdExterna: 'tid_stone_449012389',
        paymentId: 'pay-002',
        saleId: 'ven-002',
        eventId: 'evt-001',
        eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        subaccountId: 'sub-001',
        gateway: GatewayProvider.PAGARME_STONE,
        metodoPagamento: 'PIX',
        valorTotalBruto: 440.0,
        valorProdutor: 376.0,
        valorDiskIngressos: 64.0,
        valorMdrTotal: 4.35,
        mdrProdutor: 4.35,
        mdrDiskIngressos: 0.0,
        status: StatusSplitTransaction.LIQUIDADO,
        liquidadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'spl-tx-003',
        codigoTransacao: 'SPL-2026-000414',
        transacaoIdExterna: 'tid_cielo_119028374',
        paymentId: 'pay-003',
        saleId: 'ven-003',
        eventId: 'evt-002',
        eventNome: 'Turnê Titãs Encontro Arena da Baixada',
        subaccountId: 'sub-002',
        gateway: GatewayProvider.CIELO,
        metodoPagamento: 'CARTAO_CREDITO_PARCELADO',
        valorTotalBruto: 750.0,
        valorProdutor: 660.0,
        valorDiskIngressos: 90.0,
        valorMdrTotal: 28.5,
        mdrProdutor: 28.5,
        mdrDiskIngressos: 0.0,
        status: StatusSplitTransaction.PROCESSADO,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ]);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [resKpis, resTx, resSub, resCfg]: any = await Promise.all([
        api.get('/split-payment/kpis'),
        api.get('/split-payment/transactions', {
          params: { status: filterStatus !== 'TODOS' ? filterStatus : undefined },
        }),
        api.get('/split-payment/subaccounts'),
        api.get('/split-payment/configs'),
      ]);

      if (resKpis) setKpis(resKpis);
      if (resTx && Array.isArray(resTx)) setTransactions(resTx);
      if (resSub && Array.isArray(resSub)) setSubaccounts(resSub);
      if (resCfg && Array.isArray(resCfg)) setConfigs(resCfg);
    } catch (err) {
      console.warn('Usando dados de demonstração para Split de Pagamento:', err);
      applyDemoFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  // Simulação de split em tempo real
  useEffect(() => {
    const runSimulacao = async () => {
      try {
        setSimulando(true);
        const res: any = await api.post('/split-payment/simular', {
          eventId: simEventoId,
          valorIngresso: simValorIngresso,
          taxaServico: simTaxaServico,
          quantidade: simQtd,
          metodoPagamento: simMetodo,
          taxaMdrPercent: simMetodo === 'PIX' ? 0.99 : simMetodo.includes('PARCELADO') ? 3.2 : 2.5,
        });

        if (res) {
          setSimResult(res);
        }
      } catch (err) {
        // Cálculo fallback de simulação
        const ingressosTotal = simValorIngresso * simQtd;
        const taxaTotal = simTaxaServico * simQtd;
        const total = ingressosTotal + taxaTotal;
        const comissaoDisk = Number(((ingressosTotal * 0.12) + taxaTotal).toFixed(2));
        const fatiaProdutor = Number((total - comissaoDisk).toFixed(2));
        const mdrRate = simMetodo === 'PIX' ? 0.0099 : simMetodo.includes('PARCELADO') ? 0.032 : 0.025;
        const mdrTotal = Number((total * mdrRate).toFixed(2));

        setSimResult({
          valorTotalTransacao: total,
          fatiaProdutorBruta: fatiaProdutor,
          fatiaDiskBruta: comissaoDisk,
          taxaMdrTotal: mdrTotal,
          mdrAbsorvidoProdutor: simProdutorMdr ? mdrTotal : 0,
          mdrAbsorvidoDisk: simProdutorMdr ? 0 : mdrTotal,
          valorLiquidoProdutor: simProdutorMdr ? Number((fatiaProdutor - mdrTotal).toFixed(2)) : fatiaProdutor,
          valorLiquidoDisk: simProdutorMdr ? comissaoDisk : Number((comissaoDisk - mdrTotal).toFixed(2)),
          produtorMdrAbsorvido: simProdutorMdr,
          percentualEfetivoDisk: Number(((comissaoDisk / total) * 100).toFixed(2)),
          isKycAprovado: true,
        });
      } finally {
        setSimulando(false);
      }
    };

    const timer = setTimeout(runSimulacao, 250);
    return () => clearTimeout(timer);
  }, [simEventoId, simValorIngresso, simTaxaServico, simQtd, simMetodo, simProdutorMdr]);

  const handleCadastrarSubconta = async () => {
    try {
      setActionLoading(true);
      const payload = {
        producerId: `prod-${Date.now()}`,
        producerNome: novoProdutorNome || 'Nova Produtora Parceira',
        gateway: novoGateway,
        documentoFiscal: novoDocFiscal || '00.000.000/0001-00',
        razaoSocial: novoProdutorNome || 'Razão Social Homologada Ltda',
        banco: novoBanco,
        agencia: novaAgencia || '0001',
        conta: novaConta || '12345-6',
        chavePix: novaChavePix || novoDocFiscal,
        transferenciaAutomatica: true,
        periodicidadeLiquidacao: 'D+30_CREDITO',
      };

      const res: any = await api.post('/split-payment/subaccounts', payload);
      setFeedbackMsg({
        tipo: 'success',
        texto: `Subconta ${res?.recipientId || 're_homologada'} credenciada com sucesso na adquirente!`,
      });
      setShowNovaSubcontaModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao cadastrar subconta.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSalvarRegra = async () => {
    try {
      setActionLoading(true);
      const sub = subaccounts.find((s) => s.id === regraSubcontaId) || subaccounts[0];
      const payload = {
        eventId: `evt-${Date.now()}`,
        eventNome: regraEventoNome || 'Novo Evento Cadastrado',
        producerId: sub ? sub.producerId : 'prod-001',
        subaccountId: sub ? sub.id : 'sub-001',
        comissaoDiskPercent: regraComissao,
        taxaServicoFixa: regraTaxaFixa,
        produtorMdrAbsorvido: true,
        produtorChargebackResponsavel: true,
      };

      await api.post('/split-payment/configs', payload);
      setFeedbackMsg({
        tipo: 'success',
        texto: `Regra de split para "${payload.eventNome}" salva com sucesso!`,
      });
      setShowNovaRegraModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao salvar regra de split.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecutarEstorno = async () => {
    if (!selectedTx) return;
    try {
      setActionLoading(true);
      await api.post(`/split-payment/transactions/${selectedTx.id}/estorno`, {
        motivoEstorno: motivoEstorno || 'Direito de arrependimento CDC Art. 49 solicitado pelo cliente.',
        solicitadoPor: 'SAC & Financeiro DiskIngressos',
      });

      setFeedbackMsg({
        tipo: 'success',
        texto: `Estorno pro-rata da transação ${selectedTx.codigoTransacao} executado na adquirente!`,
      });
      setShowEstornoModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao processar estorno de split.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Split className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Split de Pagamento Nativo & Subadquirência
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              LC 116/03 & IN RFB 2.179
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Divisão primária na raiz da adquirente (Cielo, Stone, Rede, PagBank) eliminando riscos de bitributação e custódia financeira.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNovaSubcontaModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nova Subconta (Adquirente)
          </button>
          <button
            onClick={loadData}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            feedbackMsg.tipo === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span>{feedbackMsg.texto}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 CARDS DE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Volume Total em Split
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis?.volumeTotalTransacionadoSplit || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Processado na raiz das adquirentes
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receita Própria Disk
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis?.receitaPropriaRetidaDisk || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Comissão + Taxa de Conveniência tributável
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Liquidado aos Produtores
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg text-purple-600 dark:text-purple-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrencyBRL(kpis?.volumeLiquidadoProdutores || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Direto nas subcontas em D+1 / D+30
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subcontas Homologadas
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {kpis?.subcontasHomologadas || 0}
            </span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              Stone, Cielo e Rede com KYC aprovado
            </p>
          </div>
        </div>
      </div>

      {/* ABAS */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('transacoes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'transacoes'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Transações Divididas na Adquirente
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {transactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'simulador'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Simulador de Checkout & Partição
        </button>

        <button
          onClick={() => setActiveTab('subcontas')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'subcontas'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Subcontas de Produtores (KYC)
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {subaccounts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('regras')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'regras'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Regras Configuradas por Evento
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {configs.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: TRANSAÇÕES COM SPLIT NATIVO */}
      {/* ========================================================================= */}
      {activeTab === 'transacoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-80 relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar código, evento ou recebedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2"
              >
                <option value="TODOS">Todos os Status</option>
                <option value={StatusSplitTransaction.PROCESSADO}>Processado</option>
                <option value={StatusSplitTransaction.LIQUIDADO}>Liquidado</option>
                <option value={StatusSplitTransaction.RETIDO_ESCROW}>Retido em Escrow</option>
                <option value={StatusSplitTransaction.ESTORNADO}>Estornado</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Código / TID Gateway</th>
                    <th className="px-4 py-3.5">Evento & Adquirente</th>
                    <th className="px-4 py-3.5">Método Pagamento</th>
                    <th className="px-4 py-3.5 text-right">Valor Bruto</th>
                    <th className="px-4 py-3.5 text-right">Fatia Produtor</th>
                    <th className="px-4 py-3.5 text-right">Fatia Disk (Comissão)</th>
                    <th className="px-4 py-3.5">Status Liquidação</th>
                    <th className="px-4 py-3.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{tx.codigoTransacao}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{tx.transacaoIdExterna}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{tx.eventNome}</div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${GATEWAY_LABELS[tx.gateway]?.badge || 'bg-slate-100'}`}>
                            {GATEWAY_LABELS[tx.gateway]?.name || tx.gateway}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          {tx.metodoPagamento === 'PIX' ? (
                            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          {tx.metodoPagamento}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          MDR: {formatCurrencyBRL(tx.valorMdrTotal)} (Produtor)
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrencyBRL(tx.valorTotalBruto)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="font-bold text-purple-600 dark:text-purple-400">
                          {formatCurrencyBRL(tx.valorProdutor)}
                        </div>
                        <div className="text-[11px] text-slate-400">Subconta Produtor</div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrencyBRL(tx.valorDiskIngressos)}
                        </div>
                        <div className="text-[11px] text-slate-400">Conta DiskIngressos</div>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_TX_BADGES[tx.status]?.badge || 'bg-slate-100'}`}>
                          {STATUS_TX_BADGES[tx.status]?.label || tx.status}
                        </span>
                        {tx.liquidadoEm && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Em: {formatDateBR(tx.liquidadoEm)}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {tx.status !== StatusSplitTransaction.ESTORNADO && (
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setShowEstornoModal(true);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition"
                            title="Estornar Pro-Rata na Adquirente (CDC 49)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: SIMULADOR DE CHECKOUT & PARTIÇÃO */}
      {/* ========================================================================= */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                Simulador de Split Primário em Tempo Real
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simula como o gateway/adquirente dividirá o pagamento no momento do checkout entre Produtor e DiskIngressos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Valor Facial do Ingresso (R$)
                </label>
                <input
                  type="number"
                  min={10}
                  step={5}
                  value={simValorIngresso}
                  onChange={(e) => setSimValorIngresso(Number(e.target.value))}
                  className="w-full text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Taxa de Conveniência Disk (R$)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={simTaxaServico}
                  onChange={(e) => setSimTaxaServico(Number(e.target.value))}
                  className="w-full text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Quantidade de Ingressos
                </label>
                <select
                  value={simQtd}
                  onChange={(e) => setSimQtd(Number(e.target.value))}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-medium"
                >
                  <option value={1}>1 ingresso</option>
                  <option value={2}>2 ingressos</option>
                  <option value={4}>4 ingressos</option>
                  <option value={10}>10 ingressos (Grupo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Método de Pagamento
                </label>
                <select
                  value={simMetodo}
                  onChange={(e) => setSimMetodo(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-medium"
                >
                  <option value="PIX">Pix (0.99% taxa)</option>
                  <option value="CARTAO_CREDITO_1X">Cartão de Crédito 1x (2.50%)</option>
                  <option value="CARTAO_CREDITO_PARCELADO">Cartão Parcelado 6x (3.20%)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={simProdutorMdr}
                    onChange={(e) => setSimProdutorMdr(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  Produtor absorve taxa MDR
                </label>
              </div>
            </div>

            {/* GRÁFICO VISUAL DE PARTIÇÃO */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Visualização Gráfica da Divisão Primária
              </span>
              <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div
                  style={{
                    width: `${simResult?.valorTotalTransacao ? (simResult.valorLiquidoProdutor / simResult.valorTotalTransacao) * 100 : 75}%`,
                  }}
                  className="bg-purple-600 h-full flex items-center justify-center text-[11px] text-white font-bold"
                  title="Fatia Líquida do Produtor"
                >
                  Produtor ({Math.round(simResult?.valorTotalTransacao ? (simResult.valorLiquidoProdutor / simResult.valorTotalTransacao) * 100 : 75)}%)
                </div>
                <div
                  style={{
                    width: `${simResult?.valorTotalTransacao ? (simResult.valorLiquidoDisk / simResult.valorTotalTransacao) * 100 : 22}%`,
                  }}
                  className="bg-emerald-600 h-full flex items-center justify-center text-[11px] text-white font-bold"
                  title="Receita da DiskIngressos"
                >
                  Disk ({Math.round(simResult?.valorTotalTransacao ? (simResult.valorLiquidoDisk / simResult.valorTotalTransacao) * 100 : 22)}%)
                </div>
                <div
                  style={{
                    width: `${simResult?.valorTotalTransacao ? (simResult.taxaMdrTotal / simResult.valorTotalTransacao) * 100 : 3}%`,
                  }}
                  className="bg-slate-400 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Taxa MDR Adquirente"
                >
                  MDR
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DIREITO: RESUMO DO SPLIT */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-indigo-800/50 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Partição Liquidada no Gateway
            </span>

            <div>
              <div className="text-xs text-indigo-300">Valor Cobrado no Cartão / Pix</div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {formatCurrencyBRL(simResult?.valorTotalTransacao || 0)}
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-indigo-800/60 py-3">
              <div className="flex justify-between">
                <span className="text-indigo-200">Destino 1 (Subconta Produtor):</span>
                <span className="font-bold text-purple-300">
                  {formatCurrencyBRL(simResult?.valorLiquidoProdutor || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Destino 2 (Conta DiskIngressos):</span>
                <span className="font-bold text-emerald-300">
                  {formatCurrencyBRL(simResult?.valorLiquidoDisk || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">MDR Retido na Adquirente:</span>
                <span className="font-semibold text-slate-300">
                  - {formatCurrencyBRL(simResult?.taxaMdrTotal || 0)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/70 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Em conformidade com IN RFB 2.179 / COSIT 23/14
              </div>
              <p className="text-[11px] text-indigo-300">
                Apenas a fatia de {formatCurrencyBRL(simResult?.valorLiquidoDisk || 0)} ingressa na escrituração tributária e NFS-e da DiskIngressos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: SUBCONTAS DE PRODUTORES (KYC ADQUIRENTES) */}
      {/* ========================================================================= */}
      {activeTab === 'subcontas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Subcontas Credenciadas nas Adquirentes
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Recebedores homologados para recebimento direto de vendas sem trânsito na conta da ticketeira.
              </p>
            </div>
            <button
              onClick={() => setShowNovaSubcontaModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Credenciar Produtor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subaccounts.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${GATEWAY_LABELS[sub.gateway]?.badge || 'bg-slate-100'}`}>
                    {GATEWAY_LABELS[sub.gateway]?.name || sub.gateway}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {sub.statusKyc}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {sub.producerNome}
                  </h4>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {formatCpfCnpj(sub.documentoFiscal)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Recipient ID:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{sub.recipientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domicílio Bancário:</span>
                    <span className="font-semibold">{sub.banco}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agência / Conta:</span>
                    <span>Ag {sub.agencia} | CC {sub.conta}</span>
                  </div>
                  {sub.chavePix && (
                    <div className="flex justify-between">
                      <span>Chave Pix:</span>
                      <span className="font-mono">{sub.chavePix}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Liquidando em: {sub.periodicidadeLiquidacao}</span>
                  <span>Homologado: {formatDateBR(sub.homologadoEm)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: REGRAS CONFIGURADAS POR EVENTO */}
      {/* ========================================================================= */}
      {activeTab === 'regras' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Políticas de Split por Evento
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Parâmetros contratuais de comissão, taxa de serviço e responsabilidade de estorno/chargeback.
              </p>
            </div>
            <button
              onClick={() => setShowNovaRegraModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Configurar Novo Evento
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Evento Vinculado</th>
                  <th className="px-4 py-3.5">Gateway & Subconta</th>
                  <th className="px-4 py-3.5">Comissão Disk (%)</th>
                  <th className="px-4 py-3.5">Taxa de Serviço Fixa</th>
                  <th className="px-4 py-3.5">MDR Absorvido Por</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {configs.map((cfg) => (
                  <tr key={cfg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{cfg.eventNome}</div>
                      <div className="text-xs text-slate-500">Criado por: {cfg.criadoPor}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${GATEWAY_LABELS[cfg.gateway]?.badge || 'bg-slate-100'}`}>
                        {GATEWAY_LABELS[cfg.gateway]?.name || cfg.gateway}
                      </span>
                      <div className="text-xs text-slate-500 font-mono mt-1">{cfg.subaccountId}</div>
                    </td>

                    <td className="px-4 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {cfg.comissaoDiskPercent}%
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(cfg.taxaServicoFixa)} / ingresso
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {cfg.produtorMdrAbsorvido ? 'Produtor (Subconta)' : 'DiskIngressos'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {cfg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVA SUBCONTA */}
      {/* ========================================================================= */}
      {showNovaSubcontaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Credenciar Subconta na Adquirente
              </h3>
              <button onClick={() => setShowNovaSubcontaModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Nome Fantasia / Razão Social do Produtor
                </label>
                <input
                  type="text"
                  placeholder="Ex: Prime Entretenimento e Shows Ltda"
                  value={novoProdutorNome}
                  onChange={(e) => setNovoProdutorNome(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    CNPJ ou CPF
                  </label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={novoDocFiscal}
                    onChange={(e) => setNovoDocFiscal(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Gateway Adquirente
                  </label>
                  <select
                    value={novoGateway}
                    onChange={(e) => setNovoGateway(e.target.value as GatewayProvider)}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                  >
                    <option value={GatewayProvider.PAGARME_STONE}>Stone Pagar.me v5</option>
                    <option value={GatewayProvider.CIELO}>Cielo eCommerce 3.0</option>
                    <option value={GatewayProvider.EREDE}>Rede e.Rede Itaú</option>
                    <option value={GatewayProvider.PAGBANK}>PagBank Split</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Banco
                  </label>
                  <input
                    type="text"
                    placeholder="341 - Itaú"
                    value={novoBanco}
                    onChange={(e) => setNovoBanco(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Agência
                  </label>
                  <input
                    type="text"
                    placeholder="0084"
                    value={novaAgencia}
                    onChange={(e) => setNovaAgencia(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Conta Corrente
                  </label>
                  <input
                    type="text"
                    placeholder="12345-6"
                    value={novaConta}
                    onChange={(e) => setNovaConta(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Chave Pix (Liquidação D+1)
                </label>
                <input
                  type="text"
                  placeholder="E-mail, CNPJ ou chave aleatória"
                  value={novaChavePix}
                  onChange={(e) => setNovaChavePix(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowNovaSubcontaModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCadastrarSubconta}
                disabled={actionLoading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Homologar Subconta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVA REGRA DE SPLIT */}
      {/* ========================================================================= */}
      {showNovaRegraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Configurar Regra de Split do Evento
              </h3>
              <button onClick={() => setShowNovaRegraModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Evento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Curitiba Country Festival 2026"
                  value={regraEventoNome}
                  onChange={(e) => setRegraEventoNome(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Subconta do Produtor
                </label>
                <select
                  value={regraSubcontaId}
                  onChange={(e) => setRegraSubcontaId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                >
                  <option value="">Selecione a subconta homologada...</option>
                  {subaccounts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.producerNome} ({s.gateway} - {s.recipientId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Comissão Disk (%)
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={regraComissao}
                    onChange={(e) => setRegraComissao(Number(e.target.value))}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Taxa Serviço Fixa (R$)
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={regraTaxaFixa}
                    onChange={(e) => setRegraTaxaFixa(Number(e.target.value))}
                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowNovaRegraModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarRegra}
                disabled={actionLoading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition"
              >
                Salvar Política de Split
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ESTORNO PRO-RATA */}
      {/* ========================================================================= */}
      {showEstornoModal && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Estorno Pro-Rata de Split (CDC Art. 49)
              </h3>
              <button onClick={() => setShowEstornoModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Confirma o estorno proporcional da transação{' '}
                <strong className="text-slate-900 dark:text-white">{selectedTx.codigoTransacao}</strong>?
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Valor Total Estornado:</span>
                  <span className="font-bold text-red-600">{formatCurrencyBRL(selectedTx.valorTotalBruto)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estorno da Subconta Produtor:</span>
                  <span className="font-semibold text-purple-600">- {formatCurrencyBRL(selectedTx.valorProdutor)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estorno da Conta DiskIngressos:</span>
                  <span className="font-semibold text-emerald-600">- {formatCurrencyBRL(selectedTx.valorDiskIngressos)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Motivo do Estorno
                </label>
                <textarea
                  rows={2}
                  value={motivoEstorno}
                  onChange={(e) => setMotivoEstorno(e.target.value)}
                  placeholder="Ex: Cancelamento dentro do prazo de 7 dias (CDC Art. 49)."
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowEstornoModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Voltar
              </button>
              <button
                onClick={handleExecutarEstorno}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Confirmar Estorno na Adquirente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
