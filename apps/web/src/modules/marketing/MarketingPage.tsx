import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Target,
  DollarSign,
  TrendingUp,
  Percent,
  Ticket,
  Share2,
  Send,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  Layers,
  ArrowUpRight,
  Sliders,
  Sparkles,
  Link as LinkIcon,
  Copy,
} from 'lucide-react';
import { formatCurrencyBRL } from '@diskingressos/utils';
import type {
  MarketingCampaignDto,
  MarketingCouponDto,
  MarketingPromoterAffiliateDto,
  MarketingPixelCapiLogDto,
  MarketingOverviewMetricsDto,
} from '@diskingressos/types';

export const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'campanhas' | 'pixel' | 'cupons' | 'promoters' | 'atribuicao'
  >('campanhas');

  const [overview, setOverview] = useState<MarketingOverviewMetricsDto | null>(null);
  const [campaigns, setCampaigns] = useState<MarketingCampaignDto[]>([]);
  const [coupons, setCoupons] = useState<MarketingCouponDto[]>([]);
  const [promoters, setPromoters] = useState<MarketingPromoterAffiliateDto[]>([]);
  const [pixelLogs, setPixelLogs] = useState<MarketingPixelCapiLogDto[]>([]);
  const [attribution, setAttribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Campaign Form Modal State
  const [showNewCampModal, setShowNewCampModal] = useState(false);
  const [campNome, setCampNome] = useState('');
  const [campCanal, setCampCanal] = useState('META_ADS');
  const [campEvento, setCampEvento] = useState('VillaMix Festival Curitiba');
  const [campOrcamento, setCampOrcamento] = useState(15000);
  const [campUtmCampaign, setCampUtmCampaign] = useState('villamix_lote2_instagram');

  // New Coupon Form Modal State
  const [showNewCouponModal, setShowNewCouponModal] = useState(false);
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [cupomDescricao, setCupomDescricao] = useState('');
  const [cupomTipo, setCupomTipo] = useState('PERCENTUAL');
  const [cupomValor, setCupomValor] = useState(15);
  const [cupomLimite, setCupomLimite] = useState(500);

  // Payout toast
  const [payoutFeedback, setPayoutFeedback] = useState<string | null>(null);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const [resOverview, resCamp, resCoup, resProm, resPixel, resAttr] = await Promise.all([
        api.get<any>('/marketing/overview').catch(() => ({ data: null })),
        api.get<any>('/marketing/campaigns').catch(() => ({ data: [] })),
        api.get<any>('/marketing/coupons').catch(() => ({ data: [] })),
        api.get<any>('/marketing/promoters').catch(() => ({ data: [] })),
        api.get<any>('/marketing/pixel-capi-logs').catch(() => ({ data: [] })),
        api.get<any>('/marketing/attribution-models').catch(() => ({ data: [] })),
      ]);

      setOverview(resOverview?.data || resOverview);
      setCampaigns(resCamp?.data || resCamp || []);
      setCoupons(resCoup?.data || resCoup || []);
      setPromoters(resProm?.data || resProm || []);
      setPixelLogs(resPixel?.data || resPixel || []);
      setAttribution(resAttr?.data || resAttr || []);
    } catch (e) {
      console.error('Erro ao carregar módulo de marketing:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/marketing/campaigns', {
        nomeCampanha: campNome,
        canal: campCanal,
        nomeEvento: campEvento,
        orcamentoTotal: campOrcamento,
        utmSource: campCanal === 'META_ADS' ? 'facebook_instagram' : 'google',
        utmMedium: 'paid_traffic',
        utmCampaign: campUtmCampaign,
      });
      setShowNewCampModal(false);
      setCampNome('');
      fetchMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/marketing/coupons', {
        codigoCupom: cupomCodigo,
        descricao: cupomDescricao,
        tipoDesconto: cupomTipo,
        valorDesconto: cupomValor,
        limiteUsosGlobal: cupomLimite,
      });
      setShowNewCouponModal(false);
      setCupomCodigo('');
      setCupomDescricao('');
      fetchMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayPromoter = async (promoterId: string) => {
    setPayoutFeedback(null);
    try {
      const res: any = await api.post(`/marketing/promoters/${promoterId}/pay`);
      const data = res?.data || res;
      setPayoutFeedback(data.mensagem || 'Comissão paga com sucesso via Pix.');
      fetchMarketingData();
    } catch (err) {
      setPayoutFeedback('Erro ao processar liquidação da comissão.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional DiskIngressos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-disk-600" />
              <span>Central de Marketing Digital & Aquisição</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-disk-500/10 text-disk-600 dark:text-disk-400 border border-disk-500/20">
              Growth & Conversions API
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de campanhas multi-canal (Meta, Google, TikTok), pixel server-side CAPI, cupons dinâmicos e rede de promoters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMarketingData()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => setShowNewCampModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Campanha Ads</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Consolidados de Marketing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Investimento em Ads</span>
            <DollarSign className="w-4 h-4 text-disk-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(overview?.totalInvestidoAds || 76900)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Meta, Google Ads & TikTok
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Receita Atribuída</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(overview?.totalReceitaAtribuida || 1055700)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {overview?.totalIngressosVendidos || 7880} ingressos vendidos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>ROAS Médio Consolidado</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {overview?.roasGlobal || 13.73}x
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            CPA Médio: {formatCurrencyBRL(overview?.cpaGlobalMedio || 9.75)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Taxa Sucesso Server CAPI</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {overview?.capiServerSuccessRate || 99.85}%
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Meta CAPI & Google Enhanced
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('campanhas')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'campanhas'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Campanhas Multi-Canal (Ads)</span>
        </button>

        <button
          onClick={() => setActiveTab('pixel')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'pixel'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Pixel & CAPI Server-Side</span>
        </button>

        <button
          onClick={() => setActiveTab('cupons')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'cupons'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Cupons de Desconto</span>
        </button>

        <button
          onClick={() => setActiveTab('promoters')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'promoters'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Promoters & Afiliados</span>
        </button>

        <button
          onClick={() => setActiveTab('atribuicao')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'atribuicao'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Modelos de Atribuição</span>
        </button>
      </div>

      {payoutFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{payoutFeedback}</span>
        </div>
      )}

      {/* Conteúdo Tab 1: Campanhas */}
      {activeTab === 'campanhas' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Campanhas Publicitárias Ativas
              </h3>
              <p className="text-xs text-slate-500">
                Performance em tempo real com rastreamento UTM e conexão com os ad accounts oficiais.
              </p>
            </div>
            <button
              onClick={() => setShowNewCampModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
            >
              + Criar Campanha
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Campanha / Canal</th>
                  <th className="p-3">Evento Alvo</th>
                  <th className="p-3">Investido</th>
                  <th className="p-3">Cliques</th>
                  <th className="p-3">Ingressos</th>
                  <th className="p-3">Receita Gerada</th>
                  <th className="p-3">ROAS</th>
                  <th className="p-3">CPA</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{c.nomeCampanha}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.canal} • UTM: {c.utmCampaign}
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                      {c.nomeEvento}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(c.valorInvestido)}
                    </td>
                    <td className="p-3 font-mono">{c.cliques.toLocaleString('pt-BR')}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {c.ingressosVendidos}
                    </td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(c.receitaGerada)}
                    </td>
                    <td className="p-3 font-bold text-amber-500">{c.roasCalculado}x</td>
                    <td className="p-3 font-mono">{formatCurrencyBRL(c.cpaMedio)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 2: Pixel CAPI */}
      {activeTab === 'pixel' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-disk-600" />
              <span>API de Conversões Server-Side (Meta CAPI & Google Enhanced)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Eventos disparados do servidor para bypass de bloqueadores de anúncios (AdBlockers e Apple iOS 14.5+ ATT).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">Tipo de Evento</th>
                  <th className="p-3">Valor da Compra</th>
                  <th className="p-3">Deduplicação Score</th>
                  <th className="p-3">Hash Payload SHA-256</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {pixelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestampEvento).toLocaleTimeString('pt-BR')}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {log.plataformaDestino}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {log.tipoEvento}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">{formatCurrencyBRL(log.valorTransacao)}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {log.deduplicacaoScore} / 10
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {log.respostaPayloadHash}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {log.statusEnvio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 3: Cupons */}
      {activeTab === 'cupons' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cupons de Desconto & Vouchers Dinâmicos
              </h3>
              <p className="text-xs text-slate-500">
                Gestão de limites de uso global, restrição por CPF e retorno gerado por cupom.
              </p>
            </div>
            <button
              onClick={() => setShowNewCouponModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
            >
              + Criar Novo Cupom
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Código Cupom</th>
                  <th className="p-3">Descrição / Evento</th>
                  <th className="p-3">Desconto Concedido</th>
                  <th className="p-3">Usos / Limite Global</th>
                  <th className="p-3">Desconto Total (R$)</th>
                  <th className="p-3">Receita Gerada (R$)</th>
                  <th className="p-3">Validade</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-disk-600 text-sm">
                      {c.codigoCupom}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{c.descricao}</div>
                      <div className="text-[10px] text-slate-400">{c.nomeEvento || 'Global'}</div>
                    </td>
                    <td className="p-3 font-semibold">
                      {c.tipoDesconto === 'PERCENTUAL'
                        ? `${c.valorDesconto}% OFF`
                        : c.tipoDesconto === 'VALOR_FIXO'
                        ? `R$ ${c.valorDesconto} OFF`
                        : 'TAXA ZERO'}
                    </td>
                    <td className="p-3 font-mono">
                      {c.usosAtuais} / {c.limiteUsosGlobal}
                    </td>
                    <td className="p-3 font-semibold text-rose-600">
                      {formatCurrencyBRL(c.descontoTotalConcedido)}
                    </td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(c.receitaTotalGerada)}
                    </td>
                    <td className="p-3 text-[10px] text-slate-500">
                      {new Date(c.validoAte).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 4: Promoters */}
      {activeTab === 'promoters' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rede de Promoters & Afiliados Comissionados
              </h3>
              <p className="text-xs text-slate-500">
                Links parametrizados por promoter, controle de ingressos comercializados e liquidação instantânea via Pix.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Promoter / Afiliado</th>
                  <th className="p-3">Link Parametrizado</th>
                  <th className="p-3">Regra de Comissão</th>
                  <th className="p-3">Ingressos Vendidos</th>
                  <th className="p-3">Volume Vendido (R$)</th>
                  <th className="p-3">Comissão Acumulada</th>
                  <th className="p-3">Comissão Pendente</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {promoters.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{p.nomePromoter}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.telefoneWhatsapp} • Pix: {p.chavePix}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-disk-600 bg-disk-500/10 px-2 py-0.5 rounded text-[11px]">
                        diskingressos.com.br/?ref={p.slugLink}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">
                      {p.tipoComissao === 'PERCENTUAL'
                        ? `${p.taxaComissao}% da receita`
                        : `R$ ${p.taxaComissao} por ingresso`}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {p.ingressosVendidos}
                    </td>
                    <td className="p-3 font-semibold">{formatCurrencyBRL(p.volumeVendasBRL)}</td>
                    <td className="p-3 font-semibold text-emerald-600">
                      {formatCurrencyBRL(p.comissaoTotalAcumulada)}
                    </td>
                    <td className="p-3 font-bold text-amber-500">
                      {formatCurrencyBRL(p.comissaoPendente)}
                    </td>
                    <td className="p-3">
                      {p.comissaoPendente > 0 ? (
                        <button
                          onClick={() => handlePayPromoter(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                        >
                          Liquidar via Pix
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Liquidado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Tab 5: Modelos de Atribuição */}
      {activeTab === 'atribuicao' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-disk-600" />
              <span>Modelagem de Atribuição Multi-Toque (First vs Last vs Data-Driven IA)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Análise comparativa de contribuição de cada canal na jornada de compra de ingressos.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Canal de Aquisição</th>
                  <th className="p-3">First Click %</th>
                  <th className="p-3">Last Click %</th>
                  <th className="p-3">Linear %</th>
                  <th className="p-3">Data-Driven IA %</th>
                  <th className="p-3">Receita Atribuída (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {attribution.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.canal}</td>
                    <td className="p-3 font-mono">{item.firstClick}%</td>
                    <td className="p-3 font-mono">{item.lastClick}%</td>
                    <td className="p-3 font-mono">{item.linear}%</td>
                    <td className="p-3 font-bold text-disk-600">{item.dataDrivenAi}%</td>
                    <td className="p-3 font-bold text-emerald-600">
                      {formatCurrencyBRL(item.receitaAtribuidaBRL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nova Campanha */}
      {showNewCampModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nova Campanha Multi-Canal
            </h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nome da Campanha:</label>
                <input
                  type="text"
                  required
                  value={campNome}
                  onChange={(e) => setCampNome(e.target.value)}
                  placeholder="Ex: Meta Ads - Lote 2 Festival Rock"
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Canal:</label>
                <select
                  value={campCanal}
                  onChange={(e) => setCampCanal(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="META_ADS">Meta Ads (Facebook & Instagram)</option>
                  <option value="GOOGLE_ADS">Google Ads (Search & Performance Max)</option>
                  <option value="TIKTOK_ADS">TikTok Ads</option>
                  <option value="EMAIL_MARKETING">E-mail Marketing CRM</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Orçamento Previsto (R$):</label>
                <input
                  type="number"
                  required
                  value={campOrcamento}
                  onChange={(e) => setCampOrcamento(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Parâmetro UTM Campaign:</label>
                <input
                  type="text"
                  required
                  value={campUtmCampaign}
                  onChange={(e) => setCampUtmCampaign(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCampModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-bold"
                >
                  Publicar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Cupom */}
      {showNewCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Emitir Novo Cupom Promocional
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Código do Cupom:</label>
                <input
                  type="text"
                  required
                  value={cupomCodigo}
                  onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: PROMO20"
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Descrição:</label>
                <input
                  type="text"
                  required
                  value={cupomDescricao}
                  onChange={(e) => setCupomDescricao(e.target.value)}
                  placeholder="Ex: 20% de Desconto para Clientes VIP"
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tipo Desconto:</label>
                  <select
                    value={cupomTipo}
                    onChange={(e) => setCupomTipo(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="PERCENTUAL">Percentual (%)</option>
                    <option value="VALOR_FIXO">Valor Fixo (R$)</option>
                    <option value="ISENCAO_TAXA">Taxa Zero</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Valor do Desconto:</label>
                  <input
                    type="number"
                    required
                    value={cupomValor}
                    onChange={(e) => setCupomValor(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Limite de Usos Global:</label>
                <input
                  type="number"
                  required
                  value={cupomLimite}
                  onChange={(e) => setCupomLimite(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCouponModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-bold"
                >
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
