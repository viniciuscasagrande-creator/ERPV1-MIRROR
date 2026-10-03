import React, { useState } from 'react';
import {
  Award,
  RefreshCw,
  FileCheck2,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { TipoContratoPatrocinio } from '@diskingressos/types';
import type {
  SponsorshipNamingAgreementDto,
  BarterTradeExchangeRecordDto,
  SponsorshipRevenueAmortizationDto,
  SponsorshipDashboardKpisDto,
} from '@diskingressos/types';

export const SponsorshipBarterPage: React.FC = () => {
  const [kpis] = useState<SponsorshipDashboardKpisDto>({
    receitaTotalContratadaBrl: 1650000.0,
    receitaDiferidaPassivoBrl: 1250000.0,
    receitaAmortizadaAnoBrl: 400000.0,
    volumePermutasBarterBrl: 85000.0,
    marcasPatrocinadorasAtivas: 2,
  });

  const [agreements] = useState<SponsorshipNamingAgreementDto[]>([
    {
      id: 'spn-001',
      empresaPatrocinadoraNome: 'Ambev S.A. (Budweiser)',
      cnpjPatrocinador: '07.526.557/0001-00',
      eventoOuEspacoNome: 'Arena Disk Festival - Palco Principal',
      tipoContrato: TipoContratoPatrocinio.NAMING_RIGHTS,
      valorTotalContratoBrl: 1200000.0,
      prazoVigenciaMeses: 12,
      statusContrato: 'ATIVO_HOMOLOGADO',
      dataInicioVigencia: '2026-01-01T00:00:00Z',
    },
    {
      id: 'spn-002',
      empresaPatrocinadoraNome: 'Red Bull do Brasil Ltda',
      cnpjPatrocinador: '04.811.233/0001-49',
      eventoOuEspacoNome: 'Camarote Eletrônico Disk Stage',
      tipoContrato: TipoContratoPatrocinio.COTA_MASTER,
      valorTotalContratoBrl: 450000.0,
      prazoVigenciaMeses: 6,
      statusContrato: 'ATIVO_HOMOLOGADO',
      dataInicioVigencia: '2026-02-01T00:00:00Z',
    },
  ]);

  const [barters] = useState<BarterTradeExchangeRecordDto[]>([
    {
      id: 'bar-001',
      acordoPatrocinioId: 'spn-001',
      descricaoItemPermuta: 'Fornecimento de infraestrutura de som line array em troca de ingressos VIP',
      valorEconomicoAvaliadoBrl: 85000.0,
      numeroNotaFiscalEntrada: 'NF-E-99412',
      numeroNotaFiscalSaida: 'NF-S-10492',
      dataEfetivacao: '2026-03-15T10:00:00Z',
    },
  ]);

  const [amortizations] = useState<SponsorshipRevenueAmortizationDto[]>([
    {
      id: 'amt-001',
      acordoPatrocinioId: 'spn-001',
      mesCompetencia: '2026-03',
      receitaDiferidaInicialBrl: 1000000.0,
      amortizacaoCompetenciaBrl: 100000.0,
      saldoReceitaDiferidaFinalBrl: 900000.0,
      contaContabilCredito: '3.1.1.10 - Receitas de Patrocínios e Naming Rights',
      apuradoEm: '2026-03-31T23:59:59Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-xl shadow-lg shadow-yellow-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Patrocínios Corporativos, Naming Rights & Permutas (IFRS 15)
              </h1>
              <p className="text-sm text-slate-400">
                Amortização de receita diferida por competência, contratos de naming rights e barter trade com notas fiscais
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            NBC TG 47 / IFRS 15
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 48
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Receita Total Contratada</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {kpis.receitaTotalContratadaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-amber-300 flex items-center gap-1 mt-1">
            {kpis.marcasPatrocinadorasAtivas} marcas em portfólio
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Receita Diferida (Passivo)</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 mt-2">
            R$ {kpis.receitaDiferidaPassivoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            A amortizar por competência
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Amortizado no Exercício</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {kpis.receitaAmortizadaAnoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            Reconhecido na DRE
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Permutas / Barter</span>
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            R$ {kpis.volumePermutasBarterBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
            Compensação fiscal validada
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Marcas Ativas</span>
            <Building2 className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
            {kpis.marcasPatrocinadorasAtivas}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Ambev, Red Bull, etc.
          </span>
        </div>
      </div>

      {/* Sponsorship Agreements Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Contratos de Patrocínio & Naming Rights
          </h2>
          <span className="text-xs text-slate-400">{agreements.length} contratos vigentes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Patrocinador / CNPJ</th>
                <th className="p-3">Espaço ou Evento</th>
                <th className="p-3">Tipo Contrato</th>
                <th className="p-3">Valor Total</th>
                <th className="p-3">Vigência</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{a.empresaPatrocinadoraNome}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{a.cnpjPatrocinador}</div>
                  </td>
                  <td className="p-3 text-slate-300">{a.eventoOuEspacoNome}</td>
                  <td className="p-3 font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {a.tipoContrato}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    R$ {a.valorTotalContratoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{a.prazoVigenciaMeses} meses</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                      {a.statusContrato}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Barters & Amortizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barters */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              Operações de Permuta Comercial (Barter Trade)
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {barters.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{b.descricaoItemPermuta}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    R$ {b.valorEconomicoAvaliadoBrl.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>NF-e Entrada (Serviço Recebido):</div>
                  <div className="font-mono text-right text-cyan-400">{b.numeroNotaFiscalEntrada}</div>
                  <div>NFS-e Saída (Ingressos Cedidos):</div>
                  <div className="font-mono text-right text-amber-400">{b.numeroNotaFiscalSaida}</div>
                  <div>Data Efetivação:</div>
                  <div className="text-right text-slate-400">{new Date(b.dataEfetivacao).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amortizations */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Amortizações Contábeis por Competência
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {amortizations.map((a) => (
              <div
                key={a.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Competência: {a.mesCompetencia}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{a.acordoPatrocinioId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Receita Diferida Inicial:</div>
                  <div className="font-mono text-right text-white">R$ {a.receitaDiferidaInicialBrl.toLocaleString('pt-BR')}</div>
                  <div className="font-bold text-emerald-400">Amortizado na Competência:</div>
                  <div className="font-mono font-bold text-right text-emerald-400">
                    + R$ {a.amortizacaoCompetenciaBrl.toLocaleString('pt-BR')}
                  </div>
                  <div>Saldo Diferido Final:</div>
                  <div className="font-mono text-right text-slate-300">R$ {a.saldoReceitaDiferidaFinalBrl.toLocaleString('pt-BR')}</div>
                  <div>Conta de Crédito DRE:</div>
                  <div className="font-mono text-right text-slate-400 text-[10px]">{a.contaContabilCredito}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
