import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { GatewayIntegration } from '@diskingressos/types';
import { formatCurrencyBRL } from '@diskingressos/utils';
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Activity,
  Layers,
  Search,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const GatewaysAuditoriaPage: React.FC = () => {
  const [gateways, setGateways] = useState<GatewayIntegration[]>([]);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gatewaysRes, auditRes]: any = await Promise.all([
        api.get('/gateways'),
        api.get('/gateways/auditoria-mdr'),
      ]);
      setGateways(gatewaysRes || []);
      setAudit(auditRes || null);
    } catch (err) {
      console.error('Falha ao carregar dados de gateways:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalVolumeHoje = gateways.reduce((acc, g) => acc + (g.volumeHoje || 0), 0);
  const totalTransacoesHoje = gateways.reduce((acc, g) => acc + (g.totalTransacoesHoje || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-disk-500" />
            Gateways de Pagamento & Auditoria de MDR
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Status das integrações de bilheteria e conferência rigorosa entre taxa contratada vs cobrada
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Métricas
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Volume Processado Hoje</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrencyBRL(totalVolumeHoje)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {totalTransacoesHoje} transações online e POS
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Taxa Média Praticada</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {audit ? `${audit.taxaMediaReal.toFixed(2)}%` : '2.89%'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            MDR ponderado (Crédito, Débito e PIX)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Divergências de Taxa</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {audit ? audit.totalDivergencias : 0} transações
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Com cobrança acima do contrato
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Sobrepreço Total Detectado</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {audit ? formatCurrencyBRL(audit.valorSobreprecoTotal) : 'R$ 0,00'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Passível de contestação junto à adquirente
          </div>
        </div>
      </div>

      {/* Grid de Gateways Integrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gateways.map((g) => (
          <div
            key={g.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {g.codigo}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                  {g.nome}
                </h3>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>MDR Contratado:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {g.taxaMdrPadrao.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>MDR Praticado Médio:</span>
                <span
                  className={`font-semibold ${
                    g.desvioMdr > 0
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {g.taxaPraticadaMedia.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Volume Hoje:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrencyBRL(g.volumeHoje)}
                </span>
              </div>
            </div>

            {g.desvioMdr > 0 && (
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Desvio de +{g.desvioMdr.toFixed(2)}% na taxa
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabela de Auditoria de MDR Transação por Transação */}
      {audit && audit.transacoes && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-disk-500" />
              Auditoria de Taxas Praticadas por Transação de Venda
            </h2>
            <span className="text-xs text-slate-400">
              Conferência automática por pedido
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Pedido / Evento</th>
                  <th className="px-6 py-4">Gateway & Método</th>
                  <th className="px-6 py-4">Ref. Transação</th>
                  <th className="px-6 py-4 text-right">Valor Pago</th>
                  <th className="px-6 py-4 text-right">MDR Cobrado</th>
                  <th className="px-6 py-4 text-right">MDR Contratual</th>
                  <th className="px-6 py-4 text-center">Status Auditoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {audit.transacoes.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">
                        {t.codigoPedido}
                      </p>
                      <p className="text-xs text-slate-400 max-w-[180px] truncate">
                        {t.eventoNome}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {t.gateway}
                      </span>
                      <span className="block text-xs text-slate-400 font-mono">
                        {t.metodo}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {t.transacaoId}
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrencyBRL(t.valorPago)}
                    </td>

                    <td className="px-6 py-4 text-right text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrencyBRL(t.mdrCobradoValor)}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        ({t.mdrCobradoPercent.toFixed(2)}%)
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-xs">
                      <span className="text-slate-600 dark:text-slate-300">
                        {formatCurrencyBRL(t.mdrEsperadoValor)}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        ({t.mdrEsperadoPercent.toFixed(2)}%)
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {t.divergente ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Sobrepreço (+{formatCurrencyBRL(t.diferenca)})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Conforme
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
