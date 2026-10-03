import React, { useState } from 'react';
import {
  Bot,
  BrainCircuit,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
  Send,
  MessageSquare,
  Lock,
  RefreshCw,
  Sliders,
  DollarSign,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  StatusFechamentoAi,
  TipoAgenteSwarm,
  StatusValidacaoAgente,
  TipoInsightPreditivo,
  GrauUrgenciaInsight,
} from '@diskingressos/types';
import type {
  AiClosingExecutionDto,
  AiAgentAuditLogDto,
  AiCfoCopilotMessageDto,
  AiPredictiveBalanceInsightDto,
  AiAutonomousClosingDashboardKpisDto,
} from '@diskingressos/types';

export const AiAutonomousClosingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'esteira' | 'swarm' | 'copilot' | 'preditivo'>('esteira');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [executingZeroTouch, setExecutingZeroTouch] = useState(false);
  const [periodoInput, setPeriodoInput] = useState('2026-04');
  const [autoTravar, setAutoTravar] = useState(true);

  // Copilot Chat State
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // KPIs
  const [kpis, setKpis] = useState<AiAutonomousClosingDashboardKpisDto>({
    taxaAutomacaoZeroTouchPercent: 98.8,
    tempoMedioFechamentoSegundos: 3.84,
    totalDiscrepanciasCorrigidasAno: 14,
    confiancaRegulatoriaMediaPercent: 99.6,
    periodosFechadosCount: 2,
  });

  // Execuções
  const [executions, setExecutions] = useState<AiClosingExecutionDto[]>([
    {
      id: 'close-001',
      codigoFechamento: 'CLOSE-AI-2026-03',
      periodoAnoMes: '2026-03',
      statusFechamento: StatusFechamentoAi.CONCLUIDO_TRAVADO,
      totalLancamentosAuditados: 8420,
      totalDiscrepanciasCorrigidas: 12,
      tempoExecucaoSegundos: 4.25,
      confiancaMediaPercent: 99.4,
      iniciadoPor: 'SYSTEM_AUTONOMOUS_SWARM',
      concluidoEm: '2026-03-31T23:59:59Z',
      criadoEm: '2026-03-31T23:59:55Z',
    },
    {
      id: 'close-000',
      codigoFechamento: 'CLOSE-AI-2026-02',
      periodoAnoMes: '2026-02',
      statusFechamento: StatusFechamentoAi.CONCLUIDO_TRAVADO,
      totalLancamentosAuditados: 7890,
      totalDiscrepanciasCorrigidas: 8,
      tempoExecucaoSegundos: 3.65,
      confiancaMediaPercent: 99.8,
      iniciadoPor: 'DIRETORIA_CFO',
      concluidoEm: '2026-02-28T23:59:59Z',
      criadoEm: '2026-02-28T23:59:55Z',
    },
  ]);

  // Logs Swarm
  const [agentLogs, setAgentLogs] = useState<AiAgentAuditLogDto[]>([
    {
      id: 'log-001',
      closingExecutionId: 'close-001',
      agenteEspecialista: TipoAgenteSwarm.AGENTE_FISCAL_REFORMA,
      moduloAuditado: 'Fiscal & Reforma Tributária 2026 (IVA Dual)',
      statusValidacao: StatusValidacaoAgente.AJUSTADO_AUTO,
      justificativaRaciocinio:
        'Auditados 1.250 comprovantes de split tributário no checkout. Identificada divergência de R$ 142,50 no rateio proporcional de CBS (3,52%) vs IBS (7,08%) decorrente de truncamento na adquirente. Ajuste de centavos aplicado em contrapartida à Conta de Ajustes Tributários Transitórios.',
      normaRegulamentar: 'Emenda Constitucional 132/2023 & Art. 49 e 138 do PLP 68/2024',
      divergenciaBrl: 142.5,
      ajusteRealizadoBrl: 142.5,
      dataLog: '2026-03-31T23:59:56Z',
    },
    {
      id: 'log-002',
      closingExecutionId: 'close-001',
      agenteEspecialista: TipoAgenteSwarm.AGENTE_TESOURARIA_SPI_DREX,
      moduloAuditado: 'Bancos, Open Finance & Custódia DREX',
      statusValidacao: StatusValidacaoAgente.APROVADO_AUTO,
      justificativaRaciocinio:
        'Confrontados extratos SPI do Banco Central, reservas bancárias em DREX e liquidações de gateways. 100% dos saldos de R$ 6.800.000,00 conciliados sub-segundo sem partidas pendentes.',
      normaRegulamentar: 'Resoluções BCB 109/2021 e 277/2022 (Diretrizes Piloto DREX)',
      divergenciaBrl: 0.0,
      ajusteRealizadoBrl: 0.0,
      dataLog: '2026-03-31T23:59:56Z',
    },
    {
      id: 'log-003',
      closingExecutionId: 'close-001',
      agenteEspecialista: TipoAgenteSwarm.AGENTE_SOCIETARIO_IFRS_MEP,
      moduloAuditado: 'Consolidação IFRS & Equivalência Patrimonial',
      statusValidacao: StatusValidacaoAgente.APROVADO_AUTO,
      justificativaRaciocinio:
        'Executadas eliminações intercompany de mútuo (R$ 600.000,00) e taxas de serviço (R$ 850.000,00). Reconhecido resultado MEP de R$ 480.000,00 da investida SCP Prime Tour. Equação Ativo = Passivo + PL perfeita.',
      normaRegulamentar: 'CPC 36 / IFRS 10 e CPC 18 / IAS 28',
      divergenciaBrl: 0.0,
      ajusteRealizadoBrl: 0.0,
      dataLog: '2026-03-31T23:59:57Z',
    },
    {
      id: 'log-004',
      closingExecutionId: 'close-001',
      agenteEspecialista: TipoAgenteSwarm.AGENTE_FIDC_RISCO_RWA,
      moduloAuditado: 'FIDC de Bilheteria & Tokens RWA',
      statusValidacao: StatusValidacaoAgente.APROVADO_AUTO,
      justificativaRaciocinio:
        'Verificado índice de subordinação do FIDC em 25.00% (igual ao limite regulatório mínimo). Triggers de oráculos físicos homologados para 3 megaeventos com 100% de cobertura de garantia.',
      normaRegulamentar: 'Resoluções CVM 175 (Anexo II) e CVM 88/2022',
      divergenciaBrl: 0.0,
      ajusteRealizadoBrl: 0.0,
      dataLog: '2026-03-31T23:59:58Z',
    },
    {
      id: 'log-005',
      closingExecutionId: 'close-001',
      agenteEspecialista: TipoAgenteSwarm.AGENTE_GOVERNANCA_SOD,
      moduloAuditado: 'Segregação de Funções & Governança SoD',
      statusValidacao: StatusValidacaoAgente.APROVADO_AUTO,
      justificativaRaciocinio:
        'Auditada a matriz de alçadas de pagamento. Nenhum pagamento liberado por operadores de cadastro de contas bancárias (quarentena de 48h estritamente respeitada). Chave dupla CFO ativa.',
      normaRegulamentar: 'Princípios COSO Enterprise Risk Management & NBC TA 315',
      divergenciaBrl: 0.0,
      ajusteRealizadoBrl: 0.0,
      dataLog: '2026-03-31T23:59:59Z',
    },
  ]);

  // Mensagens Copilot
  const [copilotMessages, setCopilotMessages] = useState<AiCfoCopilotMessageDto[]>([
    {
      id: 'msg-001',
      closingExecutionId: 'close-001',
      usuarioId: 'user-cfo-01',
      perguntaUsuario: 'Qual é o EBITDA consolidado de março considerando o desconto da cessão do FIDC e os créditos de carbono?',
      respostaCopilot:
        'O EBITDA consolidado de março de 2026 fechou em R$ 4.780.000,00 (margem de 25,2% sobre a receita líquida de R$ 18.950.000,00). O impacto líquido da cessão de R$ 15,5M no FIDC foi de R$ 628.000,00 em despesas financeiras de desconto, amortizado pelo ganho operacional de R$ 480.000,00 em MEP e compensação verde de R$ 111.000,00 com 100% de neutralização.',
      metricasCitadasJson: JSON.stringify({
        ebitdaBrl: 4780000.0,
        margemPercent: 25.2,
        receitaLiquidaBrl: 18950000.0,
        custoFidcBrl: 628000.0,
        resultadoMepBrl: 480000.0,
      }),
      sugestaoAcao: 'Exportar DRE Executiva e Parecer CFO em PDF',
      dataHora: '2026-03-31T18:30:00Z',
    },
  ]);

  // Insights Preditivos
  const [insights] = useState<AiPredictiveBalanceInsightDto[]>([
    {
      id: 'ins-001',
      periodoReferencia: '2026-04 / 2026-06',
      tipoInsight: TipoInsightPreditivo.PROJECAO_EBITDA,
      titulo: 'Aceleração de Margem Operacional para o 2T-2026 (+18%)',
      descricaoDetalhada:
        'A antecipação de 4 novas turnês internacionais via FIDC garantirá R$ 22M de liquidez imediata com spread favorável de CDI + 2.8%, elevando o EBITDA projetado para R$ 14,2M no trimestre.',
      impactoEstimadoBrl: 2160000.0,
      grauUrgencia: GrauUrgenciaInsight.BAIXO,
      acaoRecomendada: 'Homologar lotes adicionais de cotas seniores na B3',
      dataGeracao: '2026-03-31T19:00:00Z',
    },
    {
      id: 'ins-002',
      periodoReferencia: '2026-04',
      tipoInsight: TipoInsightPreditivo.COBERTURA_FIDC,
      titulo: 'Alerta Preventivo de Barreira de Subordinação (25.00%)',
      descricaoDetalhada:
        'O FIDC opera no limite regulatório exato de 25,00% de cotas subordinadas. Para novas cessões previstas para abril, é mandatório aporte de R$ 2,5M na cota subordinada ou retenção de reserva em borderô para evitar desenquadramento CVM 175.',
      impactoEstimadoBrl: 2500000.0,
      grauUrgencia: GrauUrgenciaInsight.ALTO,
      acaoRecomendada: 'Programar aporte de capital subordinado antes da abertura de novas cessões',
      dataGeracao: '2026-03-31T19:15:00Z',
    },
    {
      id: 'ins-003',
      periodoReferencia: '2026-05',
      tipoInsight: TipoInsightPreditivo.OTIMIZACAO_TRIBUTARIA,
      titulo: 'Otimização de Créditos IBS/CBS no Split de Ingressos',
      descricaoDetalhada:
        'Identificada oportunidade de apropriação imediata de créditos tributários sobre fornecedores de infraestrutura de palco sob o regime não-cumulativo da EC 132/2023, gerando economia fiscal estimada em R$ 340k.',
      impactoEstimadoBrl: 340000.0,
      grauUrgencia: GrauUrgenciaInsight.MEDIO,
      acaoRecomendada: 'Revisar parametrização de alíquotas de entrada de fornecedores credenciados',
      dataGeracao: '2026-03-31T20:00:00Z',
    },
  ]);

  // Handler de Execução Zero-Touch
  const handleExecutarZeroTouch = () => {
    setExecutingZeroTouch(true);
    setTimeout(() => {
      const novoFechamento: AiClosingExecutionDto = {
        id: `close-${Date.now()}`,
        codigoFechamento: `CLOSE-AI-${periodoInput}`,
        periodoAnoMes: periodoInput,
        statusFechamento: autoTravar
          ? StatusFechamentoAi.CONCLUIDO_TRAVADO
          : StatusFechamentoAi.CONCILIADO_SUCESSO,
        totalLancamentosAuditados: 9140,
        totalDiscrepanciasCorrigidas: 14,
        tempoExecucaoSegundos: 3.84,
        confiancaMediaPercent: 99.6,
        iniciadoPor: 'DIRETORIA_CFO',
        concluidoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
      };

      setExecutions([novoFechamento, ...executions]);
      setKpis((prev) => ({
        ...prev,
        periodosFechadosCount: prev.periodosFechadosCount + 1,
        totalDiscrepanciasCorrigidasAno: prev.totalDiscrepanciasCorrigidasAno + 14,
      }));
      setExecutingZeroTouch(false);
      setIsModalOpen(false);
    }, 1200);
  };

  // Handler de Pergunta ao Copilot
  const handleAskCopilot = (perguntaTexto?: string) => {
    const q = perguntaTexto || copilotQuestion;
    if (!q.trim()) return;

    setIsAsking(true);
    setTimeout(() => {
      let resposta = '';
      let acao = 'Emitir Relatório Executivo';

      const pLower = q.toLowerCase();
      if (pLower.includes('ebitda') || pLower.includes('resultado')) {
        resposta =
          'O EBITDA consolidado apurado para o período é de R$ 4.780.000,00, com margem de 25,2%. Todos os repasses de bilheteria e taxas de serviço operam com rentabilidade líquida 4,8% superior à média do setor de entretenimento.';
        acao = 'Visualizar DRE Gerencial Consolidada';
      } else if (pLower.includes('fidc') || pLower.includes('subordina')) {
        resposta =
          'A carteira do FIDC conta com R$ 15,5M de recebíveis cedidos e R$ 42M de PL. O índice de subordinação está em 25,00%, exatamente no limite mínimo estipulado pelo Anexo II da Resolução CVM 175. Recomenda-se capitalização de R$ 2M para novas concessões em abril.';
        acao = 'Acessar Módulo de FIDC & Cotas';
      } else if (pLower.includes('drex') || pLower.includes('rwa') || pLower.includes('token')) {
        resposta =
          'Existem 3 pools ativas no Piloto DREX somando R$ 6.800.000,00 em TVL. O mercado secundário registrou zero tentativas de cambismo acima do teto de +20%, com R$ 42,38 em royalties distribuídos automaticamente.';
        acao = 'Verificar Pools na Rede DREX';
      } else {
        resposta =
          'Análise formal realizada pelo Swarm de IA: O período 2026-03 encontra-se 100% conciliado em partidas dobradas (Σ Débitos = Σ Créditos = R$ 18.950.000,00), sem pendências na CVM, Bacen ou Receita Federal.';
        acao = 'Emitir Certidão de Conciliação Integral';
      }

      const novaMsg: AiCfoCopilotMessageDto = {
        id: `msg-${Date.now()}`,
        usuarioId: 'cfo-web-user',
        perguntaUsuario: q,
        respostaCopilot: resposta,
        sugestaoAcao: acao,
        dataHora: new Date().toISOString(),
      };

      setCopilotMessages((prev) => [...prev, novaMsg]);
      setCopilotQuestion('');
      setIsAsking(false);
    }, 600);
  };

  const getAgentLabel = (tipo: TipoAgenteSwarm) => {
    switch (tipo) {
      case TipoAgenteSwarm.AGENTE_FISCAL_REFORMA:
        return 'Agente Fiscal & Reforma (EC 132)';
      case TipoAgenteSwarm.AGENTE_TESOURARIA_SPI_DREX:
        return 'Agente Tesouraria, SPI & DREX';
      case TipoAgenteSwarm.AGENTE_SOCIETARIO_IFRS_MEP:
        return 'Agente Societário, IFRS & MEP';
      case TipoAgenteSwarm.AGENTE_FIDC_RISCO_RWA:
        return 'Agente FIDC, Risco & RWA';
      case TipoAgenteSwarm.AGENTE_GOVERNANCA_SOD:
        return 'Agente Governança & SoD';
    }
  };

  const getStatusBadge = (status: StatusFechamentoAi) => {
    switch (status) {
      case StatusFechamentoAi.CONCLUIDO_TRAVADO:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Lock className="w-3 h-3" /> Concluído & Travado
          </span>
        );
      case StatusFechamentoAi.CONCILIADO_SUCESSO:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <CheckCircle2 className="w-3 h-3" /> Conciliado 100%
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-md">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Inteligência Regulamentar de IA Contábil
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Swarm Zero-Touch & Copilot CFO
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fechamento contábil autônomo multiagente, validação de normas (CVM 175, CVM 193, NBC TG, EC 132) e oráculo executivo de balanços.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Abrir Copilot CFO
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            <Zap className="w-4 h-4" />
            Executar Fechamento Zero-Touch
          </button>
        </div>
      </div>

      {/* TOP KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Taxa Automação Zero-Touch</span>
            <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.taxaAutomacaoZeroTouchPercent.toFixed(1)}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Partidas dobradas auto-conciliadas
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tempo Médio de Fechamento</span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.tempoMedioFechamentoSegundos.toFixed(2)}s
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <BrainCircuit className="w-3.5 h-3.5" />
            Swarm de 5 agentes em paralelo
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discrepâncias Auto-Ajustadas</span>
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
              <Sliders className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.totalDiscrepanciasCorrigidasAno}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            Truncamento adquirente & centavos
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confiabilidade Regulatória</span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {kpis.confiancaRegulatoriaMediaPercent.toFixed(1)}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            Alinhamento CVM, Bacen, RFB & COSO
          </div>
        </div>
      </div>

      {/* ABAS DO MÓDULO */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('esteira')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'esteira'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            Esteira Zero-Touch ({executions.length})
          </button>

          <button
            onClick={() => setActiveTab('swarm')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'swarm'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            Swarm de 5 Agentes & Chain of Thought
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'copilot'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Bot className="w-4 h-4 text-violet-500" />
            AI Copilot CFO (Perguntas & Respostas)
          </button>

          <button
            onClick={() => setActiveTab('preditivo')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'preditivo'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Insights Preditivos de Balanço ({insights.length})
          </button>
        </nav>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {/* ABA 1: ESTEIRA ZERO-TOUCH */}
      {activeTab === 'esteira' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Histórico de Fechamentos Autônomos Executados
                </h3>
                <p className="text-xs text-slate-500">
                  Conciliação automática em sub-segundos com conferência em partidas dobradas e travamento fiduciário.
                </p>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                Próxima Execução Agendada: 30/04/2026 às 23:59:59
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Código / Período</th>
                    <th className="py-3 px-4">Status & Trava</th>
                    <th className="py-3 px-4 text-right">Lançamentos Auditados</th>
                    <th className="py-3 px-4 text-right">Discrepâncias Ajustadas</th>
                    <th className="py-3 px-4 text-center">Tempo Execução</th>
                    <th className="py-3 px-4 text-center">Confiança Média</th>
                    <th className="py-3 px-4">Iniciado Por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {executions.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{e.codigoFechamento}</div>
                        <div className="text-xs text-slate-400">Competência: {e.periodoAnoMes}</div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(e.statusFechamento)}</td>
                      <td className="py-3.5 px-4 text-right font-medium">{e.totalLancamentosAuditados.toLocaleString('pt-BR')}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {e.totalDiscrepanciasCorrigidas} ajustadas
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {e.tempoExecucaoSegundos.toFixed(2)}s
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {e.confiancaMediaPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{e.iniciadoPor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Banner de Demonstração Arquitetural */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <BrainCircuit className="w-8 h-8 text-indigo-300" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold flex items-center gap-2">
                  Fluxo Zero-Touch Auditado pelo Swarm Especialista
                  <span className="text-xs font-normal bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded">
                    Norma NBC TA 315 & Resolução CVM 175
                  </span>
                </h4>
                <p className="text-xs text-indigo-100 leading-relaxed max-w-4xl">
                  Ao final de cada competência, o Swarm de IA aciona 5 agentes em paralelo. Eles confrontam os saldos do razão contra extratos do Banco Central (SPI/PIX),
                  custódia fiduciária de recebíveis na CERC/B3, reservas de DREX e regras fiscais da Reforma Tributária 2026 (EC 132).
                  Qualquer divergência decimal de arredondamento é automaticamente ajustada com log imutável de raciocínio (Chain of Thought).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: SWARM DE 5 AGENTES & CHAIN OF THOUGHT */}
      {activeTab === 'swarm' && (
        <div className="space-y-6">
          {/* Card dos 5 Agentes Especialistas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                tipo: TipoAgenteSwarm.AGENTE_FISCAL_REFORMA,
                titulo: 'Fiscal & Reforma',
                norma: 'EC 132 & PLP 68',
                status: 'Ativo (100%)',
                cor: 'border-l-indigo-500',
              },
              {
                tipo: TipoAgenteSwarm.AGENTE_TESOURARIA_SPI_DREX,
                titulo: 'Tesouraria & DREX',
                norma: 'BCB 109 & 277',
                status: 'Ativo (100%)',
                cor: 'border-l-blue-500',
              },
              {
                tipo: TipoAgenteSwarm.AGENTE_SOCIETARIO_IFRS_MEP,
                titulo: 'IFRS & Societário',
                norma: 'CPC 36 & CPC 18',
                status: 'Ativo (100%)',
                cor: 'border-l-emerald-500',
              },
              {
                tipo: TipoAgenteSwarm.AGENTE_FIDC_RISCO_RWA,
                titulo: 'FIDC & Tokens RWA',
                norma: 'CVM 175 & CVM 88',
                status: 'Ativo (100%)',
                cor: 'border-l-purple-500',
              },
              {
                tipo: TipoAgenteSwarm.AGENTE_GOVERNANCA_SOD,
                titulo: 'Governança & SoD',
                norma: 'COSO & NBC TA 315',
                status: 'Ativo (100%)',
                cor: 'border-l-amber-500',
              },
            ].map((ag, idx) => (
              <div
                key={idx}
                className={`p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 ${ag.cor}`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Agente #{idx + 1}</span>
                  <span className="text-emerald-600 font-semibold">{ag.status}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{ag.titulo}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{ag.norma}</p>
              </div>
            ))}
          </div>

          {/* Logs de Chain of Thought */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                Trilha de Auditoria com Raciocínio Formal (Chain of Thought)
              </h3>
              <span className="text-xs text-slate-500">5 de 5 agentes homologados</span>
            </div>

            {agentLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-lg">
                      <Bot className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {getAgentLabel(log.agenteEspecialista)}
                      </div>
                      <div className="text-xs text-slate-400">{log.moduloAuditado}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Norma: {log.normaRegulamentar}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        log.statusValidacao === StatusValidacaoAgente.AJUSTADO_AUTO
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {log.statusValidacao === StatusValidacaoAgente.AJUSTADO_AUTO ? 'Ajustado Auto' : 'Aprovado Auto'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                    Justificativa de Raciocínio (Chain of Thought):
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                    {log.justificativaRaciocinio}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-4">
                    <span>
                      Divergência Inicial:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">
                        R$ {log.divergenciaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </span>
                    <span>
                      Ajuste Aplicado:{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        R$ {log.ajusteRealizadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </span>
                  </div>
                  <span className="text-slate-400">{new Date(log.dataLog).toLocaleTimeString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: AI COPILOT CFO */}
      {activeTab === 'copilot' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-500" />
                AI Copilot CFO - Assistente Executivo Financeiro & Contábil
              </h3>
              <p className="text-xs text-slate-500">
                Consulte em linguagem natural métricas de EBITDA, status regulatório CVM 175, saldos em DREX e projeções de balanço.
              </p>
            </div>

            {/* Sugestões Rápidas de Pergunta */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perguntas Rápidas Sugeridas:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Qual é o EBITDA consolidado de março considerando o desconto da cessão do FIDC e créditos de carbono?',
                  'Qual o status do índice de subordinação do FIDC perante a Resolução CVM 175?',
                  'Existem divergências em DREX ou tokens RWA de bilheteria?',
                  'Qual a situação do fechamento contábil e equação patrimonial?',
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskCopilot(sug)}
                    className="text-xs text-left px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition"
                  >
                    💬 {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Histórico do Chat */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/40 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4">
              {copilotMessages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  {/* Pergunta Usuário */}
                  <div className="flex items-start justify-end gap-2">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs max-w-lg shadow-sm">
                      {msg.perguntaUsuario}
                    </div>
                  </div>

                  {/* Resposta Copilot */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl text-white shadow-sm shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 text-xs text-slate-800 dark:text-slate-200 max-w-2xl shadow-sm space-y-3">
                      <p className="leading-relaxed">{msg.respostaCopilot}</p>

                      {msg.sugestaoAcao && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            Ação Executiva Recomendada: {msg.sugestaoAcao}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-mono">Confiança: 99.2%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isAsking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                  <Sparkles className="w-4 h-4 text-violet-500 animate-spin" />
                  Swarm de IA analisando bases regulamentares e livros diários...
                </div>
              )}
            </div>

            {/* Input de Envio */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                placeholder="Pergunte ao AI Copilot CFO sobre EBITDA, FIDC, DREX, balanço ou tributos..."
                className="flex-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button
                onClick={() => handleAskCopilot()}
                disabled={isAsking || !copilotQuestion.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                Consultar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: INSIGHTS PREDITIVOS DE BALANÇO */}
      {activeTab === 'preditivo' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Radar Preditivo de Balanços & Liquidez
              </h3>
              <p className="text-xs text-slate-500">
                Modelos de machine learning analisando liquidez de curto prazo, enquadramento fiduciário de FIDC e oportunidades tributárias.
              </p>
            </div>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-3 py-1 rounded-full">
              3 Insights Estratégicos Detectados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Ref: {ins.periodoReferencia}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        ins.grauUrgencia === GrauUrgenciaInsight.ALTO
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : ins.grauUrgencia === GrauUrgenciaInsight.MEDIO
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      Urgência: {ins.grauUrgencia}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ins.titulo}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ins.descricaoDetalhada}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Impacto Estimado:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      R$ {ins.impactoEstimadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block text-[11px] text-slate-500 mb-0.5">
                      Recomendação da IA:
                    </span>
                    {ins.acaoRecomendada}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE EXECUÇÃO ZERO-TOUCH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Executar Fechamento Zero-Touch
                </h3>
                <p className="text-xs text-slate-500">Disparo do Swarm de 5 Agentes de Inteligência Contábil</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Competência de Fechamento (AAAA-MM)
                </label>
                <input
                  type="text"
                  value={periodoInput}
                  onChange={(e) => setPeriodoInput(e.target.value)}
                  placeholder="Ex: 2026-04"
                  className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoTrava"
                  checked={autoTravar}
                  onChange={(e) => setAutoTravar(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="autoTrava" className="text-slate-700 dark:text-slate-300 font-medium">
                  Travar competência automaticamente após conciliação 100%
                </label>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 leading-relaxed text-[11px]">
                ℹ️ Esta rotina auditará automaticamente 9.140 lançamentos contábeis, checará reservas em DREX,
                enquadramento de cotas FIDC e aplicará ajustes decimais nos splits fiscais da EC 132.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={executingZeroTouch}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecutarZeroTouch}
                disabled={executingZeroTouch}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 transition"
              >
                {executingZeroTouch ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processando Swarm...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Iniciar Fechamento
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
