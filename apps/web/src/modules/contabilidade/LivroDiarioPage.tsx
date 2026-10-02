import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  JournalEntry,
  ChartOfAccountsItem,
  TipoPartida,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  BookText,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Scale,
} from 'lucide-react';

interface PartidaForm {
  accountId: string;
  tipo: TipoPartida;
  valor: string;
  historicoComplementar: string;
}

export const LivroDiarioPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<ChartOfAccountsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [origemFilter, setOrigemFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    historico: '',
    origem: 'MANUAL',
  });

  const [partidas, setPartidas] = useState<PartidaForm[]>([
    { accountId: '', tipo: TipoPartida.DEBITO, valor: '', historicoComplementar: '' },
    { accountId: '', tipo: TipoPartida.CREDITO, valor: '', historicoComplementar: '' },
  ]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const [entriesRes, accountsRes]: any = await Promise.all([
        api.get('/contabilidade/diario', {
          params: {
            origem: origemFilter || undefined,
            search: search || undefined,
          },
        }),
        api.get('/contabilidade/plano-contas', { params: { analitica: true } }),
      ]);
      setEntries(entriesRes || []);
      setAccounts(accountsRes || []);
    } catch (err) {
      console.error('Falha ao carregar livro diário:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [origemFilter, search]);

  const handleAddPartida = () => {
    setPartidas([
      ...partidas,
      { accountId: '', tipo: TipoPartida.DEBITO, valor: '', historicoComplementar: '' },
    ]);
  };

  const handleRemovePartida = (index: number) => {
    if (partidas.length <= 2) {
      alert('Um lançamento requer pelo menos 2 partidas.');
      return;
    }
    setPartidas(partidas.filter((_, i) => i !== index));
  };

  const handlePartidaChange = (index: number, field: keyof PartidaForm, value: string) => {
    const updated = [...partidas];
    (updated[index] as any)[field] = value;
    setPartidas(updated);
  };

  // Cálculo de equilíbrio em tempo real
  const totalDebitoCalculado = partidas
    .filter((p) => p.tipo === TipoPartida.DEBITO)
    .reduce((sum, p) => sum + (parseFloat(p.valor) || 0), 0);

  const totalCreditoCalculado = partidas
    .filter((p) => p.tipo === TipoPartida.CREDITO)
    .reduce((sum, p) => sum + (parseFloat(p.valor) || 0), 0);

  const diferencaPartidas = Math.abs(totalDebitoCalculado - totalCreditoCalculado);
  const estaEquilibrado = totalDebitoCalculado > 0 && diferencaPartidas < 0.01;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estaEquilibrado) {
      alert('O lançamento contábil deve estar rigorosamente equilibrado (Débito = Crédito)!');
      return;
    }

    setActionLoading(true);
    try {
      await api.post('/contabilidade/diario', {
        ...formData,
        items: partidas.map((p) => ({
          accountId: p.accountId,
          tipo: p.tipo,
          valor: parseFloat(p.valor),
          historicoComplementar: p.historicoComplementar || undefined,
        })),
      });

      setIsModalOpen(false);
      setFormData({
        data: new Date().toISOString().split('T')[0],
        historico: '',
        origem: 'MANUAL',
      });
      setPartidas([
        { accountId: '', tipo: TipoPartida.DEBITO, valor: '', historicoComplementar: '' },
        { accountId: '', tipo: TipoPartida.CREDITO, valor: '', historicoComplementar: '' },
      ]);
      await fetchEntries();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao registrar lançamento no Diário');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookText className="w-7 h-7 text-indigo-600" />
            Livro Diário & Partidas Dobradas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Escrituração contábil cronológica com equilíbrio formal de débitos e créditos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Lançamento Contábil
          </button>
          <button
            onClick={fetchEntries}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar & Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por histórico ou número do lançamento contábil..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div>
          <select
            value={origemFilter}
            onChange={(e) => setOrigemFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todas as Origens</option>
            <option value="BILHETERIA">Bilheteria / Ingressos</option>
            <option value="REPASSE">Repasses a Produtores</option>
            <option value="PAGAMENTO">Pagamento Fornecedores</option>
            <option value="OFX">Conciliação Bancária / OFX</option>
            <option value="MANUAL">Lançamentos Manuais</option>
          </select>
        </div>
      </div>

      {/* Lista de Lançamentos do Livro Diário */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
            Carregando escrituração do Livro Diário...
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            Nenhum lançamento contábil registrado no período.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              {/* Cabeçalho do Lançamento */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-disk-600 dark:text-disk-400 text-sm">
                    {entry.numeroLancamento}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDateBR(entry.data)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Origem: {entry.origem}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Partidas Equilibradas: {formatCurrencyBRL(entry.totalDebito)}
                  </span>
                </div>
              </div>

              {/* Histórico Oficial */}
              <div className="px-6 py-2.5 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-750">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <span className="font-bold text-slate-500 uppercase mr-1">Histórico:</span>
                  {entry.historico}
                </p>
              </div>

              {/* Partidas Dobradas */}
              <div className="divide-y divide-slate-100 dark:divide-slate-750">
                {entry.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/40 dark:hover:bg-slate-750/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                          item.tipo === 'DEBITO'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        }`}
                      >
                        {item.tipo === 'DEBITO' ? 'D' : 'C'}
                      </span>
                      <div>
                        <span className="font-mono text-slate-500 mr-2">
                          {item.accountCodigo}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.accountNome}
                        </span>
                        {item.historicoComplementar && (
                          <span className="text-[11px] text-slate-400 ml-2 italic">
                            ({item.historicoComplementar})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-mono font-bold text-sm">
                      <span
                        className={
                          item.tipo === 'DEBITO'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }
                      >
                        {formatCurrencyBRL(item.valor)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Novo Lançamento Manual no Livro Diário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-disk-500" />
                Novo Lançamento Contábil (Partidas Dobradas)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data do Lançamento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Histórico Contábil do Lançamento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Apropriação de despesa com segurança evento Pedreira"
                    value={formData.historico}
                    onChange={(e) => setFormData({ ...formData, historico: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
              </div>

              {/* Partidas Individuais */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Partidas do Lançamento (Débito e Crédito)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPartida}
                    className="text-xs font-semibold text-disk-600 hover:text-disk-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Linha
                  </button>
                </div>

                {partidas.map((partida, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-2">
                      <select
                        value={partida.tipo}
                        onChange={(e) => handlePartidaChange(idx, 'tipo', e.target.value)}
                        className={`w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 ${
                          partida.tipo === 'DEBITO'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}
                      >
                        <option value="DEBITO">Débito (D)</option>
                        <option value="CREDITO">Crédito (C)</option>
                      </select>
                    </div>

                    <div className="col-span-5">
                      <select
                        required
                        value={partida.accountId}
                        onChange={(e) => handlePartidaChange(idx, 'accountId', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        <option value="">Selecione a Conta Analítica...</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.codigo} - {acc.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Valor R$"
                        value={partida.valor}
                        onChange={(e) => handlePartidaChange(idx, 'valor', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Compl."
                        value={partida.historicoComplementar}
                        onChange={(e) =>
                          handlePartidaChange(idx, 'historicoComplementar', e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemovePartida(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Remover linha"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box de Validação de Equilíbrio */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                  estaEquilibrado
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">
                      {estaEquilibrado
                        ? 'Lançamento Equilibrado (Débito = Crédito)'
                        : `Desequilíbrio de ${formatCurrencyBRL(diferencaPartidas)}`}
                    </p>
                    <p className="text-[11px] opacity-80">
                      Total Débito: {formatCurrencyBRL(totalDebitoCalculado)} | Total Crédito: {formatCurrencyBRL(totalCreditoCalculado)}
                    </p>
                  </div>
                </div>

                <span className="font-bold text-sm">
                  {estaEquilibrado ? 'OK' : 'Pendente'}
                </span>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !estaEquilibrado}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm flex items-center gap-2 ${
                    estaEquilibrado
                      ? 'bg-disk-600 hover:bg-disk-700'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  {actionLoading ? 'Registrando...' : 'Gravar no Livro Diário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
