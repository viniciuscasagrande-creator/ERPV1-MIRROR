import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Zap,
  Sliders,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  Hash,
  Scale,
  RefreshCw,
  Search,
  Check,
  Percent,
} from 'lucide-react';
import {
  StatusConciliacaoIa,
  CategoriaTarifaBancariaIa,
  StatusTravaEscrowD0,
} from '@diskingressos/types';
import type {
  AiBankReconciliationRunDto,
  BankFeeClassificationDto,
  EscrowSafetyThresholdDto,
  ReconciliationDashboardKpisDto,
  ExecutarCicloConciliacaoIaResponseDto,
} from '@diskingressos/types';

export const AiBankReconciliationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ciclos' | 'tarifas' | 'escrow' | 'novo-ciclo'>('ciclos');

  // KPIs
  const [kpis] = useState<ReconciliationDashboardKpisDto>({
    taxaConciliacaoAutomaticaPercent: 99.88,
    volumeTotalConciliadoMesBrl: 18450000.0,
    tarifasBancariasEconomizadasBrl: 48200.0,
    saldoTotalEscrowProtegidoBrl: 2750000.0,
    totalRepassesD0LiquidadosBrl: 15700000.0,
    tempoMedioProcessamentoCicloMs: 340,
  });

  // Ciclos
  const [ciclos, setCiclos] = useState<AiBankReconciliationRunDto[]>([
    {
      id: 'rec-001',
      codigoCiclo: 'REC-IA-2026-0941',
      bancoIspb: '60701190',
      bancoNome: 'Banco Itaú Unibanco S.A.',
      contaBancariaId: 'cta-itau-principal',
      totalTransacoesProcessadas: 1420,
      transacoesConciliadasAutomaticas: 1418,
      taxaAcuraciaPercent: 99.86,
      volumeTotalConciliadoBrl: 3850000.0,
      divergenciasDetectadas: 2,
      statusExecucao: 'CONCLUIDO_COM_SUCESSO',
      tempoProcessamentoMs: 412,
      hashIntegridadeAuditoria: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      executadoEm: '2026-04-01T10:00:00Z',
    },
    {
      id: 'rec-002',
      codigoCiclo: 'REC-IA-2026-0942',
      bancoIspb: '00360305',
      bancoNome: 'Banco Bradesco S.A.',
      contaBancariaId: 'cta-bradesco-repasse',
      totalTransacoesProcessadas: 850,
      transacoesConciliadasAutomaticas: 850,
      taxaAcuraciaPercent: 100.0,
      volumeTotalConciliadoBrl: 2120000.0,
      divergenciasDetectadas: 0,
      statusExecucao: 'CONCLUIDO_COM_SUCESSO',
      tempoProcessamentoMs: 290,
      hashIntegridadeAuditoria: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
      executadoEm: '2026-04-01T11:00:00Z',
    },
  ]);

  // Tarifas
  const [tarifas] = useState<BankFeeClassificationDto[]>([
    {
      id: 'tar-001',
      codigoTarifa: 'TAR-IA-2026-1182',
      bancoIspb: '60701190',
      descricaoExtratoOriginal: 'TAR LIQ COB PIX D0',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.TARIFA_PIX,
      valorTarifaBrl: 0.85,
      confiancaClassificacaoPercent: 99.4,
      contaContabilDebito: '3.1.2.04 - Despesas Bancárias PIX',
      contaContabilCredito: '1.1.1.02 - Itaú Conta Movimento',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T10:02:15Z',
    },
    {
      id: 'tar-002',
      codigoTarifa: 'TAR-IA-2026-1183',
      bancoIspb: '60701190',
      descricaoExtratoOriginal: 'TAXA MANUT CONTA EMPRESARIAL',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.MANUTENCAO_CONTA,
      valorTarifaBrl: 89.9,
      confiancaClassificacaoPercent: 98.7,
      contaContabilDebito: '3.1.2.01 - Manutenção de Contas',
      contaContabilCredito: '1.1.1.02 - Itaú Conta Movimento',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T10:02:30Z',
    },
    {
      id: 'tar-003',
      codigoTarifa: 'TAR-IA-2026-1184',
      bancoIspb: '00360305',
      descricaoExtratoOriginal: 'RETENCAO CUSTODIA CIP RECEBIVEL',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.CUSTODIA_RECEBIVEIS,
      valorTarifaBrl: 142.5,
      confiancaClassificacaoPercent: 97.9,
      contaContabilDebito: '3.1.2.08 - Custódia e Registradoras CERC/CIP',
      contaContabilCredito: '1.1.1.03 - Bradesco Conta Repasse',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T11:05:00Z',
    },
  ]);

  // Travas Escrow
  const [escrows, setEscrows] = useState<EscrowSafetyThresholdDto[]>([
    {
      id: 'esc-001',
      eventoId: 'evt-rock-arena',
      produtorId: 'Prime Tour Entretenimento S.A.',
      percentualRetencaoEscrow: 15.0,
      saldoEscrowBloqueadoBrl: 727500.0,
      saldoDisponivelLiquidacaoD0Brl: 4122500.0,
      statusLiquidacaoD0: StatusTravaEscrowD0.LIBERADO_SEGURO,
      ultimaAtualizacao: '2026-04-01T12:00:00Z',
    },
    {
      id: 'esc-002',
      eventoId: 'evt-symphonic',
      produtorId: 'Curitiba Shows e Produções Ltda.',
      percentualRetencaoEscrow: 15.0,
      saldoEscrowBloqueadoBrl: 480000.0,
      saldoDisponivelLiquidacaoD0Brl: 2720000.0,
      statusLiquidacaoD0: StatusTravaEscrowD0.LIBERADO_SEGURO,
      ultimaAtualizacao: '2026-04-01T12:00:00Z',
    },
  ]);

  // Form Executar Ciclo
  const [bancoSelecionado, setBancoSelecionado] = useState<'60701190' | '00360305'>('60701190');
  const [toleranciaCentavos, setToleranciaCentavos] = useState<number>(0.05);
  const [cicloResult, setCicloResult] = useState<ExecutarCicloConciliacaoIaResponseDto | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleExecutarCiclo = () => {
    setIsRunning(true);
    setTimeout(() => {
      const codigoCiclo = `REC-IA-2026-094${ciclos.length + 1}`;
      const res: ExecutarCicloConciliacaoIaResponseDto = {
        codigoCiclo,
        totalProcessado: 520,
        totalConciliado: 519,
        taxaSucessoPercent: 99.81,
        volumeConciliadoBrl: 1450000.0,
        tarifasDetectadasQuantidade: 8,
        valorTotalTarifasBrl: 112.4,
        tempoMs: 295,
        hashAuditoria: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      };

      const novoCiclo: AiBankReconciliationRunDto = {
        id: `rec-${Date.now()}`,
        codigoCiclo,
        bancoIspb: bancoSelecionado,
        bancoNome: bancoSelecionado === '60701190' ? 'Banco Itaú Unibanco S.A.' : 'Banco Bradesco S.A.',
        contaBancariaId: bancoSelecionado === '60701190' ? 'cta-itau-principal' : 'cta-bradesco-repasse',
        totalTransacoesProcessadas: res.totalProcessado,
        transacoesConciliadasAutomaticas: res.totalConciliado,
        taxaAcuraciaPercent: res.taxaSucessoPercent,
        volumeTotalConciliadoBrl: res.volumeConciliadoBrl,
        divergenciasDetectadas: 1,
        statusExecucao: 'CONCLUIDO_COM_SUCESSO',
        tempoProcessamentoMs: res.tempoMs,
        hashIntegridadeAuditoria: res.hashAuditoria,
        executadoEm: new Date().toISOString(),
      };

      setCiclos([novoCiclo, ...ciclos]);
      setCicloResult(res);
      setIsRunning(false);
    }, 400);
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-700/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Motor Autônomo 24/7 Agentic Bank Reconciliation
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Repasse D+0 Seguro c/ Trava Escrow
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Landmark className="w-8 h-8 text-cyan-400" />
              Conciliação Bancária Autônoma IA & Repasse D+0
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Reconciliação tríplice contínua (Extrato OFX/Open Finance vs Razão Contábil vs Adquirentes), detecção algorítmica de tarifas ocultas e liquidação imediata D+0 protegida por travas fiduciárias de saldo mínimo de contingência.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('novo-ciclo')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Executar Ciclo IA
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Acurácia da IA</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-cyan-300">{kpis.taxaConciliacaoAutomaticaPercent}%</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matching sub-segundo ({kpis.tempoMedioProcessamentoCicloMs}ms)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Volume Conciliado Mês</span>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(kpis.volumeTotalConciliadoMesBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Repasses D+0: {formatCurrency(kpis.totalRepassesD0LiquidadosBrl)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Tarifas Auditadas por IA</span>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-300">
              {formatCurrency(kpis.tarifasBancariasEconomizadasBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-400/80">
              <Scale className="w-3.5 h-3.5" />
              <span>100% escrituradas no razão</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Saldo Escrow Blindado</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400">
              {formatCurrency(kpis.saldoTotalEscrowProtegidoBrl)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reserva anti-chargeback 15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ciclos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ciclos'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          Ciclos de Conciliação ({ciclos.length})
        </button>
        <button
          onClick={() => setActiveTab('novo-ciclo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'novo-ciclo'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4" />
          Disparador de Conciliação Instantânea
        </button>
        <button
          onClick={() => setActiveTab('tarifas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tarifas'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Percent className="w-4 h-4" />
          Tarifas Ocultas Classificadas por IA ({tarifas.length})
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'escrow'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          Travas Escrow D+0 por Evento ({escrows.length})
        </button>
      </div>

      {/* TAB 1: Ciclos de Conciliação */}
      {activeTab === 'ciclos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Ciclos Autônomos de Conciliação Bancária</h2>
              <p className="text-xs text-slate-400">
                Histórico de execuções automatizadas com conferência de centavos e hash de integridade de auditoria.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              MOTOR IA: ATIVO (INTERVALO: 5 MIN)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Código Ciclo</th>
                  <th className="py-3 px-4">Instituição Bancária</th>
                  <th className="py-3 px-4">Transações</th>
                  <th className="py-3 px-4">Acurácia IA</th>
                  <th className="py-3 px-4">Volume Conciliado</th>
                  <th className="py-3 px-4">Tempo Execução</th>
                  <th className="py-3 px-4">Hash Forense</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {ciclos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{c.codigoCiclo}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-200">{c.bancoNome}</div>
                      <div className="text-[11px] text-slate-400">ISPB: {c.bancoIspb}</div>
                    </td>
                    <td className="py-3 px-4">
                      {c.transacoesConciliadasAutomaticas} / {c.totalTransacoesProcessadas}
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-400">
                      {c.taxaAcuraciaPercent}%
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCurrency(c.volumeTotalConciliadoBrl)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{c.tempoProcessamentoMs} ms</td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-[120px]">
                      {c.hashIntegridadeAuditoria}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Conciliado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Disparador de Conciliação Instantânea */}
      {activeTab === 'novo-ciclo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Parâmetros do Ciclo de Reconciliação
              </h2>
              <p className="text-xs text-slate-400">
                Dispare a conferência tríplice autônoma em milissegundos para contas de arrecadação e repasse.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Conta Bancária / Gateway
                </label>
                <select
                  value={bancoSelecionado}
                  onChange={(e) => setBancoSelecionado(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="60701190">Banco Itaú Unibanco S.A. (Conta Principal Arrecadação)</option>
                  <option value="00360305">Banco Bradesco S.A. (Conta Fiduciária de Repasse)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tolerância de Divergência de Arredondamento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={toleranciaCentavos}
                  onChange={(e) => setToleranciaCentavos(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Limite máximo aceito para ajuste de centavos por arredondamento de adquirente.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExecutarCiclo}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all duration-200"
                >
                  {isRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isRunning ? 'Conciliando Transações...' : 'Executar Ciclo Autônomo Agora'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Resultado da Execução em Tempo Real
              </h2>
              <p className="text-xs text-slate-400">
                Detalhamento do matching das transações de bilheteria e extrato bancário.
              </p>
            </div>

            {cicloResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Processadas / Match</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {cicloResult.totalConciliado} / {cicloResult.totalProcessado}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Acurácia IA</div>
                    <div className="text-lg font-bold text-cyan-400 mt-1">
                      {cicloResult.taxaSucessoPercent}%
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <div className="text-[11px] text-slate-400 uppercase">Volume Conciliado</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">
                      {formatCurrency(cicloResult.volumeConciliadoBrl)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Tarifas Bancárias Ocultas Detectadas:</span>
                    <span className="text-purple-300 font-mono font-bold">
                      {cicloResult.tarifasDetectadasQuantidade} tarifas ({formatCurrency(cicloResult.valorTotalTarifasBrl)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Tempo de Processamento SPI/OFX:</span>
                    <span className="text-cyan-300 font-mono">{cicloResult.tempoMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Código do Ciclo Gerado:</span>
                    <span className="text-white font-mono">{cicloResult.codigoCiclo}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Hash SHA-256: {cicloResult.hashAuditoria}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <Landmark className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">
                  Selecione os parâmetros e clique em "Executar Ciclo Autônomo Agora".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Tarifas Bancárias Ocultas */}
      {activeTab === 'tarifas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Tarifas e Encargos Bancários Detectados por IA</h2>
            <p className="text-xs text-slate-400">
              Identificação inteligente de débitos automáticos em extrato com escrituração contábil imediata em partidas dobradas.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Código Tarifa</th>
                  <th className="py-3 px-4">Descrição no Extrato</th>
                  <th className="py-3 px-4">Categoria IA</th>
                  <th className="py-3 px-4">Valor Cobrado</th>
                  <th className="py-3 px-4">Confiança IA</th>
                  <th className="py-3 px-4">Débito / Crédito</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {tarifas.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{t.codigoTarifa}</td>
                    <td className="py-3 px-4 font-sans text-slate-200">{t.descricaoExtratoOriginal}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-purple-300 text-[10px]">
                        {t.categoriaIdentificadaIa}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-400">{formatCurrency(t.valorTarifaBrl)}</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">{t.confiancaClassificacaoPercent}%</td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      <div>D: {t.contaContabilDebito}</div>
                      <div>C: {t.contaContabilCredito}</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {t.statusEscrituracao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Travas Escrow D+0 */}
      {activeTab === 'escrow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Travas Fiduciárias de Saldo Mínimo Escrow (Liquidação D+0)</h2>
            <p className="text-xs text-slate-400">
              Reserva prudencial de contingência calculada para cobrir estornos, chargebacks e glosas pós-evento.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Evento / Espetáculo</th>
                  <th className="py-3 px-4">Produtor Titular</th>
                  <th className="py-3 px-4">Reserva Escrow (%)</th>
                  <th className="py-3 px-4">Saldo Bloqueado Contingência</th>
                  <th className="py-3 px-4">Saldo Disponível D+0</th>
                  <th className="py-3 px-4">Status Trava</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {escrows.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-sans">{e.eventoId}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{e.produtorId}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{e.percentualRetencaoEscrow}%</td>
                    <td className="py-3 px-4 font-bold text-rose-400">
                      {formatCurrency(e.saldoEscrowBloqueadoBrl)}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCurrency(e.saldoDisponivelLiquidacaoD0Brl)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        {e.statusLiquidacaoD0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
