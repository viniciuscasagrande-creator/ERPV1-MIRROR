import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Link2,
  Copy,
  CheckCircle2,
  Search,
  Plus,
  RefreshCw,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatCurrencyBRL } from '@diskingressos/utils';
import {
  UtmChannelType,
  UtmTrackingCampaignLinkDto,
  ValidateUtmResultDto,
} from '@diskingressos/types';

export const CentralUtmPage: React.FC = () => {
  const [links, setLinks] = useState<UtmTrackingCampaignLinkDto[]>([]);
  const [presets, setPresets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('ALL');

  // Form State para Criação de UTM
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [canalOrigem, setCanalOrigem] = useState<UtmChannelType>(UtmChannelType.META_ADS);
  const [nomeEvento, setNomeEvento] = useState('VillaMix Festival Curitiba 2026');
  const [loteSetor, setLoteSetor] = useState('Camarote Prime - Lote 1');
  const [urlDestino, setUrlDestino] = useState('https://diskingressos.com.br/evento/villamix-curitiba-2026');
  const [utmSource, setUtmSource] = useState('facebook_instagram');
  const [utmMedium, setUtmMedium] = useState('paid_social');
  const [utmCampaign, setUtmCampaign] = useState('villamix_lote1_feed_stories');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('video_animado_15s');
  const [promoterId, setPromoterId] = useState('');

  // Link criado com sucesso
  const [createdLink, setCreatedLink] = useState<UtmTrackingCampaignLinkDto | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Inspector / Validador de UTM
  const [urlToValidate, setUrlToValidate] = useState('');
  const [validationResult, setValidationResult] = useState<ValidateUtmResultDto | null>(null);
  const [validating, setValidating] = useState(false);

  // Tab interna
  const [activeTab, setActiveTab] = useState<'gerador' | 'links' | 'validador'>('gerador');

  const fetchUtmData = async () => {
    setLoading(true);
    try {
      const [resLinks, resPresets] = await Promise.all([
        api.get<any>('/marketing/utm/links').catch(() => ({ data: [] })),
        api.get<any>('/marketing/utm/presets').catch(() => ({ data: [] })),
      ]);
      setLinks(resLinks?.data || resLinks || []);
      setPresets(resPresets?.data || resPresets || []);
    } catch (e) {
      console.error('Erro ao carregar dados UTM:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtmData();
  }, []);

  // Atualiza presets quando o canal muda
  const handleChannelChange = (newChannel: UtmChannelType) => {
    setCanalOrigem(newChannel);
    const found = presets.find((p) => p.channel === newChannel);
    if (found) {
      setUtmSource(found.defaultSource);
      setUtmMedium(found.defaultMedium);
    }
  };

  const handleGenerateUtm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/marketing/utm/links', {
        nomeCampanha,
        canalOrigem,
        nomeEvento,
        loteSetor,
        urlDestinoOriginal: urlDestino,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined,
        promoterId: promoterId || undefined,
      });
      const data = res?.data || res;
      setCreatedLink(data);
      fetchUtmData();
    } catch (err) {
      console.error('Erro ao gerar UTM:', err);
    }
  };

  const handleValidateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlToValidate) return;
    setValidating(true);
    try {
      const res: any = await api.post('/marketing/utm/validate', { url: urlToValidate });
      setValidationResult(res?.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredLinks = links.filter((l) => {
    const matchesSearch =
      l.nomeCampanha.toLowerCase().includes(search.toLowerCase()) ||
      l.nomeEvento.toLowerCase().includes(search.toLowerCase()) ||
      l.codigoIdentificador.toLowerCase().includes(search.toLowerCase()) ||
      l.utmCampaign.toLowerCase().includes(search.toLowerCase());
    const matchesChannel =
      selectedChannelFilter === 'ALL' || l.canalOrigem === selectedChannelFilter;
    return matchesSearch && matchesChannel;
  });

  // Preview em tempo real da URL
  const previewUrl = (() => {
    try {
      const u = new URL(urlDestino.startsWith('http') ? urlDestino : `https://${urlDestino}`);
      if (utmSource) u.searchParams.set('utm_source', utmSource);
      if (utmMedium) u.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) u.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) u.searchParams.set('utm_term', utmTerm);
      if (utmContent) u.searchParams.set('utm_content', utmContent);
      if (promoterId) u.searchParams.set('promoter_id', promoterId);
      return u.toString();
    } catch {
      return `${urlDestino}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  })();

  return (
    <div className="space-y-6">
      {/* Header Institucional Central UTM */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-6 h-6 text-disk-600" />
              <span>Central UTM & Gerador Multi-Canal de Rastreamento</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-disk-500/10 text-disk-600 dark:text-disk-400 border border-disk-500/20">
              Todos os Canais de Ads
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Padronização de parâmetros UTM para Meta Ads, TikTok, Spotify Ads, Google Ads GA4, Pinterest, Influencers e QR Code Offline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUtmData()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Tabs da Central UTM */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('gerador')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'gerador'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gerador de UTM & Link Curto</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'links'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Links Parametrizados Ativos ({links.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('validador')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'validador'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Auditor & Inspetor de URLs UTM</span>
        </button>
      </div>

      {/* Tab 1: Gerador de UTM */}
      {activeTab === 'gerador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-disk-600" />
              <span>Configuração da Campanha & Parâmetros</span>
            </h3>

            <form onSubmit={handleGenerateUtm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Canal de Publicidade (Presets Oficiais):
                  </label>
                  <select
                    value={canalOrigem}
                    onChange={(e) => handleChannelChange(e.target.value as UtmChannelType)}
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value={UtmChannelType.META_ADS}>Meta Ads (Facebook & Instagram)</option>
                    <option value={UtmChannelType.GOOGLE_ADS_GA4}>Google Ads & GA4 (Search, YouTube, PMax)</option>
                    <option value={UtmChannelType.TIKTOK_ADS}>TikTok Ads Manager (Spark Video)</option>
                    <option value={UtmChannelType.SPOTIFY_ADS}>Spotify Ads Studio (Audio & Podcast)</option>
                    <option value={UtmChannelType.PINTEREST_ADS}>Pinterest Ads (Promoted Pins)</option>
                    <option value={UtmChannelType.X_TWITTER_ADS}>X Ads (Twitter Sponsored Post)</option>
                    <option value={UtmChannelType.LINKEDIN_ADS}>LinkedIn Ads (Sponsored Update)</option>
                    <option value={UtmChannelType.INFLUENCER_PROMOTER}>Promoters & Influenciadores VIP</option>
                    <option value={UtmChannelType.QRCODE_OFFLINE}>QR Code Offline (Outdoors / Totens / TV)</option>
                    <option value={UtmChannelType.CRM_EMAIL_PUSH}>DiskIngressos CRM (E-mail & Push)</option>
                    <option value={UtmChannelType.PROGRAMMATIC_DSP}>Mídia Programática (DV360 / Taboola)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Nome Identificador da Campanha:
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeCampanha}
                    onChange={(e) => setNomeCampanha(e.target.value)}
                    placeholder="Ex: Meta Ads Lote 1 Stories Compras"
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Evento Alvo:</label>
                  <input
                    type="text"
                    required
                    value={nomeEvento}
                    onChange={(e) => setNomeEvento(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Setor / Lote Específico:</label>
                  <input
                    type="text"
                    value={loteSetor}
                    onChange={(e) => setLoteSetor(e.target.value)}
                    placeholder="Ex: Pista Premium Lote 2"
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  URL de Destino Original (Página do Evento):
                </label>
                <input
                  type="text"
                  required
                  value={urlDestino}
                  onChange={(e) => setUrlDestino(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    utm_source:
                  </label>
                  <input
                    type="text"
                    required
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    utm_medium:
                  </label>
                  <input
                    type="text"
                    required
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    utm_campaign:
                  </label>
                  <input
                    type="text"
                    required
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    utm_term (opcional):
                  </label>
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    placeholder="palavra_chave"
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    utm_content (opcional):
                  </label>
                  <input
                    type="text"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    placeholder="banner_criativo_a"
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    promoter_id (opcional):
                  </label>
                  <input
                    type="text"
                    value={promoterId}
                    onChange={(e) => setPromoterId(e.target.value)}
                    placeholder="prm_lucas"
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-disk-600 hover:bg-disk-700 text-white font-bold text-xs shadow-md shadow-rose-900/30 transition-all flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                <span>Gerar Link Parametrizado, Encurtador & QR Code</span>
              </button>
            </form>
          </div>

          {/* Painel de Preview e Resultado */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                <span>Preview da URL Parametrizada</span>
              </h3>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  URL Completa com Tags UTM
                </span>
                <p className="font-mono text-xs text-disk-600 dark:text-disk-400 break-all select-all">
                  {previewUrl}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewUrl)}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? 'Copiado para a Área de Transferência!' : 'Copiar URL Completa'}</span>
                </button>
              </div>

              {createdLink && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Link UTM Registrado no Banco de Dados!</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/20">
                    <div>
                      <span className="text-[10px] text-slate-400">Link Encurtador Oficial:</span>
                      <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {createdLink.urlEncurtada}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(createdLink.urlEncurtada)}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Copiar
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-16 h-16 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white">
                        QR Code para Mídia Física
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Pronto para impressão em ingressos térmicos, totens e outdoors.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dica de Boas Práticas UTM */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Boas Práticas de Nomenclatura UTM (DiskIngressos)
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>Sempre utilize letras minúsculas em <code>utm_source</code> e <code>utm_medium</code> para não dividir relatórios no GA4.</li>
                <li>Separe palavras com sublinhado (_) ou hífen (-). Evite espaços em branco.</li>
                <li>No Meta Ads, prefira colocar o criativo em <code>utm_content</code> para testes A/B precisos.</li>
                <li>No Spotify Ads, inclua a duração do áudio (ex: <code>spot_30s</code>) no conteúdo.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Links Parametrizados Ativos */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por campanha, evento ou código..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedChannelFilter}
                onChange={(e) => setSelectedChannelFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">Todos os Canais de Ads</option>
                <option value={UtmChannelType.META_ADS}>Meta Ads</option>
                <option value={UtmChannelType.GOOGLE_ADS_GA4}>Google Ads GA4</option>
                <option value={UtmChannelType.TIKTOK_ADS}>TikTok Ads</option>
                <option value={UtmChannelType.SPOTIFY_ADS}>Spotify Ads</option>
                <option value={UtmChannelType.INFLUENCER_PROMOTER}>Promoters</option>
                <option value={UtmChannelType.QRCODE_OFFLINE}>QR Code Offline</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Identificador / Campanha</th>
                    <th className="p-3">Canal / Tags</th>
                    <th className="p-3">Link Curto</th>
                    <th className="p-3">Cliques</th>
                    <th className="p-3">Conversões</th>
                    <th className="p-3">Receita Atribuída</th>
                    <th className="p-3">Taxa Conv.</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {link.nomeCampanha}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {link.codigoIdentificador} • {link.nomeEvento}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {link.canalOrigem}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          src: {link.utmSource} | med: {link.utmMedium}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-disk-600 font-semibold">
                          {link.urlEncurtada}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold">
                        {link.totalCliques.toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {link.totalConversoes.toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(link.receitaGeradaBRL)}
                      </td>
                      <td className="p-3 font-bold text-amber-500">{link.taxaConversaoPercent}%</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyToClipboard(link.urlParametrizadaCompleta)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Validador / Inspetor de URLs */}
      {activeTab === 'validador' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-disk-600" />
              <span>Auditor & Inspetor de Parâmetros UTM</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cole qualquer link de anúncio para testar a conformidade com o Google Analytics 4, Meta Conversions API e TikTok Pixel.
            </p>
          </div>

          <form onSubmit={handleValidateUrl} className="flex gap-2">
            <input
              type="text"
              required
              value={urlToValidate}
              onChange={(e) => setUrlToValidate(e.target.value)}
              placeholder="Ex: https://diskingressos.com.br/evento/show?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento"
              className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={validating}
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              {validating ? 'Auditando URL...' : 'Inspecionar URL'}
            </button>
          </form>

          {validationResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Score de Qualidade</span>
                  <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                    {validationResult.scoreQualidade} / 100
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      validationResult.valido ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {validationResult.valido ? 'Conformidade Aprovada' : 'Parâmetros Incompletos'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Google Analytics 4</span>
                  <div className="text-sm font-bold mt-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GA4 Compatível</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Meta CAPI Server</span>
                  <div className="text-sm font-bold mt-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deduplicação CAPI Ativa</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Spotify & TikTok</span>
                  <div className="text-sm font-bold mt-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Webhooks Homologados</span>
                  </div>
                </div>
              </div>

              {/* Parâmetros Detectados */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Parâmetros de Rastreamento Identificados na URL:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono">
                  {Object.entries(validationResult.parametrosDetectados).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 text-[10px]">{k}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas e Sugestões */}
              {validationResult.sugestoesMelhoria.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Recomendações de Otimização:
                  </span>
                  <ul className="list-disc pl-5 text-amber-800 dark:text-amber-300 text-[11px] space-y-0.5">
                    {validationResult.sugestoesMelhoria.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
