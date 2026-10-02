import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { BankAccount, TipoContaBancaria } from '@diskingressos/types';
import { formatCurrencyBRL } from '@diskingressos/utils';
import {
  Landmark,
  Plus,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const ContasBancariasPage: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bancoNome: '',
    bancoCodigo: '',
    agencia: '',
    conta: '',
    digito: '0',
    tipo: TipoContaBancaria.CORRENTE,
    saldoAtual: '0',
    limiteCredito: '0',
    chavePix: '',
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/bancos/contas');
      setAccounts(res || []);
    } catch (err) {
      console.error('Falha ao carregar contas bancárias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/bancos/contas', {
        ...formData,
        saldoAtual: parseFloat(formData.saldoAtual || '0'),
        limiteCredito: parseFloat(formData.limiteCredito || '0'),
      });
      setIsModalOpen(false);
      setFormData({
        bancoNome: '',
        bancoCodigo: '',
        agencia: '',
        conta: '',
        digito: '0',
        tipo: TipoContaBancaria.CORRENTE,
        saldoAtual: '0',
        limiteCredito: '0',
        chavePix: '',
      });
      await fetchAccounts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao cadastrar conta bancária');
    } finally {
      setActionLoading(false);
    }
  };

  const totalSaldoDisponivel = accounts.reduce((acc, a) => acc + (a.saldoDisponivel || 0), 0);
  const totalLimiteCredito = accounts.reduce((acc, a) => acc + (a.limiteCredito || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-7 h-7 text-indigo-600" />
            Contas Bancárias & Tesouraria
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão das contas bancárias corporativas, chaves PIX homologadas, saldos e limites
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Conta Bancária
          </button>
          <button
            onClick={fetchAccounts}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Consolidados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Saldo Consolidado Disponível</span>
            <Building className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyBRL(totalSaldoDisponivel)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Soma de todas as contas corporativas
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Limite de Crédito Bancário</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrencyBRL(totalLimiteCredito)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Cheque especial e capital de giro contratado
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Contas Homologadas</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {accounts.length} Instituições
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Itaú e Bradesco integrados com OFX
          </div>
        </div>
      </div>

      {/* Grid de Cartões Bancários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
            Carregando contas bancárias...
          </div>
        ) : (
          accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Banco {acc.bancoCodigo}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ativa
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {acc.bancoNome}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Ag: {acc.agencia} | CC: {acc.conta}-{acc.digito} ({acc.tipo})
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-indigo-600">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>

              <div className="my-5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-750">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Saldo Disponível em Conta
                </p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatCurrencyBRL(acc.saldoDisponivel)}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Limite de Crédito:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrencyBRL(acc.limiteCredito)}
                  </span>
                </div>
                {acc.chavePix && (
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-disk-500" />
                      Chave PIX:
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {acc.chavePix}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <span className="text-slate-400">
                  {acc.tipo === 'CORRENTE' ? 'Conta Movimento Diário' : 'Conta Aplicação'}
                </span>
                <button
                  onClick={() => navigate('/bancos/conciliacao')}
                  className="inline-flex items-center gap-1 font-semibold text-disk-600 hover:text-disk-700 transition-colors"
                >
                  Abrir Conciliação OFX
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Nova Conta Bancária */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                Cadastrar Conta Bancária Corporativa
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
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome da Instituição Financeira *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Banco Itaú Unibanco S.A."
                    value={formData.bancoNome}
                    onChange={(e) => setFormData({ ...formData, bancoNome: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cód. Compensação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 341"
                    value={formData.bancoCodigo}
                    onChange={(e) => setFormData({ ...formData, bancoCodigo: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Agência *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0000"
                    value={formData.agencia}
                    onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Conta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="00000"
                    value={formData.conta}
                    onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Dígito
                  </label>
                  <input
                    type="text"
                    placeholder="0"
                    value={formData.digito}
                    onChange={(e) => setFormData({ ...formData, digito: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Inicial (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.saldoAtual}
                    onChange={(e) => setFormData({ ...formData, saldoAtual: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Limite de Crédito (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.limiteCredito}
                    onChange={(e) => setFormData({ ...formData, limiteCredito: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chave PIX Homologada
                </label>
                <input
                  type="text"
                  placeholder="CNPJ, E-mail ou chave aleatória"
                  value={formData.chavePix}
                  onChange={(e) => setFormData({ ...formData, chavePix: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                />
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
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm flex items-center gap-2"
                >
                  {actionLoading ? 'Salvando...' : 'Salvar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
