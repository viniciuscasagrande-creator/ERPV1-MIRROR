import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AccountPayable, PayableKpis, StatusContaPagar, CategoriaDespesa } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  ArrowUpRight,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Building,
  RefreshCw,
  XCircle,
  Tag,
} from 'lucide-react';

export const ContasPagarPage: React.FC = () => {
  const [payables, setPayables] = useState<AccountPayable[]>([]);
  const [kpis, setKpis] = useState<PayableKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<AccountPayable | null>(null);
  const [comprovanteRef, setComprovanteRef] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Formulário de Criação
  const [formData, setFormData] = useState({
    descricao: '',
    categoria: CategoriaDespesa.FORNECEDOR,
    fornecedorNome: '',
    fornecedorCpfCnpj: '',
    valor: '',
    dataVencimento: '',
    formaPagamento: 'PIX',
    eventId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, kpiRes]: any = await Promise.all([
        api.get('/contas-pagar', {
          params: {
            search: search || undefined,
            status: statusFilter || undefined,
            categoria: categoriaFilter || undefined,
          },
        }),
        api.get('/contas-pagar/kpis'),
      ]);
      setPayables(listRes || []);
      setKpis(kpiRes || null);
    } catch (err) {
      console.error('Falha ao carregar contas a pagar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, categoriaFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/contas-pagar', {
        ...formData,
        valor: parseFloat(formData.valor),
        dataVencimento: new Date(formData.dataVencimento).toISOString(),
        eventId: formData.eventId || undefined,
      });
      setIsCreateModalOpen(false);
      setFormData({
        descricao: '',
        categoria: CategoriaDespesa.FORNECEDOR,
        fornecedorNome: '',
        fornecedorCpfCnpj: '',
        valor: '',
        dataVencimento: '',
        formaPagamento: 'PIX',
        eventId: '',
      });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao cadastrar conta a pagar');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedPayable) return;
    setActionLoading(true);
    try {
      await api.patch(`/contas-pagar/${selectedPayable.id}/pagar`, {
        comprovanteRef: comprovanteRef || undefined,
      });
      setIsPayModalOpen(false);
      setSelectedPayable(null);
      setComprovanteRef('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao efetivar pagamento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSchedule = async (id: string) => {
    try {
      await api.patch(`/contas-pagar/${id}/agendar`);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao agendar pagamento');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta obrigação?')) return;
    try {
      await api.patch(`/contas-pagar/${id}/cancelar`);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao cancelar conta');
    }
  };

  const getCategoriaBadge = (cat: CategoriaDespesa) => {
    const map: Record<string, { label: string; bg: string }> = {
      FORNECEDOR: { label: 'Fornecedor', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      IMPOSTO: { label: 'Imposto / ISS', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      TAXA: { label: 'Taxa / ECAD', bg: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
      INFRAESTRUTURA: { label: 'Infra / Gerador', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
      REEMBOLSO: { label: 'Reembolso', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      COMISSAO: { label: 'Comissão', bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
      OUTRO: { label: 'Outro', bg: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
    };
    const c = map[cat] || map.OUTRO;
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
            <ArrowUpRight className="w-7 h-7 text-rose-600" />
            Contas a Pagar & Obrigações
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de despesas com fornecedores de shows, tributos, taxas de arrecadação ECAD e tesouraria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Obrigação
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Total Compromissado</span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.totalPagar)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {kpis.contagemTitulos} títulos lançados
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Em Aberto (A Vencer)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrencyBRL(kpis.totalAberto)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Aguardando vencimento
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Agendado / Programado</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrencyBRL(kpis.totalAgendado)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Pronto para remessa bancária
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Total Já Liquidado</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.totalPago)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Com comprovante de débito
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, fornecedor ou CNPJ..."
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
            <option value="EM_ABERTO">Em Aberto</option>
            <option value="AGENDADO">Agendado</option>
            <option value="PAGO">Pago / Liquidado</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todas as Categorias</option>
            <option value="FORNECEDOR">Fornecedor</option>
            <option value="IMPOSTO">Imposto</option>
            <option value="TAXA">Taxa / ECAD</option>
            <option value="INFRAESTRUTURA">Infraestrutura</option>
            <option value="REEMBOLSO">Reembolso</option>
            <option value="COMISSAO">Comissão</option>
          </select>
        </div>
      </div>

      {/* Payables Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Descrição & Categoria</th>
                <th className="px-6 py-4">Fornecedor / Favorecido</th>
                <th className="px-6 py-4">Evento Vinculado</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando contas a pagar...
                  </td>
                </tr>
              ) : payables.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma obrigação encontrada.
                  </td>
                </tr>
              ) : (
                payables.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {p.descricao}
                        </p>
                        <div className="flex items-center gap-2">
                          {getCategoriaBadge(p.categoria)}
                          <span className="text-[11px] text-slate-400 font-mono">
                            Mod: {p.formaPagamento}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {p.fornecedorNome}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {p.fornecedorCpfCnpj}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 max-w-[180px] truncate">
                        {p.eventNome || 'Despesa Corporativa'}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {formatDateBR(p.dataVencimento)}
                      </p>
                      {p.dataPagamento && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          Pago em {formatDateBR(p.dataPagamento)}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrencyBRL(p.valor)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {p.status === 'PAGO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Liquidado
                        </span>
                      )}
                      {p.status === 'AGENDADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3.5 h-3.5" />
                          Agendado
                        </span>
                      )}
                      {p.status === 'EM_ABERTO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          Em Aberto
                        </span>
                      )}
                      {p.status === 'CANCELADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {p.status !== 'PAGO' && p.status !== 'CANCELADO' && (
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'EM_ABERTO' && (
                            <button
                              onClick={() => handleSchedule(p.id)}
                              className="px-2 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                            >
                              Agendar
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedPayable(p);
                              setIsPayModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                          >
                            Pagar
                          </button>
                          <button
                            onClick={() => handleCancel(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Cancelar obrigação"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {p.status === 'PAGO' && p.comprovanteRef && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {p.comprovanteRef}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Conta a Pagar */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-disk-500" />
                Cadastrar Conta a Pagar / Obrigação
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição da Despesa / Obrigação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Serviço de Segurança / ECAD / Gerador"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Categoria Contábil *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaDespesa })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  >
                    <option value="FORNECEDOR">Fornecedor</option>
                    <option value="IMPOSTO">Imposto (ISSQN / DAM)</option>
                    <option value="TAXA">Taxa de Arrecadação (ECAD)</option>
                    <option value="INFRAESTRUTURA">Infraestrutura</option>
                    <option value="REEMBOLSO">Reembolso</option>
                    <option value="COMISSAO">Comissão</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  >
                    <option value="PIX">PIX Transferência</option>
                    <option value="TED">TED Bancária</option>
                    <option value="BOLETO">Boleto Bancário</option>
                    <option value="DAM">DAM / Guia Municipal</option>
                    <option value="CARTAO_CREDITO">Cartão Corporativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome / Razão Social do Fornecedor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do favorecido"
                    value={formData.fornecedorNome}
                    onChange={(e) => setFormData({ ...formData, fornecedorNome: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CNPJ ou CPF do Fornecedor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0000-00"
                    value={formData.fornecedorCpfCnpj}
                    onChange={(e) => setFormData({ ...formData, fornecedorCpfCnpj: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Valor a Pagar (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-disk-600 hover:bg-disk-700 text-white shadow-sm flex items-center gap-2"
                >
                  {actionLoading ? 'Salvando...' : 'Salvar Obrigação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Efetivar Pagamento */}
      {isPayModalOpen && selectedPayable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Confirmar Liquidação de Pagamento
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedPayable.descricao}
                </p>
                <p className="text-xs text-slate-500">
                  Favorecido: {selectedPayable.fornecedorNome} ({selectedPayable.fornecedorCpfCnpj})
                </p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-2">
                  {formatCurrencyBRL(selectedPayable.valor)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Código ou Hash do Comprovante Bancário
                </label>
                <input
                  type="text"
                  placeholder="Ex: PIX-AUT-99823102 ou TED-88129"
                  value={comprovanteRef}
                  onChange={(e) => setComprovanteRef(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-mono"
                />
              </div>

              <p className="text-xs text-slate-400 italic">
                * O valor será debitado automaticamente da Conta Movimento Itaú no módulo de Fluxo de Caixa.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
              >
                {actionLoading ? 'Registrando...' : 'Confirmar Débito'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
