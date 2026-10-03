import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  FileText,
  DollarSign,
  Award,
  Lock,
  Globe2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { EfetividadeControleSox } from '@diskingressos/types';
import type {
  SoxInternalControlMatrixDto,
  AuditCommitteeReviewDossierDto,
  IpoDualListingReadinessEvaluationDto,
  SoxIpoDashboardKpisDto,
} from '@diskingressos/types';

export const SoxIpoPage: React.FC = () => {
  const [kpis] = useState<SoxIpoDashboardKpisDto>({
    scoreProntidaoIpoGeralPercent: 99.2,
    controlesSoxAuditadosEficazes: 48,
    totalDeficienciasSignificativas: 0,
    deficienciasMateriaisSox: 0,
    auditoriasBigFourConcluidas: 4,
  });

  const [soxControls] = useState<SoxInternalControlMatrixDto[]>([
    {
      id: 'sox-001',
      codigoControleSox: 'SOX-FIN-01',
      processoNegocio: 'Fechamento Contábil e Partidas Dobradas',
      descricaoControle: 'Validação automática diária de igualdade matemática entre débitos e créditos com tolerância zero centavos',
      frequenciaTeste: 'DIARIA',
      tipoControle: 'AUTOMATIZADO',
      efetividadeTeste: EfetividadeControleSox.EFICAZ_SEM_DEFICIENCIA,
      testadoPor: 'Auditoria Interna / Big Four SOX Team',
      dataUltimoTeste: '2026-04-01T10:00:00Z',
    },
    {
      id: 'sox-002',
      codigoControleSox: 'SOX-REV-02',
      processoNegocio: 'Segregação de Receita de Terceiros e IFRS 15',
      descricaoControle: 'Isolamento estrito entre receita própria de comissão/conveniência e passivo fiduciário de repasse a produtores',
      frequenciaTeste: 'MENSAL',
      tipoControle: 'AUTOMATIZADO',
      efetividadeTeste: EfetividadeControleSox.EFICAZ_SEM_DEFICIENCIA,
      testadoPor: 'Auditoria Interna / Big Four SOX Team',
      dataUltimoTeste: '2026-03-31T18:00:00Z',
    },
  ]);

  const [dossiers] = useState<AuditCommitteeReviewDossierDto[]>([
    {
      id: 'com-dos-001',
      numeroAtaComite: 'ATA-CA-2026-Q1-SOX',
      membrosComitePresentes: 'Dr. Roberto Magalhães (Independente), Dra. Beatriz Fontes (Especialista Contábil), Marcelo Rossi (CFO)',
      relatorioAuditoriaIndependente: 'Opinião sem ressalvas emitida sobre as demonstrações financeiras e controles internos sob padrão PCAOB AS 2201',
      recomendacoesCfo: 'Submissão formal dos pacotes F-1 à SEC e Formulário de Referência à CVM',
      aprovadoParaConselho: true,
      dataReuniao: '2026-04-02T14:00:00Z',
    },
  ]);

  const [readiness] = useState<IpoDualListingReadinessEvaluationDto[]>([
    {
      id: 'ipo-eval-001',
      periodoReferencia: '2026-Q1 (Fases 1 a 50)',
      indiceProntidaoB3Percent: 100.0,
      indiceProntidaoSecNysePercent: 98.5,
      statusFormularioReferenciaCvm: 'HOMOLOGADO_EMPRESASNET',
      statusRegistrationFormF1Sec: 'REGISTRATION_STATEMENT_APPROVED',
      auditorExternoIndependente: 'PwC / Deloitte Independent Audit',
      certificadoEm: '2026-04-02T18:00:00Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Governança SOX 404, PCAOB & IPO Dual-Listing (B3 / NYSE)
              </h1>
              <p className="text-sm text-slate-400">
                Matriz de controles internos Sarbanes-Oxley, Comitê de Auditoria Independente e prontidão para abertura de capital
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PCAOB AS 2201 Compliant
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 50 (Golden Release)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Prontidão IPO Geral</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{kpis.scoreProntidaoIpoGeralPercent}%</p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            B3 Novo Mercado & SEC
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Controles SOX Eficazes</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.controlesSoxAuditadosEficazes}</p>
          <span className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
            Testes automatizados contínuos
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Deficiências Materiais</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{kpis.deficienciasMateriaisSox}</p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            Zero material weaknesses
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Auditorias Big Four</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{kpis.auditoriasBigFourConcluidas}</p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Parecer sem ressalvas
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Dual-Listing SEC/NYSE</span>
            <Globe2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">98.5%</p>
          <span className="text-xs text-indigo-200 flex items-center gap-1 mt-1">
            Formulário F-1 pronto
          </span>
        </div>
      </div>

      {/* SOX Control Matrix Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Matriz de Controles Internos SOX 404
          </h2>
          <span className="text-xs text-slate-400">{soxControls.length} controles testados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Código / Processo</th>
                <th className="p-3">Descrição do Controle</th>
                <th className="p-3">Frequência</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Efetividade do Teste</th>
                <th className="p-3">Data Teste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {soxControls.map((c) => (
                <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white font-mono">{c.codigoControleSox}</div>
                    <div className="text-[11px] text-cyan-400">{c.processoNegocio}</div>
                  </td>
                  <td className="p-3 text-slate-300 max-w-md">{c.descricaoControle}</td>
                  <td className="p-3 font-mono text-slate-400">{c.frequenciaTeste}</td>
                  <td className="p-3 font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {c.tipoControle}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                      {c.efetividadeTeste}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(c.dataUltimoTeste).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Audit Committee & IPO Readiness Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Committee Dossiers */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Pareceres do Comitê de Auditoria Independente
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {dossiers.map((d) => (
              <div
                key={d.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white font-mono">{d.numeroAtaComite}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[10px]">
                    APROVADO CONSELHO
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Membros do Comitê:</span>
                    <span className="text-white">{d.membrosComitePresentes}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Relatório da Auditoria:</span>
                    <span className="text-emerald-400">{d.relatorioAuditoriaIndependente}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recomendações do CFO:</span>
                    <span className="text-slate-300">{d.recomendacoesCfo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IPO & Dual Listing Certification */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              Certificação de Prontidão IPO Dual-Listing
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {readiness.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{r.periodoReferencia}</span>
                  <span className="text-slate-400 text-[11px]">{r.auditorExternoIndependente}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Prontidão B3 Novo Mercado:</div>
                  <div className="font-mono text-right text-emerald-400 font-bold">{r.indiceProntidaoB3Percent}%</div>
                  <div>Prontidão SEC / NYSE (F-1):</div>
                  <div className="font-mono text-right text-indigo-300 font-bold">{r.indiceProntidaoSecNysePercent}%</div>
                  <div>Formulário de Referência CVM:</div>
                  <div className="font-mono text-right text-emerald-400">{r.statusFormularioReferenciaCvm}</div>
                  <div>Registration Statement F-1:</div>
                  <div className="font-mono text-right text-emerald-400">{r.statusRegistrationFormF1Sec}</div>
                  <div>Data da Certificação:</div>
                  <div className="text-right text-slate-400">{new Date(r.certificadoEm).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
