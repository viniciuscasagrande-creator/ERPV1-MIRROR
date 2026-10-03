import React, { useState } from 'react';
import {
  Gavel,
  AlertTriangle,
  Scale,
  FileText,
  DollarSign,
  ShieldAlert,
  Percent,
  TrendingDown,
  Building,
} from 'lucide-react';
import { EstagioCobrancaDivida } from '@diskingressos/types';
import type {
  ProducerDebtCollectionDto,
  CreditBureauProtestRecordDto,
  Ifrs9ExpectedCreditLossDto,
  DebtRecoveryDashboardKpisDto,
} from '@diskingressos/types';

export const DebtRecoveryPage: React.FC = () => {
  const [kpis] = useState<DebtRecoveryDashboardKpisDto>({
    carteiraTotalInadimplenteBrl: 179600.0,
    provisaoPecldAcumuladaBrl: 38400.0,
    taxaRecuperacaoCreditoPercent: 62.4,
    titulosEmProtestoCartorio: 3,
    acoesJudiciaisAtivas: 2,
  });

  const [debts] = useState<ProducerDebtCollectionDto[]>([
    {
      id: 'dbt-001',
      produtorId: 'prod-show-sul-ltda',
      codigoDivida: 'DIV-2026-00441',
      valorOriginalDividaBrl: 120000.0,
      saldoDevedorAtualBrl: 128400.0,
      diasEmAtrasoAging: 68,
      estagioCobranca: EstagioCobrancaDivida.NOTIFICACAO_EXTRAJUDICIAL,
      taxaJurosMoraMensalPercent: 1.0,
      criadoEm: '2026-01-20T10:00:00Z',
    },
    {
      id: 'dbt-002',
      produtorId: 'prod-festas-brasil-me',
      codigoDivida: 'DIV-2025-00982',
      valorOriginalDividaBrl: 45000.0,
      saldoDevedorAtualBrl: 51200.0,
      diasEmAtrasoAging: 140,
      estagioCobranca: EstagioCobrancaDivida.PROTESTO_CARTORIO,
      taxaJurosMoraMensalPercent: 1.0,
      criadoEm: '2025-11-10T14:30:00Z',
    },
  ]);

  const [protests] = useState<CreditBureauProtestRecordDto[]>([
    {
      id: 'prt-001',
      dividaId: 'dbt-002',
      cartorioProtestoComarca: '1º Tabelionato de Protestos de Títulos - Curitiba/PR',
      protocoloCertidaoProtesto: 'PROT-PR-2026-00941',
      statusSerasaBoaVista: 'NEGATIVADO_SERASA_EXPERIAN',
      dataNegativacao: '2026-02-15T09:00:00Z',
    },
  ]);

  const [pecldRecords] = useState<Ifrs9ExpectedCreditLossDto[]>([
    {
      id: 'ecl-001',
      competenciaMesAno: '2026-03',
      categoriaAgingCarteira: 'AGING_61_90_DIAS',
      exposicaoAoRiscoBrl: 128400.0,
      probabilidadeInadimplenciaPd: 25.0,
      perdaDadoIncumprimentoLgd: 45.0,
      provisaoPecldCalculadaBrl: 14445.0,
      dataApuracao: '2026-03-31T23:59:59Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-red-500 rounded-xl shadow-lg shadow-rose-500/20">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Cobrança Judicial, Recuperação de Crédito & PECLD (IFRS 9 / CPC 48)
              </h1>
              <p className="text-sm text-slate-400">
                Régua de cobrança de produtores, protesto em cartório, negativação Serasa e perdas de crédito estimadas
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
            IFRS 9 Expected Credit Loss
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 47
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Carteira Inadimplente</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {kpis.carteiraTotalInadimplenteBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-rose-300 flex items-center gap-1 mt-1">
            Total sob cobrança ativa
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Provisão PECLD (IFRS 9)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            R$ {kpis.provisaoPecldAcumuladaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Expected Credit Loss apurado
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Taxa de Recuperação</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {kpis.taxaRecuperacaoCreditoPercent}%
          </p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            Acordos amigáveis e renegociações
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Títulos em Protesto</span>
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">{kpis.titulosEmProtestoCartorio}</p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Tabelionatos de Notas e CRA
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Ações Judiciais</span>
            <Scale className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.acoesJudiciaisAtivas}</p>
          <span className="text-xs text-red-300 flex items-center gap-1 mt-1">
            Execução de título extrajudicial
          </span>
        </div>
      </div>

      {/* Debts Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Gavel className="w-4 h-4 text-rose-400" />
            Títulos de Produtores em Regime de Cobrança
          </h2>
          <span className="text-xs text-slate-400">{debts.length} dívidas ativas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Código Dívida / Produtor</th>
                <th className="p-3">Valor Original</th>
                <th className="p-3">Saldo Atualizado</th>
                <th className="p-3">Aging (Dias Atraso)</th>
                <th className="p-3">Juros de Mora</th>
                <th className="p-3">Estágio de Cobrança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {debts.map((d) => (
                <tr key={d.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{d.produtorId}</div>
                    <div className="text-[11px] text-rose-400 font-mono">{d.codigoDivida}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-400">R$ {d.valorOriginalDividaBrl.toLocaleString('pt-BR')}</td>
                  <td className="p-3 font-mono font-bold text-rose-400">
                    R$ {d.saldoDevedorAtualBrl.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3 font-mono text-amber-400">{d.diasEmAtrasoAging} dias</td>
                  <td className="p-3 font-mono text-slate-300">{d.taxaJurosMoraMensalPercent}% a.m.</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 font-semibold text-[11px]">
                      {d.estagioCobranca}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Protests & IFRS 9 ECL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protests and Bureau Negativations */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              Protestos em Cartório & Birôs de Crédito
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {protests.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white font-mono">{p.protocoloCertidaoProtesto}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 font-semibold text-[10px]">
                    {p.statusSerasaBoaVista}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cartório / Comarca:</span>
                    <span className="text-white font-medium">{p.cartorioProtestoComarca}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Negativação:</span>
                    <span className="text-slate-300">{new Date(p.dataNegativacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IFRS 9 Expected Credit Loss Model */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Provisão Atuarial PECLD (IFRS 9 / CPC 48)
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {pecldRecords.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{r.categoriaAgingCarteira}</span>
                  <span className="text-slate-400">Comp: {r.competenciaMesAno}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Exposição ao Risco (EAD):</div>
                  <div className="font-mono text-right text-white">R$ {r.exposicaoAoRiscoBrl.toLocaleString('pt-BR')}</div>
                  <div>Probabilidade Inadimplência (PD):</div>
                  <div className="font-mono text-right text-amber-400">{r.probabilidadeInadimplenciaPd}%</div>
                  <div>Perda Dado Incumprimento (LGD):</div>
                  <div className="font-mono text-right text-rose-400">{r.perdaDadoIncumprimentoLgd}%</div>
                  <div className="font-bold text-amber-400">Provisão PECLD Reconhecida:</div>
                  <div className="font-mono font-bold text-right text-amber-400">
                    R$ {r.provisaoPecldCalculadaBrl.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
