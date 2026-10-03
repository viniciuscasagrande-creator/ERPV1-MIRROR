import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  Truck,
  ShieldCheck,
  CreditCard,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { TipoEquipamentoPos, StatusTurnoCaixa } from '@diskingressos/types';
import type {
  PhysicalPosTerminalDto,
  CashierSessionShiftDto,
  PosCashBleedReconciliationDto,
  PosDashboardKpisDto,
} from '@diskingressos/types';

export const PosCashierPage: React.FC = () => {
  const [kpis] = useState<PosDashboardKpisDto>({
    terminaisAtivosOnline: 34,
    turnosAbertosAgora: 12,
    volumeTotalPdvsHojeBrl: 124500.0,
    sangriasCustodiadasBrl: 38000.0,
    divergenciaCaixasPercent: 0.0,
  });

  const [terminals] = useState<PhysicalPosTerminalDto[]>([
    {
      id: 'term-001',
      codigoTerminalPos: 'PDV-CURITIBA-BATEL-01',
      localizacaoPontoVenda: 'Shopping Pátio Batel - Piso L3',
      tipoEquipamento: TipoEquipamentoPos.TOTEM_AUTOATENDIMENTO,
      numeroSerieHardware: 'POS-NX900-8812903',
      statusTerminal: 'OPERACIONAL_ONLINE',
      ultimoHeartbeat: new Date().toISOString(),
    },
    {
      id: 'term-002',
      codigoTerminalPos: 'PDV-BILHETERIA-STAD-03',
      localizacaoPontoVenda: 'Estádio Couto Pereira - Portão 1',
      tipoEquipamento: TipoEquipamentoPos.BALCAO_TEF_DEDICADO,
      numeroSerieHardware: 'POS-VX520-4491021',
      statusTerminal: 'OPERACIONAL_ONLINE',
      ultimoHeartbeat: new Date().toISOString(),
    },
  ]);

  const [shifts] = useState<CashierSessionShiftDto[]>([
    {
      id: 'shift-001',
      terminalId: 'term-002',
      operadorNome: 'Carlos Silva (Operador Sênior)',
      aberturaTimestamp: '2026-03-31T08:00:00Z',
      fechamentoTimestamp: '2026-03-31T17:00:00Z',
      fundoCaixaInicialBrl: 500.0,
      totalVendasEspecieBrl: 14250.0,
      totalVendasTefCartaoBrl: 61300.0,
      totalVendasPixQrcodeBrl: 18100.0,
      statusTurno: StatusTurnoCaixa.TURNO_FECHADO_AUDITADO,
    },
  ]);

  const [bleeds] = useState<PosCashBleedReconciliationDto[]>([
    {
      id: 'bld-001',
      shiftId: 'shift-001',
      codigoSangria: 'SNG-2026-0331-01',
      valorSangriaEspecieBrl: 12000.0,
      envelopeLacradoNumero: 'LACRE-BRINKS-99412',
      transportadoraValores: 'Brinks Segurança e Transporte de Valores',
      statusConciliacao: 'CREDITADO_EM_CONTA',
      dataSangria: '2026-03-31T15:30:00Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Gestão de PDVs Físicos, Totens & Sangria com Custódia
              </h1>
              <p className="text-sm text-slate-400">
                Fechamento de turnos, sangrias de gaveta, lacres de segurança e custódia por transportadora de valores
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Custódia Brinks / Prosegur
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 44
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Terminais Ativos</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.terminaisAtivosOnline}</p>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            {kpis.turnosAbertosAgora} turnos de operadores abertos
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Volume Total PDVs (Hoje)</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            R$ {kpis.volumeTotalPdvsHojeBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Vendas consolidadas em dinheiro, cartões e Pix
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Sangrias em Custódia</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            R$ {kpis.sangriasCustodiadasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-amber-300 flex items-center gap-1 mt-1">
            Coletas com GTV e envelopes lacrados
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Divergência / Quebra de Caixa</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {kpis.divergenciaCaixasPercent.toFixed(2)}%
          </p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            100% dos turnos perfeitamente batidos
          </span>
        </div>
      </div>

      {/* Physical Terminals Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            Parque de Terminais PDV & Totens Físicos
          </h2>
          <span className="text-xs text-slate-400">{terminals.length} cadastrados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Código Terminal</th>
                <th className="p-3">Localização do Ponto de Venda</th>
                <th className="p-3">Tipo Equipamento</th>
                <th className="p-3">Número de Série</th>
                <th className="p-3">Último Heartbeat</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {terminals.map((t) => (
                <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3 font-mono text-emerald-400 font-semibold">{t.codigoTerminalPos}</td>
                  <td className="p-3 text-slate-300">{t.localizacaoPontoVenda}</td>
                  <td className="p-3 font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {t.tipoEquipamento}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{t.numeroSerieHardware}</td>
                  <td className="p-3 text-slate-400">
                    {new Date(t.ultimoHeartbeat).toLocaleTimeString('pt-BR')}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                      {t.statusTerminal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shifts & Bleed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shifts Table */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Turnos & Fechamento de Caixa
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {shifts.map((s) => (
              <div
                key={s.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-white font-mono">{s.terminalId}</span>
                    <span className="text-slate-400 ml-2">Op: {s.operadorNome}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[10px]">
                    {s.statusTurno}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Fundo de Caixa (Abertura):</div>
                  <div className="font-mono text-right text-white">R$ {s.fundoCaixaInicialBrl.toFixed(2)}</div>
                  <div>Vendas em Dinheiro:</div>
                  <div className="font-mono text-right text-emerald-400">+ R$ {s.totalVendasEspecieBrl.toFixed(2)}</div>
                  <div>Vendas Cartões TEF:</div>
                  <div className="font-mono text-right text-cyan-400">+ R$ {s.totalVendasTefCartaoBrl.toFixed(2)}</div>
                  <div>Vendas Pix QR Code:</div>
                  <div className="font-mono text-right text-purple-400">+ R$ {s.totalVendasPixQrcodeBrl.toFixed(2)}</div>
                  <div className="font-bold text-white">Abertura:</div>
                  <div className="text-right text-slate-400">{new Date(s.aberturaTimestamp).toLocaleTimeString('pt-BR')}</div>
                  <div className="font-bold text-white">Fechamento:</div>
                  <div className="text-right text-slate-400">
                    {s.fechamentoTimestamp ? new Date(s.fechamentoTimestamp).toLocaleTimeString('pt-BR') : 'Aberto'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bleed & Custody */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              Sangrias & Custódia de Transportadora
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {bleeds.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-400 font-mono">{b.codigoSangria}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[10px]">
                    {b.statusConciliacao}
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transportadora:</span>
                    <span className="text-white font-medium">{b.transportadoraValores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Envelope Lacrado:</span>
                    <span className="text-slate-300 font-mono text-cyan-400">{b.envelopeLacradoNumero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valor em Espécie Depositado:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      R$ {b.valorSangriaEspecieBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Sangria:</span>
                    <span className="text-slate-300">{new Date(b.dataSangria).toLocaleDateString('pt-BR')}</span>
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
