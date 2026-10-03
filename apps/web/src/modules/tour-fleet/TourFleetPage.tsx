import React, { useState } from 'react';
import {
  Truck,
  Fuel,
  Navigation,
  DollarSign,
  FileText,
  ShieldCheck,
  Percent,
  TrendingDown,
  Layers,
  Clock,
} from 'lucide-react';
import { TipoVeiculoLogistica } from '@diskingressos/types';
import type {
  TourLogisticsVehicleDto,
  FieldExpenseFleetReportDto,
  Ifrs16LeaseVehicleContractDto,
  FleetDashboardKpisDto,
} from '@diskingressos/types';

export const TourFleetPage: React.FC = () => {
  const [kpis] = useState<FleetDashboardKpisDto>({
    veiculosOperacionaisAtivos: 14,
    despesaTotalCombustivelMesBrl: 18450.0,
    despesaTotalPedagiosBrl: 4200.0,
    ativoDireitoDeUsoTotalBrl: 102500.0,
    passivoArrendamentoIfrs16Brl: 102500.0,
  });

  const [vehicles] = useState<TourLogisticsVehicleDto[]>([
    {
      id: 'veh-001',
      placaVeiculo: 'BRA-2E19',
      tipoVeiculo: TipoVeiculoLogistica.VAN_EXECUTIVA,
      identificadorFrota: 'VAN-TRANSFER-01',
      motoristaResponsavel: 'José Ribamar Silva',
      capacidadePassageirosCarga: '15 passageiros',
      statusOperacional: 'EM_ROTA_EVENTO',
    },
    {
      id: 'veh-002',
      placaVeiculo: 'PRC-9941',
      tipoVeiculo: TipoVeiculoLogistica.CARRETA_SOM,
      identificadorFrota: 'CARRETA-RIDER-SP',
      motoristaResponsavel: 'Antônio Fagundes Filho',
      capacidadePassageirosCarga: '28 toneladas de som/luz',
      statusOperacional: 'DISPONIVEL',
    },
  ]);

  const [expenses] = useState<FieldExpenseFleetReportDto[]>([
    {
      id: 'exp-001',
      veiculoId: 'veh-001',
      eventoId: 'evt-rock-fest-2026',
      cartaoCombustivelNumero: 'TICKET-LOG-991204',
      litrosAbastecidos: 75.0,
      valorTotalAbastecimentoBrl: 450.0,
      quilometragemOdometro: 48500,
      pedagioSemPararBrl: 85.0,
      dataDespesa: '2026-03-28T14:00:00Z',
    },
  ]);

  const [leases] = useState<Ifrs16LeaseVehicleContractDto[]>([
    {
      id: 'lse-001',
      veiculoId: 'veh-001',
      empresaLocadora: 'Localiza Fleet S.A.',
      valorAluguelMensalBrl: 4800.0,
      prazoMeses: 24,
      taxaDescontoArrendamento: 11.5,
      ativoDireitoDeUsoBrl: 102500.0,
      passivoArrendamentoBrl: 102500.0,
      dataAssinatura: '2026-01-10T10:00:00Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-blue-500 rounded-xl shadow-lg shadow-sky-500/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Logística de Turnês, Frota & Contratos IFRS 16
              </h1>
              <p className="text-sm text-slate-400">
                Gestão de vans e carretas de rider, cartões de combustível/pedágio e direito de uso/passivo de arrendamento (CPC 06 R2)
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            IFRS 16 / CPC 06 R2
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 49
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Veículos em Operação</span>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.veiculosOperacionaisAtivos}</p>
          <span className="text-xs text-sky-300 flex items-center gap-1 mt-1">
            Vans, carretas e transfers VIP
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Combustível no Mês</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            R$ {kpis.despesaTotalCombustivelMesBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Cartões corporativos rastreados
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Pedágios / Tags</span>
            <Navigation className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            R$ {kpis.despesaTotalPedagiosBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
            Sem Parar / Veloe automatizados
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Ativo Direito de Uso</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {kpis.ativoDireitoDeUsoTotalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            IFRS 16 Ativo Não Circulante
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Passivo Arrendamento</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">
            R$ {kpis.passivoArrendamentoIfrs16Brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Passivo Circulante + Não Circulante
          </span>
        </div>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-400" />
            Frota Operacional de Turnês & Transfers
          </h2>
          <span className="text-xs text-slate-400">{vehicles.length} veículos cadastrados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Placa / Identificador</th>
                <th className="p-3">Tipo Veículo</th>
                <th className="p-3">Motorista Responsável</th>
                <th className="p-3">Capacidade</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{v.identificadorFrota}</div>
                    <div className="text-[11px] text-sky-400 font-mono">{v.placaVeiculo}</div>
                  </td>
                  <td className="p-3 font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {v.tipoVeiculo}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{v.motoristaResponsavel}</td>
                  <td className="p-3 text-slate-400">{v.capacidadePassageirosCarga}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                      {v.statusOperacional}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Expenses & IFRS 16 Leases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400" />
              Despesas de Campo & Cartões Combustível
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white font-mono">{e.cartaoCombustivelNumero}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    R$ {e.valorTotalAbastecimentoBrl.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Litros Abastecidos:</div>
                  <div className="font-mono text-right text-white">{e.litrosAbastecidos} L</div>
                  <div>Odômetro no Registro:</div>
                  <div className="font-mono text-right text-cyan-400">{e.quilometragemOdometro.toLocaleString('pt-BR')} km</div>
                  <div>Pedágio / Tag Sem Parar:</div>
                  <div className="font-mono text-right text-amber-400">R$ {e.pedagioSemPararBrl.toFixed(2)}</div>
                  <div>Data:</div>
                  <div className="text-right text-slate-400">{new Date(e.dataDespesa).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leases IFRS 16 */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Contratos de Locação (IFRS 16 / CPC 06 R2)
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {leases.map((l) => (
              <div
                key={l.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{l.empresaLocadora}</span>
                  <span className="text-slate-400">Prazo: {l.prazoMeses} meses</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Aluguel Mensal:</div>
                  <div className="font-mono text-right text-white">R$ {l.valorAluguelMensalBrl.toFixed(2)}</div>
                  <div>Taxa de Desconto / IBR:</div>
                  <div className="font-mono text-right text-amber-400">{l.taxaDescontoArrendamento}% a.a.</div>
                  <div className="font-bold text-emerald-400">Ativo Direito de Uso:</div>
                  <div className="font-mono font-bold text-right text-emerald-400">
                    R$ {l.ativoDireitoDeUsoBrl.toLocaleString('pt-BR')}
                  </div>
                  <div className="font-bold text-purple-400">Passivo Arrendamento:</div>
                  <div className="font-mono font-bold text-right text-purple-400">
                    R$ {l.passivoArrendamentoBrl.toLocaleString('pt-BR')}
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
