import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CashFlowSummary, FinancialTransaction } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  LineChart,
} from 'lucide-react';

export const FluxoCaixaPage: React.FC = () => {
  const [summary, setSummary] = useState<CashFlowSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/fluxo-caixa/summary');
      setSummary(res || null);
    } catch (err) {
      console.error('Falha ao carregar fluxo de caixa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-600" />
            Fluxo de Caixa & Tesouraria
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Posição consolidada da Conta Movimento Itaú, entradas, saídas, conciliação e projeção 30 dias
          </p>
        </div>
        <button
          onClick={fetchSummary}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Posição
        </button>
      </div>

      {/* KPI Cards Executivos */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Saldo Atual Disponível</span>
              <Building2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrencyBRL(summary.saldoAtual)}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Conta Movimento Itaú (Ag: 0432)
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Entradas do Mês</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(summary.entradasMes)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Recebimentos de adquirentes e bilheteria
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Saídas do Mês</span>
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrencyBRL(summary.saidasMes)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Repasses a produtores e fornecedores
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Saldo Projetado (30 Dias)</span>
              <LineChart className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrencyBRL(summary.saldoProjetado30d)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 truncate">
              (+) {formatCurrencyBRL(summary.contasReceberProximas)} a rec. | (-) {formatCurrencyBRL(summary.contasPagarProximas + summary.repassesPendentes)} a pag.
            </div>
          </div>
        </div>
      )}

      {/* Projeção Diária dos Próximos 14 Dias */}
      {summary && summary.projecaoProximosDias && summary.projecaoProximosDias.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Projeção Financeira Diária (Próximos 14 Dias)
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Considera vencimentos reais de adquirentes e obrigações
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {summary.projecaoProximosDias.slice(0, 14).map((dia, idx) => (
              <div
                key={dia.data}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                  idx === 0
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateBR(dia.data).slice(0, 5)}
                  </span>
                  {idx === 0 && (
                    <span className="ml-1 px-1 py-0.2 rounded text-[9px] bg-indigo-500 text-white font-bold">
                      Hoje
                    </span>
                  )}
                </div>

                <div className="my-2 space-y-1">
                  {dia.entradas > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      +{formatCurrencyBRL(dia.entradas)}
                    </p>
                  )}
                  {dia.saidas > 0 && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      -{formatCurrencyBRL(dia.saidas)}
                    </p>
                  )}
                  {dia.entradas === 0 && dia.saidas === 0 && (
                    <p className="text-[11px] text-slate-400">-</p>
                  )}
                </div>

                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  {formatCurrencyBRL(dia.saldoProjetado)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extrato de Transações de Tesouraria Recentes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-disk-500" />
            Extrato de Movimentações da Conta Movimento
          </h2>
          <span className="text-xs text-slate-400">
            Últimos lançamentos bancários auditados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Data / Hora</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Descrição da Operação</th>
                <th className="px-6 py-4">Categoria / Ref</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Saldo em Conta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando extrato de tesouraria...
                  </td>
                </tr>
              ) : !summary || summary.ultimasTransacoes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma transação financeira registrada.
                  </td>
                </tr>
              ) : (
                summary.ultimasTransacoes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {formatDateBR(t.dataLancamento)}
                    </td>

                    <td className="px-6 py-4">
                      {t.tipo === 'ENTRADA' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Saída
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {t.descricao}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {t.contaBancaria}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t.categoria}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-bold text-sm ${
                        t.tipo === 'ENTRADA'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {t.tipo === 'ENTRADA' ? '+' : '-'}
                      {formatCurrencyBRL(t.valor)}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatCurrencyBRL(t.saldoApos)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
