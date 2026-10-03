import React, { useState } from 'react';
import {
  Music,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Calculator,
  ListMusic,
  Download,
  AlertCircle,
} from 'lucide-react';
import { StatusGuiaEcad } from '@diskingressos/types';
import type {
  EcadTaxCalculationDto,
  EcadMusicalCueSheetDto,
  EcadDashboardKpisDto,
} from '@diskingressos/types';

export const EcadCopyrightPage: React.FC = () => {
  const [kpis] = useState<EcadDashboardKpisDto>({
    totalRetidoEcadMesBrl: 603750.0,
    guiasEcadLiquidadas: 18,
    guiasPendentesPagamento: 2,
    totalObrasCatalogadasCueSheet: 1420,
    passivoTotalAbertoEcadBrl: 363750.0,
  });

  const [activeTab, setActiveTab] = useState<'apuracoes' | 'cuesheet' | 'simulador'>('apuracoes');

  const [apuracoes] = useState<EcadTaxCalculationDto[]>([
    {
      id: 'ecad-001',
      codigoApuracao: 'ECAD-APUR-2026-0042',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      receitaBrutaBaseBrl: 4850000.0,
      aliquotaEcadPercent: 7.5,
      valorEcadDevidoBrl: 363750.0,
      guiaEcadNumero: 'GUIA-ECAD-PR-99214',
      statusGuia: StatusGuiaEcad.RETIDO_FIDUCIARIO,
      contaPassivoEcad: '2.1.4.05 - Obrigações com Direitos Autorais ECAD',
      calculadoEm: '2026-04-01T15:00:00Z',
    },
    {
      id: 'ecad-002',
      codigoApuracao: 'ECAD-APUR-2026-0043',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      receitaBrutaBaseBrl: 3200000.0,
      aliquotaEcadPercent: 7.5,
      valorEcadDevidoBrl: 240000.0,
      guiaEcadNumero: 'GUIA-ECAD-PR-99215',
      statusGuia: StatusGuiaEcad.LIQUIDADO_CONFIRMADO,
      contaPassivoEcad: '2.1.4.05 - Obrigações com Direitos Autorais ECAD',
      calculadoEm: '2026-04-01T15:10:00Z',
    },
  ]);

  const [cueSheets] = useState<EcadMusicalCueSheetDto[]>([
    {
      id: 'cue-001',
      eventoId: 'Festival Rock Curitiba 2026',
      tituloObra: 'Tempo Perdido',
      autorCompositor: 'Renato Russo / Dado Villa-Lobos / Marcelo Bonfá',
      isrcCode: 'BR-RRO-86-00012',
      duracaoSegundos: 302,
    },
    {
      id: 'cue-002',
      eventoId: 'Festival Rock Curitiba 2026',
      tituloObra: 'Primeiros Erros (Chove)',
      autorCompositor: 'Kiko Zambianchi',
      isrcCode: 'BR-WAR-85-00431',
      duracaoSegundos: 245,
    },
    {
      id: 'cue-003',
      eventoId: 'Turnê Sunset Symphonic',
      tituloObra: 'As Quatro Estações - O Verão',
      autorCompositor: 'Antonio Vivaldi (Domínio Público / Arranjo Moderno)',
      isrcCode: 'GB-AYE-08-00192',
      duracaoSegundos: 520,
    },
  ]);

  // Simulador ECAD
  const [receitaSim, setReceitaSim] = useState<number>(1000000);
  const [aliquotaSim, setAliquotaSim] = useState<number>(7.5);

  const valorCalculado = Number(((receitaSim * aliquotaSim) / 100).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">
              FASE 37 • DIREITOS AUTORAIS & ECAD
            </span>
            <span className="text-xs text-slate-500">Lei Federal 9.610/98 (Art. 68)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Central de Gestão & Apuração ECAD / Direitos Autorais
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Retenção fiduciária no borderô, geração de Guias de Arrecadação, catalogação de Cue-Sheets e conformidade legal.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Retido no Mês</span>
            <DollarSign className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.totalRetidoEcadMesBrl / 1000).toFixed(1)}k
          </div>
          <span className="text-xs text-violet-600 font-medium">Retenção no Borderô</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Guias Liquidadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {kpis.guiasEcadLiquidadas}
          </div>
          <span className="text-xs text-emerald-600 font-medium">Repassadas ao ECAD</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Guias Pendentes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {kpis.guiasPendentesPagamento}
          </div>
          <span className="text-xs text-slate-500">Dentro do vencimento</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Obras Catalogadas</span>
            <Music className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.totalObrasCatalogadasCueSheet}
          </div>
          <span className="text-xs text-slate-500">Cue-Sheets ISRC</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Passivo Fiduciário</span>
            <FileText className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">
            R$ {(kpis.passivoTotalAbertoEcadBrl / 1000).toFixed(1)}k
          </div>
          <span className="text-xs text-slate-500">Conta 2.1.4.05</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('apuracoes')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'apuracoes'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Apurações & Guias ECAD
        </button>
        <button
          onClick={() => setActiveTab('cuesheet')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'cuesheet'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          Cue-Sheets Musicais (ISRC)
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'simulador'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Simulador Paramétrico ECAD
        </button>
      </div>

      {/* Tab 1: Apurações */}
      {activeTab === 'apuracoes' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Demonstrativo de Retenção e Liquidação de Direitos Autorais
            </h2>
            <span className="text-xs text-slate-500">Regulamento de Arrecadação ECAD 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-3">Código Apuração</th>
                  <th className="p-3">Base de Receita Bruta</th>
                  <th className="p-3">Alíquota</th>
                  <th className="p-3">Valor ECAD Devido</th>
                  <th className="p-3">Guia Número</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {apuracoes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white font-mono text-xs">
                      {item.codigoApuracao}
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">
                      R$ {item.receitaBrutaBaseBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-violet-600 font-bold">{item.aliquotaEcadPercent}%</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      R$ {item.valorEcadDevidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {item.guiaEcadNumero}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          item.statusGuia === StatusGuiaEcad.LIQUIDADO_CONFIRMADO
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.statusGuia}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-violet-600 hover:underline text-xs font-semibold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        Guia PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Cue-Sheets */}
      {activeTab === 'cuesheet' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Catálogo de Repertório e Obras Executadas (Cue-Sheets)
            </h2>
            <span className="text-xs text-slate-500">Padrão Internacional ISRC / ECAD</span>
          </div>

          <div className="space-y-3">
            {cueSheets.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{c.tituloObra}</div>
                    <div className="text-xs text-slate-500">Autores: {c.autorCompositor}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Evento: {c.eventoId} | ISRC: {c.isrcCode}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {Math.floor(c.duracaoSegundos / 60)}m {c.duracaoSegundos % 60}s
                  </span>
                  <div className="text-[11px] text-emerald-600 font-medium">Validado ECAD</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Simulador */}
      {activeTab === 'simulador' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Simulador Paramétrico de Direitos Autorais ECAD
            </h2>
            <p className="text-xs text-slate-500">
              Calcule previamente o impacto da retenção de 7,5% ou 10% no borderô financeiro do evento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Receita Bruta Prevista de Bilheteria (R$)
                </label>
                <input
                  type="number"
                  value={receitaSim}
                  onChange={(e) => setReceitaSim(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Alíquota Regulamentar ECAD
                </label>
                <select
                  value={aliquotaSim}
                  onChange={(e) => setAliquotaSim(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm font-semibold"
                >
                  <option value={7.5}>7,5% - Show ao Vivo com Ingresso Pago (Padrão)</option>
                  <option value={10.0}>10,0% - Festival de Grande Porte / Multipalco</option>
                  <option value={5.0}>5,0% - Apresentação Teatral / Musical Reduzida</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                A retenção fiduciária é isolada antes do repasse líquido ao produtor, evitando solidariedade passiva.
              </div>
            </div>

            <div className="p-6 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider">
                Valor Total Devido ao ECAD
              </span>
              <div>
                <div className="text-3xl font-extrabold text-violet-900 dark:text-violet-100">
                  R$ {valorCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  Base de Cálculo: R$ {receitaSim.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({aliquotaSim}%)
                </span>
              </div>
              <div className="pt-3 border-t border-violet-200 dark:border-violet-800 text-xs text-slate-600 dark:text-slate-400">
                Conta Contábil de Terceiros: <span className="font-mono font-semibold">2.1.4.05 (Passivo Circulante)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
