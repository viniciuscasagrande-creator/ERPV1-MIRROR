import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Percent,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  Layers,
  HelpCircle,
} from 'lucide-react';
import type {
  TicketInsurancePolicyDto,
  InsuranceClaimRecordDto,
  SusepBrokerageCommissionDto,
  InsuranceDashboardKpisDto,
} from '@diskingressos/types';

export const TicketInsurancePage: React.FC = () => {
  const [kpis] = useState<InsuranceDashboardKpisDto>({
    totalApolicesVigentes: 13950,
    volumePremiosEmitidosBrl: 426000.0,
    receitaCorretagemBrl: 85200.0,
    taxaSinistralidadePercent: 1.85,
    sinistrosLiquidadosMes: 18,
  });

  const [policies] = useState<TicketInsurancePolicyDto[]>([
    {
      id: 'pol-seg-001',
      numeroApoliceSusep: 'SUSEP-APOL-2026-0091823',
      pedidoId: 'ped-ord-99214',
      seguradoNome: 'Juliana Ferreira Mendes',
      seguradoCpf: '104.***.***-89',
      seguradoraParceira: 'Porto Seguro Cia de Seguros Gerais',
      valorPremioTotalBrl: 35.0,
      comissaoCorretagemBrl: 7.0,
      premioLiquidoCiaBrl: 28.0,
      statusApolice: 'VIGENTE_REGULAMENTAR',
      emitidaEm: '2026-03-20T10:00:00Z',
    },
    {
      id: 'pol-seg-002',
      numeroApoliceSusep: 'SUSEP-APOL-2026-0091824',
      pedidoId: 'ped-ord-99218',
      seguradoNome: 'Ricardo Albuquerque Neves',
      seguradoCpf: '451.***.***-12',
      seguradoraParceira: 'Tokio Marine Seguradora S.A.',
      valorPremioTotalBrl: 22.0,
      comissaoCorretagemBrl: 4.4,
      premioLiquidoCiaBrl: 17.6,
      statusApolice: 'VIGENTE_REGULAMENTAR',
      emitidaEm: '2026-03-21T14:30:00Z',
    },
  ]);

  const [claims] = useState<InsuranceClaimRecordDto[]>([
    {
      id: 'clm-001',
      codigoSinistro: 'SIN-SUSEP-2026-0042',
      apoliceId: 'pol-seg-001',
      motivoSinistro: 'EMERGENCIA_MEDICA_HOSPITALAR',
      valorIndenizacaoBrl: 450.0,
      statusSinistro: 'INDENIZADO_PAGO',
      dataAprovacao: '2026-03-29T16:00:00Z',
    },
  ]);

  const [commissions] = useState<SusepBrokerageCommissionDto[]>([
    {
      id: 'com-001',
      codigoLoteComissao: 'COM-LOTE-2026-03',
      mesCompetencia: '2026-03',
      totalApolicesEmitidas: 14200,
      volumePremiosBrl: 426000.0,
      receitaComissaoBrl: 85200.0,
      contaReceitaContabil: '3.1.01.08.001 - Receita Comissões Corretagem Seguros',
      apuradoEm: '2026-03-31T17:00:00Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-xl shadow-lg shadow-rose-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Central de Seguros de Ingressos & Sinistros (SUSEP)
              </h1>
              <p className="text-sm text-slate-400">
                Ticket refund insurance, emissão automática de apólices, sinistralidade e comissões de corretagem
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SUSEP Circular 621/2021
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 45
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Apólices Vigentes</span>
            <FileCheck className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {kpis.totalApolicesVigentes.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-rose-300 flex items-center gap-1 mt-1">
            Coberturas ativas com emissão SUSEP
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Volume de Prêmios Emitidos</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {kpis.volumePremiosEmitidosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Prêmios totais arrecadados no período
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Taxa de Sinistralidade</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{kpis.taxaSinistralidadePercent}%</p>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            Loss ratio saudável (&lt; 5.0%)
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Comissões de Corretagem</span>
            <HeartHandshake className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">
            R$ {kpis.receitaCorretagemBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            {kpis.sinistrosLiquidadosMes} sinistros liquidados
          </span>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            Apólices de Proteção de Ingresso Vigentes
          </h2>
          <span className="text-xs text-slate-400">{policies.length} apólices recentes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Número SUSEP</th>
                <th className="p-3">Seguradora Parceira</th>
                <th className="p-3">Segurado</th>
                <th className="p-3">Prêmio Bruto</th>
                <th className="p-3">Comissão Corretagem</th>
                <th className="p-3">Prêmio Líquido Cia</th>
                <th className="p-3">Emitida Em</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3 font-mono text-cyan-400 font-semibold">{p.numeroApoliceSusep}</td>
                  <td className="p-3 text-white font-medium">{p.seguradoraParceira}</td>
                  <td className="p-3">
                    <div className="text-white font-medium">{p.seguradoNome}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.seguradoCpf}</div>
                  </td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">R$ {p.valorPremioTotalBrl.toFixed(2)}</td>
                  <td className="p-3 font-mono text-purple-400">R$ {p.comissaoCorretagemBrl.toFixed(2)}</td>
                  <td className="p-3 font-mono text-slate-300">R$ {p.premioLiquidoCiaBrl.toFixed(2)}</td>
                  <td className="p-3 text-slate-400">{new Date(p.emitidaEm).toLocaleDateString('pt-BR')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                      {p.statusApolice}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Claims & Brokerage Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Processed */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Sinistros & Indenizações Liquidadas
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {claims.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white font-mono">{c.codigoSinistro}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[10px]">
                    {c.statusSinistro}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Motivo do Sinistro:</div>
                  <div className="font-mono text-right text-rose-300 font-semibold">{c.motivoSinistro}</div>
                  <div>Apólice Vinculada:</div>
                  <div className="font-mono text-right text-slate-300">{c.apoliceId}</div>
                  <div className="font-bold text-emerald-400">Indenização Paga ao Cliente:</div>
                  <div className="font-mono font-bold text-right text-emerald-400">
                    R$ {c.valorIndenizacaoBrl.toFixed(2)}
                  </div>
                  <div>Aprovado Em:</div>
                  <div className="text-right text-slate-400">
                    {new Date(c.dataAprovacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brokerage Commissions */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              Lotes de Comissão de Corretagem
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {commissions.map((com) => (
              <div
                key={com.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{com.codigoLoteComissao}</span>
                  <span className="text-slate-400 text-[11px]">Comp: {com.mesCompetencia}</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Apólices:</span>
                    <span className="font-mono text-white text-[11px]">{com.totalApolicesEmitidas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volume de Prêmios:</span>
                    <span className="font-mono text-cyan-400">
                      R$ {com.volumePremiosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Conta Contábil de Receita:</span>
                    <span className="font-mono text-slate-400 text-[10px]">{com.contaReceitaContabil}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-white">Receita de Comissão:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      R$ {com.receitaComissaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
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
