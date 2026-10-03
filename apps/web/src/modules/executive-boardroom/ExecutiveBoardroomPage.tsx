import React, { useState } from 'react';
import {
  Presentation,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Lock,
  Download,
  Building2,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Coins,
  Leaf,
  Briefcase,
  Zap,
  Sparkles,
  RefreshCw,
  Hash,
  Award,
  Globe,
  Sliders,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import {
  TipoDemonstracaoDfp,
  StatusAuditoriaBigFour,
  CategoriaRiscoCorporativo,
  NivelRiscoHeatmap,
} from '@diskingressos/types';
import type {
  ExecutiveBoardroomKpisDto,
  DfpAuditPackageDto,
  CorporateRiskItemDto,
  DigitalBoardroomStreamDataDto,
  GerarPacoteDfpRequestDto,
} from '@diskingressos/types';

export const ExecutiveBoardroomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'boardroom' | 'dfp' | 'grc' | 'telemetria'>('boardroom');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingDfp, setGeneratingDfp] = useState(false);

  // Form de Geração DFP/ITR
  const [tipoDemo, setTipoDemo] = useState<TipoDemonstracaoDfp>(TipoDemonstracaoDfp.DFP_ANUAL);
  const [anoExercicio, setAnoExercicio] = useState<number>(2025);
  const [trimestre, setTrimestre] = useState<number>(1);
  const [auditorBigFour, setAuditorBigFour] = useState('PricewaterhouseCoopers (PwC) Auditores Independentes');
  const [crcResponsavel, setCrcResponsavel] = useState('CRC-PR 048.912/O-3 (Diretoria Contábil)');

  // Selected DFP package for viewing
  const [selectedDfpId, setSelectedDfpId] = useState<string>('dfp-001');

  // KPIs C-Level Soberanos
  const [kpis] = useState<ExecutiveBoardroomKpisDto>({
    ebitdaLtmBrl: 54200000.0,
    margemEbitdaPercent: 26.4,
    receitaLiquidaLtmBrl: 205300000.0,
    liquidezCorrente: 2.84,
    liquidezSeca: 2.45,
    patrimonioLiquidoConsolidadoBrl: 124500000.0,
    tvlTokensDrexBrl: 6800000.0,
    indiceSubordinacaoFidcPercent: 25.0,
    saldoCompensacaoEsgTco2: 1840.5,
    scoreGovernancaGrc: 98.5,
    cndFederalValida: true,
    cndEstadualValida: true,
    cndMunicipalValida: true,
    cndFgtsValida: true,
  });

  // Telemetria em Tempo Real
  const [telemetry] = useState<DigitalBoardroomStreamDataDto>({
    timestamp: new Date().toISOString(),
    ingressosEmitidosMinuto: 342,
    volumeTransacionadoMinutoBrl: 118450.0,
    taxaSucessoGatewaysPercent: 99.85,
    statusPilotoDrex: 'Conectado (3 Pools Ativas / TVL R$ 6.8M)',
    statusFidcSubordinacao: 'Regular (25.00% / Limite CVM 175 Atendido)',
  });

  // Pacotes DFP / ITR
  const [dfpPackages, setDfpPackages] = useState<DfpAuditPackageDto[]>([
    {
      id: 'dfp-001',
      codigoPacote: 'DFP-2025-CONSOLIDADO',
      tipoDemonstracao: TipoDemonstracaoDfp.DFP_ANUAL,
      exercicioAno: 2025,
      statusAuditoria: StatusAuditoriaBigFour.HOMOLOGADO_CVM,
      auditorResponsavel: 'PricewaterhouseCoopers (PwC) Auditores Independentes',
      responsavelTecnicoCrc: 'CRC-PR 048.912/O-3 (Diretoria Contábil)',
      hashIntegridadeSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      balancoPatrimonialAtivoJson: JSON.stringify({
        ativoCirculante: 106750000.0,
        ativoNaoCirculante: 47550000.0,
        totalAtivoBrl: 154300000.0,
      }),
      balancoPatrimonialPassivoJson: JSON.stringify({
        passivoCirculante: 29800000.0,
        passivoNaoCirculante: 12000000.0,
        patrimonioLiquido: 124500000.0,
        totalPassivoPlBrl: 154300000.0,
      }),
      dreConsolidadaJson: JSON.stringify({
        receitaLiquidaOperacional: 44000000.0,
        lucroBruto: 29800000.0,
        ebitdaConsolidado: 15150000.0,
        lucroLiquidoExercicio: 13800000.0,
      }),
      dfcFluxoCaixaJson: JSON.stringify({
        fluxoOperacionalLiquido: 28400000.0,
        variacaoLiquidaCaixa: 32400000.0,
      }),
      dmplMutacoesPlJson: JSON.stringify({
        saldoInicialPl: 98000000.0,
        lucroLiquidoPeriodo: 13800000.0,
        saldoFinalPl: 124500000.0,
      }),
      dvaValorAdicionadoJson: JSON.stringify({
        valorAdicionadoBruto: 46200000.0,
        retencaoLucrosAcionistas: 21700000.0,
      }),
      notasExplicativasTexto:
        'Nota 1 - Contexto Operacional: A DiskIngressos opera plataformas de bilheteria omnichannel, atua como gestora fiduciária de recebíveis e custodia contratos de FIDC (CVM 175) e DREX (Piloto Bacen).\nNota 2 - Práticas Contábeis (CPC 00 / CPC 26): Demonstrações elaboradas em conformidade com as normas internacionais IFRS e CPCs emitidos pelo CFC.\nNota 3 - Governança ESG e Créditos de Carbono: Inventário GHG Protocol auditado e compensado via títulos Verra VCS / CBIOMOB conforme CVM Resolução 193/2023.\nNota 4 - FIDC & Segregação Fiduciária: Carteira de direitos creditórios cedidos com 25% de cotas subordinadas retidas como first-loss piece, sem coobrigação integral.',
      parecerAuditoresTexto:
        'Relatório dos Auditores Independentes sobre as Demonstrações Financeiras: Examinamos as demonstrações financeiras consolidadas da DiskIngressos. Em nossa opinião, as demonstrações acima apresentam adequadamente, em todos os aspectos relevantes, a posição patrimonial e financeira em 31 de dezembro de 2025, em conformidade com os CPCs e normas IFRS. [PwC Auditores Independentes - Emitido sem ressalvas].',
      dataGeracao: '2026-01-20T10:00:00Z',
      homologadoEm: '2026-01-25T14:30:00Z',
    },
  ]);

  // Riscos Corporativos (GRC)
  const [risks] = useState<CorporateRiskItemDto[]>([
    {
      id: 'rsk-001',
      codigoRisco: 'RSK-REG-CVM175',
      categoria: CategoriaRiscoCorporativo.REGULATORIO,
      titulo: 'Desenquadramento do Índice de Subordinação FIDC (25.00%)',
      descricaoRisco:
        'Risco de expansão acelerada de volume de cessões de bilheteria sem aporte tempestivo de cotas subordinadas, violando a barreira regulatória do Anexo II da Resolução CVM 175.',
      probabilidade: 'MEDIA',
      impactoFinanceiro: 'ALTO',
      nivelRisco: NivelRiscoHeatmap.MODERADO,
      estrategiaMitigacao:
        'Trava algorítmica de pré-validação no fechamento autônomo (Fase 29) e retenção automática de reserva em borderô.',
      responsavelAlcada: 'Diretoria Financeira & Gestor FIDC',
      statusMonitoramento: 'SOB_CONTROLE',
      atualizadoEm: '2026-03-31T20:00:00Z',
    },
    {
      id: 'rsk-002',
      codigoRisco: 'RSK-TRIB-EC132',
      categoria: CategoriaRiscoCorporativo.TRIBUTARIO,
      titulo: 'Transição e Truncamento de Rateio IBS / CBS (IVA Dual 2026)',
      descricaoRisco:
        'Adaptação às novas regras da Emenda Constitucional 132/2023 com divergências no split de checkouts multicanal entre Estado e Município.',
      probabilidade: 'BAIXA',
      impactoFinanceiro: 'MEDIO',
      nivelRisco: NivelRiscoHeatmap.BAIXO,
      estrategiaMitigacao:
        'Motor Fiscal do Agente de IA com auto-ajuste de centavos na conta de ajustes tributários transitórios.',
      responsavelAlcada: 'Diretoria Contábil & Jurídico Tributário',
      statusMonitoramento: 'SOB_CONTROLE',
      atualizadoEm: '2026-03-31T20:00:00Z',
    },
    {
      id: 'rsk-003',
      codigoRisco: 'RSK-LIQ-TURNES',
      categoria: CategoriaRiscoCorporativo.LIQUIDEZ,
      titulo: 'Concentração de Desembolsos em Megaeventos Internacionais',
      descricaoRisco:
        'Necessidade de liquidação spot de cachês em moeda estrangeira (USD/EUR) com volatilidade cambial antes da realização do festival.',
      probabilidade: 'MEDIA',
      impactoFinanceiro: 'ALTO',
      nivelRisco: NivelRiscoHeatmap.ELEVADO,
      estrategiaMitigacao:
        'Contratação mandatória de Hedge Cambial Spot / Trava Cambial PTAX (Fase 24) e cobertura em DREX.',
      responsavelAlcada: 'CFO & Tesouraria Soberana',
      statusMonitoramento: 'ATIVO',
      atualizadoEm: '2026-03-31T20:00:00Z',
    },
    {
      id: 'rsk-004',
      codigoRisco: 'RSK-CIB-CAMBISMO',
      categoria: CategoriaRiscoCorporativo.CIBERNETICO,
      titulo: 'Ataques Distribuídos de Bots Cambistas em Vendas de Alta Demanda',
      descricaoRisco:
        'Tentativa de sequestro de inventário de ingressos nos primeiros 10 minutos de abertura de vendas para revenda abusiva.',
      probabilidade: 'ALTA',
      impactoFinanceiro: 'MEDIO',
      nivelRisco: NivelRiscoHeatmap.MODERADO,
      estrategiaMitigacao:
        'Antifraude Sentinel com IA comportamental (Fase 23) e trava anti-cambismo de +20% em smart contracts RWA (Fase 27).',
      responsavelAlcada: 'Diretoria de Tecnologia & CISO',
      statusMonitoramento: 'MITIGADO',
      atualizadoEm: '2026-03-31T20:00:00Z',
    },
  ]);

  const activePackage = dfpPackages.find((p) => p.id === selectedDfpId) || dfpPackages[0];

  // Handler de Geração de Pacote DFP
  const handleGerarPacoteDfp = () => {
    setGeneratingDfp(true);
    setTimeout(() => {
      const codigoPacote =
        tipoDemo === TipoDemonstracaoDfp.DFP_ANUAL
          ? `DFP-${anoExercicio}-CONSOLIDADO`
          : `ITR-${anoExercicio}-${trimestre}T`;

      const novoPacote: DfpAuditPackageDto = {
        id: `dfp-${Date.now()}`,
        codigoPacote,
        tipoDemonstracao: tipoDemo,
        exercicioAno: anoExercicio,
        periodoTrimestre: tipoDemo === TipoDemonstracaoDfp.ITR_TRIMESTRAL ? trimestre : undefined,
        statusAuditoria: StatusAuditoriaBigFour.PARECER_EMITIDO_SEM_RESSALVAS,
        auditorResponsavel: auditorBigFour,
        responsavelTecnicoCrc: crcResponsavel,
        hashIntegridadeSha256: '9a7f5b8c3d2e1f4a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
        balancoPatrimonialAtivoJson: JSON.stringify({
          ativoCirculante: 112000000.0,
          ativoNaoCirculante: 49500000.0,
          totalAtivoBrl: 161500000.0,
        }),
        balancoPatrimonialPassivoJson: JSON.stringify({
          passivoCirculante: 32000000.0,
          passivoNaoCirculante: 12500000.0,
          patrimonioLiquido: 117000000.0,
          totalPassivoPlBrl: 161500000.0,
        }),
        dreConsolidadaJson: JSON.stringify({
          receitaLiquidaOperacional: 52000000.0,
          lucroBruto: 36000000.0,
          ebitdaConsolidado: 17800000.0,
          lucroLiquidoExercicio: 15400000.0,
        }),
        dfcFluxoCaixaJson: JSON.stringify({
          fluxoOperacionalLiquido: 31200000.0,
          variacaoLiquidaCaixa: 35000000.0,
        }),
        dmplMutacoesPlJson: JSON.stringify({
          saldoInicialPl: 101600000.0,
          lucroLiquidoPeriodo: 15400000.0,
          saldoFinalPl: 117000000.0,
        }),
        dvaValorAdicionadoJson: JSON.stringify({
          valorAdicionadoBruto: 51200000.0,
          retencaoLucrosAcionistas: 24500000.0,
        }),
        notasExplicativasTexto: `Pacote Contábil ${codigoPacote}: Elaborado sob CPC 26 / IFRS com reconciliação integral de quotas subordinadas de FIDC (CVM 175), borderô verde ESG (CVM 193) e equivalência patrimonial de investidas (CPC 18).`,
        parecerAuditoresTexto: `Parecer de Auditoria Independente (${auditorBigFour}): Demonstrações auditadas sem ressalvas. As informações contábeis refletem fidedignamente o patrimônio e as operações consolidadas da DiskIngressos.`,
        dataGeracao: new Date().toISOString(),
        homologadoEm: new Date().toISOString(),
      };

      setDfpPackages([novoPacote, ...dfpPackages]);
      setSelectedDfpId(novoPacote.id);
      setGeneratingDfp(false);
      setIsModalOpen(false);
    }, 1200);
  };

  const getRiscoColor = (nivel: NivelRiscoHeatmap) => {
    switch (nivel) {
      case NivelRiscoHeatmap.CRITICO:
        return 'bg-rose-500 text-white';
      case NivelRiscoHeatmap.ELEVADO:
        return 'bg-orange-500 text-white';
      case NivelRiscoHeatmap.MODERADO:
        return 'bg-amber-400 text-slate-900';
      case NivelRiscoHeatmap.BAIXO:
        return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 rounded-xl text-amber-400 shadow-lg border border-amber-500/30">
              <Presentation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Digital Boardroom & Cockpit Executivo C-Level
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700">
                  Conselho Soberano & CVM
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Observabilidade unificada em tempo real, integridade fiduciária de FIDC (CVM 175), DREX, ESG e gerador de DFP/ITR Big Four.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('telemetria')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            Live Telemetry
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            Gerar Pacote DFP / ITR (Big Four)
          </button>
        </div>
      </div>

      {/* TOP 4 KPIS SOBERANOS C-LEVEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EBITDA LTM */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">EBITDA LTM Consolidado</span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            R$ {(kpis.ebitdaLtmBrl / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Margem: {kpis.margemEbitdaPercent}%</span>
            <span className="text-slate-400">Rec: R$ {(kpis.receitaLiquidaLtmBrl / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* LIQUIDEZ CORRENTE & SECA */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Índices de Liquidez</span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.liquidezCorrente.toFixed(2)}x
          </p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Liquidez Seca: {kpis.liquidezSeca.toFixed(2)}x</span>
            <span className="text-slate-500">Solvência Confortável</span>
          </div>
        </div>

        {/* COLCHÃO FIDC & DREX */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">FIDC & DREX Fiduciário</span>
            <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-lg">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {kpis.indiceSubordinacaoFidcPercent.toFixed(1)}% Subord.
          </p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-500">First-loss R$ 10.5M</span>
            <span className="text-emerald-600 font-medium">TVL R$ 6.8M DREX</span>
          </div>
        </div>

        {/* SCORE GRC & ESG */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Governança GRC & ESG</span>
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {kpis.scoreGovernancaGrc.toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
          </p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-emerald-600 font-medium">CNDs 100% Regulares</span>
            <span className="text-slate-500">Net Zero IFRS S2</span>
          </div>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('boardroom')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'boardroom'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Presentation className="w-4 h-4" />
            Cockpit Soberano (Digital Boardroom)
          </button>

          <button
            onClick={() => setActiveTab('dfp')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'dfp'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-amber-500" />
            Central DFP / ITR (CVM & Big Four) ({dfpPackages.length})
          </button>

          <button
            onClick={() => setActiveTab('grc')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'grc'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Matriz de Riscos Corporativos (GRC / COSO) ({risks.length})
          </button>

          <button
            onClick={() => setActiveTab('telemetria')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'telemetria'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            Telemetria em Tempo Real (Live Stream)
          </button>
        </nav>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 1: COCKPIT SOBERANO */}
      {activeTab === 'boardroom' && (
        <div className="space-y-6">
          {/* Card Estrutura de Capital & Balanço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  Estrutura de Capital & PL
                </h3>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  Consolidado
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patrimônio Líquido (PL):</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    R$ {kpis.patrimonioLiquidoConsolidadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cotas FIDC Estruturadas:</span>
                  <span className="font-bold text-purple-600">R$ 42.000.000,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ativos em Tokens DREX:</span>
                  <span className="font-bold text-blue-600">
                    R$ {kpis.tvlTokensDrexBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Caixa & Títulos Públicos CDI:</span>
                  <span className="font-bold text-emerald-600">R$ 80.500.000,00</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  Certidões & Regularidade Fiscal
                </h3>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  100% Em Dia
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  { nome: 'CND Federal (Receita / PGFN)', status: 'Regular / Negativa com Efeitos' },
                  { nome: 'CND Estadual (SEFAZ Paraná)', status: 'Regular / Sem Pendências' },
                  { nome: 'CND Municipal (Prefeitura Curitiba)', status: 'Regular / ISS Quitado' },
                  { nome: 'CRF FGTS (Caixa Econômica Federal)', status: 'Certificado Válido' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{c.nome}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Selos Regulamentares Ativos
                </h3>
                <span className="text-xs text-slate-400">Normas CVM / BACEN</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200">Resolução CVM 175 (Anexo II)</span>
                  <span className="text-[11px] font-bold text-indigo-600">Subordinação 25%</span>
                </div>
                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">Resolução CVM 193 / IFRS S2</span>
                  <span className="text-[11px] font-bold text-emerald-600">Net Zero GHG Protocol</span>
                </div>
                <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
                  <span className="font-semibold text-blue-900 dark:text-blue-200">Banco Central do Brasil (DREX)</span>
                  <span className="text-[11px] font-bold text-blue-600">Piloto Homologado</span>
                </div>
                <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-lg border border-amber-100 dark:border-amber-900/60 flex items-center justify-between">
                  <span className="font-semibold text-amber-900 dark:text-amber-200">Reforma Tributária (EC 132/23)</span>
                  <span className="text-[11px] font-bold text-amber-600">Split CBS/IBS 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de Observabilidade Executiva */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-xl border border-indigo-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-400/20 text-amber-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Parecer de Soberania Contábil & Governança C-Level
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A DiskIngressos opera com segregação fiduciária completa entre receitas de terceiros e comissões próprias (LC 116/03),
                  garantindo conformidade com a barreira de 25% de subordinação em cotas de FIDC (CVM 175) e reconciliação sub-segundo de
                  partidas dobradas no razão contábil pelo Swarm de IA (Fase 29). As demonstrações estão 100% aptas para auditoria externa das Big Four.
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('dfp')}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-xs rounded-xl shadow hover:from-indigo-600 hover:to-violet-700 transition flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  Acessar Demonstrações DFP
                </button>
                <span className="text-[10px] text-center text-slate-400">Homologado via SHA-256</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CENTRAL DFP / ITR (CVM & BIG FOUR) */}
      {activeTab === 'dfp' && (
        <div className="space-y-6">
          {/* Seletor de Pacotes */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Pacotes de Demonstrações Auditadas Gerados:
              </span>
              <div className="flex items-center gap-2">
                {dfpPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedDfpId(pkg.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      selectedDfpId === pkg.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {pkg.codigoPacote} ({pkg.tipoDemonstracao})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Zap className="w-4 h-4" />
              Emitir Nova Demonstração
            </button>
          </div>

          {/* Detalhes do Pacote Selecionado */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activePackage.codigoPacote}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                    {activePackage.statusAuditoria}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Auditor Independente: <strong>{activePackage.auditorResponsavel}</strong> | Responsável Técnico: <strong>{activePackage.responsavelTecnicoCrc}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Hash className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-slate-500">SHA-256:</span>
                <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {activePackage.hashIntegridadeSha256}
                </span>
              </div>
            </div>

            {/* Grid com Balanço e DRE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Balanço Patrimonial */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Balanço Patrimonial Consolidado (CPC 26)</span>
                  <span className="text-emerald-600 font-mono">Ativo = Passivo + PL</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Ativo Circulante (Disponibilidades + Clientes):</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 106.750.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Ativo Não Circulante (MEP SCP + Imobilizado):</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 47.550.000,00</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2 rounded font-bold text-indigo-900 dark:text-indigo-200">
                    <span>Total do Ativo:</span>
                    <span>R$ 154.300.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 pt-2">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Passivo Circulante (Repasses + Fornecedores):</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 29.800.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Passivo Não Circulante (Cotas Subordinadas):</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 12.000.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Patrimônio Líquido Consolidado (PL):</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 124.500.000,00</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2 rounded font-bold text-indigo-900 dark:text-indigo-200">
                    <span>Total Passivo + Patrimônio Líquido:</span>
                    <span>R$ 154.300.000,00</span>
                  </div>
                </div>
              </div>

              {/* DRE Consolidada */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>DRE Consolidada (Demonstração do Resultado)</span>
                  <span className="text-indigo-600 font-mono">Margem 26.4%</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Receita Bruta Total de Bilheteria:</span>
                    <span className="font-bold text-slate-900 dark:text-white">R$ 242.000.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-rose-600">
                    <span className="font-medium">(-) Deduções de Repasse aos Produtores (LC 116):</span>
                    <span className="font-bold">- R$ 198.000.000,00</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-slate-100 dark:bg-slate-800 px-2 rounded font-semibold text-slate-900 dark:text-white">
                    <span>(=) Receita Própria Líquida (Taxas & Comissões):</span>
                    <span>R$ 44.000.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">(-) Custos Operacionais e Gateways:</span>
                    <span className="font-bold text-slate-900 dark:text-white">- R$ 14.200.000,00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-600 dark:text-slate-400">(+) Resultado de Equivalência Patrimonial (MEP):</span>
                    <span className="font-bold text-emerald-600">+ R$ 1.850.000,00</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 rounded font-bold text-emerald-900 dark:text-emerald-200">
                    <span>EBITDA Consolidado:</span>
                    <span>R$ 15.150.000,00</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2 rounded font-bold text-indigo-900 dark:text-indigo-200">
                    <span>Lucro Líquido do Exercício:</span>
                    <span>R$ 13.800.000,00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas Explicativas e Parecer Big Four */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Notas Explicativas da Administração (CPC 00 / CPC 26 / CVM 175):
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                  {activePackage.notasExplicativasTexto}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Parecer dos Auditores Independentes (Big Four):
                </span>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans">
                  {activePackage.parecerAuditoresTexto}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: MATRIZ DE RISCOS CORPORATIVOS (GRC / COSO) */}
      {activeTab === 'grc' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Matriz de Riscos Corporativos & Heatmap COSO ERM
              </h3>
              <p className="text-xs text-slate-500">
                Monitoramento contínuo de riscos regulatórios (CVM 175), fiscais (EC 132), liquidez de eventos e segurança cibernética.
              </p>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full">
              4 Riscos Monitorados com Mitigação Ativa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.map((rsk) => (
              <div
                key={rsk.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-slate-400 block mb-1">
                      {rsk.codigoRisco} • Categoria: {rsk.categoria}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rsk.titulo}</h4>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getRiscoColor(rsk.nivelRisco)}`}>
                    Nível: {rsk.nivelRisco}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rsk.descricaoRisco}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 block text-[11px]">
                    Estratégia de Mitigação:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{rsk.estrategiaMitigacao}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Alçada: <strong className="text-slate-700 dark:text-slate-300">{rsk.responsavelAlcada}</strong></span>
                  <span className="font-semibold text-emerald-600">{rsk.statusMonitoramento}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: TELEMETRIA EM TEMPO REAL */}
      {activeTab === 'telemetria' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                  Streaming de Telemetria Contábil & Fiduciária em Tempo Real
                </h3>
                <p className="text-xs text-slate-500">
                  Monitoramento contínuo de vazão de checkouts, liquidação no Piloto DREX e barreira de subordinação do FIDC.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live WebSocket Ativo
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Vazão de Ingressos</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {telemetry.ingressosEmitidosMinuto} / min
                </p>
                <span className="text-xs text-emerald-600 font-medium mt-1 block">Pico estável</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Volume Financeiro</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  R$ {(telemetry.volumeTransacionadoMinutoBrl / 1000).toFixed(1)}k / min
                </p>
                <span className="text-xs text-indigo-600 font-medium mt-1 block">Checkouts ativos</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">Saúde Gateways</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {telemetry.taxaSucessoGatewaysPercent}%
                </p>
                <span className="text-xs text-slate-400 mt-1 block">Cielo, Stone & Rede</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase">FIDC Subordinação</span>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  25.00%
                </p>
                <span className="text-xs text-emerald-600 font-medium mt-1 block">Conforme CVM 175</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                Status dos Conectores Fiduciários e Oráculos:
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Piloto DREX (Hyperledger Besu / Bacen):</span>
                <span className="text-emerald-600 font-semibold">{telemetry.statusPilotoDrex}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Custódia de Recebíveis (CERC / B3):</span>
                <span className="text-emerald-600 font-semibold">100% dos lotes sincronizados</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Swarm de IA Contábil (Zero-Touch):</span>
                <span className="text-indigo-600 font-semibold">Standby ativo para 30/04/2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EMISSÃO DFP / ITR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Gerar Pacote Contábil Auditado (DFP / ITR)
                </h3>
                <p className="text-xs text-slate-500">
                  Consolidação oficial para protocolo CVM EmpresasNet & Auditoria Big Four
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Demonstração
                  </label>
                  <select
                    value={tipoDemo}
                    onChange={(e) => setTipoDemo(e.target.value as TipoDemonstracaoDfp)}
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value={TipoDemonstracaoDfp.DFP_ANUAL}>DFP - Anual Consolidada</option>
                    <option value={TipoDemonstracaoDfp.ITR_TRIMESTRAL}>ITR - Trimestral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ano de Exercício
                  </label>
                  <input
                    type="number"
                    value={anoExercicio}
                    onChange={(e) => setAnoExercicio(Number(e.target.value))}
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {tipoDemo === TipoDemonstracaoDfp.ITR_TRIMESTRAL && (
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Trimestre de Referência
                  </label>
                  <select
                    value={trimestre}
                    onChange={(e) => setTrimestre(Number(e.target.value))}
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value={1}>1º Trimestre (Janeiro - Março)</option>
                    <option value={2}>2º Trimestre (Abril - Junho)</option>
                    <option value={3}>3º Trimestre (Julho - Setembro)</option>
                    <option value={4}>4º Trimestre (Outubro - Dezembro)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Firma de Auditoria Externa (Big Four)
                </label>
                <select
                  value={auditorBigFour}
                  onChange={(e) => setAuditorBigFour(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="PricewaterhouseCoopers (PwC) Auditores Independentes">
                    PricewaterhouseCoopers (PwC)
                  </option>
                  <option value="Deloitte Touche Tohmatsu Auditores Independentes">
                    Deloitte Touche Tohmatsu
                  </option>
                  <option value="Ernst & Young (EY) Assessoria Empresarial">
                    Ernst & Young (EY)
                  </option>
                  <option value="KPMG Auditores Independentes">
                    KPMG
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Responsável Técnico Contábil (CRC)
                </label>
                <input
                  type="text"
                  value={crcResponsavel}
                  onChange={(e) => setCrcResponsavel(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 leading-relaxed text-[11px]">
                ℹ️ Esta rotina consolidará o Balanço Patrimonial, DRE, DFC, DMPL, DVA e Notas Explicativas (CPC 26, CVM 175 e IFRS S1/S2),
                gerando um Hash SHA-256 inviolável de integridade.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={generatingDfp}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleGerarPacoteDfp}
                disabled={generatingDfp}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 transition"
              >
                {generatingDfp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Consolidando DFP...
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    Gerar e Assinar Pacote
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
