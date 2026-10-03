import React, { useState } from 'react';
import {
  Utensils,
  CreditCard,
  QrCode,
  DollarSign,
  Package,
  Layers,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Percent,
} from 'lucide-react';
import { StatusPulseiraCashless } from '@diskingressos/types';
import type {
  CashlessRfidWristbandDto,
  EventFoodBeverageSaleDto,
  SpedInventoryBlockKRecordDto,
  CashlessDashboardKpisDto,
} from '@diskingressos/types';

export const CashlessInventoryPage: React.FC = () => {
  const [kpis] = useState<CashlessDashboardKpisDto>({
    totalPulseirasAtivas: 18450,
    volumeTotalRecargasBrl: 485000.0,
    consumoTotalBaresBrl: 412000.0,
    saldoSobraNaoResgatadoBrl: 73000.0,
    margemBrutaAlimentosBebidasPercent: 65.5,
  });

  const [wristbands] = useState<CashlessRfidWristbandDto[]>([
    {
      id: 'wrb-001',
      tagRfidUid: 'RFID-NFC-99410291',
      eventoId: 'evt-rock-fest-2026',
      saldoAtualBrl: 145.0,
      saldoNaoResgatadoBrl: 25.0,
      taxaAtivacaoPagaBrl: 5.0,
      statusPulseira: StatusPulseiraCashless.ATIVA,
      ultimaCargaEm: new Date().toISOString(),
    },
    {
      id: 'wrb-002',
      tagRfidUid: 'RFID-NFC-88192033',
      eventoId: 'evt-rock-fest-2026',
      saldoAtualBrl: 80.0,
      saldoNaoResgatadoBrl: 15.0,
      taxaAtivacaoPagaBrl: 5.0,
      statusPulseira: StatusPulseiraCashless.ATIVA,
      ultimaCargaEm: new Date().toISOString(),
    },
  ]);

  const [sales] = useState<EventFoodBeverageSaleDto[]>([
    {
      id: 'sale-001',
      pulseiraId: 'wrb-001',
      eventoId: 'evt-rock-fest-2026',
      pontoVendaBar: 'Bar Principal Pista 01',
      itemDescricao: 'Chopp Artesanal IPA 500ml',
      quantidade: 2,
      valorTotalBrl: 40.0,
      custoMercadoriaVendidaBrl: 14.0,
      timestampVenda: new Date().toISOString(),
    },
    {
      id: 'sale-002',
      pulseiraId: 'wrb-002',
      eventoId: 'evt-rock-fest-2026',
      pontoVendaBar: 'Bar Camarote VIP 02',
      itemDescricao: 'Combo Vodka Premium + Energéticos',
      quantidade: 1,
      valorTotalBrl: 180.0,
      custoMercadoriaVendidaBrl: 58.0,
      timestampVenda: new Date().toISOString(),
    },
  ]);

  const [spedRecords] = useState<SpedInventoryBlockKRecordDto[]>([
    {
      id: 'blk-001',
      eventoId: 'evt-rock-fest-2026',
      mesCompetencia: '2026-04',
      codigoItemInsumo: 'INS-CHOPP-IPA-BARRIL-50L',
      quantidadeEstoqueInicial: 100.0,
      quantidadeConsumida: 45.0,
      quantidadeEstoqueFinal: 55.0,
      perdaApuradaQuebra: 0.5,
      dataFechamento: new Date().toISOString(),
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Gestão de A&B, Cashless RFID / NFC & Estoque SPED Bloco K
              </h1>
              <p className="text-sm text-slate-400">
                Pulseiras de consumo pré-pago, reconciliação de CMV, sobras não resgatadas e escrituração fiscal de insumos
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SPED Bloco K Ativo
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 46
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Pulseiras Ativas</span>
            <QrCode className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {kpis.totalPulseirasAtivas.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-orange-300 flex items-center gap-1 mt-1">
            RFID/NFC em operação
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Total Recarregado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {kpis.volumeTotalRecargasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Cargas via Pix, Cartão e Totem
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Consumo em Bares</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            R$ {kpis.consumoTotalBaresBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Vendas faturadas nos PDVs
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Sobras Não Resgatadas</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">
            R$ {kpis.saldoSobraNaoResgatadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-purple-300 flex items-center gap-1 mt-1">
            Receita extraordinária (Breakage)
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Margem Bruta A&B</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {kpis.margemBrutaAlimentosBebidasPercent}%
          </p>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            CMV sob controle contábil
          </span>
        </div>
      </div>

      {/* Main Grid: RFID Wristbands & Bar Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wristbands Table */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-orange-400" />
              Pulseiras Cashless RFID / NFC Cadastradas
            </h2>
            <span className="text-xs text-slate-400">{wristbands.length} ativas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">Tag RFID UID</th>
                  <th className="p-3">Evento</th>
                  <th className="p-3">Saldo Disponível</th>
                  <th className="p-3">Taxa Ativação</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {wristbands.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 font-mono text-cyan-400 font-semibold">{w.tagRfidUid}</td>
                    <td className="p-3 text-slate-300">{w.eventoId}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      R$ {w.saldoAtualBrl.toFixed(2)}
                    </td>
                    <td className="p-3 font-mono text-slate-400">R$ {w.taxaAtivacaoPagaBrl.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                        {w.statusPulseira}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Bar Consumption */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Consumo de Bares em Tempo Real
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">Ponto de Venda / Bar</th>
                  <th className="p-3">Item Consumido</th>
                  <th className="p-3">Qtd</th>
                  <th className="p-3">Total Venda</th>
                  <th className="p-3">CMV Apurado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 font-medium text-white">{s.pontoVendaBar}</td>
                    <td className="p-3 text-slate-300">{s.itemDescricao}</td>
                    <td className="p-3 font-mono text-cyan-400">{s.quantidade}x</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">R$ {s.valorTotalBrl.toFixed(2)}</td>
                    <td className="p-3 font-mono text-rose-300">R$ {s.custoMercadoriaVendidaBrl.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SPED Bloco K Inventory */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            Controle de Estoque & Produção (SPED Fiscal Bloco K)
          </h2>
          <span className="text-xs text-slate-400">Inventário Físico & Quebra Técnica</span>
        </div>
        <div className="p-4 space-y-4">
          {spedRecords.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-white font-mono">{r.codigoItemInsumo}</span>
                <span className="text-slate-400 text-[11px]">Competência: {r.mesCompetencia}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-400 block">Estoque Inicial:</span>
                  <span className="font-mono text-white text-sm">{r.quantidadeEstoqueInicial} un</span>
                </div>
                <div>
                  <span className="text-rose-400 block">Consumido / Vendido:</span>
                  <span className="font-mono text-rose-300 text-sm">-{r.quantidadeConsumida} un</span>
                </div>
                <div>
                  <span className="text-amber-400 block">Quebra Técnica / Perda:</span>
                  <span className="font-mono text-amber-300 text-sm">-{r.perdaApuradaQuebra} un</span>
                </div>
                <div>
                  <span className="text-emerald-400 block">Estoque Final Conciliado:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{r.quantidadeEstoqueFinal} un</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
