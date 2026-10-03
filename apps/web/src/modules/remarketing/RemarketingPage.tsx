import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Repeat,
  RefreshCw,
  Search,
  ShoppingCart,
  MessageSquare,
  Smartphone,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Users,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  ExternalLink,
  Send,
  Sparkles,
} from 'lucide-react';
import { formatCurrencyBRL } from '@diskingressos/utils';
import type {
  AbandonedCartRecoveryDto,
  RfmCustomerSegmentDto,
  RemarketingTriggerAutomationDto,
  RemarketingMetricsDto,
} from '@diskingressos/types';

export const RemarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'carrinhos' | 'rfm' | 'gatilhos' | 'reengajamento'
  >('carrinhos');

  const [overview, setOverview] = useState<RemarketingMetricsDto | null>(null);
  const [carts, setCarts] = useState<AbandonedCartRecoveryDto[]>([]);
  const [rfmSegments, setRfmSegments] = useState<RfmCustomerSegmentDto[]>([]);
  const [triggers, setTriggers] = useState<RemarketingTriggerAutomationDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [search, setSearch] = useState('');

  // Recovery Action Feedback
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchRemarketingData = async () => {
    setLoading(true);
    try {
      const [resOverview, resCarts, resRfm, resTriggers] = await Promise.all([
        api.get<any>('/remarketing/overview').catch(() => ({ data: null })),
        api.get<any>('/remarketing/abandoned-carts').catch(() => ({ data: [] })),
        api.get<any>('/remarketing/rfm-segments').catch(() => ({ data: [] })),
        api.get<any>('/remarketing/triggers').catch(() => ({ data: [] })),
      ]);

      setOverview(resOverview?.data || resOverview);
      setCarts(resCarts?.data || resCarts || []);
      setRfmSegments(resRfm?.data || resRfm || []);
      setTriggers(resTriggers?.data || resTriggers || []);
    } catch (e) {
      console.error('Erro ao carregar módulo de remarketing:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarketingData();
  }, []);

  const handleTriggerRecovery = async (cartId: string, canal: 'WHATSAPP' | 'SMS') => {
    setActionFeedback(null);
    try {
      const res: any = await api.post(`/remarketing/abandoned-carts/${cartId}/recover`, {
        canal,
      });
      const data = res?.data || res;
      setActionFeedback(data.mensagemDisparada || `Gatilho ${canal} disparado com sucesso.`);
      fetchRemarketingData();
    } catch (err) {
      setActionFeedback('Erro ao disparar mensagem de recuperação.');
    }
  };

  const handleSyncAudience = async (plataforma: 'META' | 'GOOGLE', cluster: string) => {
    setActionFeedback(null);
    try {
      const res: any = await api.post('/remarketing/rfm/sync', { plataforma, cluster });
      const data = res?.data || res;
      setActionFeedback(data.mensagem || `Audiência sincronizada com ${plataforma}.`);
    } catch (err) {
      setActionFeedback('Erro ao sincronizar audiência.');
    }
  };

  const handleToggleTrigger = async (triggerId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/remarketing/triggers/${triggerId}`, { ativo: !currentStatus });
      fetchRemarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCarts = carts.filter(
    (c) =>
      c.clienteNome.toLowerCase().includes(search.toLowerCase()) ||
      c.nomeEvento.toLowerCase().includes(search.toLowerCase()) ||
      c.clienteEmail.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Institucional DiskIngressos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Repeat className="w-6 h-6 text-disk-600" />
              <span>Motor de Remarketing & Recuperação de Carrinhos</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Taxa de Conversão 32.1%
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Recuperação inteligente via WhatsApp Cloud API e SMS, segmentação RFM (LTV) e automação de gatilhos pós-abandono.
          </p>
        </div>

        <button
          onClick={() => fetchRemarketingData()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Monitoramento</span>
        </button>
      </div>

      {/* KPI Cards Consolidados de Remarketing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Receita Recuperada</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrencyBRL(overview?.receitaRecuperadaBRL || 284500)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ticket Médio: {formatCurrencyBRL(overview?.ticketMedioRecuperadoBRL || 714.82)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Taxa de Recuperação</span>
            <TrendingUp className="w-4 h-4 text-disk-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {overview?.taxaRecuperacaoGlobalPercent || 32.1}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {overview?.totalCarrinhosRecuperados || 398} pedidos salvos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Carrinhos em Aberto</span>
            <ShoppingCart className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {overview?.carrinhosEmAberto || 3}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Aguardando disparo ou expirando
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Audiências RFM Sincronizadas</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {(overview?.audienciasSincronizadas || 18450).toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Meta Custom & Google Match
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('carrinhos')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'carrinhos'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Carrinhos Abandonados em Tempo Real</span>
        </button>

        <button
          onClick={() => setActiveTab('rfm')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'rfm'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Segmentação RFM (LTV & Clusters)</span>
        </button>

        <button
          onClick={() => setActiveTab('gatilhos')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'gatilhos'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Gatilhos & Automação Webhook</span>
        </button>

        <button
          onClick={() => setActiveTab('reengajamento')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'reengajamento'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reengajamento Pós-Evento</span>
        </button>
      </div>

      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Conteúdo Tab 1: Carrinhos Abandonados */}
      {activeTab === 'carrinhos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por comprador, evento ou e-mail..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sessões de Compra Interrompidas
                </h3>
                <p className="text-xs text-slate-500">
                  Carrinhos com assentos bloqueados aguardando recuperação com link direto para retomada do checkout.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Comprador</th>
                    <th className="p-3">Evento & Setor</th>
                    <th className="p-3">Valor Total</th>
                    <th className="p-3">Estágio do Abandono</th>
                    <th className="p-3">Status Recuperação</th>
                    <th className="p-3">Cupom Sugerido</th>
                    <th className="p-3 text-right">Ação Imediata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {cart.clienteNome}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cart.clienteTelefone} • {cart.clienteEmail}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {cart.nomeEvento}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {cart.quantidadeIngressos}x {cart.setorLote}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {formatCurrencyBRL(cart.valorTotal)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {cart.estagioAbandono}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            cart.statusRecuperacao === 'RECUPERADO'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {cart.statusRecuperacao}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-disk-600">
                        {cart.cupomIncentivo || '-'}
                      </td>
                      <td className="p-3 text-right">
                        {cart.statusRecuperacao !== 'RECUPERADO' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTriggerRecovery(cart.id, 'WHATSAPP')}
                              title="Enviar WhatsApp Cloud API"
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] flex items-center gap-1 shadow-sm"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => handleTriggerRecovery(cart.id, 'SMS')}
                              title="Enviar SMS Rápido"
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] flex items-center gap-1 shadow-sm"
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>SMS</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Venda Concluída</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 2: RFM */}
      {activeTab === 'rfm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                Campeões (Champions)
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white">4.280 Clientes</div>
              <p className="text-[11px] text-slate-500">Recência &lt; 30d • LTV &gt; R$ 4.500</p>
              <button
                onClick={() => handleSyncAudience('META', 'CHAMPIONS')}
                className="mt-2 text-[10px] font-bold text-purple-600 dark:text-purple-400 underline"
              >
                Sync Meta Audiences →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Clientes Leais (Loyal)
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white">8.950 Clientes</div>
              <p className="text-[11px] text-slate-500">Frequência &gt; 5 eventos ano</p>
              <button
                onClick={() => handleSyncAudience('GOOGLE', 'LOYAL')}
                className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 underline"
              >
                Sync Google Match →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                Em Risco (At Risk)
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white">3.120 Clientes</div>
              <p className="text-[11px] text-slate-500">Sem comprar há mais de 120 dias</p>
              <button
                onClick={() => handleSyncAudience('META', 'AT_RISK')}
                className="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 underline"
              >
                Ativar Campanha Reativação →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">
                Hibernando (Churn)
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white">2.100 Clientes</div>
              <p className="text-[11px] text-slate-500">Sem comprar há mais de 240 dias</p>
              <button
                onClick={() => handleSyncAudience('META', 'HIBERNATING')}
                className="mt-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 underline"
              >
                Disparo Cupom Volte Com 25% →
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Amostra da Base RFM & Sincronização em Tempo Real
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Cliente / CPF</th>
                    <th className="p-3">Recência</th>
                    <th className="p-3">Frequência</th>
                    <th className="p-3">Valor Total LTV</th>
                    <th className="p-3">Cluster RFM</th>
                    <th className="p-3">Score RFM</th>
                    <th className="p-3">Sync Meta / Google</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {rfmSegments.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {r.clienteNome}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.clienteCpf} • {r.clienteEmail}
                        </div>
                      </td>
                      <td className="p-3 font-semibold">{r.recenciaDias} dias atrás</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {r.frequenciaEventos} eventos
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(r.valorMonetarioTotal)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {r.clusterRfm}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-500">{r.scoreRfmPontuacao} / 10</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600">
                            META SYNC
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">
                            GOOGLE SYNC
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 3: Gatilhos Automáticos */}
      {activeTab === 'gatilhos' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-disk-600" />
              <span>Gatilhos de Automação & Webhooks Pós-Abandono</span>
            </h3>
            <p className="text-xs text-slate-500">
              Regras inteligentes que monitoram desistências de checkout e ativam comunicações automáticas.
            </p>
          </div>

          <div className="space-y-4">
            {triggers.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {t.nomeRegra}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Espera: {t.tempoEsperaMinutos}m • Canal: {t.canalEnvio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    "{t.templateMensagem}"
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-4">
                    <span>Disparos: <strong>{t.totalDisparos}</strong></span>
                    <span>Convertidos: <strong>{t.totalConvertidos}</strong></span>
                    <span className="text-emerald-600 font-bold">
                      Taxa de Conversão: {t.taxaConversaoPercent}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTrigger(t.id, t.ativo)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      t.ativo
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t.ativo ? 'Gatilho Ativo' : 'Pausado'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Tab 4: Reengajamento Pós-Evento */}
      {activeTab === 'reengajamento' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-disk-600" />
              <span>Motor de Cross-Selling & Reengajamento Pós-Evento</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ofertas personalizadas para quem já participou de shows recentes com convite VIP e cupom fidelidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Campanha: Público VillaMix → Próximo Festival Sertanejo
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Público alvo: 14.500 compradores validados no controle de acesso do VillaMix.
                Gatilho: Disparo D+3 após o evento oferecendo lote secreto com 15% OFF.
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 font-bold">Conversão Estimada: 18.5%</span>
                <span className="text-slate-400 font-mono">Status: Agendada</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Campanha: Público Rock Curitiba Stadium → Arena Heavy Metal
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Público alvo: 28.000 fãs de rock com ticket médio acima de R$ 220,00.
                Gatilho: Pré-venda exclusiva de 48 horas antes da abertura geral ao público.
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 font-bold">Conversão Estimada: 24.2%</span>
                <span className="text-slate-400 font-mono">Status: Pronta</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
