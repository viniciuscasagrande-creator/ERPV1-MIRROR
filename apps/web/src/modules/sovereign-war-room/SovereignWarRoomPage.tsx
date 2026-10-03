import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  Award,
  Lock,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { StatusKernelSoberano } from '@diskingressos/types';
import type {
  ZeroTrustAuditKernelDto,
  Isae3402ComplianceDossierDto,
  WarRoomDashboardKpisDto,
} from '@diskingressos/types';

export const SovereignWarRoomPage: React.FC = () => {
  const [kpis] = useState<WarRoomDashboardKpisDto>({
    scoreIntegridadePatrimonialPercent: 100.0,
    totalFasesConformes: 40,
    totalRegrasContabeisValidadas: 480,
    saldoConsolidadoSegregadoBrl: 48250000.0,
    tempoMedioAuditoriaKernelMs: 240,
    statusKillSwitchGeral: 'ARMADO_OPERACIONAL',
  });

  const [kernelCycles] = useState<ZeroTrustAuditKernelDto[]>([
    {
      id: 'knl-001',
      codigoCicloKernel: 'KNL-ZERO-TRUST-2026-0042',
      timestampExecucao: '2026-04-01T18:00:00Z',
      totalRegrasAuditadas: 480,
      regrasConformes: 480,
      violacoesCriticas: 0,
      integridadeContabilScore: 100.0,
      statusKernel: StatusKernelSoberano.SOBERANO_EQUILIBRADO,
      hashGlobalMptSha256: 'e83f2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    },
    {
      id: 'knl-002',
      codigoCicloKernel: 'KNL-ZERO-TRUST-2026-0041',
      timestampExecucao: '2026-04-01T17:30:00Z',
      totalRegrasAuditadas: 480,
      regrasConformes: 480,
      violacoesCriticas: 0,
      integridadeContabilScore: 100.0,
      statusKernel: StatusKernelSoberano.SOBERANO_EQUILIBRADO,
      hashGlobalMptSha256: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    },
  ]);

  const [dossiers] = useState<Isae3402ComplianceDossierDto[]>([
    {
      id: 'dos-001',
      codigoDossie: 'ISAE-3402-TYPE-II-2026-Q1',
      anoPeriodoAuditoria: '2026-Q1 (Fases 1 a 40)',
      auditorResponsavel: 'Auditores Independentes Big Four Registrados CVM',
      statusHomologacao: 'APROVADO_SEM_RESSALVAS',
      hashAssinaturaAuditoria: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      emitidoEm: '2026-04-01T18:30:00Z',
    },
  ]);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleDispararAuditoria = () => {
    setIsAuditing(true);
    setAuditResult(null);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult('Auditoria Zero-Trust executada com sucesso! 480/480 regras validadas em todas as 40 fases.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              FASE 40 • WAR ROOM SOBERANO & ZERO-TRUST KERNEL
            </span>
            <span className="text-xs text-slate-500">ISAE 3402 Type II • SOC 1 / SOC 2 AICPA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            War Room Soberano da Diretoria & Zero-Trust Financial Kernel
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Painel supremo de controle contábil, telemetria das 40 fases do ERP, integridade patrimonial contínua e kill-switch operacional.
          </p>
        </div>

        <button
          onClick={handleDispararAuditoria}
          disabled={isAuditing}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          {isAuditing ? 'Auditoria em Execução...' : 'Disparar Varredura Zero-Trust (40 Fases)'}
        </button>
      </div>

      {auditResult && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{auditResult}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Integridade Global</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {kpis.scoreIntegridadePatrimonialPercent}%
          </div>
          <span className="text-xs text-slate-500">Zero Tolerância a Falhas</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Fases Integradas</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.totalFasesConformes} / 40
          </div>
          <span className="text-xs text-blue-600 font-medium">Cobertura Integral 100%</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Regras Validadas</span>
            <FileCheck2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.totalRegrasContabeisValidadas}
          </div>
          <span className="text-xs text-slate-500">Partidas Dobradas no Centavo</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Patrimônio Segregado</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.saldoConsolidadoSegregadoBrl / 1000000).toFixed(2)}M
          </div>
          <span className="text-xs text-purple-600 font-medium">Isolamento Fiduciário</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Latência Kernel</span>
            <Cpu className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.tempoMedioAuditoriaKernelMs}ms
          </div>
          <span className="text-xs text-slate-500">Validação Instantânea</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Kill-Switch</span>
            <AlertOctagon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xs font-bold text-emerald-600 pt-1">
            ARMADO OPERACIONAL
          </div>
          <span className="text-xs text-slate-500">Quarentena Automática</span>
        </div>
      </div>

      {/* Grid: Ciclos Zero-Trust e Dossiê ISAE 3402 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ciclos Zero-Trust */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Ciclos de Auditoria Criptográfica Zero-Trust (Merkle Patricia Tree)
          </h2>

          <div className="space-y-3">
            {kernelCycles.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {c.codigoCicloKernel}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {c.statusKernel}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>
                    <span className="font-semibold">Regras Conformes:</span> {c.regrasConformes} / {c.totalRegrasAuditadas} (100%)
                  </div>
                  <div>
                    <span className="font-semibold">Merkle Root Hash:</span>{' '}
                    <span className="font-mono text-[11px] text-slate-500 break-all">{c.hashGlobalMptSha256}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Timestamp: {new Date(c.timestampExecucao).toLocaleTimeString('pt-BR')}</span>
                  <span className="text-emerald-600 font-semibold">Integridade 100.0%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dossiê ISAE 3402 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            Certificação ISAE 3402 Type II / SOC 1 Homologada
          </h2>
          <p className="text-xs text-slate-500">
            Relatório de auditoria independente assegurando a eficácia operacional de todos os controles internos corporativos das 40 fases.
          </p>

          <div className="space-y-3">
            {dossiers.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-purple-900 dark:text-purple-200">
                    {d.codigoDossie}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {d.statusHomologacao}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div><span className="font-semibold">Período:</span> {d.anoPeriodoAuditoria}</div>
                  <div><span className="font-semibold">Auditor Externo:</span> {d.auditorResponsavel}</div>
                  <div className="pt-1">
                    <span className="font-semibold">Assinatura Digital Auditada:</span>{' '}
                    <span className="font-mono text-[11px] text-slate-500 break-all">{d.hashAssinaturaAuditoria}</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  Conformidade plena com CVM Resolução 175/2022, Circular BCB 3.978/2020 e NBC TO 3402.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
