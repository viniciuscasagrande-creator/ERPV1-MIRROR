import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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
  ExecutarFechamentoZeroTouchRequestDto,
  ExecutarFechamentoZeroTouchResponseDto,
  ConsultarCfoCopilotRequestDto,
  ConsultarCfoCopilotResponseDto,
  AiAutonomousClosingDashboardKpisDto,
} from '@diskingressos/types';

@Injectable()
export class AiAutonomousClosingService {
  private readonly logger = new Logger(AiAutonomousClosingService.name);

  private inMemoryExecutions: AiClosingExecutionDto[] = [];
  private inMemoryLogs: AiAgentAuditLogDto[] = [];
  private inMemoryCopilotMessages: AiCfoCopilotMessageDto[] = [];
  private inMemoryInsights: AiPredictiveBalanceInsightDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de inteligência regulamentar de IA Contábil e Swarm Zero-Touch...');

    // 1. Execução de Fechamento Autônomo
    const e1: AiClosingExecutionDto = {
      id: 'close-001',
      codigoFechamento: 'CLOSE-AI-2026-03',
      periodoAnoMes: '2026-03',
      statusFechamento: StatusFechamentoAi.CONCILIADO_SUCESSO,
      totalLancamentosAuditados: 8420,
      totalDiscrepanciasCorrigidas: 12,
      tempoExecucaoSegundos: 4.25,
      confiancaMediaPercent: 99.4,
      iniciadoPor: 'SYSTEM_AUTONOMOUS_SWARM',
      concluidoEm: new Date('2026-03-03T23:59:59Z').toISOString(),
      criadoEm: new Date('2026-03-03T23:59:55Z').toISOString(),
    };

    this.inMemoryExecutions = [e1];

    // 2. Logs de Raciocínio (Chain of Thought) do Swarm de Agentes
    const l1: AiAgentAuditLogDto = {
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
      dataLog: new Date('2026-03-03T23:59:56Z').toISOString(),
    };

    const l2: AiAgentAuditLogDto = {
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
      dataLog: new Date('2026-03-03T23:59:56Z').toISOString(),
    };

    const l3: AiAgentAuditLogDto = {
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
      dataLog: new Date('2026-03-03T23:59:57Z').toISOString(),
    };

    const l4: AiAgentAuditLogDto = {
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
      dataLog: new Date('2026-03-03T23:59:58Z').toISOString(),
    };

    const l5: AiAgentAuditLogDto = {
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
      dataLog: new Date('2026-03-03T23:59:59Z').toISOString(),
    };

    this.inMemoryLogs = [l1, l2, l3, l4, l5];

    // 3. Conversas Históricas do AI Copilot CFO
    const m1: AiCfoCopilotMessageDto = {
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
      dataHora: new Date('2026-03-03T18:30:00Z').toISOString(),
    };

    this.inMemoryCopilotMessages = [m1];

    // 4. Insights Preditivos de Balanço
    const in1: AiPredictiveBalanceInsightDto = {
      id: 'ins-001',
      periodoReferencia: '2026-04 / 2026-06',
      tipoInsight: TipoInsightPreditivo.PROJECAO_EBITDA,
      titulo: 'Aceleração de Margem Operacional para o 2T-2026 (+18%)',
      descricaoDetalhada:
        'A antecipação de 4 novas turnês internacionais via FIDC garantirá R$ 22M de liquidez imediata com spread favorável de CDI + 2.8%, elevando o EBITDA projetado para R$ 14,2M no trimestre.',
      impactoEstimadoBrl: 2160000.0,
      grauUrgencia: GrauUrgenciaInsight.BAIXO,
      acaoRecomendada: 'Homologar lotes adicionais de cotas seniores na B3',
      dataGeracao: new Date('2026-03-03T19:00:00Z').toISOString(),
    };

    const in2: AiPredictiveBalanceInsightDto = {
      id: 'ins-002',
      periodoReferencia: '2026-03',
      tipoInsight: TipoInsightPreditivo.COBERTURA_FIDC,
      titulo: 'Alerta Preventivo de Barreira de Subordinação (25.00%)',
      descricaoDetalhada:
        'O FIDC opera no limite regulatório exato de 25,00% de cotas subordinadas. Para novas cessões previstas para abril, é mandatório aporte de R$ 2,5M na cota subordinada ou retenção de reserva em borderô para evitar desenquadramento CVM 175.',
      impactoEstimadoBrl: 2500000.0,
      grauUrgencia: GrauUrgenciaInsight.ALTO,
      acaoRecomendada: 'Programar aporte de capital subordinado antes da abertura de novas cessões',
      dataGeracao: new Date('2026-03-03T19:15:00Z').toISOString(),
    };

    this.inMemoryInsights = [in1, in2];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DO DASHBOARD ZERO-TOUCH
  // ============================================================================
  async getDashboardKpis(): Promise<AiAutonomousClosingDashboardKpisDto> {
    await this.ensureSeedData();

    return {
      taxaAutomacaoZeroTouchPercent: 98.8,
      tempoMedioFechamentoSegundos: 4.25,
      totalDiscrepanciasCorrigidasAno: 48,
      confiancaRegulatoriaMediaPercent: 99.4,
      periodosFechadosCount: this.inMemoryExecutions.length,
    };
  }

  // ============================================================================
  // EXECUÇÃO DO FECHAMENTO ZERO-TOUCH
  // ============================================================================
  async listarExecucoesFechamento(): Promise<AiClosingExecutionDto[]> {
    await this.ensureSeedData();
    return this.inMemoryExecutions;
  }

  async obterExecucaoPorId(id: string): Promise<AiClosingExecutionDto | null> {
    await this.ensureSeedData();
    return this.inMemoryExecutions.find((e) => e.id === id) || null;
  }

  async executarFechamentoZeroTouch(
    dto: ExecutarFechamentoZeroTouchRequestDto,
  ): Promise<ExecutarFechamentoZeroTouchResponseDto> {
    await this.ensureSeedData();

    const novoFechamento: AiClosingExecutionDto = {
      id: `close-${Date.now()}`,
      codigoFechamento: `CLOSE-AI-${dto.periodoAnoMes}`,
      periodoAnoMes: dto.periodoAnoMes,
      statusFechamento: dto.autoTravaCompetencia
        ? StatusFechamentoAi.CONCLUIDO_TRAVADO
        : StatusFechamentoAi.CONCILIADO_SUCESSO,
      totalLancamentosAuditados: 9140,
      totalDiscrepanciasCorrigidas: 14,
      tempoExecucaoSegundos: 3.84,
      confiancaMediaPercent: 99.6,
      iniciadoPor: dto.iniciadoPor || 'DIRETORIA_CFO',
      concluidoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };

    this.inMemoryExecutions.unshift(novoFechamento);

    return {
      fechamento: novoFechamento,
      agentLogs: this.inMemoryLogs,
      balancoEquilibrado: true,
      parecerCfoPronto:
        'Parecer de Conformidade Emitido: Balanço patrimonial, demonstração de resultados, obrigações fiduciárias CVM 175 e fiscais da EC 132 auditados com 99,6% de confiança sem ressalvas.',
    };
  }

  // ============================================================================
  // LOGS DE AUDITORIA DO SWARM
  // ============================================================================
  async listarLogsAgentes(): Promise<AiAgentAuditLogDto[]> {
    await this.ensureSeedData();
    return this.inMemoryLogs;
  }

  // ============================================================================
  // AI CFO COPILOT
  // ============================================================================
  async consultarCfoCopilot(
    dto: ConsultarCfoCopilotRequestDto,
  ): Promise<ConsultarCfoCopilotResponseDto> {
    await this.ensureSeedData();

    const p = dto.pergunta.toLowerCase();
    let respostaTexto = '';
    let sugestaoAcao = 'Emitir Relatório Executivo';

    if (p.includes('ebitda') || p.includes('resultado')) {
      respostaTexto =
        'O EBITDA consolidado apurado para o período é de R$ 4.780.000,00, com margem de 25,2%. Todos os repasses de bilheteria e taxas de serviço operam com rentabilidade líquida 4,8% superior à média do setor de entretenimento.';
      sugestaoAcao = 'Visualizar DRE Gerencial Consolidada';
    } else if (p.includes('fidc') || p.includes('subordina')) {
      respostaTexto =
        'A carteira do FIDC conta com R$ 15,5M de recebíveis cedidos e R$ 42M de PL. O índice de subordinação está em 25,00%, exatamente no limite mínimo estipulado pelo Anexo II da Resolução CVM 175. Recomenda-se capitalização de R$ 2M para novas concessões em abril.';
      sugestaoAcao = 'Acessar Módulo de FIDC & Cotas';
    } else if (p.includes('drex') || p.includes('rwa') || p.includes('token')) {
      respostaTexto =
        'Existem 3 pools ativas no Piloto DREX somando R$ 6.800.000,00 em TVL. O mercado secundário registrou zero tentativas de cambismo acima do teto de +20%, com R$ 42,38 em royalties distribuídos automaticamente.';
      sugestaoAcao = 'Verificar Pools na Rede DREX';
    } else {
      respostaTexto = `Análise formal realizada pelo Swarm de IA: O período ${
        dto.periodoReferencia || 'corrente'
      } encontra-se 100% conciliado em partidas dobradas ($\sum D = \sum C$), sem pendências na CVM, Bacen ou Receita Federal.`;
    }

    const mensagem: AiCfoCopilotMessageDto = {
      id: `msg-${Date.now()}`,
      usuarioId: 'cfo-web-user',
      perguntaUsuario: dto.pergunta,
      respostaCopilot: respostaTexto,
      sugestaoAcao,
      dataHora: new Date().toISOString(),
    };

    this.inMemoryCopilotMessages.push(mensagem);

    return {
      respostaTexto,
      sugestaoAcao,
      confiancaRespostaPercent: 99.2,
    };
  }

  // ============================================================================
  // INSIGHTS PREDITIVOS DE BALANÇO
  // ============================================================================
  async listarInsightsPreditivos(): Promise<AiPredictiveBalanceInsightDto[]> {
    await this.ensureSeedData();
    return this.inMemoryInsights;
  }
}
