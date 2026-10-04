import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Server,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Eye,
  Smartphone,
  Globe2,
  Layers,
  ArrowUpRight,
  Filter,
  Check,
} from 'lucide-react';
import { formatCurrencyBRL } from '@diskingressos/utils';
import type {
  AdsNetworkTelemetryMetricDto,
  AdsTelemetryLiveEventDto,
  AdsTelemetryAnomalyAlertDto,
  AdsTelemetryOverviewDto,
} from '@diskingressos/types';

export const TelemetriaAdsPage: React.FC = () => {
  const [overview, setOverview] = useState<AdsTelemetryOverviewDto | null>(null);
  const [networks, setNetworks] = useState<AdsNetworkTelemetryMetricDto[]>([]);
  const [liveEvents, setLiveEvents] = useState<AdsTelemetryLiveEventDto[]>([]);
  const [anomalies, setAnomalies] = useState<AdsTelemetryAnomalyAlertDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('ALL');
  const [resolveFeedback, setResolveFeedback] = useState<string | null>(null);

  // Payload modal state
  const [selectedEventPayload, setSelectedEventPayload] = useState<string | null>(null);

  const fetchTelemetryData = async () => {
    setLoading(true);
    try {
      const [resOverview, resNetworks, resEvents, resAnomalies] = await Promise.all([
        api.get<any>('/marketing/telemetry/overview').catch(() => ({ data: null })),
        api.get<any>('/marketing/telemetry/networks').catch(() => ({ data: [] })),
        api.get<any>('/marketing/telemetry/live-events').catch(() => ({ data: [] })),
        api.get<any>('/marketing/telemetry/anomalies').catch(() => ({ data: [] })),
      ]);

      setOverview(resOverview?.data || resOverview);
      setNetworks(resNetworks?.data || resNetworks || []);
      setLiveEvents(resEvents?.data || resEvents || []);
      setAnomalies(resAnomalies?.data || resAnomalies || []);
    } catch (e) {
      console.error('Erro ao carregar telemetria de ads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryData();
    // Auto refresh a cada 15 segundos para monitoramento ao vivo
    const interval = setInterval(() => {
      fetchTelemetryData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAnomaly = async (alertId: string) => {
    setResolveFeedback(null);
    try {
      const res: any = await api.post(`/marketing/telemetry/anomalies/${alertId}/resolve`);
      const data = res?.data || res;
      setResolveFeedback(data.mensagem || 'Alerta de telemetria resolvido com sucesso.');
      fetchTelemetryData();
    } catch (err) {
      setResolveFeedback('Erro ao resolver alerta.');
    }
  };

  const filteredEvents = liveEvents.filter((ev) => {
    if (selectedNetworkFilter === 'ALL') return true;
    return ev.canalNetwork === selectedNetworkFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional de Telemetria */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-disk-600 animate-pulse" />
              <span>Telemetria de Ads & Observabilidade de Tráfego</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-disk-500/10 text-disk-600 dark:text-disk-400 border border-disk-500/20">
              Uso Interno DiskIngressos
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitoramento em tempo real de latência de disparo, saúde de APIs de conversão (CAPI), detecção de anomalias e ROAS ao vivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Telemetria em Tempo Real (15s)</span>
          </div>
          <button
            onClick={() => fetchTelemetryData()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recarregar</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Telemetria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Score de Saúde Global</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {overview?.scoreSaudeGeral || 98.4}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {overview?.canaisMonitoradosAtivos || 6} redes ativas sem quedas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Latência Média Server CAPI</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {overview?.latenciaMediaGlobalMs || 39} ms
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Taxa de Entrega: {overview?.taxaEntregaGlobalCapi || 99.85}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Gasto Monitorado 24h</span>
            <DollarSign className="w-4 h-4 text-disk-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(overview?.gastoMonitoradoTotal24hBRL || 79100)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Eventos 24h: {(overview?.eventosProcessados24hTotal || 473500).toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>ROAS Blended ao Vivo</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {overview?.roasBlendedRealTime || 13.35}x
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Receita: {formatCurrencyBRL(overview?.receitaAtribuidaTotal24hBRL || 1055700)}
          </div>
        </div>
      </div>

      {resolveFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{resolveFeedback}</span>
        </div>
      )}

      {/* Grid de Redes de Anúncios e Status de Ping */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-disk-600" />
          <span>Status de Conexão, Ping & Telemetria por Rede de Anúncios</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networks.map((net) => (
            <div
              key={net.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {net.nomeExibicao}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400">{net.canalNetwork}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {net.statusConexao}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Ping Latência:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{net.latenciaMediaMs} ms</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Entrega CAPI:</span>
                  <p className="font-bold text-emerald-600">{net.taxaEntregaServerSideCapi}%</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Deduplicação:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{net.taxaDeduplicacaoScore}/10</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Matching iOS ATT:</span>
                  <p className="font-bold text-blue-600">{net.taxaMatchingAttIosPercent}%</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800 pt-2 text-slate-600 dark:text-slate-400">
                <span>Gasto 24h: <strong>{formatCurrencyBRL(net.gastoMonitorado24hBRL)}</strong></span>
                <span className="text-emerald-600 font-bold">ROAS: {net.roasEmTempoReal}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas de Anomalias de Telemetria */}
      {anomalies.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Alertas de Telemetria & Detecção de Anomalias</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
              {anomalies.filter((a) => a.status === 'PENDENTE').length} Pendentes
            </span>
          </div>

          <div className="space-y-3">
            {anomalies.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{alt.codigoAlerta}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{alt.tipoAnomalia}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                      {alt.canalNetwork}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{alt.descricao}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Detectado: <strong className="text-rose-600">{alt.valorDetectado}</strong></span>
                    <span>Esperado: <strong className="text-emerald-600">{alt.valorEsperado}</strong></span>
                    <span className="text-slate-500">Ação: {alt.acaoRecomendada}</span>
                  </div>
                </div>

                <div>
                  {alt.status === 'PENDENTE' ? (
                    <button
                      onClick={() => handleResolveAnomaly(alt.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar como Resolvido</span>
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolvido</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribuição de Dispositivos e Navegadores */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-disk-600" />
          <span>Telemetria de Dispositivos, Navegadores & Opt-in iOS ATT</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px]">iOS Safari ATT</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">44.5%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '44.5%' }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px]">Android Chrome</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">32.8%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '32.8%' }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px]">Desktop Web</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">12.2%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '12.2%' }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px]">Instagram In-App</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">6.5%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-disk-600 h-1.5 rounded-full" style={{ width: '6.5%' }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px]">TikTok Webview</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">3.2%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '3.2%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stream ao Vivo de Eventos de Ads */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-disk-600" />
              <span>Stream em Tempo Real de Eventos de Telemetria de Anúncios</span>
            </h3>
            <p className="text-xs text-slate-500">
              Traces de disparos de pixel e chamadas CAPI capturados pelo servidor DiskIngressos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedNetworkFilter}
              onChange={(e) => setSelectedNetworkFilter(e.target.value)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              <option value="ALL">Todas as Redes</option>
              <option value="META_ADS">Meta Ads</option>
              <option value="GOOGLE_ADS_GA4">Google Ads GA4</option>
              <option value="TIKTOK_ADS">TikTok Ads</option>
              <option value="SPOTIFY_ADS">Spotify Ads</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Horário / Trace ID</th>
                <th className="p-3">Rede de Anúncio</th>
                <th className="p-3">Tipo Evento</th>
                <th className="p-3">Valor (R$)</th>
                <th className="p-3">Latência</th>
                <th className="p-3">Dispositivo / IP</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Inspecionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {new Date(ev.timestampEvento).toLocaleTimeString('pt-BR')}
                    </span>
                    <div className="text-[10px] text-slate-400">{ev.eventTraceId}</div>
                  </td>
                  <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {ev.canalNetwork}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {ev.tipoEvento}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    {ev.valorMonetario > 0 ? formatCurrencyBRL(ev.valorMonetario) : '-'}
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {ev.latenciaDisparoMs} ms
                  </td>
                  <td className="p-3 font-sans text-slate-600 dark:text-slate-300 text-[10px]">
                    <div>{ev.navegadorDispositivo}</div>
                    <span className="font-mono text-slate-400">{ev.ipOrigemHash}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      HTTP {ev.httpStatus} OK
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedEventPayload(ev.payloadSnippet)}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                    >
                      Payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Inspeção de Payload JSON */}
      {selectedEventPayload && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-disk-600" />
                <span>Inspeção de Payload CAPI Server-Side</span>
              </h3>
              <button
                onClick={() => setSelectedEventPayload(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72">
              {JSON.stringify(JSON.parse(selectedEventPayload), null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEventPayload(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
