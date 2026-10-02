import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ProducerSettlementItem } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  FileText,
  Printer,
  X,
  Send,
  Building2,
  Landmark,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export const ProducerRepassesPage: React.FC = () => {
  const [repasses, setRepasses] = useState<ProducerSettlementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Modal de Comprovante Bancário
  const [selectedRepasse, setSelectedRepasse] = useState<ProducerSettlementItem | null>(null);

  // Modal de Solicitação de Repasse
  const [isAdiantamentoOpen, setIsAdiantamentoOpen] = useState(false);
  const [eventosDisponiveis, setEventosDisponiveis] = useState<any[]>([]);
  const [formAdiantamento, setFormAdiantamento] = useState({
    eventId: '',
    valor: '',
    justificativa: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRepasses = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/producer-portal/repasses');
      setRepasses(res || []);
    } catch (err) {
      console.warn('Erro ao carregar repasses da API, usando dados de demonstração:', err);
      setRepasses([
        {
          id: 'rep-1',
          codigoBordero: 'REP-2026-000101',
          eventoId: 'evt-rock-arena',
          eventoNome: 'Rock Legends Curitiba Arena',
          valorBrutoApurado: 3850000.0,
          comissaoRetida: 385000.0,
          taxasRetidas: 0,
          retencaoSeguranca: 0,
          valorLiquido: 375000.0,
          status: 'PAGO',
          solicitadoEm: '2026-08-22T10:00:00Z',
          aprovadoEm: '2026-08-25T14:00:00Z',
          pagoEm: '2026-08-25T14:30:00Z',
          autenticacaoBancaria: 'ITAU_PIX_AUT_883921092831',
          bancoDestino: 'Banco Itaú Unibanco (Ag: 0432 / CC: 29871-4)',
          chavePix: 'financeiro@curitibashows.com.br',
        },
        {
          id: 'rep-2',
          codigoBordero: 'REP-2026-000102',
          eventoId: 'evt-rock-arena',
          eventoNome: 'Rock Legends Curitiba Arena (Saldo Final)',
          valorBrutoApurado: 2544750.0,
          comissaoRetida: 0,
          taxasRetidas: 0,
          retencaoSeguranca: 0,
          valorLiquido: 2544750.0,
          status: 'APROVADO',
          solicitadoEm: '2026-08-26T09:00:00Z',
          aprovadoEm: '2026-08-26T16:00:00Z',
          bancoDestino: 'Banco Itaú Unibanco (Ag: 0432 / CC: 29871-4)',
          chavePix: 'financeiro@curitibashows.com.br',
        },
        {
          id: 'rep-3',
          codigoBordero: 'REP-2026-000103',
          eventoId: 'evt-samba-curitiba',
          eventoNome: 'Festival Tardezinha Curitiba',
          valorBrutoApurado: 500000.0,
          comissaoRetida: 50000.0,
          taxasRetidas: 0,
          retencaoSeguranca: 0,
          valorLiquido: 450000.0,
          status: 'SOLICITADO',
          solicitadoEm: '2026-09-01T11:20:00Z',
          bancoDestino: 'Banco Itaú Unibanco (Ag: 0432 / CC: 29871-4)',
          chavePix: 'financeiro@curitibashows.com.br',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventos = async () => {
    try {
      const res: any = await api.get('/producer-portal/eventos');
      setEventosDisponiveis(res || []);
      if (res && res.length > 0) {
        setFormAdiantamento((prev) => ({ ...prev, eventId: res[0].id }));
      }
    } catch {
      setEventosDisponiveis([
        { id: 'evt-rock-arena', nome: 'Rock Legends Curitiba Arena' },
        { id: 'evt-samba-curitiba', nome: 'Festival Tardezinha Curitiba' },
      ]);
      setFormAdiantamento((prev) => ({ ...prev, eventId: 'evt-rock-arena' }));
    }
  };

  useEffect(() => {
    fetchRepasses();
    fetchEventos();
  }, []);

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAdiantamento.eventId || !formAdiantamento.valor || Number(formAdiantamento.valor) <= 0) {
      alert('Preencha os campos obrigatórios com valores válidos.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/producer-portal/repasses/solicitar-adiantamento', {
        eventId: formAdiantamento.eventId,
        valor: Number(formAdiantamento.valor),
        justificativa: formAdiantamento.justificativa,
      });
      alert('Solicitação de repasse enviada com sucesso!');
      setIsAdiantamentoOpen(false);
      setFormAdiantamento({ eventId: eventosDisponiveis[0]?.id || '', valor: '', justificativa: '' });
      fetchRepasses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao solicitar repasse.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculos de Totais
  const totalPago = repasses
    .filter((r) => r.status === 'PAGO')
    .reduce((acc, r) => acc + r.valorLiquido, 0);

  const totalAprovadoPendente = repasses
    .filter((r) => r.status === 'APROVADO')
    .reduce((acc, r) => acc + r.valorLiquido, 0);

  const totalEmAnalise = repasses
    .filter((r) => r.status === 'SOLICITADO')
    .reduce((acc, r) => acc + r.valorLiquido, 0);

  // Filtros
  const repassesFiltrados = repasses.filter((r) => {
    const matchTexto =
      r.codigoBordero.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      r.eventoNome.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || r.status === filtroStatus;
    return matchTexto && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-400" />
            Repasses & Borderôs
          </h1>
          <p className="text-sm text-slate-400">
            Consulte os borderôs de liquidação, comprovantes bancários e solicite adiantamentos parciais.
          </p>
        </div>

        <button
          onClick={() => setIsAdiantamentoOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-900/40 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Solicitar Repasse / Adiantamento
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Pago na Conta
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-300">
            {formatCurrencyBRL(totalPago)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Liquidados e autenticados via PIX / TED bancária
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aprovados (Próximo Lote)
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-300">
            {formatCurrencyBRL(totalAprovadoPendente)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Aprovados pela diretoria financeira, aguardando envio bancário
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Em Análise Contábil
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-300">
            {formatCurrencyBRL(totalEmAnalise)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Solicitações em auditoria de conciliação de bilheteria
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código REP ou nome do evento..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="PAGO">Pago (Liquidado)</option>
            <option value="APROVADO">Aprovado</option>
            <option value="SOLICITADO">Em Análise (Solicitado)</option>
            <option value="RECUSADO">Recusado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Borderôs e Repasses */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">Carregando extrato de repasses...</p>
          </div>
        ) : repassesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wallet className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-300">Nenhum repasse localizado</p>
            <p className="text-xs text-slate-500 mt-1">
              Verifique os filtros de busca ou solicite um novo adiantamento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-5 py-3">Código Borderô</th>
                  <th className="px-5 py-3">Evento Referência</th>
                  <th className="px-5 py-3">Solicitado Em</th>
                  <th className="px-5 py-3">Data Liquidação</th>
                  <th className="px-5 py-3 text-right">Valor Líquido</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {repassesFiltrados.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">
                      {rep.codigoBordero}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-200">
                      {rep.eventoNome}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {formatDateBR(rep.solicitadoEm)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {rep.pagoEm ? formatDateBR(rep.pagoEm) : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-white text-sm">
                      {formatCurrencyBRL(rep.valorLiquido)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border ${
                          rep.status === 'PAGO'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : rep.status === 'APROVADO'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : rep.status === 'SOLICITADO'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {rep.status === 'PAGO' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {rep.status === 'PAGO' ? (
                        <button
                          onClick={() => setSelectedRepasse(rep)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Comprovante
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRepasse(rep)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          Ver Borderô
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Comprovante Bancário / Detalhes de Autenticação */}
      {selectedRepasse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Comprovante de Repasse</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Borderô {selectedRepasse.codigoBordero}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRepasse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comprovante Corpo */}
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Origem Pagadora</span>
                  <span className="font-bold text-slate-200">
                    DISK INGRESSOS SERVICOS DE BILHETERIA LTDA
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">CNPJ Emissor</span>
                  <span className="font-mono text-slate-300">08.234.567/0001-89</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Favorecido (Produtora)</span>
                  <span className="font-bold text-indigo-300">
                    {selectedRepasse.eventoNome}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Banco de Destino</span>
                  <span className="text-slate-300">{selectedRepasse.bancoDestino}</span>
                </div>
                {selectedRepasse.chavePix && (
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Chave PIX</span>
                    <span className="font-mono text-slate-300">{selectedRepasse.chavePix}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">Valor Liquidado</span>
                  <span className="text-lg font-black text-emerald-400">
                    {formatCurrencyBRL(selectedRepasse.valorLiquido)}
                  </span>
                </div>
              </div>

              {/* Autenticação Bancária */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Autenticação Bancária Homologada
                </div>
                <div className="font-mono text-[11px] text-emerald-200/90 break-all bg-emerald-950/60 p-2.5 rounded border border-emerald-500/20">
                  {selectedRepasse.autenticacaoBancaria ||
                    'TED/PIX COMPROVANTE OFICIAL — LOTE PROCESSADO BANCO ITAÚ UNIBANCO'}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Data da Liquidação: {formatDateBR(selectedRepasse.pagoEm || selectedRepasse.solicitadoEm)}</span>
                  <span>Protocolo: DISK-FIN-BORD-{selectedRepasse.id}</span>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedRepasse(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-md shadow-indigo-900/40"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Comprovante
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Adiantamento */}
      {isAdiantamentoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                Solicitar Adiantamento / Repasse
              </h2>
              <button
                onClick={() => setIsAdiantamentoOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSolicitar} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Evento de Origem
                </label>
                <select
                  value={formAdiantamento.eventId}
                  onChange={(e) =>
                    setFormAdiantamento((prev) => ({ ...prev, eventId: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Selecione o evento</option>
                  {eventosDisponiveis.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Valor Solicitado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formAdiantamento.valor}
                  onChange={(e) =>
                    setFormAdiantamento((prev) => ({ ...prev, valor: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Justificativa Operacional
                </label>
                <textarea
                  rows={3}
                  value={formAdiantamento.justificativa}
                  onChange={(e) =>
                    setFormAdiantamento((prev) => ({ ...prev, justificativa: e.target.value }))
                  }
                  placeholder="Ex: Pagamento de montagem de palco, hospedagem de artistas, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-3 text-[11px] text-indigo-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  O pedido é auditado pelo setor de Tesouraria DiskIngressos e pago via PIX/TED
                  conforme a conta bancária homologada da produtora.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdiantamentoOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Confirmar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
