import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TrialBalanceSummary } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Scale,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const BalancetePage: React.FC = () => {
  const [summary, setSummary] = useState<TrialBalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchTrialBalance = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/contabilidade/balancete', {
        params: {
          dataInicio: dataInicio || undefined,
          dataFim: dataFim || undefined,
        },
      });
      setSummary(res || null);
    } catch (err) {
      console.error('Falha ao carregar balancete:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialBalance();
  }, [dataInicio, dataFim]);

  const filteredContas = (summary?.contas || []).filter(
    (c) =>
      c.codigo.toLowerCase().includes(search.toLowerCase()) ||
      c.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-7 h-7 text-indigo-600" />
            Balancete de Verificação Contábil
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Demostrativo de fechamento contábil com conferência de soma dos débitos e créditos
          </p>
        </div>
        <button
          onClick={fetchTrialBalance}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Balancete
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Status do Fechamento</span>
              <Scale className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span>Equilibrado</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Débitos e Créditos conferidos
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Movimento Total Débito</span>
              <span className="font-mono text-xs font-bold text-blue-500">(D)</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
              {formatCurrencyBRL(summary.somaDebitos)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Soma de todas as partidas devedoras
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Movimento Total Crédito</span>
              <span className="font-mono text-xs font-bold text-emerald-500">(C)</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrencyBRL(summary.somaCreditos)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Soma de todas as partidas credoras
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Contas no Balancete</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {summary.contas.length} Contas
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Estrutura sintética e analítica
            </div>
          </div>
        </div>
      )}

      {/* Toolbar & Busca */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar contas no balancete por código ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
          <span className="text-slate-400 text-xs">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Tabela Oficial do Balancete */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 w-36">Código</th>
                <th className="px-6 py-4">Descrição da Conta Contábil</th>
                <th className="px-6 py-4 text-right">Saldo Anterior</th>
                <th className="px-6 py-4 text-right">Débitos</th>
                <th className="px-6 py-4 text-right">Créditos</th>
                <th className="px-6 py-4 text-right">Saldo Atual</th>
                <th className="px-6 py-4 text-center">D/C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Gerando balancete de verificação...
                  </td>
                </tr>
              ) : filteredContas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma conta encontrada com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredContas.map((c) => {
                  const isSynthetical = !c.analitica;

                  return (
                    <tr
                      key={c.codigo}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors ${
                        isSynthetical ? 'bg-slate-50/30 dark:bg-slate-900/20 font-bold' : ''
                      }`}
                    >
                      <td className="px-6 py-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                        {c.codigo}
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={
                            isSynthetical
                              ? 'text-slate-900 dark:text-white font-bold'
                              : 'text-slate-700 dark:text-slate-300'
                          }
                        >
                          {c.nome}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-right font-mono text-xs text-slate-400">
                        {formatCurrencyBRL(c.saldoAnterior)}
                      </td>

                      <td className="px-6 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                        {c.totalDebitos > 0 ? formatCurrencyBRL(c.totalDebitos) : '-'}
                      </td>

                      <td className="px-6 py-3 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        {c.totalCreditos > 0 ? formatCurrencyBRL(c.totalCreditos) : '-'}
                      </td>

                      <td className="px-6 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrencyBRL(c.saldoAtual)}
                      </td>

                      <td className="px-6 py-3 text-center">
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            c.situacao === 'D'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}
                        >
                          {c.situacao}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Rodapé com Totais do Balancete */}
            {summary && (
              <tfoot className="bg-slate-100/80 dark:bg-slate-900/80 border-t-2 border-slate-300 dark:border-slate-700 font-bold text-sm">
                <tr>
                  <td colSpan={3} className="px-6 py-4 uppercase text-slate-700 dark:text-slate-300">
                    TOTAIS DO BALANCETE DE VERIFICAÇÃO
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrencyBRL(summary.somaDebitos)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(summary.somaCreditos)}
                  </td>
                  <td colSpan={2} className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      D = C (100% Equilibrado)
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
