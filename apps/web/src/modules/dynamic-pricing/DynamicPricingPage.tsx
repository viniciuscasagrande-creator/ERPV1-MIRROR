import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Cpu,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import { SetorIngressoDynamic, StatusPoliticaDynamic } from '@diskingressos/types';
import type {
  DynamicPricingPolicyDto,
  DynamicTicketBatchPriceDto,
  PriceSurgeAuditLogDto,
  DynamicPricingDashboardKpisDto,
} from '@diskingressos/types';

export const DynamicPricingPage: React.FC = () => {
  const [kpis] = useState<DynamicPricingDashboardKpisDto>({
    totalPoliticasAtivas: 12,
    receitaIncrementalAgioBrl: 485200.0,
    fatorMedioOcupacaoPercent: 78.5,
    disparosSurgePricingHoje: 24,
    ticketMedioDinamicoBrl: 284.0,
  });

  const [policies] = useState<DynamicPricingPolicyDto[]>([
    {
      id: 'pol-001',
      codigoPolitica: 'DYN-FESTIVAL-ROCK-2026',
      eventoId: 'evt-rock-fest-2026',
      setorIngresso: SetorIngressoDynamic.PISTA_PREMIUM,
      precoBaseBrl: 200.0,
      precoPisoMinimoBrl: 160.0,
      precoTetoMaximoBrl: 400.0,
      fatorElasticidadeIa: 1.42,
      statusPolitica: StatusPoliticaDynamic.ATIVA_OPERACIONAL,
      criadoEm: '2026-03-25T10:00:00Z',
    },
    {
      id: 'pol-002',
      codigoPolitica: 'DYN-TEATRO-CLASSICO-2026',
      eventoId: 'evt-orquestra-curitiba',
      setorIngresso: SetorIngressoDynamic.CAMAROTE_OPEN_BAR,
      precoBaseBrl: 450.0,
      precoPisoMinimoBrl: 380.0,
      precoTetoMaximoBrl: 700.0,
      fatorElasticidadeIa: 1.5,
      statusPolitica: StatusPoliticaDynamic.ATIVA_OPERACIONAL,
      criadoEm: '2026-03-26T14:30:00Z',
    },
  ]);

  const [batchPrices] = useState<DynamicTicketBatchPriceDto[]>([
    {
      id: 'batch-001',
      politicaId: 'pol-001',
      loteNumero: 1,
      precoAtualVigenteBrl: 284.0,
      percentualAgio: 42.0,
      ingressosDisponiveis: 120,
      velocidadeVendasMinuto: 34.2,
      atualizadoEm: new Date().toISOString(),
    },
    {
      id: 'batch-002',
      politicaId: 'pol-002',
      loteNumero: 2,
      precoAtualVigenteBrl: 675.0,
      percentualAgio: 50.0,
      ingressosDisponiveis: 45,
      velocidadeVendasMinuto: 18.7,
      atualizadoEm: new Date().toISOString(),
    },
  ]);

  const [auditLogs] = useState<PriceSurgeAuditLogDto[]>([
    {
      id: 'log-001',
      codigoSurgeLog: 'SURGE-2026-0042',
      eventoId: 'evt-rock-fest-2026',
      precoAnteriorBrl: 260.0,
      precoNovoBrl: 284.0,
      motivoGatilhoIa: 'Pico de tráfego orgânico: 1.200 ingressos pesquisados/minuto pós anúncio headliner.',
      autorizadoPor: 'IA_AUTONOMOUS_KERNEL',
      timestampGatilho: new Date().toISOString(),
    },
  ]);

  const [simulatedLote, setSimulatedLote] = useState({
    precoBase: 200,
    ocupacao: 80,
    velocidade: 35,
  });
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSimulate = () => {
    const fatorSurge = 1.0 + (simulatedLote.ocupacao / 100) * 0.5 + (simulatedLote.velocidade > 20 ? 0.15 : 0);
    const precoSugerido = Math.min(simulatedLote.precoBase * fatorSurge, simulatedLote.precoBase * 2.0);
    setSimulationResult({
      fatorCalculado: Number(fatorSurge.toFixed(2)),
      precoFinal: Number(precoSugerido.toFixed(2)),
      incremento: Number((precoSugerido - simulatedLote.precoBase).toFixed(2)),
    });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Motor de Precificação Dinâmica & Yield Management (IA)
              </h1>
              <p className="text-sm text-slate-400">
                Surge pricing preditivo, elasticidade de demanda e teto tarifário regulatório
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Algoritmo Prophet-LSTM Ativo
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 41
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Políticas Ativas</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.totalPoliticasAtivas}</p>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            {kpis.disparosSurgePricingHoje} disparos de surge hoje
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Receita Incremental (Ágio)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {kpis.receitaIncrementalAgioBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Yield incremental acumulado
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Ocupação Média Setor</span>
            <Sliders className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.fatorMedioOcupacaoPercent}%</p>
          <span className="text-xs text-indigo-300 flex items-center gap-1 mt-1">
            Ocupação preditiva balanceada
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Ticket Médio Dinâmico</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {kpis.ticketMedioDinamicoBrl.toFixed(2)}
          </p>
          <span className="text-xs text-amber-300 flex items-center gap-1 mt-1">
            Dentro dos tetos regulatórios
          </span>
        </div>
      </div>

      {/* Main Grid: Policies & Real-time Batch Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Políticas de Precificação (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Policies Table */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Políticas de Precificação Dinâmica Cadastradas
              </h2>
              <span className="text-xs text-slate-400">{policies.length} configuradas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Evento</th>
                    <th className="p-3">Setor</th>
                    <th className="p-3">Preço Base</th>
                    <th className="p-3">Piso / Teto</th>
                    <th className="p-3">Elasticidade IA</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 font-mono text-cyan-400 font-semibold">{p.codigoPolitica}</td>
                      <td className="p-3 text-slate-300">{p.eventoId}</td>
                      <td className="p-3 font-mono text-white">{p.setorIngresso}</td>
                      <td className="p-3 font-mono text-emerald-400">R$ {p.precoBaseBrl.toFixed(2)}</td>
                      <td className="p-3 font-mono text-slate-400">
                        R$ {p.precoPisoMinimoBrl.toFixed(2)} - R$ {p.precoTetoMaximoBrl.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-indigo-300 font-semibold">{p.fatorElasticidadeIa}x</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                          {p.statusPolitica}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Dynamic Batches Table */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Lotes em Tempo Real com Surge Pricing Aplicado
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                  <tr>
                    <th className="p-3">Lote</th>
                    <th className="p-3">Preço Vigente (IA)</th>
                    <th className="p-3">Ágio Aplicado</th>
                    <th className="p-3">Ingressos Restantes</th>
                    <th className="p-3">Velocidade Vendas</th>
                    <th className="p-3">Atualização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {batchPrices.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 font-mono text-cyan-300">Lote #{b.loteNumero}</td>
                      <td className="p-3 font-bold text-emerald-400 text-sm">
                        R$ {b.precoAtualVigenteBrl.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-indigo-300 font-semibold">
                        +{b.percentualAgio}%
                      </td>
                      <td className="p-3 font-mono text-white">{b.ingressosDisponiveis} un</td>
                      <td className="p-3 font-mono text-amber-400">{b.velocidadeVendasMinuto} v/min</td>
                      <td className="p-3 text-slate-400">
                        {new Date(b.atualizadoEm).toLocaleTimeString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Simulator & Audit Trail */}
        <div className="space-y-6">
          {/* IA Simulator */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Simulador Preditivo de Elasticidade
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Preço Base do Lote (R$)</label>
                <input
                  type="number"
                  value={simulatedLote.precoBase}
                  onChange={(e) =>
                    setSimulatedLote({ ...simulatedLote, precoBase: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Ocupação do Setor (%): {simulatedLote.ocupacao}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulatedLote.ocupacao}
                  onChange={(e) =>
                    setSimulatedLote({ ...simulatedLote, ocupacao: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Velocidade de Vendas (ingressos/min)</label>
                <input
                  type="number"
                  value={simulatedLote.velocidade}
                  onChange={(e) =>
                    setSimulatedLote({ ...simulatedLote, velocidade: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleSimulate}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Calcular Surge Pricing IA
              </button>

              {simulationResult && (
                <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-lg space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Fator Multiplicador:</span>
                    <span className="font-bold text-cyan-300">{simulationResult.fatorCalculado}x</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Preço Calculado:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      R$ {simulationResult.precoFinal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Ganho Adicional de Yield:</span>
                    <span className="text-emerald-400 font-semibold">+R$ {simulationResult.incremento.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              Auditoria de Variações de Preço
            </h2>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-cyan-400 text-[11px]">{log.codigoSurgeLog}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(log.timestampGatilho).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>R$ {log.precoAnteriorBrl.toFixed(2)}</span>
                    <span>→</span>
                    <span className="font-bold text-emerald-400">R$ {log.precoNovoBrl.toFixed(2)}</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 text-[10px]">
                      {log.autorizadoPor}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {log.motivoGatilhoIa}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
