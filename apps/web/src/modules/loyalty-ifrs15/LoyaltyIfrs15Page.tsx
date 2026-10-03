import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  TrendingDown,
  Clock,
  Sparkles,
  BookOpen,
  PieChart,
  Users,
  CheckCircle,
} from 'lucide-react';
import type {
  LoyaltyProgramConfigDto,
  LoyaltyCustomerBalanceDto,
  LoyaltyContractLiabilityRecordDto,
  LoyaltyDashboardKpisDto,
} from '@diskingressos/types';

export const LoyaltyIfrs15Page: React.FC = () => {
  const [kpis] = useState<LoyaltyDashboardKpisDto>({
    totalPontosCirculantes: 17809000,
    passivoTotalIfrs15Brl: 890450.0,
    taxaBreakageRealizadaPercent: 18.5,
    pontosResgatadosMes: 1400000,
    totalClientesEngajados: 64200,
  });

  const [programs] = useState<LoyaltyProgramConfigDto[]>([
    {
      id: 'loyp-001',
      codigoPrograma: 'FIDELIDADE-DISK-VIP-2026',
      taxaConversaoPontosBrl: 0.05,
      taxaCaducidadeMeses: 12,
      breakageRateEstimadaPercent: 18.5,
      ativo: true,
    },
  ]);

  const [customerBalances] = useState<LoyaltyCustomerBalanceDto[]>([
    {
      id: 'cust-bal-001',
      clienteCpf: '104.***.***-89',
      saldoPontosAtivos: 12500,
      saldoPontosExpirando: 1200,
      valorMonetarioBrl: 625.0,
      atualizadoEm: '2026-03-29T14:20:00Z',
    },
    {
      id: 'cust-bal-002',
      clienteCpf: '451.***.***-12',
      saldoPontosAtivos: 8200,
      saldoPontosExpirando: 400,
      valorMonetarioBrl: 410.0,
      atualizadoEm: '2026-03-30T11:15:00Z',
    },
  ]);

  const [liabilityRecords] = useState<LoyaltyContractLiabilityRecordDto[]>([
    {
      id: 'rec-001',
      mesCompetencia: '2026-03',
      totalPontosEmitidos: 4200000,
      totalPontosResgatados: 1400000,
      passivoObrigacaoIfrs15Brl: 890450.0,
      receitaBreakageReconhecidaBrl: 70000.0,
      contaContabilPassivo: '2.1.04.01.001 - Passivo de Contrato IFRS 15',
      calculadoEm: '2026-03-31T23:59:59Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Hub de Fidelidade, Cashback & Passivo Circulante CPC 47 / IFRS 15
              </h1>
              <p className="text-sm text-slate-400">
                Alocação contábil de receita diferida, estimativa de breakage rate e obrigações de desempenho
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Conformidade IFRS 15
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 43
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Passivo Contratual IFRS 15</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            R$ {kpis.passivoTotalIfrs15Brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Receita diferida para resgates futuros
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Pontos em Circulação</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {kpis.totalPontosCirculantes.toLocaleString('pt-BR')} pts
          </p>
          <span className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
            Valor facial: R$ {(kpis.totalPontosCirculantes * 0.05).toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Taxa Histórica de Breakage</span>
            <TrendingDown className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">{kpis.taxaBreakageRealizadaPercent}%</p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Projeção atuarial de não resgate
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Clientes com Pontos</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {kpis.totalClientesEngajados.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            Base ativa engajada
          </span>
        </div>
      </div>

      {/* Program Config */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Parâmetros Contábeis do Programa de Fidelidade
          </h2>
          <span className="text-xs text-slate-400">Auditoria IFRS 15 / CPC 47</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {programs.map((p) => (
            <React.Fragment key={p.id}>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Código do Programa:</span>
                <p className="font-mono text-sm font-semibold text-cyan-400">{p.codigoPrograma}</p>
                <span className="text-[11px] text-slate-400">Status: {p.ativo ? 'ATIVO' : 'INATIVO'}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Taxa de Conversão:</span>
                <p className="font-mono text-sm font-semibold text-white">1 Ponto = R$ {p.taxaConversaoPontosBrl}</p>
                <span className="text-[11px] text-slate-400">Equivalência contábil</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Breakage Rate Estimada:</span>
                <p className="font-mono text-sm font-semibold text-indigo-300">{p.breakageRateEstimadaPercent}%</p>
                <span className="text-[11px] text-slate-400">Caducidade: {p.taxaCaducidadeMeses} meses</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Obrigação de Desempenho:</span>
                <p className="font-mono text-[11px] font-semibold text-emerald-400">CPC 47 / IFRS 15 § B39</p>
                <span className="text-[10px] text-slate-400">Reconhecimento no resgate</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Grid: Liabilities Closing Record & Customer Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liability Monthly Closing */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Conciliação Mensal do Passivo Contratual
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {liabilityRecords.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Competência: {r.mesCompetencia}</span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(r.calculadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="text-cyan-400">(+) Pontos Emitidos:</div>
                  <div className="font-mono text-right text-cyan-400">+{r.totalPontosEmitidos.toLocaleString('pt-BR')}</div>
                  <div className="text-emerald-400">(-) Pontos Resgatados:</div>
                  <div className="font-mono text-right text-emerald-400">-{r.totalPontosResgatados.toLocaleString('pt-BR')}</div>
                  <div>Receita Breakage Reconhecida:</div>
                  <div className="font-mono text-right text-emerald-400 font-bold">
                    R$ {r.receitaBreakageReconhecidaBrl.toLocaleString('pt-BR')}
                  </div>
                  <div>Conta Contábil:</div>
                  <div className="font-mono text-right text-slate-400 text-[10px]">{r.contaContabilPassivo}</div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-amber-400">Passivo de Obrigação IFRS 15:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    R$ {r.passivoObrigacaoIfrs15Brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Balances */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Saldos Amostrais de Clientes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">CPF Cliente</th>
                  <th className="p-3">Saldo Ativo</th>
                  <th className="p-3">Expirando</th>
                  <th className="p-3">Valor BRL</th>
                  <th className="p-3">Atualização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {customerBalances.map((cb) => (
                  <tr key={cb.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 font-mono text-cyan-400 font-semibold">{cb.clienteCpf}</td>
                    <td className="p-3 font-mono font-bold text-white">
                      {cb.saldoPontosAtivos.toLocaleString('pt-BR')} pts
                    </td>
                    <td className="p-3 font-mono text-rose-300">
                      {cb.saldoPontosExpirando.toLocaleString('pt-BR')} pts
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-medium">
                      R$ {cb.valorMonetarioBrl.toFixed(2)}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(cb.atualizadoEm).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
