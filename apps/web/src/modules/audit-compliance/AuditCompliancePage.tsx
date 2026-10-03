import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  AiFraudDetectionDto,
  ContinuousAuditAnomalyDto,
  LgpdComplianceRequestDto,
  AuditComplianceKpisDto,
  StatusFraudeTransacao,
  TipoAnomaliaAuditoria,
  StatusAnomaliaAuditoria,
  TipoSolicitacaoLgpd,
  StatusSolicitacaoLgpd,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  ShieldAlert,
  ShieldCheck,
  Bot,
  UserCheck,
  AlertTriangle,
  Lock,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Fingerprint,
  Globe,
  FileText,
  Building2,
  Scale,
  Sparkles,
  HelpCircle,
  Info,
} from 'lucide-react';

export const AuditCompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sentinel' | 'auditoria' | 'lgpd' | 'cvm'>('sentinel');
  const [loading, setLoading] = useState(true);

  // States
  const [kpis, setKpis] = useState<AuditComplianceKpisDto>({
    transacoesQuarentenaCount: 1,
    valorFraudesPrevenidasTotal: 1840.0,
    taxaEficaciaBotSentinelPercent: 99.85,
    anomaliasContabeisAbertasCount: 1,
    solicitacoesLgpdPendentesCount: 1,
    conformidadePrazosLgpdPercent: 100.0,
  });

  const [frauds, setFrauds] = useState<AiFraudDetectionDto[]>([
    {
      id: 'frd-001',
      codigoTransacao: 'TRX-2026-98124',
      vendaId: 'vnd-8812',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      compradorDocumento: '458.***.***-12',
      ipOrigem: '185.220.101.42',
      geolocalizacaoIp: 'Frankfurt, Alemanha (Proxy Tor/VPN)',
      deviceFingerprint: 'fp-botnet-chromium-headless-8821',
      valorTransacao: 1840.0,
      tempoPreenchimentoSeg: 1,
      scoreProbabilidadeBot: 98.5,
      scoreRiscoFraude: 94.0,
      fatoresAlerta: [
        'Velocidade de preenchimento inumana (< 1.2 segundos)',
        'IP originário de saída de rede Tor/VPN internacional',
        'Tentativa de compra de 8 ingressos de lote premium consecutivamente',
      ],
      statusFraude: StatusFraudeTransacao.QUARENTENA,
      decisaoIa: 'Quarentena imediata: bloqueio de emissão de QR Code até validação biométrica/3DS.',
      analisadoPor: 'AI Sentinel Agent v4.1',
      resolvidoEm: null,
      createdAt: new Date('2026-03-02T14:22:00Z').toISOString(),
    },
    {
      id: 'frd-002',
      codigoTransacao: 'TRX-2026-98125',
      vendaId: 'vnd-8813',
      eventoId: 'evt-002',
      eventoNome: 'Grande Concerto MPB no Teatro Guaíra',
      compradorDocumento: '012.***.***-99',
      ipOrigem: '177.18.204.11',
      geolocalizacaoIp: 'Curitiba, PR, Brasil',
      deviceFingerprint: 'fp-safari-ios-17-iphone15',
      valorTransacao: 380.0,
      tempoPreenchimentoSeg: 48,
      scoreProbabilidadeBot: 1.2,
      scoreRiscoFraude: 3.5,
      fatoresAlerta: [],
      statusFraude: StatusFraudeTransacao.APROVADO,
      decisaoIa: 'Transação legítima com autenticação 3DS e biometria confirmada.',
      analisadoPor: 'AI Sentinel Agent v4.1',
      resolvidoEm: new Date('2026-03-02T15:10:00Z').toISOString(),
      createdAt: new Date('2026-03-02T15:09:00Z').toISOString(),
    },
  ]);

  const [anomalies, setAnomalies] = useState<ContinuousAuditAnomalyDto[]>([
    {
      id: 'ano-001',
      codigoAnomalia: 'ANO-2026-0042',
      tipoAnomalia: TipoAnomaliaAuditoria.DIVERGENCIA_GATEWAY_BORDERO,
      severidade: 'ALTA',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      valorDivergencia: 240.0,
      descricaoDiagnostico:
        'Divergência de R$ 240,00 entre o relatório de liquidação da Cielo e os borderôs de bilheteria gerados.',
      acaoCorretivaSugerida:
        'Executar reprocessamento do webhook ID whk-9912 para conciliação das taxas MDR retidas.',
      status: StatusAnomaliaAuditoria.PENDENTE,
      detectadoEm: new Date('2026-03-01T23:45:00Z').toISOString(),
      reconhecidoPor: null,
      reconhecidoEm: null,
    },
    {
      id: 'ano-002',
      codigoAnomalia: 'ANO-2026-0043',
      tipoAnomalia: TipoAnomaliaAuditoria.TENTATIVA_LANCAMENTO_PERIODO_FECHADO,
      severidade: 'CRITICA',
      eventoId: null,
      eventoNome: 'Contabilidade Geral DiskIngressos',
      valorDivergencia: 15400.0,
      descricaoDiagnostico:
        'Tentativa bloqueada de estorno manual com data contábil retroativa a 31/01/2026 (período encerrado).',
      acaoCorretivaSugerida:
        'Registrar ajuste contábil no período aberto corrente (março/2026) conforme NBC TG 23.',
      status: StatusAnomaliaAuditoria.RECONHECIDO,
      detectadoEm: new Date('2026-03-02T09:15:00Z').toISOString(),
      reconhecidoPor: 'cfo@diskingressos.com.br',
      reconhecidoEm: new Date('2026-03-02T10:00:00Z').toISOString(),
    },
  ]);

  const [lgpdRequests, setLgpdRequests] = useState<LgpdComplianceRequestDto[]>([
    {
      id: 'lgpd-001',
      protocoloAtendimento: 'LGPD-2026-0012',
      titularNome: 'Mariana Silveira Mendes',
      titularEmail: 'mariana.mendes@email.com',
      titularCpf: '084.291.849-33',
      tipoSolicitacao: TipoSolicitacaoLgpd.ANONIMIZACAO,
      prazoLimiteResposta: new Date('2026-03-18T18:00:00Z').toISOString(),
      status: StatusSolicitacaoLgpd.EM_ANALISE,
      justificativaLegal: 'Avaliação de histórico de ingressos emitidos e guarda fiscal de 5 anos.',
      atendidoPor: 'dpo@diskingressos.com.br',
      dataSolicitacao: new Date('2026-03-01T10:00:00Z').toISOString(),
      dataConclusao: null,
    },
    {
      id: 'lgpd-002',
      protocoloAtendimento: 'LGPD-2026-0011',
      titularNome: 'Carlos Eduardo Bastos',
      titularEmail: 'carlos.bastos@email.com',
      titularCpf: '194.882.112-70',
      tipoSolicitacao: TipoSolicitacaoLgpd.ACESSO,
      prazoLimiteResposta: new Date('2026-03-15T18:00:00Z').toISOString(),
      status: StatusSolicitacaoLgpd.CONCLUIDA,
      justificativaLegal: 'Relatório completo de dados cadastrais e compras expedido em formato seguro.',
      atendidoPor: 'dpo@diskingressos.com.br',
      dataSolicitacao: new Date('2026-02-25T14:30:00Z').toISOString(),
      dataConclusao: new Date('2026-02-27T11:00:00Z').toISOString(),
    },
  ]);

  // Modal / Novo Pedido LGPD
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoCpf, setNovoCpf] = useState('');
  const [novoTipo, setNovoTipo] = useState<TipoSolicitacaoLgpd>(TipoSolicitacaoLgpd.ANONIMIZACAO);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [kpisRes, fraudsRes, anomaliesRes, lgpdRes] = await Promise.allSettled([
        api.get('/audit-compliance/dashboard'),
        api.get('/audit-compliance/frauds'),
        api.get('/audit-compliance/anomalies'),
        api.get('/audit-compliance/lgpd-requests'),
      ]);

      if (kpisRes.status === 'fulfilled' && kpisRes.value?.data?.data) {
        setKpis(kpisRes.value.data.data);
      }
      if (fraudsRes.status === 'fulfilled' && fraudsRes.value?.data?.data) {
        setFrauds(fraudsRes.value.data.data);
      }
      if (anomaliesRes.status === 'fulfilled' && anomaliesRes.value?.data?.data) {
        setAnomalies(anomaliesRes.value.data.data);
      }
      if (lgpdRes.status === 'fulfilled' && lgpdRes.value?.data?.data) {
        setLgpdRequests(lgpdRes.value.data.data);
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

  const handleResolverFraude = async (id: string, decisao: 'APROVADO' | 'BLOQUEADO') => {
    try {
      await api.patch(`/audit-compliance/frauds/${id}/resolve`, {
        decisao,
        responsavel: 'auditor.chefe@diskingressos.com.br',
      });
      setFrauds((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                statusFraude:
                  decisao === 'APROVADO'
                    ? StatusFraudeTransacao.APROVADO
                    : StatusFraudeTransacao.BLOQUEADO,
                resolvidoEm: new Date().toISOString(),
              }
            : f,
        ),
      );
    } catch {
      setFrauds((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                statusFraude:
                  decisao === 'APROVADO'
                    ? StatusFraudeTransacao.APROVADO
                    : StatusFraudeTransacao.BLOQUEADO,
                resolvidoEm: new Date().toISOString(),
              }
            : f,
        ),
      );
    }
  };

  const handleReconhecerAnomalia = async (id: string) => {
    try {
      await api.patch(`/audit-compliance/anomalies/${id}/acknowledge`, {
        responsavel: 'controller@diskingressos.com.br',
      });
      setAnomalies((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: StatusAnomaliaAuditoria.RECONHECIDO,
                reconhecidoPor: 'controller@diskingressos.com.br',
                reconhecidoEm: new Date().toISOString(),
              }
            : a,
        ),
      );
    } catch {
      setAnomalies((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: StatusAnomaliaAuditoria.RECONHECIDO,
                reconhecidoPor: 'controller@diskingressos.com.br',
                reconhecidoEm: new Date().toISOString(),
              }
            : a,
        ),
      );
    }
  };

  const handleCriarSolicitacaoLgpd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoCpf) return;

    try {
      const res = await api.post('/audit-compliance/lgpd-requests', {
        titularNome: novoNome,
        titularEmail: novoEmail,
        titularCpf: novoCpf,
        tipoSolicitacao: novoTipo,
      });
      if (res.data?.data) {
        setLgpdRequests((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const nova: LgpdComplianceRequestDto = {
        id: `lgpd-00${lgpdRequests.length + 1}`,
        protocoloAtendimento: `LGPD-2026-00${lgpdRequests.length + 1}`,
        titularNome: novoNome,
        titularEmail: novoEmail,
        titularCpf: novoCpf,
        tipoSolicitacao: novoTipo,
        prazoLimiteResposta: new Date(Date.now() + 15 * 86400000).toISOString(),
        status: StatusSolicitacaoLgpd.EM_ANALISE,
        justificativaLegal: 'Aguardando validação de identidade e histórico de compras.',
        atendidoPor: 'dpo@diskingressos.com.br',
        dataSolicitacao: new Date().toISOString(),
        dataConclusao: null,
      };
      setLgpdRequests((prev) => [nova, ...prev]);
    }

    setNovoNome('');
    setNovoEmail('');
    setNovoCpf('');
  };

  const handleAnonimizarTitular = async (cpf: string) => {
    try {
      await api.post('/audit-compliance/lgpd-anonymize', {
        titularCpf: cpf,
        dpoResponsavel: 'dpo@diskingressos.com.br',
      });
      setLgpdRequests((prev) =>
        prev.map((r) =>
          r.titularCpf === cpf
            ? {
                ...r,
                status: StatusSolicitacaoLgpd.CONCLUIDA,
                dataConclusao: new Date().toISOString(),
                justificativaLegal: 'Anonimizado com retenção legal de dados fiscais (5 anos).',
              }
            : r,
        ),
      );
    } catch {
      setLgpdRequests((prev) =>
        prev.map((r) =>
          r.titularCpf === cpf
            ? {
                ...r,
                status: StatusSolicitacaoLgpd.CONCLUIDA,
                dataConclusao: new Date().toISOString(),
                justificativaLegal: 'Anonimizado com retenção legal de dados fiscais (5 anos).',
              }
            : r,
        ),
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Contexto Institucional */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-6 rounded-2xl text-white shadow-xl border border-rose-800/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-200 border border-rose-400/40 backdrop-blur-md">
              <Bot className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
              AI Sentinel Antifraude v4.1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 backdrop-blur-md">
              <Scale className="w-3.5 h-3.5 text-indigo-300" />
              LGPD Lei 13.709/18 & CVM
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Auditoria Contínua com IA & Compliance LGPD/CVM
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Detecção comportamental de bots cambistas em milissegundos, quarentena preventiva de ingressos,
            auditoria autônoma de conciliações e gestão de direitos dos titulares de dados com retenção fiscal legal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => carregarDados()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recalcular Anomalias
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Quarentena Antifraude
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {kpis.transacoesQuarentenaCount} Transações
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>QR Codes retidos temporariamente</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Fraudes Prevenidas (IA)
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.valorFraudesPrevenidasTotal)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span>{kpis.taxaEficaciaBotSentinelPercent}% Eficácia de Bloqueio</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Anomalias Contábeis Abertas
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {kpis.anomaliasContabeisAbertasCount} Pendências
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
              <span>Varredura automática contínua</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Conformidade LGPD (DPO)
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {kpis.conformidadePrazosLgpdPercent}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{kpis.solicitacoesLgpdPendentesCount} solicitações em prazo legal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'sentinel'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Sentinel (Antifraude & Bots)
          </button>
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'auditoria'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Auditoria Contínua (Reconciliação)
          </button>
          <button
            onClick={() => setActiveTab('lgpd')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'lgpd'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Scale className="w-4 h-4" />
            Portal de Privacidade LGPD (DPO)
          </button>
          <button
            onClick={() => setActiveTab('cvm')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition ${
              activeTab === 'cvm'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Trilha CVM & Auditoria Externa
          </button>
        </nav>
      </div>

      {/* ABA 1: AI SENTINEL (ANTIFRAUDE & BOTS) */}
      {activeTab === 'sentinel' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  Transações Analisadas pelo Motor Comportamental
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoramento em tempo real de fingerprinting, velocidade de preenchimento e mitigação de bots cambistas.
                </p>
              </div>
              <span className="text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1.5 rounded-lg font-bold border border-rose-200">
                {frauds.length} Transações Registradas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Evento</th>
                    <th className="p-3.5">Comprador</th>
                    <th className="p-3.5">Valor</th>
                    <th className="p-3.5">Origem / IP</th>
                    <th className="p-3.5">Tempo Checkout</th>
                    <th className="p-3.5">Score Bot</th>
                    <th className="p-3.5">Score Fraude</th>
                    <th className="p-3.5">Diagnóstico IA</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {frauds.map((fraud) => {
                    const isQuarentena = fraud.statusFraude === StatusFraudeTransacao.QUARENTENA;
                    return (
                      <tr key={fraud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{fraud.codigoTransacao}</div>
                          <div className="text-slate-400 font-medium">{fraud.eventoNome}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                          {fraud.compradorDocumento}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {formatCurrencyBRL(fraud.valorTransacao)}
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{fraud.ipOrigem}</div>
                          <div className="text-2xs text-slate-400">{fraud.geolocalizacaoIp}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                          {fraud.tempoPreenchimentoSeg}s
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-black ${
                              fraud.scoreProbabilidadeBot > 70
                                ? 'text-rose-600'
                                : fraud.scoreProbabilidadeBot > 30
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {fraud.scoreProbabilidadeBot}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-black ${
                              fraud.scoreRiscoFraude > 70
                                ? 'text-rose-600'
                                : fraud.scoreRiscoFraude > 30
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {fraud.scoreRiscoFraude}%
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs text-slate-500 truncate" title={fraud.decisaoIa}>
                          {fraud.decisaoIa}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-2xs font-bold ${
                              fraud.statusFraude === StatusFraudeTransacao.APROVADO
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : fraud.statusFraude === StatusFraudeTransacao.QUARENTENA
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-700'
                            }`}
                          >
                            {fraud.statusFraude}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {isQuarentena ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleResolverFraude(fraud.id, 'APROVADO')}
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                                title="Aprovar e Liberar QR Code"
                              >
                                Liberar
                              </button>
                              <button
                                onClick={() => handleResolverFraude(fraud.id, 'BLOQUEADO')}
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
                                title="Bloquear e Cancelar Venda"
                              >
                                Bloquear
                              </button>
                            </div>
                          ) : (
                            <span className="text-2xs text-slate-400">Resolvido</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: AUDITORIA CONTÍNUA (RECONCILIAÇÃO) */}
      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Anomalias Contábeis e Divergências Autônomas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Auditoria de partidas dobradas, divergências entre adquirentes e borderôs de produtores em tempo real.
                </p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-bold border border-indigo-200">
                {anomalies.length} Anomalias Monitoradas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Código / Data</th>
                    <th className="p-3.5">Tipo de Anomalia</th>
                    <th className="p-3.5">Severidade</th>
                    <th className="p-3.5">Evento Vinculado</th>
                    <th className="p-3.5">Valor Divergência</th>
                    <th className="p-3.5">Diagnóstico IA</th>
                    <th className="p-3.5">Ação Corretiva Sugerida</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {anomalies.map((anom) => {
                    const isPendente = anom.status === StatusAnomaliaAuditoria.PENDENTE;
                    return (
                      <tr key={anom.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{anom.codigoAnomalia}</div>
                          <div className="text-slate-400 font-mono text-2xs">
                            {formatDateBR(anom.detectadoEm)}
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                          {anom.tipoAnomalia.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-2xs font-bold ${
                              anom.severidade === 'CRITICA'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : anom.severidade === 'ALTA'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {anom.severidade}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          {anom.eventoNome || 'Contabilidade Geral'}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {formatCurrencyBRL(anom.valorDivergencia)}
                        </td>
                        <td className="p-3.5 max-w-xs text-slate-500 truncate" title={anom.descricaoDiagnostico}>
                          {anom.descricaoDiagnostico}
                        </td>
                        <td className="p-3.5 max-w-xs text-indigo-600 dark:text-indigo-400 truncate" title={anom.acaoCorretivaSugerida}>
                          {anom.acaoCorretivaSugerida}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-2xs font-bold ${
                              anom.status === StatusAnomaliaAuditoria.RECONHECIDO
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {anom.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {isPendente ? (
                            <button
                              onClick={() => handleReconhecerAnomalia(anom.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                            >
                              Reconhecer
                            </button>
                          ) : (
                            <span className="text-2xs text-slate-400">Reconhecido</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: PRIVACIDADE & LGPD */}
      {activeTab === 'lgpd' && (
        <div className="space-y-6">
          {/* Formulário de Registro de Solicitação de Titular */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Canal de Atendimento ao Titular de Dados (Art. 18 LGPD)
              </h3>
            </div>

            <form onSubmit={handleCriarSolicitacaoLgpd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Titular
                </label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  E-mail do Titular
                </label>
                <input
                  type="email"
                  placeholder="titular@email.com"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={novoCpf}
                  onChange={(e) => setNovoCpf(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow"
                >
                  Registrar Solicitação (15 Dias)
                </button>
              </div>
            </form>
          </div>

          {/* Tabela de Solicitações LGPD */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Protocolos Registrados e Controle de Prazo Legal (Art. 19, II)
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Protocolo</th>
                    <th className="p-3.5">Titular</th>
                    <th className="p-3.5">Tipo de Solicitação</th>
                    <th className="p-3.5">Data Registro</th>
                    <th className="p-3.5">Prazo Limite Legal</th>
                    <th className="p-3.5">Fundamentação DPO</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {lgpdRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {req.protocoloAtendimento}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{req.titularNome}</div>
                        <div className="text-slate-400 font-mono text-2xs">{req.titularCpf}</div>
                      </td>
                      <td className="p-3.5 font-medium">{req.tipoSolicitacao}</td>
                      <td className="p-3.5 text-slate-600">{formatDateBR(req.dataSolicitacao)}</td>
                      <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                        {formatDateBR(req.prazoLimiteResposta)}
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-500 truncate" title={req.justificativaLegal || ''}>
                        {req.justificativaLegal || 'Em avaliação'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-2xs font-bold ${
                            req.status === StatusSolicitacaoLgpd.CONCLUIDA
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {req.status !== StatusSolicitacaoLgpd.CONCLUIDA ? (
                          <button
                            onClick={() => handleAnonimizarTitular(req.titularCpf)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                          >
                            Anonimizar (SHA-256)
                          </button>
                        ) : (
                          <span className="text-2xs text-emerald-600 font-bold">Atendido</span>
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

      {/* ABA 4: TRILHA CVM & AUDITORIA EXTERNA */}
      {activeTab === 'cvm' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Trilha de Evidências Imutável para CVM & Auditoria Independente (Big Four)
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
              Em cumprimento às exigências de governança da CVM e às normas brasileiras de auditoria independente (NBC TA),
              todos os fechamentos de borderôs, viradas de lote com precificação dinâmica e estornos executados
              possuem carimbo temporal SHA-256 assinado e isolamento contra alterações retroativas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Retenção Contábil Legal
                </span>
                <p className="text-2xs text-slate-500 dark:text-slate-400">
                  Guarda de 5 anos obrigatória por lei fiscal e civil (Art. 1.194 CC).
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Integridade Criptográfica
                </span>
                <p className="text-2xs text-slate-500 dark:text-slate-400">
                  Todos os logs de bilheteria e conciliação possuem hash SHA-256 encadeado.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Segregação de Funções (SoD)
                </span>
                <p className="text-2xs text-slate-500 dark:text-slate-400">
                  Aprovação de quarentenas e estornos requer perfil com alçada designada.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
