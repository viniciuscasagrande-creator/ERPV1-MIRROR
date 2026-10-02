import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  BankAccount,
  BankStatementItem,
  ReconciliationSummary,
  StatusConciliacao,
  TipoLancamentoExtrato,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  FileCheck2,
  Upload,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Sparkles,
  Link,
  Ban,
  FileCode,
} from 'lucide-react';

export const ConciliacaoBancariaPage: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [items, setItems] = useState<BankStatementItem[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDENTE');
  const [search, setSearch] = useState('');

  // Modais e Ações
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [ofxFilename, setOfxFilename] = useState('');
  const [ofxContent, setOfxContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [autoMatchResult, setAutoMatchResult] = useState<string | null>(null);

  const fetchAccountsAndData = async () => {
    setLoading(true);
    try {
      const accs: any = await api.get('/bancos/contas');
      setAccounts(accs || []);

      const accountId = selectedAccountId || (accs && accs.length > 0 ? accs[0].id : '');
      if (accountId && !selectedAccountId) {
        setSelectedAccountId(accountId);
      }

      if (accountId) {
        const [statementRes, summaryRes]: any = await Promise.all([
          api.get(`/conciliacao/extrato/${accountId}`, {
            params: {
              status: statusFilter || undefined,
              search: search || undefined,
            },
          }),
          api.get('/conciliacao/summary', {
            params: { bankAccountId: accountId },
          }),
        ]);
        setItems(statementRes || []);
        setSummary(summaryRes || null);
      }
    } catch (err) {
      console.error('Falha ao carregar conciliação bancária:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsAndData();
  }, [selectedAccountId, statusFilter, search]);

  const handleRunAutoMatch = async () => {
    if (!selectedAccountId) return;
    setActionLoading(true);
    try {
      const res: any = await api.post(`/conciliacao/auto-conciliar/${selectedAccountId}`);
      setAutoMatchResult(
        `Auto-Conciliação Concluída: ${res.totalConciliados} item(ns) conciliados automaticamente!`
      );
      setTimeout(() => setAutoMatchResult(null), 6000);
      await fetchAccountsAndData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao executar auto-conciliação');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualReconcile = async (
    statementItemId: string,
    target: { tipo: 'RECEBIVEL' | 'CONTA_PAGAR' | 'REPASSE'; id: string }
  ) => {
    setActionLoading(true);
    try {
      await api.post('/conciliacao/conciliar-manual', {
        statementItemId,
        target,
      });
      await fetchAccountsAndData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao vincular lançamento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIgnore = async (statementItemId: string) => {
    try {
      await api.patch(`/conciliacao/ignorar/${statementItemId}`);
      await fetchAccountsAndData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao ignorar item');
    }
  };

  const handleUploadOfx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !ofxContent) return;
    setActionLoading(true);
    try {
      const res: any = await api.post('/conciliacao/importar-ofx', {
        bankAccountId: selectedAccountId,
        filename: ofxFilename || 'extrato_importado.ofx',
        content: ofxContent,
      });
      setIsUploadModalOpen(false);
      setOfxFilename('');
      setOfxContent('');
      setAutoMatchResult(
        `OFX Importado: ${res.novosInseridos} transações novas, ${res.conciliadosAutomaticamente} conciliadas na hora!`
      );
      setTimeout(() => setAutoMatchResult(null), 6000);
      await fetchAccountsAndData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao processar arquivo OFX');
    } finally {
      setActionLoading(false);
    }
  };

  // Carrega exemplo padrão de OFX para facilitar testes
  const handleLoadSampleOfx = () => {
    setOfxFilename('EXTRATO-ITAU-SAMPLE.ofx');
    setOfxContent(`OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20261002160000[-0300]
<LANGUAGE>POR
<FI>
<ORG>ITAU UNIBANCO
<FID>341
</FI>
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>341
<ACCTID>0432298714
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20261001000000[-0300]
<DTEND>20261002235959[-0300]
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261002120000[-0300]
<TRNAMT>436995.00
<FITID>OFX-SMP-001
<CHECKNUM>CIELO9921
<MEMO>CRED LIQUIDACAO ADQUIRENCIA CIELO
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261002130000[-0300]
<TRNAMT>-76080.00
<FITID>OFX-SMP-002
<CHECKNUM>ECAD2026
<MEMO>PAGAMENTO TITULO ECAD DIREITOS AUTORAIS
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>376690.00
<DTASOF>20261002235959[-0300]
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notificação de Auto-Match */}
      {autoMatchResult && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 text-white shadow-2xl border border-emerald-500/50 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <p className="text-xs font-semibold">{autoMatchResult}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-indigo-600" />
            Conciliação Bancária & Leitor OFX
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Motor inteligente de cruzamento entre extratos bancários, recebíveis de adquirentes e pagamentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            Importar OFX
          </button>
          <button
            onClick={handleRunAutoMatch}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            Auto-Conciliar 1-Click
          </button>
          <button
            onClick={fetchAccountsAndData}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards de Conciliação */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Índice de Conciliação</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
              <span>{summary.percentualConciliado}%</span>
              <span className="text-xs font-normal text-slate-500">
                ({summary.totalConciliado} de {summary.totalItens})
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${summary.percentualConciliado}%` }}
              ></div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Pendentes de Validação</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {summary.totalPendente} lançamentos
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Aguardando cruzamento contábil
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Créditos a Conciliar</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(summary.valorPendenteCreditos)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Recebimentos de bilheteria e adquirentes
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Débitos a Conciliar</span>
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrencyBRL(summary.valorPendenteDebitos)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Pagamentos a fornecedores e repasses
            </div>
          </div>
        </div>
      )}

      {/* Toolbar & Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="sm:w-72">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.bancoNome} (Ag: {acc.agencia} CC: {acc.conta})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, FITID ou documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
          >
            <option value="">Todos os Status</option>
            <option value="PENDENTE">Pendentes (Necessitam Atenção)</option>
            <option value="CONCILIADO">Conciliados (Auditados)</option>
            <option value="IGNORADO">Ignorados</option>
          </select>
        </div>
      </div>

      {/* Lista de Lançamentos de Extrato e Auto-Match Split */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Data Extrato</th>
                <th className="px-6 py-4">FITID / Documento</th>
                <th className="px-6 py-4">Descrição Oficial Bancária</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Correspondência ERP (Match)</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-disk-500" />
                    Carregando extrato bancário...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Nenhum lançamento encontrado para esta conta com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {formatDateBR(item.dataLancamento)}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      <p>{item.fitId}</p>
                      {item.documento && <p className="text-[10px] text-slate-500">Doc: {item.documento}</p>}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.descricao}
                      </p>
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-bold text-sm ${
                        item.tipo === TipoLancamentoExtrato.CREDITO
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.tipo === TipoLancamentoExtrato.CREDITO ? '+' : '-'}
                      {formatCurrencyBRL(item.valor)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.statusConciliacao === 'CONCILIADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Conciliado
                        </span>
                      )}
                      {item.statusConciliacao === 'PENDENTE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          Pendente
                        </span>
                      )}
                      {item.statusConciliacao === 'IGNORADO' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          <Ban className="w-3.5 h-3.5" />
                          Ignorado
                        </span>
                      )}
                    </td>

                    {/* Correspondência Contábil */}
                    <td className="px-6 py-4">
                      {item.statusConciliacao === 'CONCILIADO' ? (
                        <div className="space-y-0.5 text-xs">
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Link className="w-3 h-3 text-emerald-500" />
                            Vínculo: {item.conciliadoComTipo}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Auditado por: {item.conciliadoPor}
                          </p>
                        </div>
                      ) : item.candidateMatches && item.candidateMatches.length > 0 ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {item.candidateMatches[0].score}% Match
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                              {item.candidateMatches[0].descricao}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {item.candidateMatches[0].motivo} ({formatCurrencyBRL(item.candidateMatches[0].valor)})
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Sem candidato automático
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.statusConciliacao === 'PENDENTE' && (
                        <div className="flex items-center justify-end gap-1.5">
                          {item.candidateMatches && item.candidateMatches.length > 0 && (
                            <button
                              onClick={() =>
                                handleManualReconcile(item.id, {
                                  tipo: item.candidateMatches![0].tipo,
                                  id: item.candidateMatches![0].id,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                              title="Confirmar match sugerido"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Vincular
                            </button>
                          )}
                          <button
                            onClick={() => handleIgnore(item.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            title="Ignorar lançamento não contábil"
                          >
                            <Ban className="w-4 h-4" />
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

      {/* Modal: Importar Arquivo OFX */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Importar Extrato Bancário OFX
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadOfx} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Conta Bancária de Destino *
                </label>
                <select
                  required
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500 font-semibold"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bancoNome} (Ag: {acc.agencia} CC: {acc.conta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Conteúdo do Arquivo OFX *
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleOfx}
                    className="text-xs font-semibold text-disk-600 hover:text-disk-700 flex items-center gap-1"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Carregar Exemplo OFX Itaú
                  </button>
                </div>
                <textarea
                  required
                  rows={8}
                  placeholder="Cole aqui o conteúdo do arquivo .ofx baixado do Internet Banking Itaú, Bradesco, etc..."
                  value={ofxContent}
                  onChange={(e) => setOfxContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-disk-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !ofxContent}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2"
                >
                  {actionLoading ? 'Processando OFX...' : 'Processar e Auto-Conciliar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
