import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { EventSummary } from '@diskingressos/types';
import {
  Ticket,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Search,
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';

export const EventosPage: React.FC = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/events', {
        params: { search, statusFinanceiro: statusFilter || undefined },
      });
      setEvents(res.items || []);
    } catch (e) {
      console.error('Falha ao carregar eventos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, statusFilter]);

  const totalIngressos = events.reduce((acc, e) => acc + (e.totalTicketsSold || 0), 0);
  const totalBruto = events.reduce(
    (acc, e) => acc + Number(e.financialSummary?.vendasBrutas || 0),
    0,
  );
  const eventosAguardando = events.filter(
    (e) => e.statusFinanceiro === 'AGUARDANDO_CONCILIACAO' || e.statusFinanceiro === 'APURADO',
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-disk-600" />
            <span>Eventos & Bilheteria</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de eventos, monitoramento de vendas por lote e controle financeiro por produtor.
          </p>
        </div>

        <button
          onClick={() => navigate('/eventos/central-fechamento')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>Acessar Central de Fechamento</span>
        </button>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total de Ingressos Vendidos</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalIngressos.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase">Volume Bruto Apurado</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrencyBRL(totalBruto)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase">Eventos em Fechamento</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {eventosAguardando} eventos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por evento, local ou produtor..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">Todos os Status Financeiros</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="AGUARDANDO_CONCILIACAO">Aguardando Conciliação</option>
          <option value="APURADO">Apurado</option>
          <option value="FECHADO">Fechado Contabilmente</option>
        </select>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Carregando eventos...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">Nenhum evento encontrado.</div>
        ) : (
          events.map((e) => {
            const sold = e.totalTicketsSold || 0;
            const cap = e.capacidadeTotal || 1;
            const pct = Math.min(Math.round((sold / cap) * 100), 100);

            return (
              <div
                key={e.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Info Principal */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {e.categoria}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        e.statusFinanceiro === 'FECHADO'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : e.statusFinanceiro === 'AGUARDANDO_CONCILIACAO'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {e.statusFinanceiro}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {e.nome}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-disk-500" />
                      {e.producerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDateBR(e.dataEvento)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {e.local} ({e.cidade}/{e.estado})
                    </span>
                  </div>

                  {/* Barra de Ocupação */}
                  <div className="pt-2 max-w-md">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">
                        Ocupação: <strong>{sold.toLocaleString('pt-BR')}</strong> /{' '}
                        {cap.toLocaleString('pt-BR')} ingressos
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-disk-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Métricas Financeiras & Ações */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Vendas Brutas</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(e.financialSummary?.vendasBrutas || 0)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Líquido Produtor: {formatCurrencyBRL(e.financialSummary?.valorLiquidoProdutor || 0)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => navigate('/eventos/central-fechamento')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-disk-600" />
                      <span>Central de Fechamento</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
