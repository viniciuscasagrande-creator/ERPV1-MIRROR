import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { wsService } from '../../services/websocket';
import {
  ProducerSettlement,
  SettlementKpis,
  StatusRepasse,
  SocketEvent,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import { useAuthStore } from '../../stores/auth.store';
import {
  Landmark,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  Building,
  RefreshCw,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const RepassesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [settlements, setSettlements] = useState<ProducerSettlement[]>([]);
  const [kpis, setKpis] = useState<SettlementKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<ProducerSettlement | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Eventos para solicitação
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventCalculation, setEventCalculation] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // Forms
  const [formValor, setFormValor] = useState('');
  const [formRetencao, setFormRetencao] = useState('0');
  const [formObservacoes, setFormObservacoes] = useState('');
  const [approveMotivo, setApproveMotivo] = useState('');
  const [execAutenticacao, setExecAutenticacao] = useState('');

  // Toast de atualização em tempo real
  const [liveToast, setLiveToast] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, kpiRes]: any = await Promise.all([
        api.get('/repasses', {
          params: {
            search: search || undefined,
            status: statusFilter || undefined,
          },
        }),
        api.get('/repasses/kpis'),
      ]);
      setSettlements(listRes || []);
      setKpis(kpiRes || null);
    } catch (err) {
      console.error('Falha ao carregar repasses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Carrega eventos disponíveis para repasse
    api.get('/events').then((res: any) => {
      setEventsList(res.items || []);
    });

    // Conecta listener do Socket.IO para sincronização instantânea
    const handleSettlementUpdate = (payload: any) => {
      setLiveToast(`Repasse ${payload.codigo} atualizado para status: ${payload.status}`);
      setTimeout(() => setLiveToast(null), 5000);
      fetchData();
    };

    wsService.on(SocketEvent.SETTLEMENT_UPDATED, handleSettlementUpdate);
    wsService.on(SocketEvent.PRODUCER_SETTLEMENT_UPDATED, handleSettlementUpdate);

    return () => {
      wsService.off(SocketEvent.SETTLEMENT_UPDATED, handleSettlementUpdate);
      wsService.off(SocketEvent.PRODUCER_SETTLEMENT_UPDATED, handleSettlementUpdate);
    };
  }, [search, statusFilter]);

  // Ao selecionar um evento no modal de criação, calcula o saldo disponível
  useEffect(() => {
    if (!selectedEventId) {
      setEventCalculation(null);
      return;
    }

    setCalcLoading(true);
    api
      .get(`/repasses/calculo-evento/${selectedEventId}`)
      .then((res: any) => {
        setEventCalculation(res);
        setFormValor(String(res.dre?.saldoDisponivel || '0'));
      })
      .catch((e) => console.error('Erro ao calcular DRE do evento:', e))
      .finally(() => setCalcLoading(false));
  }, [selectedEventId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setActionLoading(true);
    try {
      await api.post('/repasses', {
        eventId: selectedEventId,
        valorSolicitado: parseFloat(formValor),
        retencaoSeguranca: parseFloat(formRetencao || '0'),
        observacoes: formObservacoes || undefined,
      });
      setIsCreateModalOpen(false);
      setSelectedEventId('');
      setFormValor('');
      setFormRetencao('0');
      setFormObservacoes('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao solicitar repasse');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (aprovado: boolean) => {
    if (!selectedSettlement) return;
    setActionLoading(true);
    try {
      await api.patch(`/repasses/${selectedSettlement.id}/aprovar`, {
        aprovado,
        motivo: approveMotivo || undefined,
      });
      setIsApproveModalOpen(false);
      setSelectedSettlement(null);
      setApproveMotivo('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao aprovar/rejeitar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedSettlement || !execAutenticacao) {
      alert('Informe o código de autenticação bancária');
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/repasses/${selectedSettlement.id}/executar`, {
        autenticacaoBancaria: execAutenticacao,
      });
      setIsExecuteModalOpen(false);
      setSelectedSettlement(null);
      setExecAutenticacao('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao registrar execução');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notificação Tempo Real */}
      {liveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-disk-500/50 animate-bounce">
          <Sparkles className="w-5 h-5 text-disk-400" />
          <p className="text-xs font-medium">{liveToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-7 h-7 text-disk-500" />
            Repasses a Produtores & Borderôs de Liquidação
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Apuração contratual de eventos, esteira de autorização de pagamentos e liquidação bancária via PIX
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Solicitar Repasse
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Total Repassado (Liquidado)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.totalPago)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Efetivado com autenticação bancária
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Aprovado (Na Tesouraria)</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrencyBRL(kpis.totalAprovado)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Pronto para remessa PIX/TED
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Pendente de Aprovação</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrencyBRL(kpis.totalPendente)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Em análise contábil / auditoria
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Retenção Técnica (Garantia)</span>
              <ShieldCheck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrencyBRL(kpis.totalRetencaoSeguranca)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Retido contra estornos pós-evento
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código REP, produtor ou evento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todos os Status</option>
            <option value="SOLICITADO">Solicitado</option>
            <option value="APROVADO">Aprovado</option>
            <option value="PAGO">Pago</option>
            <option value="REJEITADO">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Borderô / Código</th>
                <th className="px-6 py-4">Produtor & Favorecido</th>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4 text-right">Apurado</th>
                <th className="px-6 py-4 text-right">Retenção</th>
                <th className="px-6 py-4 text-right">Líquido Repasse</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando borderôs de repasses...
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Nenhum repasse localizado.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-disk-600 dark:text-disk-400">
                        {s.codigo}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDateBR(s.solicitadoEm)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {s.producerNome}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        PIX: {s.chavePix || s.bancoDestino}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                        {s.eventNome}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        Por: {s.solicitadoPorNome}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right text-xs text-slate-500">
                      {formatCurrencyBRL(s.valorBrutoApurado)}
                    </td>

                    <td className="px-6 py-4 text-right text-xs text-purple-600 dark:text-purple-400 font-medium">
                      -{formatCurrencyBRL(s.retencaoSeguranca)}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white text-base">
                      {formatCurrencyBRL(s.valorLiquido)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {s.status === 'PAGO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pago
                        </span>
                      )}
                      {s.status === 'APROVADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3.5 h-3.5" />
                          Aprovado
                        </span>
                      )}
                      {s.status === 'SOLICITADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          Solicitado
                        </span>
                      )}
                      {s.status === 'REJEITADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejeitado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {s.status === 'SOLICITADO' && (
                          <button
                            onClick={() => {
                              setSelectedSettlement(s);
                              setIsApproveModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                          >
                            Analisar
                          </button>
                        )}
                        {s.status === 'APROVADO' && (
                          <button
                            onClick={() => {
                              setSelectedSettlement(s);
                              setIsExecuteModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Pagar PIX
                          </button>
                        )}
                        {s.status === 'PAGO' && s.autenticacaoBancaria && (
                          <span
                            className="text-[11px] font-mono text-slate-400 max-w-[130px] truncate block"
                            title={s.autenticacaoBancaria}
                          >
                            {s.autenticacaoBancaria}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Solicitar Repasse */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-disk-500" />
                Nova Solicitação de Repasse / Borderô
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o Evento para Apuração *
                </label>
                <select
                  required
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                >
                  <option value="">Selecione um evento...</option>
                  {eventsList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome} ({e.producer?.nomeFantasia || 'Produtor'})
                    </option>
                  ))}
                </select>
              </div>

              {/* DRE e Saldo em tempo real do evento */}
              {calcLoading && (
                <div className="p-4 text-center text-xs text-slate-400">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-disk-500" />
                  Calculando DRE e apuração líquida do evento...
                </div>
              )}

              {eventCalculation && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Vendas Brutas Ingressos:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(eventCalculation.dre.vendasBrutas)}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>(-) Cancelamentos & Estornos:</span>
                    <span>-{formatCurrencyBRL(eventCalculation.dre.cancelamentos + eventCalculation.dre.estornos)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>(-) Taxas Adquirentes MDR:</span>
                    <span>-{formatCurrencyBRL(eventCalculation.dre.taxasMdrGateway)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>(-) Comissão DiskIngressos:</span>
                    <span>-{formatCurrencyBRL(eventCalculation.dre.comissaoDisk)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 dark:text-rose-400">
                    <span>(-) Repasses já Comprometidos:</span>
                    <span>-{formatCurrencyBRL(eventCalculation.dre.totalRepassesComprometidos)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm">
                    <span className="text-slate-900 dark:text-white">Saldo Disponível para Repasse:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(eventCalculation.dre.saldoDisponivel)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    Favorecido: {eventCalculation.producerNome} | PIX: {eventCalculation.chavePix || 'Não informado'}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Valor Solicitado (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Retenção Técnica de Garantia (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formRetencao}
                    onChange={(e) => setFormRetencao(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 text-purple-600 dark:text-purple-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Observações do Borderô
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: 1º adiantamento contratual 30 dias antes do show..."
                  value={formObservacoes}
                  onChange={(e) => setFormObservacoes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedEventId}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm flex items-center gap-2"
                >
                  {actionLoading ? 'Gerando...' : 'Gerar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Aprovar / Rejeitar Repasse */}
      {isApproveModalOpen && selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Auditar e Aprovar Repasse
              </h3>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-mono font-bold text-disk-500">{selectedSettlement.codigo}</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedSettlement.producerNome}
                </p>
                <p className="text-xs text-slate-400">Evento: {selectedSettlement.eventNome}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  Líquido: {formatCurrencyBRL(selectedSettlement.valorLiquido)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parecer / Motivo da Decisão
                </label>
                <input
                  type="text"
                  placeholder="Ex: Liberado conforme cláusula 4.2 do contrato"
                  value={approveMotivo}
                  onChange={(e) => setApproveMotivo(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleApprove(false)}
                disabled={actionLoading}
                className="px-3 py-2 text-sm font-medium rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300"
              >
                Rejeitar
              </button>
              <button
                type="button"
                onClick={() => handleApprove(true)}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
              >
                {actionLoading ? 'Processando...' : 'Aprovar Repasse'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Executar Repasse Bancário (PIX) */}
      {isExecuteModalOpen && selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                Executar Liquidação PIX
              </h3>
              <button
                onClick={() => setIsExecuteModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Favorecido: {selectedSettlement.producerNome}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  Chave PIX: {selectedSettlement.chavePix || selectedSettlement.bancoDestino}
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  {formatCurrencyBRL(selectedSettlement.valorLiquido)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Autenticação Bancária (Hash do Comprovante PIX) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PIX-E341098877202610-AUT-BRL"
                  value={execAutenticacao}
                  onChange={(e) => setExecAutenticacao(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                />
              </div>

              <p className="text-xs text-slate-400 italic">
                * Ao confirmar, a quantia será debitada automaticamente da Conta Movimento Itaú e os ouvintes Socket.IO do Produtor serão notificados em tempo real.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsExecuteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
              >
                {actionLoading ? 'Registrando...' : 'Confirmar Pagamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
