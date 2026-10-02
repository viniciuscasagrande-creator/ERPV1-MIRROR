import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { wsService } from '../../services/websocket';
import { SaleSummary, SocketEvent, WsSalePayload } from '@diskingressos/types';
import {
  ShoppingCart,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building,
  Smartphone,
  Store,
  Monitor,
  Zap,
} from 'lucide-react';
import { formatCurrencyBRL, formatDateBR, formatCpfCnpj } from '@diskingressos/utils';

export const VendasPage: React.FC = () => {
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [canalFilter, setCanalFilter] = useState('');
  const [refundModalSale, setRefundModalSale] = useState<SaleSummary | null>(null);
  const [refundReason, setRefundReason] = useState('Cancelamento voluntário (Art. 49 CDC)');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [newSaleId, setNewSaleId] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/sales', {
        params: { search, canal: canalFilter || undefined },
      });
      setSales(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    wsService.connect();

    // Ingressa novas vendas em tempo real via Socket.IO
    const unsubscribeSale = wsService.on<WsSalePayload>(SocketEvent.SALE_CREATED, (payload) => {
      const newSale: SaleSummary = {
        id: payload.saleId,
        codigoPedido: payload.codigoPedido,
        eventId: payload.eventId,
        eventoNome: payload.eventoNome,
        canal: payload.canal as any,
        compradorNome: 'Comprador em Tempo Real',
        compradorCpf: '***.***.***-**',
        compradorEmail: 'comprador@live.disk',
        totalBruto: payload.totalBruto,
        totalTaxas: payload.totalLiquido - payload.totalBruto,
        totalDescontos: 0,
        totalLiquido: payload.totalLiquido,
        status: 'APROVADO' as any,
        metodoPagamento: payload.metodoPagamento,
        gateway: 'Cielo Live',
        createdAt: payload.createdAt,
      };

      setSales((prev) => [newSale, ...prev]);
      setNewSaleId(payload.saleId);
      setTimeout(() => setNewSaleId(null), 5000);
    });

    const unsubscribeRefund = wsService.on(SocketEvent.REFUND_CREATED, (payload: any) => {
      setSales((prev) =>
        prev.map((s) => (s.id === payload.saleId ? { ...s, status: 'ESTORNADO' as any } : s)),
      );
    });

    return () => {
      unsubscribeSale();
      unsubscribeRefund();
    };
  }, [search, canalFilter]);

  const handleRefund = async () => {
    if (!refundModalSale) return;
    setProcessingRefund(true);
    try {
      await api.post(`/sales/${refundModalSale.id}/refund`, { motivo: refundReason });
      setRefundModalSale(null);
      await fetchSales();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Falha ao processar estorno.');
    } finally {
      setProcessingRefund(false);
    }
  };

  const renderCanalIcon = (canal: string) => {
    switch (canal) {
      case 'ONLINE':
        return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
      case 'POS':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
      case 'TOTEM':
        return <Monitor className="w-3.5 h-3.5 text-purple-500" />;
      case 'PDV':
        return <Store className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-disk-600" />
              <span>Vendas & Extrato de Bilheteria</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Live Feed Ativo</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transações de vendas consolidadas em tempo real com conciliação multi-canal.
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
            placeholder="Buscar por código de pedido, comprador ou CPF..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={canalFilter}
          onChange={(e) => setCanalFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">Todos os Canais</option>
          <option value="ONLINE">Online (Site/App)</option>
          <option value="POS">POS Físico (Bilheteria)</option>
          <option value="TOTEM">Totem de Autoatendimento</option>
          <option value="PDV">PDV Parceiro (Lojas)</option>
        </select>
      </div>

      {/* Tabela de Vendas */}
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-semibold">
            <tr>
              <th className="px-6 py-4">Pedido / Data</th>
              <th className="px-6 py-4">Evento</th>
              <th className="px-6 py-4">Canal</th>
              <th className="px-6 py-4">Comprador</th>
              <th className="px-6 py-4">Valor Bruto</th>
              <th className="px-6 py-4">Taxa Disk</th>
              <th className="px-6 py-4">Total Pago</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-slate-400 text-sm">
                  Carregando extrato de vendas...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-slate-400 text-sm">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              sales.map((s) => {
                const isNew = s.id === newSaleId;

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isNew
                        ? 'bg-emerald-500/10 dark:bg-emerald-950/40 animate-pulse'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                          {s.codigoPedido}
                        </p>
                        {isNew && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-white">
                            NOVO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {formatDateBR(s.createdAt, true)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {s.eventoNome}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold w-max">
                        {renderCanalIcon(s.canal)}
                        <span>{s.canal}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">
                        {s.compradorNome}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatCpfCnpj(s.compradorCpf)}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {formatCurrencyBRL(s.totalBruto)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {formatCurrencyBRL(s.totalTaxas)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(s.totalLiquido)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
                        {s.metodoPagamento}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{s.gateway}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'APROVADO'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.status === 'APROVADO' && (
                        <button
                          onClick={() => setRefundModalSale(s)}
                          className="flex items-center gap-1 ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Estornar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação de Estorno */}
      {refundModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <span>Confirmar Estorno da Venda</span>
            </h3>

            <p className="text-xs text-slate-500">
              Esta ação devolverá o valor de{' '}
              <strong>{formatCurrencyBRL(refundModalSale.totalLiquido)}</strong> ao comprador,
              reintegrará os ingressos ao estoque e recalculará a DRE do evento imediatamente.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs space-y-1 font-mono">
              <p>Pedido: <strong>{refundModalSale.codigoPedido}</strong></p>
              <p>Comprador: {refundModalSale.compradorNome}</p>
              <p>Evento: {refundModalSale.eventoNome}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Motivo do Estorno / Cancelamento:
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value="Cancelamento voluntário (Art. 49 CDC)">
                  Cancelamento voluntário (Art. 49 CDC - 7 dias)
                </option>
                <option value="Chargeback / Contestação de Titular">
                  Chargeback / Contestação de Titular
                </option>
                <option value="Cancelamento de Evento pelo Produtor">
                  Cancelamento de Evento pelo Produtor
                </option>
                <option value="Erro Operacional de Cobrança">Erro Operacional de Cobrança</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setRefundModalSale(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={processingRefund}
                onClick={handleRefund}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/30 transition-all"
              >
                {processingRefund ? 'Processando...' : 'Confirmar Estorno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
