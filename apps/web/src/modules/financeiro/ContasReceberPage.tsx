import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AccountReceivable, ReceivableKpis, StatusRecebivel, MetodoPagamento } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  ArrowDownLeft,
  Search,
  Filter,
  CreditCard,
  QrCode,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Building,
  TrendingUp,
} from 'lucide-react';

export const ContasReceberPage: React.FC = () => {
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [kpis, setKpis] = useState<ReceivableKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [adquirenteFilter, setAdquirenteFilter] = useState<string>('');
  const [selectedReceivable, setSelectedReceivable] = useState<AccountReceivable | null>(null);
  const [isAnticipateModalOpen, setIsAnticipateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, kpiRes]: any = await Promise.all([
        api.get('/contas-receber', {
          params: {
            search: search || undefined,
            status: statusFilter || undefined,
            adquirente: adquirenteFilter || undefined,
          },
        }),
        api.get('/contas-receber/kpis'),
      ]);
      setReceivables(listRes || []);
      setKpis(kpiRes || null);
    } catch (err) {
      console.error('Falha ao carregar recebíveis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, adquirenteFilter]);

  const handleAntecipar = async () => {
    if (!selectedReceivable) return;
    setActionLoading(true);
    try {
      await api.patch(`/contas-receber/${selectedReceivable.id}/antecipar`);
      setIsAnticipateModalOpen(false);
      setSelectedReceivable(null);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao processar antecipação');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBaixar = async (id: string) => {
    if (!confirm('Confirma a baixa e liquidação deste recebível?')) return;
    try {
      await api.patch(`/contas-receber/${id}/baixar`);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao baixar título');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowDownLeft className="w-7 h-7 text-emerald-600" />
            Contas a Receber & Adquirentes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de liquidação de gateways (Cielo, Stone, Rede), prazos D+1/D+30 e esteira de antecipação
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Total Bruto Vendido</span>
              <Building className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.totalBruto)}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <span>{kpis.contagemTitulos} títulos registrados</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Taxas MDR Adquirentes</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrencyBRL(kpis.totalMdr)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Custo médio de adquirência
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Líquido a Vencer (Projeção)</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrencyBRL(kpis.totalAVencer)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Aguardando liquidação programada
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Total Efetivado em Conta</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.totalRecebido)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatCurrencyBRL(kpis.totalAntecipado)} em antecipações
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por lote, adquirente, evento ou transação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todos os Status</option>
            <option value="A_VENCER">A Vencer</option>
            <option value="RECEBIDO">Liquidado / Recebido</option>
            <option value="ANTECIPADO">Antecipado</option>
            <option value="VENCIDO">Vencido</option>
          </select>

          <select
            value={adquirenteFilter}
            onChange={(e) => setAdquirenteFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todas as Adquirentes</option>
            <option value="Cielo">Cielo</option>
            <option value="Stone">Stone</option>
            <option value="Rede">Rede</option>
            <option value="PagBank">PagBank</option>
          </select>
        </div>
      </div>

      {/* Receivables Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Adquirente & Modalidade</th>
                <th className="px-6 py-4">Evento / Produtor</th>
                <th className="px-6 py-4">Ref. Transação</th>
                <th className="px-6 py-4 text-right">Valor Bruto</th>
                <th className="px-6 py-4 text-right">MDR</th>
                <th className="px-6 py-4 text-right">Valor Líquido</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando contas a receber...
                  </td>
                </tr>
              ) : receivables.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    Nenhum recebível encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                receivables.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                          {r.metodo === MetodoPagamento.PIX ? (
                            <QrCode className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {r.adquirente}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.metodo.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                        {r.eventNome || 'Evento Geral'}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {r.producerNome || 'DiskIngressos'}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {r.transacaoRef}
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrencyBRL(r.valorBruto)}
                    </td>

                    <td className="px-6 py-4 text-right text-rose-600 dark:text-rose-400 text-xs">
                      -{formatCurrencyBRL(r.taxaMdr)}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(r.valorLiquido)}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {formatDateBR(r.dataVencimento)}
                      </p>
                      {r.dataRecebimento && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          Recebido: {formatDateBR(r.dataRecebimento)}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {r.status === 'RECEBIDO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Liquidado
                        </span>
                      )}
                      {r.status === 'ANTECIPADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Zap className="w-3.5 h-3.5" />
                          Antecipado
                        </span>
                      )}
                      {r.status === 'A_VENCER' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3.5 h-3.5" />
                          A Vencer
                        </span>
                      )}
                      {r.status === 'VENCIDO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Vencido
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {r.status === 'A_VENCER' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReceivable(r);
                              setIsAnticipateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/40 border border-purple-200 dark:border-purple-800 transition-colors"
                            title="Antecipar com adquirente"
                          >
                            <Zap className="w-3 h-3" />
                            Antecipar
                          </button>
                          <button
                            onClick={() => handleBaixar(r.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 border border-emerald-200 dark:border-emerald-800 transition-colors"
                            title="Baixar Título"
                          >
                            Baixar
                          </button>
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

      {/* Modal de Antecipação */}
      {isAnticipateModalOpen && selectedReceivable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Simular Antecipação de Recebíveis
              </h3>
              <button
                onClick={() => setIsAnticipateModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs text-slate-500">Adquirente & Ref:</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedReceivable.adquirente} - {selectedReceivable.transacaoRef}
                </p>
                <p className="text-xs text-slate-400">
                  Evento: {selectedReceivable.eventNome || 'Geral'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor Líquido Original:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatCurrencyBRL(selectedReceivable.valorLiquido)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxa de Antecipação Contratual (1.8% a.m.):</span>
                  <span className="text-rose-600 font-medium">
                    -{formatCurrencyBRL(selectedReceivable.valorLiquido * 0.018)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-base">
                  <span className="text-slate-900 dark:text-white">Crédito Líquido Imediato:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(selectedReceivable.valorLiquido * (1 - 0.018))}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">
                * O valor será creditado imediatamente na Conta Movimento Itaú da DiskIngressos e lançado como entrada no Fluxo de Caixa.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAnticipateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAntecipar}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-2"
              >
                {actionLoading ? 'Processando...' : 'Confirmar Antecipação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
