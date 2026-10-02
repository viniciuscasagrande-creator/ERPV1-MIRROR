import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ChartOfAccountsItem, GrupoContabil, NaturezaConta } from '@diskingressos/types';
import { formatCurrencyBRL } from '@diskingressos/utils';
import {
  BookOpen,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Layers,
  ChevronRight,
  TrendingUp,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const PlanoContasPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccountsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [grupoFilter, setGrupoFilter] = useState<string>('');
  const [analiticaOnly, setAnaliticaOnly] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/contabilidade/plano-contas', {
        params: {
          grupo: grupoFilter || undefined,
          analitica: analiticaOnly ? true : undefined,
        },
      });
      setAccounts(res || []);
    } catch (err) {
      console.error('Falha ao carregar plano de contas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [grupoFilter, analiticaOnly]);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.codigo.toLowerCase().includes(search.toLowerCase()) ||
      acc.nome.toLowerCase().includes(search.toLowerCase())
  );

  const getGrupoBadge = (grupo: GrupoContabil) => {
    const map: Record<string, { label: string; bg: string }> = {
      ATIVO_CIRCULANTE: { label: 'Ativo Circulante', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      ATIVO_NAO_CIRCULANTE: { label: 'Ativo Não Circulante', bg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
      PASSIVO_CIRCULANTE: { label: 'Passivo Circulante', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      PASSIVO_NAO_CIRCULANTE: { label: 'Passivo Não Circulante', bg: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
      PATRIMONIO_LIQUIDO: { label: 'Patrimônio Líquido', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
      RECEITAS: { label: 'Receitas', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      DESPESAS: { label: 'Despesas', bg: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
      CUSTOS: { label: 'Custos Adquirência', bg: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' },
    };
    const c = map[grupo] || { label: grupo, bg: 'bg-slate-50 text-slate-700' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Plano de Contas Oficial DiskIngressos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Estrutura canônica de 5 níveis contábeis: Ativo, Passivo, Patrimônio Líquido, Receitas e Despesas
          </p>
        </div>
        <button
          onClick={fetchAccounts}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Toolbar & Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código ou descrição da conta contábil..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={grupoFilter}
            onChange={(e) => setGrupoFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todos os Grupos</option>
            <option value="ATIVO_CIRCULANTE">1. Ativo Circulante</option>
            <option value="PASSIVO_CIRCULANTE">2. Passivo Circulante</option>
            <option value="PATRIMONIO_LIQUIDO">3. Patrimônio Líquido</option>
            <option value="RECEITAS">4. Receitas</option>
            <option value="CUSTOS">5.1 Custos Adquirência</option>
            <option value="DESPESAS">5.2 Despesas Operacionais</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={analiticaOnly}
              onChange={(e) => setAnaliticaOnly(e.target.checked)}
              className="rounded text-disk-600 focus:ring-disk-500"
            />
            Apenas Analíticas
          </label>
        </div>
      </div>

      {/* Tabela do Plano de Contas */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 w-44">Código</th>
                <th className="px-6 py-4">Descrição da Conta Contábil</th>
                <th className="px-6 py-4">Grupo</th>
                <th className="px-6 py-4 text-center">Natureza</th>
                <th className="px-6 py-4 text-center">Tipo</th>
                <th className="px-6 py-4 text-right">Saldo Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando plano de contas...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma conta contábil encontrada.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const paddingLeft = (acc.nivel - 1) * 20;
                  const isSynthetical = !acc.analitica;

                  return (
                    <tr
                      key={acc.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors ${
                        isSynthetical ? 'bg-slate-50/30 dark:bg-slate-900/20 font-bold' : ''
                      }`}
                    >
                      <td className="px-6 py-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                        {acc.codigo}
                      </td>

                      <td className="px-6 py-3">
                        <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center gap-1.5">
                          {isSynthetical && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                          <span
                            className={
                              isSynthetical
                                ? 'text-slate-900 dark:text-white font-bold'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {acc.nome}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3">{getGrupoBadge(acc.grupo)}</td>

                      <td className="px-6 py-3 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            acc.natureza === NaturezaConta.DEVEDORA
                              ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}
                        >
                          {acc.natureza === NaturezaConta.DEVEDORA ? 'Devedora (D)' : 'Credora (C)'}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-center">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            acc.analitica
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold'
                          }`}
                        >
                          {acc.analitica ? 'Analítica' : 'Sintética'}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        {acc.analitica ? formatCurrencyBRL(acc.saldoAtual) : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
