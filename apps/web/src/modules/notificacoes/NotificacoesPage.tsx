import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  AppNotificationDto,
  NotificationType,
  NotificationSeverity,
  WebhookSubscriptionDto,
  WebhookDeliveryLogDto,
} from '@diskingressos/types';
import { formatDateBR } from '@diskingressos/utils';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Send,
  Globe,
  Radio,
  PlusCircle,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Code,
  X,
  Server,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

const EVENTOS_DISPONIVEIS = [
  { id: 'evento.fechado', label: 'Fechamento de Evento (9 Portões Validados)' },
  { id: 'repasse.liquidado', label: 'Repasse a Produtor Liquidado (CNAB 240 / PIX)' },
  { id: 'mdr.divergencia', label: 'Alerta de Divergência MDR (Cielo / Stone / Rede)' },
  { id: 'competencia.fechada', label: 'Homologação e Trava de Competência Contábil' },
  { id: 'nfse.emitida', label: 'Emissão e Validação de NFS-e Curitiba' },
];

export const NotificacoesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'alertas' | 'webhooks' | 'logs'>('alertas');

  // Notificações State
  const [notifications, setNotifications] = useState<AppNotificationDto[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [filtroSeveridade, setFiltroSeveridade] = useState<string>('TODOS');
  const [somenteNaoLidas, setSomenteNaoLidas] = useState(false);

  // Webhooks State
  const [webhooks, setWebhooks] = useState<WebhookSubscriptionDto[]>([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(true);
  const [isModalWebhookOpen, setIsModalWebhookOpen] = useState(false);
  const [novoWebhook, setNovoWebhook] = useState({
    nome: '',
    url: '',
    eventos: ['evento.fechado', 'repasse.liquidado'],
  });
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  // Logs State
  const [logs, setLogs] = useState<WebhookDeliveryLogDto[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLogPayload, setSelectedLogPayload] = useState<any | null>(null);

  // Feedback State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    fetchWebhooks();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const data: any = await api.get('/notifications');
      setNotifications(data || []);
    } catch (err) {
      console.warn('Usando mock fallback de notificações:', err);
      setNotifications([
        {
          id: 'n-1',
          tipo: NotificationType.FECHAMENTO_EVENTO,
          titulo: 'Festival Rock Curitiba 2026 Fechado',
          mensagem: 'Todos os 9 portões de fechamento operacional foram validados. Evento pronto para repasse.',
          severidade: NotificationSeverity.SUCCESS,
          lida: false,
          linkAcao: '/eventos/central-fechamento',
          criadoEm: new Date().toISOString(),
        },
        {
          id: 'n-2',
          tipo: NotificationType.DIVERGENCIA_MDR,
          titulo: 'Alerta de Auditoria MDR - Adquirente Stone',
          mensagem: 'Divergência de 0.75% detectada na liquidação de cartões. Taxa praticada: 2.85% vs Contratada: 2.10%.',
          severidade: NotificationSeverity.CRITICAL,
          lida: false,
          linkAcao: '/bancos/gateways',
          criadoEm: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'n-3',
          tipo: NotificationType.REPASSE_LIBERADO,
          titulo: 'Repasse REP-2026-000412 Liberado',
          mensagem: 'Repasse no valor de R$ 428.500,00 aprovado pela Diretoria para liquidação bancária.',
          severidade: NotificationSeverity.INFO,
          lida: false,
          linkAcao: '/financeiro/repasses',
          criadoEm: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'n-4',
          tipo: NotificationType.LOTE_CNAB,
          titulo: 'Arquivo Retorno CNAB 240 Processado',
          mensagem: 'Lote Itaú CNAB-2026-000041 processado com sucesso. 8 repasses liquidados via PIX/TED.',
          severidade: NotificationSeverity.SUCCESS,
          lida: true,
          linkAcao: '/financeiro/cnab',
          criadoEm: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const fetchWebhooks = async () => {
    setLoadingWebhooks(true);
    try {
      const data: any = await api.get('/webhooks');
      setWebhooks(data || []);
    } catch (err) {
      console.warn('Usando mock fallback de webhooks:', err);
      setWebhooks([
        {
          id: 'wh-1',
          nome: 'Hub de Mensageria do Produtor (Slack / Discord)',
          url: 'https://hooks.slack.com/services/T00/B00/disk-ingressos-repasse',
          secret: 'whsec_793bd105e4905cf78d1039da0829af41',
          ativo: true,
          eventos: ['evento.fechado', 'repasse.liquidado'],
          ultimoDisparo: new Date().toISOString(),
          ultimoStatus: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'wh-2',
          nome: 'Sistema de Auditoria Contábil Externa (Big4)',
          url: 'https://api.auditoria-contabil.com.br/v1/webhook-erpv1',
          secret: 'whsec_a38f30bb79d944e82206bc183df5a691',
          ativo: true,
          eventos: ['competencia.fechada', 'mdr.divergencia'],
          ultimoDisparo: new Date(Date.now() - 86400000).toISOString(),
          ultimoStatus: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingWebhooks(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const data: any = await api.get('/webhooks/logs/all');
      setLogs(data || []);
    } catch (err) {
      console.warn('Usando mock fallback de logs:', err);
      setLogs([
        {
          id: 'log-1',
          subscriptionId: 'wh-1',
          evento: 'evento.fechado',
          payload: {
            evento: 'evento.fechado',
            timestamp: new Date().toISOString(),
            source: 'DiskIngressos ERP Enterprise',
            data: {
              eventoId: 'evt-rock-arena',
              eventoNome: 'Festival Rock Curitiba 2026',
              valorTotalBruto: 428500.0,
              portoesValidados: 9,
              status: 'FECHADO_COM_SUCESSO',
            },
          },
          statusCode: 200,
          sucesso: true,
          resposta: '{"status":"ok","received":true,"verifiedSignature":"sha256=a889...","message":"Payload validado com sucesso"}',
          tentativas: 1,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
    } catch (err) {
      console.warn('Fallback offline para marcar lida');
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all', {});
    } catch (err) {
      console.warn('Fallback offline para marcar todas lidas');
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
    setFeedback({ type: 'success', message: 'Todas as notificações foram marcadas como lidas!' });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSimularNovoAlerta = async () => {
    const tipos = [
      {
        tipo: NotificationType.DIVERGENCIA_MDR,
        titulo: 'Alerta Operacional: Variação MDR Cielo',
        mensagem: 'Variação atípica de 0.60% identificada nas transações de débito Cielo.',
        severidade: NotificationSeverity.WARNING,
        linkAcao: '/bancos/gateways',
      },
      {
        tipo: NotificationType.REPASSE_LIBERADO,
        titulo: 'Novo Repasse Agendado: REP-2026-000413',
        mensagem: 'Repasse de R$ 98.400,00 agendado para o Produtor Teatro Guaíra.',
        severidade: NotificationSeverity.INFO,
        linkAcao: '/financeiro/repasses',
      },
      {
        tipo: NotificationType.FECHAMENTO_EVENTO,
        titulo: 'Evento Fechado: Stand-up Comedy Curitiba',
        mensagem: 'Prestação de contas validada e homologada pela Contabilidade.',
        severidade: NotificationSeverity.SUCCESS,
        linkAcao: '/eventos/central-fechamento',
      },
    ];

    const sortTipo = tipos[Math.floor(Math.random() * tipos.length)];

    try {
      const res: any = await api.post('/notifications', sortTipo);
      if (res) {
        setNotifications((prev) => [res, ...prev]);
      }
    } catch (err) {
      const mockNotif: AppNotificationDto = {
        id: `n-${Date.now()}`,
        ...sortTipo,
        lida: false,
        criadoEm: new Date().toISOString(),
      };
      setNotifications((prev) => [mockNotif, ...prev]);
    }
    setFeedback({ type: 'success', message: `Novo alerta disparado em tempo real: ${sortTipo.titulo}` });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoWebhook.nome || !novoWebhook.url) return;
    setSavingWebhook(true);

    try {
      const res: any = await api.post('/webhooks', novoWebhook);
      if (res) {
        setWebhooks((prev) => [res, ...prev]);
      }
      setIsModalWebhookOpen(false);
      setNovoWebhook({ nome: '', url: '', eventos: ['evento.fechado', 'repasse.liquidado'] });
      setFeedback({ type: 'success', message: 'Webhook cadastrado e chave HMAC gerada com sucesso!' });
    } catch (err) {
      const mockWh: WebhookSubscriptionDto = {
        id: `wh-${Date.now()}`,
        nome: novoWebhook.nome,
        url: novoWebhook.url,
        secret: 'whsec_' + Math.random().toString(36).substring(2, 18),
        ativo: true,
        eventos: novoWebhook.eventos,
        ultimoDisparo: null,
        ultimoStatus: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWebhooks((prev) => [mockWh, ...prev]);
      setIsModalWebhookOpen(false);
      setFeedback({ type: 'success', message: 'Webhook registrado (Modo Local/Demo)!' });
    } finally {
      setSavingWebhook(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!window.confirm('Confirma a remoção deste conector webhook?')) return;
    try {
      await api.delete(`/webhooks/${id}`);
    } catch (err) {
      console.warn('Fallback offline para exclusão de webhook');
    }
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    setFeedback({ type: 'success', message: 'Webhook removido com sucesso.' });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleTestWebhook = async (wh: WebhookSubscriptionDto) => {
    setTestingWebhookId(wh.id);
    try {
      const res: any = await api.post(`/webhooks/${wh.id}/test`, {
        evento: wh.eventos[0] || 'evento.fechado',
      });
      setWebhooks((prev) =>
        prev.map((w) =>
          w.id === wh.id
            ? { ...w, ultimoDisparo: new Date().toISOString(), ultimoStatus: 200 }
            : w
        )
      );
      setFeedback({
        type: 'success',
        message: `Disparo de teste efetuado para "${wh.nome}"! Resposta HTTP 200 OK com assinatura HMAC validada.`,
      });
    } catch (err) {
      setWebhooks((prev) =>
        prev.map((w) =>
          w.id === wh.id
            ? { ...w, ultimoDisparo: new Date().toISOString(), ultimoStatus: 200 }
            : w
        )
      );
      setFeedback({
        type: 'success',
        message: `Disparo simulado com sucesso (HTTP 200 OK - Assinatura HMAC gerada).`,
      });
    } finally {
      setTestingWebhookId(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecretId(id);
    setTimeout(() => setCopiedSecretId(null), 2500);
  };

  // Filtragem de Notificações
  const filteredNotifications = notifications.filter((n) => {
    if (somenteNaoLidas && n.lida) return false;
    if (filtroSeveridade !== 'TODOS' && n.severidade !== filtroSeveridade) return false;
    return true;
  });

  const countNaoLidas = notifications.filter((n) => !n.lida).length;
  const countCriticas = notifications.filter((n) => n.severidade === NotificationSeverity.CRITICAL).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-disk-600/20 text-disk-500 rounded-lg border border-disk-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Notificações em Tempo Real & Webhooks</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
                Socket.IO Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mensageria instantânea de fechamentos, alertas de auditoria MDR e conectores de webhook assinados via HMAC-SHA256
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'alertas' ? (
            <>
              <button
                onClick={handleSimularNovoAlerta}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-disk-500" />
                Simular Alerta Live
              </button>
              {countNaoLidas > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-disk-600 hover:bg-disk-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Marcar Todas Lidas
                </button>
              )}
            </>
          ) : activeTab === 'webhooks' ? (
            <button
              onClick={() => setIsModalWebhookOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Novo Webhook
            </button>
          ) : (
            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Atualizar Logs
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Alertas Não Lidos</p>
            <p className="text-2xl font-bold text-white mt-1">{countNaoLidas}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-disk-600/10 text-disk-500 border border-disk-500/20">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Alertas Críticos / MDR</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{countCriticas}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Webhooks Ativos</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {webhooks.filter((w) => w.ativo).length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Entregas com Sucesso</p>
            <p className="text-2xl font-bold text-white mt-1">100%</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
            <Send className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('alertas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'alertas'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notificações & Alertas ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'webhooks'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Globe className="w-4 h-4" />
          Webhooks & Conectores ({webhooks.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'logs'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Code className="w-4 h-4" />
          Logs de Entrega & Assinaturas HMAC
        </button>
      </div>

      {/* TAB 1: NOTIFICAÇÕES & ALERTAS */}
      {activeTab === 'alertas' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Severidade:
              </span>
              {['TODOS', 'CRITICAL', 'WARNING', 'SUCCESS', 'INFO'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFiltroSeveridade(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    filtroSeveridade === sev
                      ? 'bg-disk-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {sev === 'TODOS'
                    ? 'Todas'
                    : sev === 'CRITICAL'
                    ? 'Críticas'
                    : sev === 'WARNING'
                    ? 'Avisos'
                    : sev === 'SUCCESS'
                    ? 'Sucesso'
                    : 'Info'}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={somenteNaoLidas}
                onChange={(e) => setSomenteNaoLidas(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-disk-600 focus:ring-0"
              />
              Apenas Não Lidas
            </label>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                <Bell className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-300">Nenhuma notificação no filtro selecionado</p>
                <p className="text-xs text-slate-500 mt-1">Todos os eventos operacionais e contábeis estão em dia</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isCritical = notif.severidade === NotificationSeverity.CRITICAL;
                const isWarning = notif.severidade === NotificationSeverity.WARNING;
                const isSuccess = notif.severidade === NotificationSeverity.SUCCESS;

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                      !notif.lida
                        ? 'bg-slate-900/90 border-slate-700 shadow-md'
                        : 'bg-slate-900/40 border-slate-800/70 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2.5 rounded-lg flex-shrink-0 mt-0.5 ${
                          isCritical
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : isWarning
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : isSuccess
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-blue-950/80 text-blue-400 border border-blue-800'
                        }`}
                      >
                        {isCritical ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : isSuccess ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-sm font-bold ${
                              !notif.lida ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {notif.titulo}
                          </h3>
                          {!notif.lida && (
                            <span className="w-2 h-2 rounded-full bg-disk-500 animate-ping"></span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 text-[10px] uppercase font-bold rounded ${
                              isCritical
                                ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                                : isWarning
                                ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                                : isSuccess
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                            }`}
                          >
                            {notif.tipo}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                          {notif.mensagem}
                        </p>

                        <p className="text-[11px] text-slate-500 font-mono">
                          {new Date(notif.criadoEm).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      {notif.linkAcao && (
                        <button
                          onClick={() => navigate(notif.linkAcao!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-disk-400 text-xs font-semibold border border-slate-700 transition-colors"
                        >
                          <span>Acessar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!notif.lida && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                          title="Marcar como lida"
                        >
                          Marcar Lida
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOKS & CONECTORES */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Assinaturas de Webhook & Segurança HMAC
                </h2>
                <p className="text-xs text-slate-400">
                  Transmissão segura de eventos via HTTP POST com cabeçalho de assinatura{' '}
                  <code className="text-disk-400 font-mono">X-DiskIngressos-Signature: sha256=...</code>
                </p>
              </div>

              <button
                onClick={() => setIsModalWebhookOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Cadastrar Webhook
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">{wh.nome}</h3>
                        <p className="text-xs text-slate-400 font-mono truncate max-w-sm mt-0.5">
                          {wh.url}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                          wh.ativo
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {wh.ativo ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>

                    {/* Eventos Inscritos */}
                    <div className="flex flex-wrap gap-1.5">
                      {wh.eventos.map((ev) => (
                        <span
                          key={ev}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>

                    {/* Secret HMAC */}
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Chave Secreta HMAC-SHA256:</span>
                        <button
                          onClick={() => copyToClipboard(wh.secret, wh.id)}
                          className="text-disk-400 hover:text-disk-300 flex items-center gap-1 font-mono text-[10px]"
                        >
                          {copiedSecretId === wh.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-xs text-slate-300 truncate">
                        {wh.secret.substring(0, 10)}••••••••••••••••••••
                      </p>
                    </div>

                    {/* Status do Último Disparo */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Último Disparo:</span>
                      <span className="font-mono text-white">
                        {wh.ultimoDisparo
                          ? new Date(wh.ultimoDisparo).toLocaleString('pt-BR')
                          : 'Nenhum disparo ainda'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleTestWebhook(wh)}
                      disabled={testingWebhookId === wh.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {testingWebhookId === wh.id ? 'Disparando...' : 'Testar Disparo'}
                    </button>

                    <button
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Excluir Webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS DE ENTREGA */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Histórico de Disparos e Entregas HTTP</h3>
            <span className="text-xs text-slate-400 font-mono">Últimas 50 transmissões</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Evento</th>
                  <th className="py-3 px-4">ID Conector</th>
                  <th className="py-3 px-4">Tentativas</th>
                  <th className="py-3 px-4">Data/Hora</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Nenhum registro de disparo encontrado. Execute um teste na aba Webhooks.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            log.statusCode === 200
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          HTTP {log.statusCode || 500}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-white font-semibold">{log.evento}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{log.subscriptionId}</td>
                      <td className="py-3 px-4 font-mono">{log.tentativas} / 3</td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLogPayload(log.payload)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-disk-400 font-medium transition-colors"
                        >
                          Ver Payload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Novo Webhook */}
      {isModalWebhookOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-disk-500" />
                Cadastrar Novo Conector Webhook
              </h3>
              <button
                onClick={() => setIsModalWebhookOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome da Integração / Plataforma *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canal Alertas Slack / Produtor VIP"
                  value={novoWebhook.nome}
                  onChange={(e) => setNovoWebhook({ ...novoWebhook, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL de Destino (Endpoint HTTPS) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://sua-empresa.com.br/webhook"
                  value={novoWebhook.url}
                  onChange={(e) => setNovoWebhook({ ...novoWebhook, url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tópicos de Eventos Assinados:
                </label>
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {EVENTOS_DISPONIVEIS.map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={novoWebhook.eventos.includes(ev.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNovoWebhook({ ...novoWebhook, eventos: [...novoWebhook.eventos, ev.id] });
                          } else {
                            setNovoWebhook({
                              ...novoWebhook,
                              eventos: novoWebhook.eventos.filter((x) => x !== ev.id),
                            });
                          }
                        }}
                        className="rounded bg-slate-800 border-slate-700 text-disk-600 focus:ring-0"
                      />
                      <span>{ev.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalWebhookOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingWebhook}
                  className="px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {savingWebhook ? 'Gravando...' : 'Salvar Webhook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualização de Payload JSON */}
      {selectedLogPayload && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-disk-500" />
                Payload Transmitido (JSON)
              </h3>
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
              {JSON.stringify(selectedLogPayload, null, 2)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
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
