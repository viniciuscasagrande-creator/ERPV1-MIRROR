import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { wsService } from '../../services/websocket';
import {
  EventSummary,
  EventClosingChecklist,
  SocketEvent,
  WsGateUpdatedPayload,
} from '@diskingressos/types';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Lock,
  ArrowRight,
  Building,
  Calendar,
  MapPin,
  Save,
  Check,
  XCircle,
  Zap,
} from 'lucide-react';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';

export const CentralFechamentoPage: React.FC = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/events');
      const items: EventSummary[] = res.items || [];
      setEvents(items);
      if (items.length > 0 && !selectedEventId) {
        setSelectedEventId(items[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    wsService.connect();
  }, []);

  // Entra na sala do evento no Socket.IO
  useEffect(() => {
    if (!selectedEventId) return;

    wsService.joinEventRoom(selectedEventId);

    // Ouve atualizações de portões em tempo real
    const unsubscribeGate = wsService.on<WsGateUpdatedPayload>(
      SocketEvent.CHECKLIST_GATE_UPDATED,
      (payload) => {
        if (payload.eventId === selectedEventId) {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === payload.eventId && e.closingChecklist
                ? {
                    ...e,
                    closingChecklist: {
                      ...e.closingChecklist,
                      [payload.gateKey]: payload.value,
                    },
                  }
                : e,
            ),
          );

          setFeedback({
            type: 'success',
            message: `⚡ Atualização em tempo real via Socket.IO: Portão '${payload.gateKey}' atualizado por ${payload.updatedBy || 'outro operador'}.`,
          });

          setTimeout(() => setFeedback(null), 5000);
        }
      },
    );

    const unsubscribeClosed = wsService.on(SocketEvent.EVENT_CLOSED, (payload: any) => {
      if (payload.eventId === selectedEventId) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === payload.eventId && e.closingChecklist
              ? {
                  ...e,
                  statusFinanceiro: 'FECHADO' as any,
                  closingChecklist: {
                    ...e.closingChecklist,
                    eventoFechado: true,
                  },
                }
              : e,
          ),
        );
      }
    });

    return () => {
      wsService.leaveEventRoom(selectedEventId);
      unsubscribeGate();
      unsubscribeClosed();
    };
  }, [selectedEventId]);

  const currentEvent = events.find((e) => e.id === selectedEventId);
  const checklist = currentEvent?.closingChecklist;
  const financial = currentEvent?.financialSummary;

  const toggleGate = async (gateKey: keyof EventClosingChecklist) => {
    if (!currentEvent || !checklist) return;
    if (checklist.eventoFechado && gateKey !== 'eventoFechado') {
      setFeedback({
        type: 'error',
        message: 'Este evento já está encerrado e arquivado para auditoria contábil.',
      });
      return;
    }

    const nextVal = !checklist[gateKey];
    setSaving(true);
    setFeedback(null);

    try {
      const updated = await api.patch(`/events/${currentEvent.id}/checklist`, {
        [gateKey]: nextVal,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id
            ? { ...e, closingChecklist: { ...e.closingChecklist, ...updated } as any }
            : e,
        ),
      );

      setFeedback({
        type: 'success',
        message: `Portão atualizado com sucesso.`,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Falha ao atualizar o checklist.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConcludeClosing = async () => {
    await toggleGate('eventoFechado');
  };

  const gates: Array<{
    key: keyof EventClosingChecklist;
    title: string;
    description: string;
    responsible: string;
  }> = [
    {
      key: 'vendasConferidas',
      title: '1. Vendas Multi-Canal',
      description: 'Conferência de lotes e bilheteria online, PDVs, totens e POS físicos sincronizados.',
      responsible: 'Operacional / Bilheteria',
    },
    {
      key: 'cancelamentosConferidos',
      title: '2. Cancelamentos e Arrependimento',
      description: 'Validação de compras canceladas no prazo de 7 dias (CDC) e retenções aplicáveis.',
      responsible: 'SAC / Atendimento',
    },
    {
      key: 'estornosConferidos',
      title: '3. Estornos & Chargebacks',
      description: 'Provisionamento de reservas de segurança para contestações de cartão.',
      responsible: 'Financeiro / Risco',
    },
    {
      key: 'gatewayConciliado',
      title: '4. Conciliação de Gateways',
      description: 'Conferência dos extratos de repasse Cielo, Stone, Rede e desconto da taxa MDR.',
      responsible: 'Financeiro / Tesouraria',
    },
    {
      key: 'bancoConciliado',
      title: '5. Extrato Bancário (OFX / API)',
      description: 'Crédito efetivo das adquirentes e PIX na conta de custódia da DiskIngressos.',
      responsible: 'Tesouraria',
    },
    {
      key: 'financeiroApurado',
      title: '6. Apuração da DRE do Evento',
      description: 'Cálculo de margem: Bruto (-) Cancelamentos (-) Estornos (-) MDR (-) Comissão Disk.',
      responsible: 'Controladoria',
    },
    {
      key: 'contabilidadeProcessada',
      title: '7. Lançamentos Contábeis (Partidas Dobradas)',
      description: 'Lançamentos no Razão/Diário com amarração no Centro de Custo do Evento.',
      responsible: 'Contabilidade CRC/PR',
    },
    {
      key: 'repasseCalculado',
      title: '8. Cálculo do Valor Líquido do Produtor',
      description: 'Emissão da planilha analítica e borderô oficial de liquidação.',
      responsible: 'Financeiro',
    },
    {
      key: 'repasseAprovado',
      title: '9. Aprovação & Assinatura de Repasse',
      description: 'Assinatura sequencial digital: Produtor assina primeiro ➔ Disk assina por último.',
      responsible: 'Diretoria / Gestor',
    },
    {
      key: 'eventoFechado',
      title: '10. Fechamento Contábil Final',
      description: 'Lacração do dossiê financeiro. O evento se torna imutável e arquivado.',
      responsible: 'Contabilidade & Governança',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-disk-600" />
              <span>Central de Fechamento de Eventos</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Socket.IO Sala Ativa</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            O elo estrutural entre Vendas ➔ Gateways ➔ Conciliação ➔ DRE ➔ Produtor ➔ Contabilidade.
          </p>
        </div>

        {/* Seletor de Evento */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Selecionar Evento:
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-disk-600"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} ({e.producerName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {currentEvent && (
        <>
          {/* Card Resumo do Evento & DRE Operacional */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info do Evento */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Evento #{currentEvent.id.slice(0, 8)}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentEvent.nome}
              </h2>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  Produtor: <strong>{currentEvent.producerName}</strong>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Data: <strong>{formatDateBR(currentEvent.dataEvento)}</strong>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Local: <strong>{currentEvent.local}</strong>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Status de Fechamento</p>
                <div className="flex items-center gap-2 mt-1">
                  {checklist?.eventoFechado ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Lock className="w-3.5 h-3.5" /> EVENTO FECHADO & ARQUIVADO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" /> EM PROCESSO DE FECHAMENTO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DRE de Fechamento */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Apuração Contábil de Fechamento (Fórmula Formal DiskIngressos)
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                <div className="flex justify-between py-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span>Vendas Brutas</span>
                  <span>{formatCurrencyBRL(financial?.vendasBrutas || 0)}</span>
                </div>
                <div className="flex justify-between py-2 text-rose-500">
                  <span>(-) Cancelamentos</span>
                  <span>- {formatCurrencyBRL(financial?.cancelamentos || 0)}</span>
                </div>
                <div className="flex justify-between py-2 text-rose-500">
                  <span>(-) Estornos & Chargebacks</span>
                  <span>- {formatCurrencyBRL(financial?.estornos || 0)}</span>
                </div>
                <div className="flex justify-between py-2 text-rose-500">
                  <span>(-) Taxas MDR Gateway</span>
                  <span>- {formatCurrencyBRL(financial?.taxasMdrGateway || 0)}</span>
                </div>
                <div className="flex justify-between py-2 text-rose-500">
                  <span>(-) Comissão DiskIngressos</span>
                  <span>- {formatCurrencyBRL(financial?.comissaoDisk || 0)}</span>
                </div>
                <div className="flex justify-between py-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 rounded-lg mt-2">
                  <span>(=) VALOR LÍQUIDO DO PRODUTOR</span>
                  <span>{formatCurrencyBRL(financial?.valorLiquidoProdutor || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela dos 10 Portões de Fechamento */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Esteira de Portões de Fechamento (*Checklist de Gates*)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Atualizações sincronizadas em tempo real via Socket.IO entre operadores.
                </p>
              </div>

              {checklist && (
                <button
                  disabled={checklist.eventoFechado}
                  onClick={handleConcludeClosing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    checklist.eventoFechado
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/30'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Concluir Fechamento Contábil</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {gates.map((gate, idx) => {
                const isChecked = checklist ? !!checklist[gate.key] : false;

                return (
                  <div
                    key={gate.key}
                    onClick={() => toggleGate(gate.key)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isChecked
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isChecked ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {gate.title}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {gate.responsible}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {gate.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CONFERIDO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>PENDENTE</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
