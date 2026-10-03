import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  AntecipacaoDto,
  AmortizacaoAntecipacaoDto,
  TravaDomicilioBancarioDto,
  AntecipacoesKpisDto,
  CalculoMargemConsignavelDto,
  SimulacaoAntecipacaoResponseDto,
  StatusAntecipacao,
  StatusTravaBancaria,
  OrigemAmortizacao,
  RegistradoraRecebiveis,
  AdquirenteTrava,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  TrendingUp,
  ShieldCheck,
  Lock,
  Unlock,
  Coins,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Calculator,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Plus,
  X,
  Check,
  Clock,
  Sparkles,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

const STATUS_BADGES: Record<StatusAntecipacao, { label: string; badge: string }> = {
  [StatusAntecipacao.RASCUNHO]: {
    label: 'Rascunho',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  },
  [StatusAntecipacao.SOLICITADA]: {
    label: 'Solicitada',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
  },
  [StatusAntecipacao.EM_ANALISE]: {
    label: 'Em Análise de Crédito',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  },
  [StatusAntecipacao.APROVADA]: {
    label: 'Aprovada (Alçada)',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300',
  },
  [StatusAntecipacao.REJEITADA]: {
    label: 'Rejeitada',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300',
  },
  [StatusAntecipacao.LIBERADA]: {
    label: 'Liberada / Domicílio Travado',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300',
  },
  [StatusAntecipacao.EM_AMORTIZACAO]: {
    label: 'Em Amortização',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
  },
  [StatusAntecipacao.QUITADA]: {
    label: 'Integralmente Quitada',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
  },
  [StatusAntecipacao.INADIMPLENTE]: {
    label: 'Inadimplente / Trava Cruzada',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300',
  },
};

const TRAVA_BADGES: Record<StatusTravaBancaria, { label: string; badge: string }> = {
  [StatusTravaBancaria.PENDENTE]: {
    label: 'Trava Pendente',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  [StatusTravaBancaria.REGISTRADA]: {
    label: 'Registrada CERC/CIP',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  [StatusTravaBancaria.ATIVA]: {
    label: 'Trava Ativa em Adquirentes',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium',
  },
  [StatusTravaBancaria.SUSPENSA]: {
    label: 'Trava Suspensa',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  [StatusTravaBancaria.LIBERADA]: {
    label: 'Domicílio Desbloqueado',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400',
  },
};

export const AntecipacoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contratos' | 'simulador' | 'travas' | 'extrato'>('contratos');
  const [kpis, setKpis] = useState<AntecipacoesKpisDto | null>(null);
  const [antecipacoes, setAntecipacoes] = useState<AntecipacaoDto[]>([]);
  const [travas, setTravas] = useState<TravaDomicilioBancarioDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Simulador
  const [selectedEventId, setSelectedEventId] = useState('evt-001');
  const [margemData, setMargemData] = useState<CalculoMargemConsignavelDto | null>(null);
  const [simulacaoValor, setSimulacaoValor] = useState(50000);
  const [simulacaoPrazo, setSimulacaoPrazo] = useState(30);
  const [simulacaoTaxa, setSimulacaoTaxa] = useState(2.35);
  const [simulacaoResult, setSimulacaoResult] = useState<SimulacaoAntecipacaoResponseDto | null>(null);
  const [simulando, setSimulando] = useState(false);
  const [registradoraEscolhida, setRegistradoraEscolhida] = useState<RegistradoraRecebiveis>(RegistradoraRecebiveis.CERC);
  const [observacoesNovaOperacao, setObservacoesNovaOperacao] = useState('');

  // Modais
  const [selectedContrato, setSelectedContrato] = useState<AntecipacaoDto | null>(null);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [showAmortizarModal, setShowAmortizarModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);

  // Formulários de Ação
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [amortizarValor, setAmortizarValor] = useState(10000);
  const [amortizarOrigem, setAmortizarOrigem] = useState<OrigemAmortizacao>(OrigemAmortizacao.REPASSE_AUTOMATICO);
  const [amortizarRepasseId, setAmortizarRepasseId] = useState('REP-2026-000125');
  const [amortizarObs, setAmortizarObs] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const applyDemoFallback = () => {
    setKpis({
      totalConcedidoPeriodo: 248000.0,
      saldoDevedorAtivo: 53000.0,
      totalAmortizado: 195000.0,
      fundoReservaEscrowTotal: 122500.0,
      taxaMediaPonderada: 2.32,
      totalOperacoesAtivas: 2,
      totalQuitadas: 1,
      travasBancariasAtivas: 2,
    });
    setAntecipacoes([
      {
        id: 'ant-uuid-001',
        codigoContrato: 'ANT-2026-000101',
        producerId: 'prod-001',
        producerNome: 'Opus Entretenimento Curitiba Ltda',
        eventId: 'evt-001',
        eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
        valorSolicitado: 80000.0,
        taxaMensal: 2.35,
        prazoDias: 45,
        custoFinanceiro: 2820.0,
        taxaAdministrativa: 400.0,
        valorLiquidoLiberado: 76780.0,
        saldoDevedor: 35000.0,
        valorAmortizado: 45000.0,
        fundoReservaRetido: 48000.0,
        status: StatusAntecipacao.EM_AMORTIZACAO,
        dataSolicitacao: new Date(Date.now() - 20 * 86400000).toISOString(),
        dataAprovacao: new Date(Date.now() - 19 * 86400000).toISOString(),
        dataLiquidacao: new Date(Date.now() - 18 * 86400000).toISOString(),
        dataVencimento: new Date(Date.now() + 25 * 86400000).toISOString(),
        registradora: RegistradoraRecebiveis.CERC,
        protocoloRegistroUr: 'CERC-UR-2026-8891024-PR',
        statusTravaBancaria: StatusTravaBancaria.ATIVA,
        adquirentesTravadas: 'CIELO, STONE, REDE',
        aprovadoPor: 'Diretoria Financeira & CFO',
        documentoAssinaturaId: 'DOC-SIG-2026-000312',
        observacoes: 'Cessão de recebíveis vinculada à montagem do palco principal e infraestrutura de som.',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        amortizacoes: [
          {
            id: 'amt-001',
            antecipacaoId: 'ant-uuid-001',
            repasseId: 'REP-2026-000115',
            valorAmortizado: 25000.0,
            saldoAnterior: 80000.0,
            saldoRestante: 55000.0,
            dataAmortizacao: new Date(Date.now() - 10 * 86400000).toISOString(),
            origemAmortizacao: OrigemAmortizacao.REPASSE_AUTOMATICO,
            observacao: 'Abatimento prioritário em fechamento do lote 1.',
            createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
          },
          {
            id: 'amt-002',
            antecipacaoId: 'ant-uuid-001',
            repasseId: 'REP-2026-000118',
            valorAmortizado: 20000.0,
            saldoAnterior: 55000.0,
            saldoRestante: 35000.0,
            dataAmortizacao: new Date(Date.now() - 2 * 86400000).toISOString(),
            origemAmortizacao: OrigemAmortizacao.REPASSE_AUTOMATICO,
            observacao: 'Abatimento prioritário em fechamento do lote 2.',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
        ],
        travas: [
          {
            id: 'trv-001',
            antecipacaoId: 'ant-uuid-001',
            producerId: 'prod-001',
            adquirente: AdquirenteTrava.CIELO,
            banco: '341 - Itaú Unibanco S.A.',
            agencia: '0084',
            conta: '99210-4 (Conta Escrow Disk)',
            registradora: RegistradoraRecebiveis.CERC,
            protocoloContrato: 'CERC-TRV-9011-PR',
            status: StatusTravaBancaria.ATIVA,
            dataEfetivacao: new Date(Date.now() - 19 * 86400000).toISOString(),
            createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
          },
        ],
      },
      {
        id: 'ant-uuid-002',
        codigoContrato: 'ANT-2026-000102',
        producerId: 'prod-002',
        producerNome: 'Seven Live Entretenimento Brasil',
        eventId: 'evt-002',
        eventNome: 'Turnê Titãs Encontro Arena da Baixada',
        valorSolicitado: 150000.0,
        taxaMensal: 2.10,
        prazoDias: 60,
        custoFinanceiro: 6300.0,
        taxaAdministrativa: 750.0,
        valorLiquidoLiberado: 142950.0,
        saldoDevedor: 0.0,
        valorAmortizado: 150000.0,
        fundoReservaRetido: 62000.0,
        status: StatusAntecipacao.QUITADA,
        dataSolicitacao: new Date(Date.now() - 50 * 86400000).toISOString(),
        dataAprovacao: new Date(Date.now() - 48 * 86400000).toISOString(),
        dataLiquidacao: new Date(Date.now() - 47 * 86400000).toISOString(),
        dataVencimento: new Date(Date.now() - 5 * 86400000).toISOString(),
        registradora: RegistradoraRecebiveis.CIP,
        protocoloRegistroUr: 'CIP-SLC-2026-4432190-PR',
        statusTravaBancaria: StatusTravaBancaria.LIBERADA,
        adquirentesTravadas: 'CIELO, GETNET',
        aprovadoPor: 'Dupla Chave CFO + CEO (Faixa C)',
        documentoAssinaturaId: 'DOC-SIG-2026-000280',
        observacoes: 'Contrato integralmente amortizado por retenções automáticas de borderôs nos lotes 1 e 2.',
        createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        amortizacoes: [
          {
            id: 'amt-003',
            antecipacaoId: 'ant-uuid-002',
            repasseId: 'REP-2026-000095',
            valorAmortizado: 150000.0,
            saldoAnterior: 150000.0,
            saldoRestante: 0.0,
            dataAmortizacao: new Date(Date.now() - 5 * 86400000).toISOString(),
            origemAmortizacao: OrigemAmortizacao.RETENCAO_BILHETERIA,
            observacao: 'Quitação total do saldo devedor.',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          },
        ],
        travas: [],
      },
      {
        id: 'ant-uuid-003',
        codigoContrato: 'ANT-2026-000103',
        producerId: 'prod-003',
        producerNome: 'Curitiba Comedy Club Produções',
        eventId: 'evt-003',
        eventNome: 'Noite de Gala do Stand-up Paranaense Teatro Positivo',
        valorSolicitado: 18000.0,
        taxaMensal: 2.50,
        prazoDias: 25,
        custoFinanceiro: 375.0,
        taxaAdministrativa: 90.0,
        valorLiquidoLiberado: 17535.0,
        saldoDevedor: 18000.0,
        valorAmortizado: 0.0,
        fundoReservaRetido: 12500.0,
        status: StatusAntecipacao.SOLICITADA,
        dataSolicitacao: new Date().toISOString(),
        dataVencimento: new Date(Date.now() + 25 * 86400000).toISOString(),
        registradora: RegistradoraRecebiveis.CERC,
        statusTravaBancaria: StatusTravaBancaria.PENDENTE,
        observacoes: 'Aguardando validação da margem e aprovação da alçada Faixa A.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        amortizacoes: [],
        travas: [],
      },
    ]);
    setTravas([
      {
        id: 'trv-001',
        antecipacaoId: 'ant-uuid-001',
        producerId: 'prod-001',
        adquirente: AdquirenteTrava.CIELO,
        banco: '341 - Itaú Unibanco S.A.',
        agencia: '0084',
        conta: '99210-4 (Conta Escrow Disk)',
        registradora: RegistradoraRecebiveis.CERC,
        protocoloContrato: 'CERC-TRV-9011-PR',
        status: StatusTravaBancaria.ATIVA,
        dataEfetivacao: new Date(Date.now() - 19 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
      },
      {
        id: 'trv-002',
        antecipacaoId: 'ant-uuid-001',
        producerId: 'prod-001',
        adquirente: AdquirenteTrava.STONE,
        banco: '341 - Itaú Unibanco S.A.',
        agencia: '0084',
        conta: '99210-4 (Conta Escrow Disk)',
        registradora: RegistradoraRecebiveis.CERC,
        protocoloContrato: 'CERC-TRV-9012-PR',
        status: StatusTravaBancaria.ATIVA,
        dataEfetivacao: new Date(Date.now() - 19 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
      },
    ]);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [resKpis, resAnt, resTravas]: any = await Promise.all([
        api.get('/antecipacoes/kpis'),
        api.get('/antecipacoes', {
          params: { status: statusFilter !== 'TODOS' ? statusFilter : undefined, search: searchTerm || undefined },
        }),
        api.get('/antecipacoes/travas/todas'),
      ]);

      if (resKpis) setKpis(resKpis);
      if (resAnt && Array.isArray(resAnt)) setAntecipacoes(resAnt);
      if (resTravas && Array.isArray(resTravas)) setTravas(resTravas);
    } catch (err) {
      console.warn('Usando dados de demonstração para Antecipações e Travas:', err);
      applyDemoFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  // Recalcular margem consignável quando troca de evento
  useEffect(() => {
    const fetchMargem = async () => {
      try {
        const res: any = await api.get(`/antecipacoes/margem-consignavel/${selectedEventId}`);
        if (res) {
          setMargemData(res);
          // Ajusta valor inicial se ultrapassar a margem
          if (simulacaoValor > res.margemConsignavelDisponivel && res.margemConsignavelDisponivel > 0) {
            setSimulacaoValor(Math.floor(res.margemConsignavelDisponivel));
          }
        }
      } catch (err) {
        console.warn('Fallback de margem para evento:', selectedEventId);
        setMargemData({
          eventId: selectedEventId,
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          producerId: 'prod-001',
          producerNome: 'Opus Entretenimento Curitiba Ltda',
          vendasBrutasTotal: 450000.0,
          taxasTicketeiraRetidas: 58500.0,
          vendasLiquidasDisponiveis: 391500.0,
          percentualMaximoConsignavel: 75,
          tetoConsignavelBruto: 293625.0,
          fundoReservaEscrow: 97875.0,
          antecipacoesAtivasTotal: 35000.0,
          margemConsignavelDisponivel: 258625.0,
          podeAntecipar: true,
        });
      }
    };
    fetchMargem();
  }, [selectedEventId]);

  // Executar simulação em tempo real
  useEffect(() => {
    const runSimulacao = async () => {
      if (!selectedEventId || simulacaoValor <= 0) return;
      try {
        setSimulando(true);
        const res: any = await api.post('/antecipacoes/simular', {
          eventId: selectedEventId,
          valorSolicitado: simulacaoValor,
          taxaMensal: simulacaoTaxa,
          prazoDias: simulacaoPrazo,
        });
        if (res) {
          setSimulacaoResult(res);
        }
      } catch (err) {
        const custoFinanceiro = Number(((simulacaoValor * (simulacaoTaxa / 30) * simulacaoPrazo) / 100).toFixed(2));
        const taxaAdministrativa = Number((simulacaoValor * 0.005).toFixed(2));
        const iofEstimado = Number((simulacaoValor * (0.0038 + (0.0082 / 100) * simulacaoPrazo)).toFixed(2));
        setSimulacaoResult({
          valorSolicitado: simulacaoValor,
          taxaMensal: simulacaoTaxa,
          prazoDias: simulacaoPrazo,
          custoFinanceiro,
          taxaAdministrativa,
          iofEstimado,
          valorLiquidoLiberado: Number((simulacaoValor - custoFinanceiro - taxaAdministrativa - iofEstimado).toFixed(2)),
          totalAPagar: simulacaoValor,
          margemConsignavelDisponivel: margemData?.margemConsignavelDisponivel || 250000,
          isDentroDaMargem: true,
          alçadaNecessaria: simulacaoValor > 100000 ? 'FAIXA_C (Dupla Chave CFO + CEO)' : 'FAIXA_B (Gerente Financeiro)',
        });
      } finally {
        setSimulando(false);
      }
    };

    const timer = setTimeout(runSimulacao, 300);
    return () => clearTimeout(timer);
  }, [selectedEventId, simulacaoValor, simulacaoPrazo, simulacaoTaxa]);

  const handleCriarOperacao = async () => {
    if (!margemData || !simulacaoResult) return;
    try {
      setActionLoading(true);
      const payload = {
        producerId: margemData.producerId,
        producerNome: margemData.producerNome,
        eventId: margemData.eventId,
        eventNome: margemData.eventNome,
        valorSolicitado: simulacaoValor,
        taxaMensal: simulacaoTaxa,
        prazoDias: simulacaoPrazo,
        registradora: registradoraEscolhida,
        adquirentesParaTrava: ['CIELO', 'STONE', 'REDE'],
        observacoes: observacoesNovaOperacao || 'Operação originada via Simulador Enterprise de Recebíveis.',
      };

      const res: any = await api.post('/antecipacoes', payload);
      setFeedbackMsg({
        tipo: 'success',
        texto: `Operação ${res?.codigoContrato || 'ANT-2026-NOVA'} submetida com sucesso à alçada de aprovação!`,
      });
      setActiveTab('contratos');
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Falha ao solicitar antecipação.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAprovar = async () => {
    if (!selectedContrato) return;
    try {
      setActionLoading(true);
      await api.patch(`/antecipacoes/${selectedContrato.id}/aprovar`, {
        aprovadorNome: 'Diretoria Financeira & CFO',
        cargo: 'CFO / Alçada Governança',
        registradora: selectedContrato.registradora,
        adquirentesParaTrava: ['CIELO', 'STONE', 'REDE'],
      });

      setFeedbackMsg({
        tipo: 'success',
        texto: `Contrato ${selectedContrato.codigoContrato} aprovado e travas bancárias ativadas nas adquirentes!`,
      });
      setShowAprovarModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao aprovar antecipação.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejeitar = async () => {
    if (!selectedContrato) return;
    try {
      setActionLoading(true);
      await api.patch(`/antecipacoes/${selectedContrato.id}/rejeitar`, {
        rejeitadoPor: 'Comitê de Crédito e Risco',
        motivoRejeicao: motivoRejeicao || 'Excedeu limite de exposição ou reprovado na esteira cadastral.',
      });

      setFeedbackMsg({
        tipo: 'success',
        texto: `Contrato ${selectedContrato.codigoContrato} rejeitado formalmente.`,
      });
      setShowRejeitarModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao rejeitar antecipação.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAmortizar = async () => {
    if (!selectedContrato) return;
    try {
      setActionLoading(true);
      const res: any = await api.post(`/antecipacoes/${selectedContrato.id}/amortizar`, {
        valorAmortizado: amortizarValor,
        origemAmortizacao: amortizarOrigem,
        repasseId: amortizarRepasseId,
        observacao: amortizarObs || 'Abatimento prioritário em fechamento de borderô.',
      });

      setFeedbackMsg({
        tipo: 'success',
        texto: `Amortização de ${formatCurrencyBRL(amortizarValor)} executada com sucesso! Saldo restante: ${formatCurrencyBRL(res?.saldoDevedor || 0)}.`,
      });
      setShowAmortizarModal(false);
      loadData();
    } catch (err: any) {
      setFeedbackMsg({
        tipo: 'error',
        texto: err.response?.data?.message || 'Erro ao processar amortização.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Coleta todas as amortizações para a aba Extrato
  const todasAmortizacoes: (AmortizacaoAntecipacaoDto & { contratoCodigo?: string; produtor?: string })[] = [];
  antecipacoes.forEach((ant) => {
    if (ant.amortizacoes) {
      ant.amortizacoes.forEach((amt) => {
        todasAmortizacoes.push({
          ...amt,
          contratoCodigo: ant.codigoContrato,
          produtor: ant.producerNome,
        });
      });
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Antecipações de Recebíveis & Travas Bancárias
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Res. BCB 4.734 / Circ. 3.952
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de cessão fiduciária de recebíveis de bilheteria, margem consignável segura, travas em adquirentes e amortização cascata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nova Antecipação / Simulação
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
              Total Concedido no Ano
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis?.totalConcedidoPeriodo || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {kpis?.totalOperacoesAtivas || 0}
              </span>{' '}
              operações ativas / {kpis?.totalQuitadas || 0} quitadas
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Saldo Devedor Ativo
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg text-purple-600 dark:text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrencyBRL(kpis?.saldoDevedorAtivo || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Amortizado até o momento:{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrencyBRL(kpis?.totalAmortizado || 0)}
              </span>
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fundo de Reserva (Escrow)
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-lg text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrencyBRL(kpis?.fundoReservaEscrowTotal || 0)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Proteção CDC Art. 49 & chargebacks (25% retido)
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Taxa Média & Travas
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {kpis?.taxaMediaPonderada || 2.35}% a.m.
            </span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              {kpis?.travasBancariasAtivas || 0} travas ativas na CERC/CIP
            </p>
          </div>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('contratos')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'contratos'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Contratos & Solicitações
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {antecipacoes.length}
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
          <Calculator className="w-4 h-4" />
          Simulador de Margem & Nova Operação
        </button>

        <button
          onClick={() => setActiveTab('travas')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'travas'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          Travas de Domicílio Bancário (Adquirentes)
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {travas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('extrato')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'extrato'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Extrato de Amortizações em Cascata
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {todasAmortizacoes.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: CONTRATOS & ANTECIPAÇÕES ATIVAS */}
      {/* ========================================================================= */}
      {activeTab === 'contratos' && (
        <div className="space-y-4">
          {/* BARRA DE FILTROS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-80 relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar contrato, produtor ou evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TODOS">Todos os Status</option>
                <option value={StatusAntecipacao.SOLICITADA}>Solicitada</option>
                <option value={StatusAntecipacao.LIBERADA}>Liberada / Travada</option>
                <option value={StatusAntecipacao.EM_AMORTIZACAO}>Em Amortização</option>
                <option value={StatusAntecipacao.QUITADA}>Integralmente Quitada</option>
                <option value={StatusAntecipacao.REJEITADA}>Rejeitada</option>
              </select>
            </div>
          </div>

          {/* TABELA DE CONTRATOS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Contrato / UR</th>
                    <th className="px-4 py-3.5">Produtor & Evento</th>
                    <th className="px-4 py-3.5 text-right">Solicitado / Liberado</th>
                    <th className="px-4 py-3.5">Saldo Devedor / Amortizado</th>
                    <th className="px-4 py-3.5">Status & Trava</th>
                    <th className="px-4 py-3.5">Vencimento</th>
                    <th className="px-4 py-3.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {antecipacoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                        Nenhuma antecipação encontrada para os critérios selecionados.
                      </td>
                    </tr>
                  ) : (
                    antecipacoes.map((ant) => {
                      const percAmortizado =
                        ant.valorSolicitado > 0
                          ? Math.min(100, Math.round((ant.valorAmortizado / ant.valorSolicitado) * 100))
                          : 0;

                      return (
                        <tr key={ant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {ant.codigoContrato}
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                              {ant.protocoloRegistroUr || `${ant.registradora} (Pendente)`}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {ant.producerNome}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {ant.eventNome}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatCurrencyBRL(ant.valorSolicitado)}
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                              Líq: {formatCurrencyBRL(ant.valorLiquidoLiberado)}
                            </div>
                          </td>

                          <td className="px-4 py-4 min-w-[180px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                Saldo: {formatCurrencyBRL(ant.saldoDevedor)}
                              </span>
                              <span className="text-slate-500">{percAmortizado}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  ant.saldoDevedor === 0
                                    ? 'bg-emerald-500'
                                    : 'bg-indigo-600 dark:bg-indigo-400'
                                }`}
                                style={{ width: `${percAmortizado}%` }}
                              ></div>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Amortizado: {formatCurrencyBRL(ant.valorAmortizado)}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                  STATUS_BADGES[ant.status]?.badge || 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {STATUS_BADGES[ant.status]?.label || ant.status}
                              </span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                                  TRAVA_BADGES[ant.statusTravaBancaria]?.badge || 'bg-slate-100'
                                }`}
                              >
                                {TRAVA_BADGES[ant.statusTravaBancaria]?.label || ant.statusTravaBancaria}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">
                            {formatDateBR(ant.dataVencimento)}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Taxa: {ant.taxaMensal}% a.m.
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Visualizar */}
                              <button
                                onClick={() => {
                                  setSelectedContrato(ant);
                                  setShowDetalhesModal(true);
                                }}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                                title="Detalhes do Contrato"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              {/* Aprovar (se solicitada) */}
                              {ant.status === StatusAntecipacao.SOLICITADA && (
                                <button
                                  onClick={() => {
                                    setSelectedContrato(ant);
                                    setShowAprovarModal(true);
                                  }}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition"
                                  title="Aprovar Alçada & Travar Domicílio"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {/* Amortizar (se liberada ou em amortização) */}
                              {(ant.status === StatusAntecipacao.LIBERADA ||
                                ant.status === StatusAntecipacao.EM_AMORTIZACAO) &&
                                ant.saldoDevedor > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedContrato(ant);
                                      setAmortizarValor(Math.min(ant.saldoDevedor, 20000));
                                      setShowAmortizarModal(true);
                                    }}
                                    className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded transition"
                                    title="Amortizar Saldo Devedor"
                                  >
                                    <Coins className="w-4 h-4" />
                                  </button>
                                )}

                              {/* Rejeitar (se solicitada) */}
                              {ant.status === StatusAntecipacao.SOLICITADA && (
                                <button
                                  onClick={() => {
                                    setSelectedContrato(ant);
                                    setShowRejeitarModal(true);
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition"
                                  title="Rejeitar Solicitação"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: SIMULADOR DE MARGEM CONSIGNÁVEL & NOVA OPERAÇÃO */}
      {/* ========================================================================= */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PAINEL ESQUERDO: CONFIGURAÇÃO DA OPERAÇÃO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    Simulador Regulatório de Antecipação
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cálculo da margem consignável segura (teto 75% da receita líquida) e dedução do Fundo de Reserva Escrow.
                  </p>
                </div>
              </div>

              {/* SELEÇÃO DO EVENTO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Selecione o Evento Vinculado
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="evt-001">Festival de Inverno Pedreira Paulo Leminski 2026 (Opus Entretenimento)</option>
                  <option value="evt-002">Turnê Titãs Encontro Arena da Baixada (Seven Live Entretenimento)</option>
                  <option value="evt-003">Noite de Gala do Stand-up Paranaense Teatro Positivo (Curitiba Comedy)</option>
                </select>
              </div>

              {/* CARDS DE APURAÇÃO DO EVENTO */}
              {margemData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Vendas Brutas</span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(margemData.vendasBrutasTotal)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Taxas Retidas</span>
                    <div className="text-sm font-bold text-red-600 dark:text-red-400">
                      - {formatCurrencyBRL(margemData.taxasTicketeiraRetidas)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Fundo Escrow (25%)</span>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrencyBRL(margemData.fundoReservaEscrow)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Margem Disponível</span>
                    <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {formatCurrencyBRL(margemData.margemConsignavelDisponivel)}
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDERS E INPUTS */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                      Valor Desejado a Antecipar
                    </label>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrencyBRL(simulacaoValor)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={Math.max(50000, margemData?.margemConsignavelDisponivel || 100000)}
                    step={1000}
                    value={simulacaoValor}
                    onChange={(e) => setSimulacaoValor(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Min: R$ 5.000</span>
                    <span>Teto Disponível: {formatCurrencyBRL(margemData?.margemConsignavelDisponivel || 0)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Prazo Estimado da Liquidação (Dias)
                    </label>
                    <select
                      value={simulacaoPrazo}
                      onChange={(e) => setSimulacaoPrazo(Number(e.target.value))}
                      className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-medium"
                    >
                      <option value={15}>15 dias (Fechamento Próximo)</option>
                      <option value={30}>30 dias (Padrão 1 mês)</option>
                      <option value={45}>45 dias (Pré-venda estendida)</option>
                      <option value={60}>60 dias (Grandes Festivais)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Taxa de Antecipação Mensal (% a.m.)
                    </label>
                    <select
                      value={simulacaoTaxa}
                      onChange={(e) => setSimulacaoTaxa(Number(e.target.value))}
                      className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-medium"
                    >
                      <option value={2.10}>2.10% a.m. (Grandes Produtores - Rating AAA)</option>
                      <option value={2.35}>2.35% a.m. (Padrão DiskIngressos Enterprise)</option>
                      <option value={2.80}>2.80% a.m. (Eventos de Risco Médio)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Registradora Homologada (BACEN)
                    </label>
                    <select
                      value={registradoraEscolhida}
                      onChange={(e) => setRegistradoraEscolhida(e.target.value as RegistradoraRecebiveis)}
                      className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 font-medium"
                    >
                      <option value={RegistradoraRecebiveis.CERC}>CERC Recebíveis (API Direta)</option>
                      <option value={RegistradoraRecebiveis.CIP}>CIP - Unidade de Recebíveis</option>
                      <option value={RegistradoraRecebiveis.B3}>B3 Registradora de Gravames</option>
                      <option value={RegistradoraRecebiveis.TAG}>TAG Infraestrutura de Mercado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Finalidade / Observações
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Pagamento de cachê artístico / venue..."
                      value={observacoesNovaOperacao}
                      onChange={(e) => setObservacoesNovaOperacao(e.target.value)}
                      className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DIREITO: RESUMO FINANCEIRO & ENCARGOS */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-indigo-800/50 space-y-5">
              <div className="flex items-center justify-between border-b border-indigo-700/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Resumo da Simulação
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-700 text-indigo-200">
                  {simulando ? 'Calculando...' : 'Atualizado'}
                </span>
              </div>

              <div>
                <div className="text-xs text-indigo-300">Valor Bruto Solicitado</div>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {formatCurrencyBRL(simulacaoValor)}
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-b border-indigo-800/60 py-3">
                <div className="flex justify-between text-indigo-200">
                  <span>(-) Juros Antecipação ({simulacaoTaxa}% / {simulacaoPrazo}d):</span>
                  <span className="font-semibold text-red-300">
                    - {formatCurrencyBRL(simulacaoResult?.custoFinanceiro || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>(-) Taxa Registro Registradora (0.50%):</span>
                  <span className="font-semibold text-red-300">
                    - {formatCurrencyBRL(simulacaoResult?.taxaAdministrativa || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>(-) Estimativa IOF PJ:</span>
                  <span className="font-semibold text-red-300">
                    - {formatCurrencyBRL(simulacaoResult?.iofEstimado || 0)}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-950/60 p-4 rounded-lg border border-indigo-700/40">
                <div className="text-xs font-semibold text-indigo-300 uppercase">
                  Valor Líquido a Transferir ao Produtor
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {formatCurrencyBRL(simulacaoResult?.valorLiquidoLiberado || 0)}
                </div>
                <div className="text-[11px] text-indigo-300 mt-1">
                  Creditado em D+0 após colhimento das assinaturas do termo de cessão.
                </div>
              </div>

              <div className="text-[11px] text-indigo-300 space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Alçada: {simulacaoResult?.alçadaNecessaria || 'FAIXA_B'}
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Trava de Domicílio: Cielo, Stone e Rede travadas na conta escrow Disk.
                </div>
              </div>

              <button
                onClick={handleCriarOperacao}
                disabled={actionLoading || !simulacaoResult?.isDentroDaMargem}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-md transition flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Formalizar Solicitação de Cessão
              </button>

              {!simulacaoResult?.isDentroDaMargem && (
                <p className="text-xs text-rose-300 text-center font-medium">
                  O valor excede a margem consignável segura do evento.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: TRAVAS DE DOMICÍLIO BANCÁRIO (ADQUIRENTES & REGISTRADORAS) */}
      {/* ========================================================================= */}
      {activeTab === 'travas' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  Painel de Travas de Domicílio Bancário em Adquirentes
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Domicílio bancário exclusivo vinculado nas adquirentes via Resolução BACEN 4.734 para garantia da liquidação direta das URs.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Interconexão Registradoras Ativa (CERC/CIP)
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Adquirente</th>
                  <th className="px-4 py-3.5">Domicílio Travado (Conta Escrow)</th>
                  <th className="px-4 py-3.5">Registradora / Protocolo</th>
                  <th className="px-4 py-3.5">Status da Trava</th>
                  <th className="px-4 py-3.5">Data Efetivação / Liberação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {travas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      Nenhuma trava bancária registrada no momento.
                    </td>
                  </tr>
                ) : (
                  travas.map((trv) => (
                    <tr key={trv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {trv.adquirente}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Adquirente Homologada
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {trv.banco}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Ag: {trv.agencia} | CC: {trv.conta}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {trv.registradora}
                        </span>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {trv.protocoloContrato}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            TRAVA_BADGES[trv.status]?.badge || 'bg-slate-100'
                          }`}
                        >
                          {TRAVA_BADGES[trv.status]?.label || trv.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">
                        <div>Ativada em: {formatDateBR(trv.dataEfetivacao)}</div>
                        {trv.dataLiberacao && (
                          <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Liberada em: {formatDateBR(trv.dataLiberacao)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: EXTRATO DE AMORTIZAÇÕES EM CASCATA */}
      {/* ========================================================================= */}
      {activeTab === 'extrato' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Auditoria de Abatimentos & Amortização Cascata
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Trilha de conciliação de retenções em fechamentos de lotes, borderôs e execuções de garantia cruzada.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Data Amortização</th>
                  <th className="px-4 py-3.5">Contrato / Produtor</th>
                  <th className="px-4 py-3.5">Origem / Referência</th>
                  <th className="px-4 py-3.5 text-right">Saldo Anterior</th>
                  <th className="px-4 py-3.5 text-right">Valor Amortizado</th>
                  <th className="px-4 py-3.5 text-right">Saldo Restante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {todasAmortizacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      Nenhuma amortização registrada no extrato até o momento.
                    </td>
                  </tr>
                ) : (
                  todasAmortizacoes.map((amt) => (
                    <tr key={amt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {formatDateBR(amt.dataAmortizacao)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {amt.contratoCodigo}
                        </div>
                        <div className="text-xs text-slate-500">{amt.produtor}</div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {amt.origemAmortizacao}
                        </span>
                        {amt.repasseId && (
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                            Ref: {amt.repasseId}
                          </div>
                        )}
                        {amt.observacao && (
                          <div className="text-[11px] text-slate-400 mt-0.5 italic">
                            {amt.observacao}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-xs text-slate-600 dark:text-slate-400">
                        {formatCurrencyBRL(amt.saldoAnterior)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          - {formatCurrencyBRL(amt.valorAmortizado)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrencyBRL(amt.saldoRestante)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE APROVAÇÃO & TRAVA BANCÁRIA */}
      {/* ========================================================================= */}
      {showAprovarModal && selectedContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Aprovação de Alçada & Trava Bancária
              </h3>
              <button onClick={() => setShowAprovarModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Confirma a aprovação do adiantamento para{' '}
                <strong className="text-slate-900 dark:text-white">{selectedContrato.producerNome}</strong>?
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Contrato:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedContrato.codigoContrato}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Solicitado:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrencyBRL(selectedContrato.valorSolicitado)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Líquido Liberado:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(selectedContrato.valorLiquidoLiberado)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fundo de Reserva (Escrow):</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrencyBRL(selectedContrato.fundoReservaRetido)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  Ao confirmar, o sistema registrará compulsariamente a <strong>trava de domicílio bancário</strong> na registradora ({selectedContrato.registradora}) para as adquirentes Cielo e Stone em favor da DiskIngressos.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAprovarModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAprovar}
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Confirmar Aprovação & Travar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE AMORTIZAÇÃO MANUAL / REPASSE */}
      {/* ========================================================================= */}
      {showAmortizarModal && selectedContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-600" />
                Amortização de Saldo Devedor
              </h3>
              <button onClick={() => setShowAmortizarModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-lg flex justify-between items-center text-xs">
                <span>Saldo Devedor Atual:</span>
                <span className="text-base font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrencyBRL(selectedContrato.saldoDevedor)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Valor da Amortização
                </label>
                <input
                  type="number"
                  max={selectedContrato.saldoDevedor}
                  min={1}
                  value={amortizarValor}
                  onChange={(e) => setAmortizarValor(Number(e.target.value))}
                  className="w-full text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Origem do Abatimento
                </label>
                <select
                  value={amortizarOrigem}
                  onChange={(e) => setAmortizarOrigem(e.target.value as OrigemAmortizacao)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                >
                  <option value={OrigemAmortizacao.REPASSE_AUTOMATICO}>Abatimento em Repasse Automático</option>
                  <option value={OrigemAmortizacao.RETENCAO_BILHETERIA}>Retenção Direta em Bilheteria</option>
                  <option value={OrigemAmortizacao.TRAVA_CRUZADA_OUTRO_EVENTO}>Trava Cruzada (Outro Evento do Produtor)</option>
                  <option value={OrigemAmortizacao.LIQUIDACAO_AVULSA}>Liquidação Avulsa / TED Recebida</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Identificador do Repasse / Documento
                </label>
                <input
                  type="text"
                  placeholder="Ex: REP-2026-000125"
                  value={amortizarRepasseId}
                  onChange={(e) => setAmortizarRepasseId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Observações de Auditoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Amortização parcial acordada referente ao 2º lote..."
                  value={amortizarObs}
                  onChange={(e) => setAmortizarObs(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowAmortizarModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAmortizar}
                disabled={actionLoading || amortizarValor <= 0 || amortizarValor > selectedContrato.saldoDevedor}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Confirmar Amortização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE REJEIÇÃO */}
      {/* ========================================================================= */}
      {showRejeitarModal && selectedContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Rejeitar Solicitação de Antecipação
              </h3>
              <button onClick={() => setShowRejeitarModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Informe o motivo da rejeição do contrato{' '}
                <strong className="text-slate-900 dark:text-white">{selectedContrato.codigoContrato}</strong>:
              </p>
              <textarea
                rows={3}
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                placeholder="Ex: Evento com histórico de adiamento ou margem insuficiente no fechamento."
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowRejeitarModal(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Voltar
              </button>
              <button
                onClick={handleRejeitar}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-sm transition"
              >
                Rejeitar Formalmente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE DETALHES COMPLETOS DO CONTRATO */}
      {/* ========================================================================= */}
      {showDetalhesModal && selectedContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Contrato de Cessão: {selectedContrato.codigoContrato}
                </h3>
                <p className="text-xs text-slate-500">{selectedContrato.eventNome}</p>
              </div>
              <button onClick={() => setShowDetalhesModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Produtor</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {selectedContrato.producerNome}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Valor Bruto</span>
                <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {formatCurrencyBRL(selectedContrato.valorSolicitado)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Líquido Liberado</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrencyBRL(selectedContrato.valorLiquidoLiberado)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Saldo Devedor</span>
                <div className="font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {formatCurrencyBRL(selectedContrato.saldoDevedor)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Fundo Escrow</span>
                <div className="font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {formatCurrencyBRL(selectedContrato.fundoReservaRetido)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-500 font-semibold uppercase">Registradora</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {selectedContrato.registradora} ({selectedContrato.protocoloRegistroUr || 'UR Registrada'})
                </div>
              </div>
            </div>

            {/* TRAVAS ASSOCIADAS */}
            {selectedContrato.travas && selectedContrato.travas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Travas de Domicílio Registradas nas Adquirentes
                </h4>
                <div className="space-y-1.5">
                  {selectedContrato.travas.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{t.adquirente}</span> &rarr;{' '}
                        <span className="text-slate-600 dark:text-slate-300 font-mono">{t.banco} ({t.conta})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TRAVA_BADGES[t.status]?.badge}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HISTÓRICO DE AMORTIZAÇÕES DO CONTRATO */}
            {selectedContrato.amortizacoes && selectedContrato.amortizacoes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  Histórico de Amortizações
                </h4>
                <div className="space-y-1.5">
                  {selectedContrato.amortizacoes.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateBR(a.dataAmortizacao)} - {a.origemAmortizacao}
                        </div>
                        {a.observacao && <div className="text-[11px] text-slate-500">{a.observacao}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          - {formatCurrencyBRL(a.valorAmortizado)}
                        </div>
                        <div className="text-[11px] text-slate-400">Restante: {formatCurrencyBRL(a.saldoRestante)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowDetalhesModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
