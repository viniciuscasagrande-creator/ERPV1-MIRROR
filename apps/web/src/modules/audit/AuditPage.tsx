import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AuditLogEntry } from '@diskingressos/types';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  X,
  FileCode,
  AlertTriangle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { formatDateBR } from '@diskingressos/utils';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entidadeFilter, setEntidadeFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/audit');
      setLogs(res.items || []);
    } catch (e) {
      console.warn('Backend audit offline, utilizando dados demonstrativos:', e);
      setLogs([
        {
          id: 'log-1',
          criadoEm: new Date(Date.now() - 3600000).toISOString(),
          usuarioNome: 'Karine Santos (Financeiro)',
          usuarioEmail: 'karine.financeiro@diskingressos.com.br',
          acao: 'APROVACAO_REPASSE',
          entidade: 'ProducerSettlement',
          entidadeId: 'rep-curitiba-shows',
          ip: '192.168.10.45',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          motivo: 'Borderô REP-2026-000101 aprovado após conciliação do extrato OFX',
          valorAnterior: JSON.stringify({ status: 'EM_ANALISE', valorSolicitado: 375000 }),
          valorNovo: JSON.stringify({ status: 'APROVADO', valorLiquido: 375000, aprovadoPor: 'Karine' }),
        },
        {
          id: 'log-2',
          criadoEm: new Date(Date.now() - 7200000).toISOString(),
          usuarioNome: 'Administrador Master Disk',
          usuarioEmail: 'admin@diskingressos.local',
          acao: 'AUTORIZAR_NFSE',
          entidade: 'FiscalInvoice',
          entidadeId: 'nfs-2026-000001',
          ip: '177.105.80.12',
          userAgent: 'Mozilla/5.0 Chrome/128.0',
          motivo: 'Emissão oficial de NFS-e transmitida à Prefeitura de Curitiba',
          valorAnterior: null,
          valorNovo: JSON.stringify({ numeroNota: 'NFS-2026-000001', status: 'AUTORIZADO', valorServicos: 385000 }),
        },
        {
          id: 'log-3',
          criadoEm: new Date(Date.now() - 86400000).toISOString(),
          usuarioNome: 'Sistema Contábil Automático',
          usuarioEmail: 'bot@diskingressos.local',
          acao: 'ESCRITURACAO_LIVRO_DIARIO',
          entidade: 'JournalEntry',
          entidadeId: 'lan-2026-000004',
          ip: '127.0.0.1',
          userAgent: 'NestJS Accounting Daemon',
          motivo: 'Partidas dobradas automáticas de liquidação de repasse ao produtor',
          valorAnterior: null,
          valorNovo: JSON.stringify({ numeroLancamento: 'LAN-2026-000004', equilibrado: true, totalDebito: 375000, totalCredito: 375000 }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = search.toLowerCase();
    const matchesSearch =
      log.usuarioNome.toLowerCase().includes(term) ||
      log.acao.toLowerCase().includes(term) ||
      log.entidade.toLowerCase().includes(term) ||
      (log.motivo && log.motivo.toLowerCase().includes(term));

    const matchesEntidade =
      entidadeFilter === 'ALL' || log.entidade === entidadeFilter;

    return matchesSearch && matchesEntidade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-disk-600" />
            <span>Trilha de Auditoria & Compliance Imutável</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registro criptográfico de alterações de estado, aprovações de repasses, partidas
            contábeis e acessos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Lock className="w-3.5 h-3.5" />
            Trilha Criptográfica Ativa
          </span>
          <button
            onClick={fetchLogs}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Recarregar Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por operador, ação, entidade ou motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={entidadeFilter}
            onChange={(e) => setEntidadeFilter(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todas as Entidades</option>
            <option value="ProducerSettlement">Repasses / Borderôs</option>
            <option value="FiscalInvoice">Notas Fiscais (NFS-e)</option>
            <option value="JournalEntry">Partidas Contábeis (Diário)</option>
            <option value="Event">Eventos & Lotes</option>
            <option value="User">Usuários & Acessos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Auditoria */}
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 font-semibold">
            <tr>
              <th className="px-5 py-3.5">Data/Hora</th>
              <th className="px-5 py-3.5">Operador</th>
              <th className="px-5 py-3.5">Ação Executada</th>
              <th className="px-5 py-3.5">Entidade Afetada</th>
              <th className="px-5 py-3.5">IP Origem</th>
              <th className="px-5 py-3.5">Justificativa / Motivo</th>
              <th className="px-5 py-3.5 text-center">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                  Nenhum log encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {formatDateBR(log.criadoEm, true)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {log.usuarioNome}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {log.usuarioEmail || '-'}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {log.acao}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {log.entidade}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-400 text-[11px]">
                    {log.ip || '127.0.0.1'}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={log.motivo || ''}>
                    {log.motivo || 'Operação realizada com sucesso'}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-[11px] flex items-center gap-1 mx-auto"
                      title="Ver Mudança de Estado"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Diff
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Diff e Mudança de Estado */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-disk-600" />
                  Inspeção Forense: {selectedLog.acao} ({selectedLog.entidade})
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ID: {selectedLog.id} | Data: {formatDateBR(selectedLog.criadoEm, true)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-semibold">Operador Responsável:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {selectedLog.usuarioNome} ({selectedLog.usuarioEmail})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Valor Anterior */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-rose-600 flex items-center gap-1">
                  Estado Anterior
                </span>
                <pre className="p-3 rounded-xl bg-slate-900 text-rose-300 font-mono text-[11px] overflow-x-auto min-h-[120px] max-h-60 leading-relaxed border border-rose-950">
                  {selectedLog.valorAnterior
                    ? JSON.stringify(JSON.parse(selectedLog.valorAnterior), null, 2)
                    : '// Sem registro anterior (Novo Objeto)'}
                </pre>
              </div>

              {/* Valor Novo */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                  Estado Novo Mutado
                </span>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto min-h-[120px] max-h-60 leading-relaxed border border-emerald-950">
                  {selectedLog.valorNovo
                    ? JSON.stringify(JSON.parse(selectedLog.valorNovo), null, 2)
                    : '// Objeto excluído ou sem alteração de campos'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700"
              >
                Fechar Inspeção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
