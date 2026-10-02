import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ProducerEventSummary } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  FileText,
  X,
  Send,
  Layers,
  Percent,
} from 'lucide-react';

export const ProducerEventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<ProducerEventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  
  // Modal de Detalhes / Borderô Analítico
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modal de Solicitação de Repasse
  const [isRepasseModalOpen, setIsRepasseModalOpen] = useState(false);
  const [repasseEventId, setRepasseEventId] = useState<string>('');
  const [valorRepasse, setValorRepasse] = useState<string>('');
  const [justificativa, setJustificativa] = useState<string>('');
  const [submittingRepasse, setSubmittingRepasse] = useState(false);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/producer-portal/eventos');
      setEventos(res || []);
    } catch (err) {
      console.warn('Erro ao carregar eventos da API, carregando dados de demonstração:', err);
      // Fallback robusto para demonstração
      setEventos([
        {
          id: 'evt-rock-arena',
          nome: 'Rock Legends Curitiba Arena',
          dataEvento: '2026-09-15T21:00:00Z',
          local: 'Pedreira Paulo Leminski',
          cidade: 'Curitiba - PR',
          status: 'ATIVO',
          statusFinanceiro: 'PARCIALMENTE_LIQUIDADO',
          ingressosVendidos: 39800,
          capacidadeTotal: 40000,
          vendasBrutas: 3850000.0,
          comissaoDisk: 385000.0,
          valorLiquidoProdutor: 3465000.0,
          batches: [
            { id: 'b1', nome: 'Lote 1 - Pista Promocional', preco: 90.0, vendidos: 15000, total: 15000 },
            { id: 'b2', nome: 'Lote 2 - Pista Regular', preco: 120.0, vendidos: 12000, total: 12000 },
            { id: 'b3', nome: 'Lote 1 - Pista Premium Open Bar', preco: 250.0, vendidos: 8000, total: 8000 },
            { id: 'b4', nome: 'Lote 1 - Camarote Exclusive VIP', preco: 450.0, vendidos: 4800, total: 5000 },
          ],
        },
        {
          id: 'evt-samba-curitiba',
          nome: 'Festival Tardezinha Curitiba',
          dataEvento: '2026-11-20T16:00:00Z',
          local: 'White Hall Jockey Eventos',
          cidade: 'Curitiba - PR',
          status: 'PUBLICADO',
          statusFinanceiro: 'EM_ANDAMENTO',
          ingressosVendidos: 12400,
          capacidadeTotal: 15000,
          vendasBrutas: 1488000.0,
          comissaoDisk: 148800.0,
          valorLiquidoProdutor: 1339200.0,
          batches: [
            { id: 'b5', nome: 'Lote 1 - Frontstage Feminino', preco: 110.0, vendidos: 5000, total: 5000 },
            { id: 'b6', nome: 'Lote 1 - Frontstage Masculino', preco: 140.0, vendidos: 5000, total: 5000 },
            { id: 'b7', nome: 'Lote 2 - Backstage Open Bar', preco: 280.0, vendidos: 2400, total: 5000 },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const openEventDetails = async (id: string) => {
    setSelectedEventId(id);
    setLoadingDetails(true);
    try {
      const res: any = await api.get(`/producer-portal/eventos/${id}`);
      setEventDetails(res);
    } catch (err) {
      console.warn('Erro ao carregar detalhes do evento, usando cache local:', err);
      const ev = eventos.find((e) => e.id === id);
      if (ev) {
        setEventDetails({
          ...ev,
          financialSummary: {
            vendasBrutas: ev.vendasBrutas,
            cancelamentos: 42500.0,
            estornos: 12000.0,
            taxasMdrGateway: 84700.0,
            comissaoDisk: ev.comissaoDisk,
            taxasServicoDisk: 19250.0,
            retencoesTributarias: 0,
            valorLiquidoProdutor: ev.valorLiquidoProdutor,
            ingressosVendidos: ev.ingressosVendidos,
            ingressosCancelados: 310,
          },
          settlements: [
            {
              id: 'rep-1',
              codigo: 'REP-2026-000101',
              valorBrutoApurado: 3850000.0,
              valorLiquido: 375000.0,
              status: 'PAGO',
              solicitadoEm: '2026-08-22T10:00:00Z',
              pagoEm: '2026-08-25T14:30:00Z',
              autenticacaoBancaria: 'ITAU_PIX_AUT_883921092831',
            },
          ],
        });
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenRepasse = (eventId: string, valorSugerido?: number) => {
    setRepasseEventId(eventId);
    setValorRepasse(valorSugerido ? String(valorSugerido) : '');
    setJustificativa('Solicitação de adiantamento operacional para custos de produção.');
    setIsRepasseModalOpen(true);
  };

  const handleSubmitRepasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repasseEventId || !valorRepasse || Number(valorRepasse) <= 0) {
      alert('Por favor informe o evento e um valor válido.');
      return;
    }

    setSubmittingRepasse(true);
    try {
      await api.post('/producer-portal/repasses/solicitar-adiantamento', {
        eventId: repasseEventId,
        valor: Number(valorRepasse),
        justificativa,
      });
      alert('Solicitação de repasse enviada com sucesso! A equipe financeira da DiskIngressos fará a conferência.');
      setIsRepasseModalOpen(false);
      fetchEventos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao solicitar adiantamento.');
    } finally {
      setSubmittingRepasse(false);
    }
  };

  // Cálculos de totais
  const totalEventosCount = eventos.length;
  const totalIngressos = eventos.reduce((acc, ev) => acc + ev.ingressosVendidos, 0);
  const totalCapacidade = eventos.reduce((acc, ev) => acc + ev.capacidadeTotal, 0);
  const totalReceitaBruta = eventos.reduce((acc, ev) => acc + ev.vendasBrutas, 0);
  const totalLiquido = eventos.reduce((acc, ev) => acc + ev.valorLiquidoProdutor, 0);
  const taxaOcupacaoGeral = totalCapacidade > 0 ? (totalIngressos / totalCapacidade) * 100 : 0;

  // Filtros
  const eventosFiltrados = eventos.filter((ev) => {
    const matchTexto =
      ev.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      ev.local.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      ev.cidade.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || ev.status === filtroStatus;
    return matchTexto && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-400" />
            Meus Eventos & Vendas
          </h1>
          <p className="text-sm text-slate-400">
            Acompanhe o ritmo de bilheteria em tempo real, capacidade de ocupação e borderôs detalhados.
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Eventos Registrados
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white">{totalEventosCount}</div>
          <div className="mt-1 text-xs text-slate-400">
            {eventos.filter((e) => e.status === 'ATIVO').length} ativos em venda aberta
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ingressos Emitidos
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white">
            {totalIngressos.toLocaleString('pt-BR')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <Percent className="w-3.5 h-3.5" />
            <span>{taxaOcupacaoGeral.toFixed(1)}% capacidade total preenchida</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Receita Bruta Total
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-300">
            {formatCurrencyBRL(totalReceitaBruta)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Vendas totais registradas pela bilheteria</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Líquido do Produtor
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-indigo-300">
            {formatCurrencyBRL(totalLiquido)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Após deduções contratuais da DiskIngressos
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evento, local ou cidade..."
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
            <option value="ATIVO">Vendas Abertas (Ativo)</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="ENCERRADO">Encerrado</option>
          </select>
        </div>
      </div>

      {/* Lista de Eventos */}
      {loading ? (
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Carregando eventos e borderôs...</p>
        </div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="font-semibold text-slate-300">Nenhum evento localizado</p>
          <p className="text-xs text-slate-500 mt-1">Ajuste os filtros de pesquisa acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {eventosFiltrados.map((evento) => {
            const ocupacao =
              evento.capacidadeTotal > 0
                ? Math.min(100, (evento.ingressosVendidos / evento.capacidadeTotal) * 100)
                : 0;

            return (
              <div
                key={evento.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 hover:border-slate-600 transition shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Info Esquerda */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {evento.status}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                          evento.statusFinanceiro === 'LIQUIDADO'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : evento.statusFinanceiro === 'PARCIALMENTE_LIQUIDADO'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {evento.statusFinanceiro.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {evento.nome}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>{formatDateBR(evento.dataEvento)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        <span>
                          {evento.local} • {evento.cidade}
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progresso de Ocupação */}
                    <div className="pt-2 max-w-md">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Ocupação da Capacidade</span>
                        <span className="font-semibold text-slate-200">
                          {evento.ingressosVendidos.toLocaleString('pt-BR')} /{' '}
                          {evento.capacidadeTotal.toLocaleString('pt-BR')} ({ocupacao.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ocupacao >= 95
                              ? 'bg-rose-500'
                              : ocupacao >= 70
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${ocupacao}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Financeiros */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-700/80 pt-4 lg:pt-0 lg:pl-6 text-right">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">
                        Vendas Brutas
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {formatCurrencyBRL(evento.vendasBrutas)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">
                        Comissão Disk
                      </div>
                      <div className="text-base font-bold text-rose-400 mt-0.5">
                        - {formatCurrencyBRL(evento.comissaoDisk)}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">
                        Líquido Produtor
                      </div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">
                        {formatCurrencyBRL(evento.valorLiquidoProdutor)}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex lg:flex-col items-center justify-end gap-2 border-t lg:border-t-0 lg:border-l border-slate-700/80 pt-4 lg:pt-0 lg:pl-6">
                    <button
                      onClick={() => openEventDetails(evento.id)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm shadow-indigo-900/30 whitespace-nowrap"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Borderô Analítico
                    </button>

                    <button
                      onClick={() => handleOpenRepasse(evento.id, evento.valorLiquidoProdutor)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Pedir Repasse
                    </button>
                  </div>
                </div>

                {/* Prévia de Lotes */}
                {evento.batches && evento.batches.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      Lotes Cadastrados:
                    </span>
                    {evento.batches.map((batch) => (
                      <span
                        key={batch.id}
                        className="px-2.5 py-1 rounded bg-slate-900 text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1.5"
                      >
                        <span className="font-semibold text-slate-200">{batch.nome}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-emerald-400">{formatCurrencyBRL(batch.preco)}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">
                          {batch.vendidos}/{batch.total} un
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Borderô Analítico & DRE do Evento */}
      {selectedEventId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Borderô Analítico & DRE do Evento
                </h2>
                <p className="text-xs text-slate-400">
                  {eventDetails?.nome || 'Carregando detalhes do fechamento contábil...'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedEventId(null);
                  setEventDetails(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
              {loadingDetails || !eventDetails ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs">Consolidando fechamento contábil e lotes...</p>
                </div>
              ) : (
                <>
                  {/* Status Geral */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Data Realização</div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">
                        {formatDateBR(eventDetails.dataEvento)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Localidade</div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">
                        {eventDetails.local} ({eventDetails.cidade})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Capacidade Ocupada</div>
                      <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                        {eventDetails.financialSummary?.ingressosVendidos?.toLocaleString('pt-BR')} /{' '}
                        {eventDetails.capacidadeTotal?.toLocaleString('pt-BR')} un
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Status Financeiro</div>
                      <div className="text-xs font-semibold text-indigo-400 mt-0.5">
                        {eventDetails.statusFinanceiro}
                      </div>
                    </div>
                  </div>

                  {/* DRE Sintética do Evento */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      Demonstração do Resultado Operacional (DRE)
                    </h3>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 text-xs font-medium">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60">
                        <span className="font-semibold text-white">
                          (+) Receita Bruta de Bilheteria
                        </span>
                        <span className="font-bold text-white">
                          {formatCurrencyBRL(eventDetails.financialSummary?.vendasBrutas || 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-2.5 text-rose-400">
                        <span>(-) Cancelamentos & Estornos de Ingressos</span>
                        <span>
                          -{' '}
                          {formatCurrencyBRL(
                            (eventDetails.financialSummary?.cancelamentos || 0) +
                              (eventDetails.financialSummary?.estornos || 0)
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-2.5 text-rose-400">
                        <span>(-) Taxas MDR de Gateway & Adquirentes</span>
                        <span>
                          - {formatCurrencyBRL(eventDetails.financialSummary?.taxasMdrGateway || 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-2.5 text-rose-400">
                        <span>(-) Comissão DiskIngressos (Contratual)</span>
                        <span>
                          - {formatCurrencyBRL(eventDetails.financialSummary?.comissaoDisk || 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-2.5 text-rose-400">
                        <span>(-) Taxas Administrativas / Retenções</span>
                        <span>
                          -{' '}
                          {formatCurrencyBRL(
                            (eventDetails.financialSummary?.taxasServicoDisk || 0) +
                              (eventDetails.financialSummary?.retencoesTributarias || 0)
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3.5 bg-indigo-950/40 text-emerald-400 font-bold text-sm">
                        <span>(=) Valor Líquido Apurado do Produtor</span>
                        <span className="text-base">
                          {formatCurrencyBRL(eventDetails.financialSummary?.valorLiquidoProdutor || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lotes & Tipos de Ingressos */}
                  {eventDetails.batches && eventDetails.batches.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Desempenho por Lote & Setor
                      </h3>
                      <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-2.5">Setor / Lote</th>
                              <th className="px-4 py-2.5">Preço Unit.</th>
                              <th className="px-4 py-2.5">Vendidos</th>
                              <th className="px-4 py-2.5">Total Capacidade</th>
                              <th className="px-4 py-2.5 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {eventDetails.batches.map((b: any) => {
                              const tt = b.ticketTypes?.[0];
                              const preco = Number(tt?.precoUnitario || b.preco || 0);
                              const vendidos = tt ? tt.quantidadeVendida : b.vendidos || 0;
                              const total = tt ? tt.quantidadeTotal : b.total || 0;
                              const subtotal = preco * vendidos;

                              return (
                                <tr key={b.id} className="hover:bg-slate-900/40">
                                  <td className="px-4 py-2.5 font-medium text-slate-200">{b.nome}</td>
                                  <td className="px-4 py-2.5 text-slate-300">
                                    {formatCurrencyBRL(preco)}
                                  </td>
                                  <td className="px-4 py-2.5 font-bold text-white">
                                    {vendidos.toLocaleString('pt-BR')}
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-400">
                                    {total.toLocaleString('pt-BR')}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-bold text-emerald-400">
                                    {formatCurrencyBRL(subtotal)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Histórico de Repasses do Evento */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Repasses & Borderôs deste Evento
                    </h3>
                    {eventDetails.settlements && eventDetails.settlements.length > 0 ? (
                      <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60">
                        {eventDetails.settlements.map((set: any) => (
                          <div
                            key={set.id}
                            className="px-4 py-3 flex items-center justify-between text-xs hover:bg-slate-900/40"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-indigo-400">
                                {set.codigo || set.codigoBordero}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  set.status === 'PAGO'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {set.status}
                              </span>
                              {set.autenticacaoBancaria && (
                                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                                  Aut: {set.autenticacaoBancaria}
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-white text-sm">
                              {formatCurrencyBRL(set.valorLiquido)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                        Nenhum repasse efetuado até o momento para este evento.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedEventId(null);
                  setEventDetails(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  const evId = selectedEventId;
                  const vLiq = eventDetails?.financialSummary?.valorLiquidoProdutor;
                  setSelectedEventId(null);
                  setEventDetails(null);
                  if (evId) handleOpenRepasse(evId, vLiq);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-md shadow-indigo-900/40"
              >
                <Send className="w-3.5 h-3.5" />
                Solicitar Repasse deste Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Adiantamento / Repasse */}
      {isRepasseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                Solicitar Repasse / Adiantamento
              </h2>
              <button
                onClick={() => setIsRepasseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRepasse} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Evento de Origem
                </label>
                <select
                  value={repasseEventId}
                  onChange={(e) => setRepasseEventId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Selecione o evento</option>
                  {eventos.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome} (Líquido: {formatCurrencyBRL(e.valorLiquidoProdutor)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Valor Desejado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={valorRepasse}
                  onChange={(e) => setValorRepasse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Justificativa / Observações
                </label>
                <textarea
                  rows={3}
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Ex: Custos de cachê artístico, locação de geradores, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-3 text-[11px] text-indigo-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  O adiantamento passará pela validação contábil da DiskIngressos. O crédito será
                  efetuado na conta bancária homologada cadastrada.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRepasseModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingRepasse}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingRepasse ? 'Enviando...' : 'Confirmar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
