import React, { useState } from 'react';
import {
  Globe2,
  DollarSign,
  FileCheck,
  Send,
  Building2,
  ShieldAlert,
  Percent,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import type {
  ArtistRoyaltyAgreementDto,
  InternationalWithholdingTaxDto,
  ForeignRemittanceOrderDto,
  ArtistRoyaltyDashboardKpisDto,
} from '@diskingressos/types';

export const ArtistRoyaltiesPage: React.FC = () => {
  const [kpis] = useState<ArtistRoyaltyDashboardKpisDto>({
    totalContratosInternacionais: 8,
    volumeTotalRemessasUsd: 1450000.0,
    tributosRetidosFonteBrl: 1125000.0,
    remessasSwiftLiquidadas: 14,
    taxaMediaPtaxPraticadaBrl: 5.15,
  });

  const [agreements] = useState<ArtistRoyaltyAgreementDto[]>([
    {
      id: 'roy-001',
      codigoContrato: 'ROY-2026-COLDPLAY-STAD',
      artistaNome: 'Coldplay',
      agenciaInternacional: 'WME Agency LLC',
      paisOrigemIso: 'GBR',
      possuiTratadoDuplaTrib: true,
      moedaContratual: 'USD',
      valorCacheMoedaOrigem: 500000.0,
      statusContrato: 'ATIVO_HOMOLOGADO',
      criadoEm: '2026-03-20T10:00:00Z',
    },
    {
      id: 'roy-002',
      codigoContrato: 'ROY-2026-METALLICA-BR',
      artistaNome: 'Metallica',
      agenciaInternacional: 'Q Prime Inc',
      paisOrigemIso: 'USA',
      possuiTratadoDuplaTrib: false,
      moedaContratual: 'USD',
      valorCacheMoedaOrigem: 750000.0,
      statusContrato: 'ATIVO_HOMOLOGADO',
      criadoEm: '2026-03-21T15:00:00Z',
    },
  ]);

  const [withholdings] = useState<InternationalWithholdingTaxDto[]>([
    {
      id: 'wht-001',
      contratoId: 'roy-001',
      codigoRetencao: 'RET-IRRF-CIDE-2026-01',
      aliquotaIrrfPercent: 15.0,
      valorIrrfRetidoBrl: 386250.0,
      aliquotaCidePercent: 10.0,
      valorCideDevidoBrl: 257500.0,
      darfIrrfNumero: 'DARF-0422-2026-88192',
      darfCideNumero: 'DARF-8741-2026-33910',
      dataCalculo: '2026-03-25T10:00:00Z',
    },
  ]);

  const [remittanceOrders] = useState<ForeignRemittanceOrderDto[]>([
    {
      id: 'rem-001',
      codigoRemessa: 'FX-SWIFT-2026-00441',
      contratoId: 'roy-001',
      bancoCambioIspb: '00000000 - Banco do Brasil S.A.',
      taxaCambioPtaxBrl: 5.15,
      valorLiquidoEnviadoMoeda: 375000.0,
      swiftReference: 'SWIFT-BB-2026-9921490',
      statusRemessa: 'LIQUIDADA_SWIFT',
      dataEfetivacao: '2026-03-27T16:00:00Z',
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Gestão de Royalties & Direitos de Imagem Internacionais
              </h1>
              <p className="text-sm text-slate-400">
                Withholding Tax (IRRF / CIDE), Tratados de Bitributação e Liquidação Cambial SWIFT
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
            Bacen Câmbio & Receita Federal
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
            Fase 42
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Contratos Internacionais</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {kpis.totalContratosInternacionais}
          </p>
          <span className="text-xs text-purple-300 flex items-center gap-1 mt-1">
            Total USD: US$ {kpis.volumeTotalRemessasUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Withholding Retido (IRRF + CIDE)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            R$ {kpis.tributosRetidosFonteBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Apuração automática DARF 0422 / 8741
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Remessas SWIFT Realizadas</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{kpis.remessasSwiftLiquidadas}</p>
          <span className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
            Registros Bacen validados sem pendência
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-medium text-slate-400">Cotação Média PTAX</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            R$ {kpis.taxaMediaPtaxPraticadaBrl.toFixed(2)}
          </p>
          <span className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
            Cotação média de liquidação de contratos
          </span>
        </div>
      </div>

      {/* Agreements Section */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            Contratos de Royalties & Direitos Internacionais
          </h2>
          <span className="text-xs text-slate-400">{agreements.length} contratos ativos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700/60">
              <tr>
                <th className="p-3">Código / Artista</th>
                <th className="p-3">Agência Internacional</th>
                <th className="p-3">País Origem</th>
                <th className="p-3">Cachê Original</th>
                <th className="p-3">Tratado Dupla Trib.</th>
                <th className="p-3">Criado Em</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{a.artistaNome}</div>
                    <div className="text-[11px] text-purple-400 font-mono">{a.codigoContrato}</div>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{a.agenciaInternacional}</td>
                  <td className="p-3 font-mono text-cyan-400">{a.paisOrigemIso}</td>
                  <td className="p-3 font-mono text-slate-300">
                    {a.moedaContratual} {a.valorCacheMoedaOrigem.toLocaleString('en-US')}
                  </td>
                  <td className="p-3">
                    {a.possuiTratadoDuplaTrib ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[11px]">
                        Sim (IRRF 15%)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 font-semibold text-[11px]">
                        Não (IRRF 25%)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-400">{new Date(a.criadoEm).toLocaleDateString('pt-BR')}</td>
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

      {/* Grid: Withholding apuração & SWIFT Remittance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withholding Calculations */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              Apurações de Withholding Tax Tributário
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {withholdings.map((w) => (
              <div
                key={w.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-white font-mono">{w.codigoRetencao}</span>
                  <span className="text-slate-400">Contrato: {w.contratoId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Alíquota IRRF:</div>
                  <div className="font-mono text-right text-amber-400">{w.aliquotaIrrfPercent}%</div>
                  <div>Valor IRRF Retido:</div>
                  <div className="font-mono text-right text-amber-400 font-bold">R$ {w.valorIrrfRetidoBrl.toLocaleString('pt-BR')}</div>
                  <div>Alíquota CIDE:</div>
                  <div className="font-mono text-right text-purple-400">{w.aliquotaCidePercent}%</div>
                  <div>Valor CIDE Devido:</div>
                  <div className="font-mono text-right text-purple-400 font-bold">R$ {w.valorCideDevidoBrl.toLocaleString('pt-BR')}</div>
                  <div>DARF IRRF:</div>
                  <div className="font-mono text-right text-cyan-400">{w.darfIrrfNumero}</div>
                  <div>DARF CIDE:</div>
                  <div className="font-mono text-right text-cyan-400">{w.darfCideNumero}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SWIFT Remittance Orders */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Ordens de Câmbio & Liquidação SWIFT
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {remittanceOrders.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-semibold text-white font-mono">{r.codigoRemessa}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold text-[10px]">
                    {r.statusRemessa}
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Banco Câmbio:</span>
                    <span className="text-white font-medium">{r.bancoCambioIspb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa Câmbio PTAX:</span>
                    <span className="font-mono text-cyan-400">R$ {r.taxaCambioPtaxBrl.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Referência SWIFT:</span>
                    <span className="font-mono text-white text-[11px]">{r.swiftReference}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-white">Valor Líquido Enviado:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    US$ {r.valorLiquidoEnviadoMoeda.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
