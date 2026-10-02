import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../services/api';
import { wsService } from '../../services/websocket';
import { DashboardKpis, SocketEvent, WsSalePayload } from '@diskingressos/types';
import {
  DollarSign,
  TrendingUp,
  Percent,
  AlertOctagon,
  ArrowDownLeft,
  ArrowUpRight,
  Server,
  Layers,
  CheckCircle2,
  Clock,
  Smartphone,
  CreditCard,
  Monitor,
  Store,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { formatCurrencyBRL } from '@diskingressos/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [realtimeNotification, setRealtimeNotification] = useState<{
    id: string;
    message: string;
    type: 'sale' | 'refund';
  } | null>(null);
  const navigate = useNavigate();

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/dashboard/kpis');
      setKpis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();

    // Conecta ao Socket.IO Gateway
    wsService.connect();

    // Ouve eventos de vendas em tempo real
    const unsubscribeSale = wsService.on<WsSalePayload>(SocketEvent.SALE_CREATED, (payload) => {
      setRealtimeNotification({
        id: payload.saleId,
        message: `⚡ Nova venda em tempo real: ${payload.codigoPedido} • ${formatCurrencyBRL(
          payload.totalLiquido,
        )} (${payload.canal}) • ${payload.eventoNome}`,
        type: 'sale',
      });

      // Atualiza os KPIs em tempo real
      setKpis((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          receitaBruta: prev.receitaBruta + payload.totalBruto,
          receitaLiquida: prev.receitaLiquida + payload.totalLiquido,
          totalIngressosVendidos: prev.totalIngressosVendidos + payload.ingressosQtd,
          totalVendasQuantidade: prev.totalVendasQuantidade + 1,
        };
      });

      setTimeout(() => setRealtimeNotification(null), 6000);
    });

    const unsubscribeRefund = wsService.on(SocketEvent.REFUND_CREATED, (payload: any) => {
      setRealtimeNotification({
        id: payload.saleId,
        message: `↩️ Estorno processado: ${formatCurrencyBRL(payload.valor)} • Motivo: ${payload.motivo}`,
        type: 'refund',
      });

      setKpis((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          estornosValor: prev.estornosValor + payload.valor,
          estornosQuantidade: prev.estornosQuantidade + 1,
        };
      });

      setTimeout(() => setRealtimeNotification(null), 6000);
    });

    return () => {
      unsubscribeSale();
      unsubscribeRefund();
    };
  }, []);

  const kpiCards = [
    {
      label: 'Receita Bruta (Vendas)',
      value: formatCurrencyBRL(kpis?.receitaBruta || 0),
      change: `${kpis?.totalIngressosVendidos || 0} ingressos vendidos`,
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Taxas & MDR Cobrados',
      value: formatCurrencyBRL(kpis?.taxasMdr || 0),
      change: 'Custo de adquirentes',
      icon: Percent,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: 'Comissão DiskIngressos',
      value: formatCurrencyBRL(kpis?.comissaoDisk || 0),
      change: 'Receita Operacional Disk',
      icon: TrendingUp,
      color: 'text-disk-600 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      label: 'Estornos & Chargebacks',
      value: formatCurrencyBRL(kpis?.estornosValor || 0),
      change: `${kpis?.estornosQuantidade || 0} estornos processados`,
      icon: AlertOctagon,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      label: 'A Pagar (Produtores)',
      value: formatCurrencyBRL(kpis?.valoresARepassar || 0),
      change: `${kpis?.eventosAtivos || 0} eventos em liquidação`,
      icon: ArrowDownLeft,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'A Receber (Adquirentes)',
      value: formatCurrencyBRL(kpis?.valoresAReceber || 0),
      change: 'Previsão de liquidação em D+1',
      icon: ArrowUpRight,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Notificação Toast em Tempo Real via Socket.IO */}
      {realtimeNotification && (
        <div
          className={`p-4 rounded-xl shadow-xl flex items-center justify-between border animate-bounce ${
            realtimeNotification.type === 'sale'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="text-sm font-bold">{realtimeNotification.message}</span>
          </div>
          <span className="text-[10px] uppercase font-mono font-semibold bg-black/20 px-2 py-0.5 rounded">
            Socket.IO Live
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Painel Operacional & Contábil
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Socket.IO Tempo Real Ativo</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bem-vindo(a), <strong>{user?.nome}</strong> ({user?.cargo}) — Perfil:{' '}
            <span className="font-mono font-bold text-disk-600 dark:text-disk-400">
              {user?.roles.join(', ')}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/eventos/central-fechamento')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Central de Fechamento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className={`p-2.5 rounded-lg ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {loading ? 'Carregando...' : kpi.value}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {kpi.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Canais de Venda e Eventos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Canal */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Vendas por Canal de Atendimento
          </h2>
          <div className="space-y-4 pt-2">
            {kpis?.distribuicaoCanais.map((c) => {
              const total = kpis?.receitaBruta || 1;
              const pct = Math.round((c.valor / total) * 100);

              return (
                <div key={c.canal} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {c.canal === 'ONLINE' && <Smartphone className="w-3.5 h-3.5 text-blue-500" />}
                      {c.canal === 'POS' && <CreditCard className="w-3.5 h-3.5 text-emerald-500" />}
                      {c.canal === 'TOTEM' && <Monitor className="w-3.5 h-3.5 text-purple-500" />}
                      {c.canal === 'PDV' && <Store className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{c.canal}</span>
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {formatCurrencyBRL(c.valor)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-disk-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eventos em Monitoramento Contábil */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Eventos em Monitoramento & Fechamento
            </h2>
            <button
              onClick={() => navigate('/eventos/lista')}
              className="text-xs font-semibold text-disk-600 hover:text-disk-700 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {kpis?.eventosRecentes.map((ev) => (
              <div
                key={ev.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {ev.nome}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Produtor: <strong>{ev.produtor}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(ev.vendasBrutas)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ev.statusFinanceiro === 'FECHADO'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {ev.statusFinanceiro}
                    </span>
                  </div>

                  <div className="w-24 text-right">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Checklist: {ev.fechamentoConcluidoPercent}%
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${ev.fechamentoConcluidoPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
