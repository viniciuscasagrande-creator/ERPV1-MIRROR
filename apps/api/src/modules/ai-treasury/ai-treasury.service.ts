import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AiCashFlowForecastDto,
  DynamicPricingRuleDto,
  ProducerCreditScoreDto,
  TreasuryCashSweepDto,
  AiTreasuryKpisDto,
  SimularCurvaVendasRequestDto,
  SimularCurvaVendasResponseDto,
  RatingProdutor,
  StatusRecomendacaoPreco,
  StatusAnaliseScore,
} from '@diskingressos/types';

@Injectable()
export class AiTreasuryService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback local com dados pré-configurados)
  // ============================================================================
  private inMemoryForecasts: AiCashFlowForecastDto[] = [];
  private inMemoryDynamicRules: DynamicPricingRuleDto[] = [];
  private inMemoryScores: ProducerCreditScoreDto[] = [];
  private inMemoryCashSweeps: TreasuryCashSweepDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.aiCashFlowForecast.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, utiliza fallback in-memory
    }

    // 1. Projeção de Fluxo de Caixa (IA - 30/60/90 Dias)
    const f1: AiCashFlowForecastDto = {
      id: 'prv-001',
      codigoPrevisao: 'PRV-2026-001',
      horizonteDias: 90,
      dataInicio: new Date('2026-03-01T00:00:00Z').toISOString(),
      dataFim: new Date('2026-05-30T23:59:59Z').toISOString(),
      saldoInicial: 480000.0,
      receitaPrevistaTotal: 3450000.0,
      despesaPrevistaTotal: 2980000.0,
      saldoProjetadoFinal: 950000.0,
      gapLiquidezIdentificado: false,
      dataGapPrevista: null,
      valorGapPrevisto: 0.0,
      probabilidadeConfianca: 96.2,
      acoesRecomendadas:
        'Liquidez estável. Recomenda-se aplicar excedente de R$ 350.000 em Cash Sweep overnight (100% CDI).',
      geradoEm: new Date('2026-03-01T08:00:00Z').toISOString(),
    };

    const f2: AiCashFlowForecastDto = {
      id: 'prv-002',
      codigoPrevisao: 'PRV-2026-002',
      horizonteDias: 30,
      dataInicio: new Date('2026-03-01T00:00:00Z').toISOString(),
      dataFim: new Date('2026-03-31T23:59:59Z').toISOString(),
      saldoInicial: 480000.0,
      receitaPrevistaTotal: 1250000.0,
      despesaPrevistaTotal: 1120000.0,
      saldoProjetadoFinal: 610000.0,
      gapLiquidezIdentificado: false,
      dataGapPrevista: null,
      valorGapPrevisto: 0.0,
      probabilidadeConfianca: 98.4,
      acoesRecomendadas:
        'Fluxo positivo. Virada do 2º lote do Festival de Inverno acelerará receitas em R$ 140.000.',
      geradoEm: new Date('2026-03-01T08:00:00Z').toISOString(),
    };

    this.inMemoryForecasts = [f1, f2];

    // 2. Regras de Precificação Dinâmica (Yield Management)
    const rule1: DynamicPricingRuleDto = {
      id: 'rule-001',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      loteId: 'lot-002',
      loteNome: 'Pista Premium - 2º Lote',
      precoOriginal: 220.0,
      precoSugeridoIa: 250.0,
      velocidadeVendasHora: 142, // Ingressos/hora
      percentualOcupacao: 82.5,
      elasticidadePrecoDemanda: 0.38, // Demanda inelástica (pouca sensibilidade a aumento)
      motivoRecomendacao:
        'Velocidade de vendas 45% acima da curva histórica. Recomenda-se virada antecipada para capturar R$ 42.000 de margem adicional.',
      status: StatusRecomendacaoPreco.SUGERIDO,
      aplicadoEm: null,
      createdAt: new Date('2026-03-02T11:00:00Z').toISOString(),
    };

    const rule2: DynamicPricingRuleDto = {
      id: 'rule-002',
      eventId: 'evt-002',
      eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
      loteId: 'lot-001',
      loteNome: 'Plateia Central - Lote 1',
      precoOriginal: 180.0,
      precoSugeridoIa: 195.0,
      velocidadeVendasHora: 88,
      percentualOcupacao: 68.0,
      elasticidadePrecoDemanda: 0.42,
      motivoRecomendacao:
        'Esgotamento previsto em 6 horas. Ajuste dinâmico autorizado para maximizar receita líquida.',
      status: StatusRecomendacaoPreco.APLICADO,
      aplicadoEm: new Date('2026-03-01T16:00:00Z').toISOString(),
      createdAt: new Date('2026-03-01T14:00:00Z').toISOString(),
    };

    this.inMemoryDynamicRules = [rule1, rule2];

    // 3. Credit Scoring & Ratings de Produtores
    const score1: ProducerCreditScoreDto = {
      id: 'sc-001',
      producerId: 'prod-001',
      producerNome: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
      documentoFiscal: '04.821.902/0001-44',
      scorePontuacao: 920,
      rating: RatingProdutor.AAA,
      limiteAntecipacaoMaximo: 750000.0,
      percentualMaximoRecebiveis: 75.0,
      historicoEventosRealizados: 48,
      taxaOcupacaoMediaPercent: 91.5,
      indiceChargebackPercent: 0.12,
      status: StatusAnaliseScore.HOMOLOGADO,
      ultimaAnaliseEm: new Date('2026-02-28T18:00:00Z').toISOString(),
    };

    const score2: ProducerCreditScoreDto = {
      id: 'sc-002',
      producerId: 'prod-002',
      producerNome: 'Seven Entretenimento & Promoções Artísticas Ltda',
      documentoFiscal: '07.342.110/0001-00',
      scorePontuacao: 785,
      rating: RatingProdutor.AA,
      limiteAntecipacaoMaximo: 350000.0,
      percentualMaximoRecebiveis: 50.0,
      historicoEventosRealizados: 22,
      taxaOcupacaoMediaPercent: 84.0,
      indiceChargebackPercent: 0.35,
      status: StatusAnaliseScore.HOMOLOGADO,
      ultimaAnaliseEm: new Date('2026-03-01T10:00:00Z').toISOString(),
    };

    this.inMemoryScores = [score1, score2];

    // 4. Cash Sweep (Aplicação Automática de Sobras em CDI)
    const sw1: TreasuryCashSweepDto = {
      id: 'swp-001',
      codigoAplicacao: 'SWP-2026-0001',
      contaBancariaId: 'cta-itau-01',
      bancoNome: '341 - Itaú Unibanco S.A.',
      saldoAplicado: 350000.0,
      taxaRendimentoPercentCdi: 100.0,
      rendimentoAcumulado: 4120.5,
      status: 'APLICADO',
      dataAplicacao: new Date('2026-02-15T18:00:00Z').toISOString(),
      dataResgate: null,
    };

    this.inMemoryCashSweeps = [sw1];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS EXECUTIVOS
  // ============================================================================
  async getDashboardKpis(): Promise<AiTreasuryKpisDto> {
    await this.ensureSeedData();

    const volumeCashSweepAplicado = this.inMemoryCashSweeps
      .filter((s) => s.status === 'APLICADO')
      .reduce((acc, s) => acc + s.saldoAplicado, 0);

    const rendimentoFinanceiroTotal = this.inMemoryCashSweeps.reduce(
      (acc, s) => acc + s.rendimentoAcumulado,
      0,
    );

    const scoreTotal = this.inMemoryScores.reduce((acc, s) => acc + s.scorePontuacao, 0);
    const scoreMedioProdutores =
      this.inMemoryScores.length > 0 ? Math.round(scoreTotal / this.inMemoryScores.length) : 850;

    return {
      saldoProjetado90Dias: 950000.0,
      gapsLiquidezEvitadosCount: 4,
      aumentoReceitaYieldPercent: 14.8, // +14.8% de ganho médio com precificação dinâmica
      volumeCashSweepAplicado,
      rendimentoFinanceiroTotal,
      scoreMedioProdutores,
    };
  }

  // ============================================================================
  // PROJEÇÃO PREDITIVA DE FLUXO DE CAIXA
  // ============================================================================
  async obterPrevisaoFluxoCaixa(horizonteDias = 30): Promise<AiCashFlowForecastDto> {
    await this.ensureSeedData();

    const forecast = this.inMemoryForecasts.find((f) => f.horizonteDias === horizonteDias);
    if (forecast) return forecast;

    return this.inMemoryForecasts[0];
  }

  // ============================================================================
  // SIMULADOR DE CURVA DE VENDAS & YIELD MANAGEMENT
  // ============================================================================
  async simularCurvaVendasYield(
    dto: SimularCurvaVendasRequestDto,
  ): Promise<SimularCurvaVendasResponseDto> {
    const velocidadeVendasHora = Math.round(dto.vendasNasUltimas24h / 24);
    const percentualOcupacaoAtual = dto.percentualVendido;

    // Lógica do algoritmo de elasticidade:
    // Se a ocupação > 70% e velocidade > 10 tickets/hora -> Recomenda aumento de 10% a 15%
    let precoOtimizadoSugerido = dto.precoLoteAtual;
    let recomendacaoAcao: SimularCurvaVendasResponseDto['recomendacaoAcao'] = 'MANTER_PRECO';
    let justificativaIa = '';

    if (percentualOcupacaoAtual >= 75 && velocidadeVendasHora >= 15) {
      precoOtimizadoSugerido = Number((dto.precoLoteAtual * 1.15).toFixed(2));
      recomendacaoAcao = 'VIRAR_LOTE_ANTECIPADO';
      justificativaIa =
        'Forte aceleração de demanda identificada. A antecipação da virada de lote ampliará a receita total sem prejudicar o ritmo de ocupação.';
    } else if (percentualOcupacaoAtual < 40 && dto.diasAteEvento <= 10) {
      precoOtimizadoSugerido = Number((dto.precoLoteAtual * 0.9).toFixed(2));
      recomendacaoAcao = 'PROMOVER_LOTE_FLASH';
      justificativaIa =
        'Proximidade do espetáculo com ocupação abaixo da média. Sugere-se lote relâmpago promocional para aquecer a conversão.';
    } else {
      precoOtimizadoSugerido = dto.precoLoteAtual;
      recomendacaoAcao = 'MANTER_PRECO';
      justificativaIa =
        'Ritmo de vendas em equilíbrio com o modelo preditivo. Recomenda-se manter a grade de preços atual.';
    }

    const ingressosRestantes = Math.round(dto.capacidadeTotal * (1 - percentualOcupacaoAtual / 100));
    const incrementoReceitaEstimado = Number(
      ((precoOtimizadoSugerido - dto.precoLoteAtual) * ingressosRestantes * 0.7).toFixed(2),
    );

    return {
      velocidadeVendasHora,
      percentualOcupacaoAtual,
      precoOtimizadoSugerido,
      incrementoReceitaEstimado: Math.max(0, incrementoReceitaEstimado),
      recomendacaoAcao,
      justificativaIa,
    };
  }

  // ============================================================================
  // PRECIFICAÇÃO DINÂMICA
  // ============================================================================
  async listarRegrasPrecificacaoDinamica(): Promise<DynamicPricingRuleDto[]> {
    await this.ensureSeedData();
    return this.inMemoryDynamicRules;
  }

  async aplicarPrecoDinamico(id: string): Promise<DynamicPricingRuleDto> {
    await this.ensureSeedData();
    const idx = this.inMemoryDynamicRules.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Regra de precificação dinâmica ${id} não localizada.`);
    }

    this.inMemoryDynamicRules[idx].status = StatusRecomendacaoPreco.APLICADO;
    this.inMemoryDynamicRules[idx].aplicadoEm = new Date().toISOString();
    return this.inMemoryDynamicRules[idx];
  }

  // ============================================================================
  // CREDIT SCORING & RATINGS DE PRODUTORES
  // ============================================================================
  async listarScoresProdutores(): Promise<ProducerCreditScoreDto[]> {
    await this.ensureSeedData();
    return this.inMemoryScores;
  }

  async obterScoreProdutor(producerId: string): Promise<ProducerCreditScoreDto> {
    await this.ensureSeedData();
    const score = this.inMemoryScores.find((s) => s.producerId === producerId);
    if (!score) {
      throw new NotFoundException(`Score para a produtora ${producerId} não encontrado.`);
    }
    return score;
  }

  // ============================================================================
  // CASH SWEEP (SOBRAS DE TESOURARIA EM CDI)
  // ============================================================================
  async listarAplicacoesCashSweep(): Promise<TreasuryCashSweepDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCashSweeps;
  }

  async executarCashSweep(valor: number, bancoNome: string): Promise<TreasuryCashSweepDto> {
    await this.ensureSeedData();

    const novoSweep: TreasuryCashSweepDto = {
      id: `swp-00${this.inMemoryCashSweeps.length + 1}`,
      codigoAplicacao: `SWP-2026-${String(this.inMemoryCashSweeps.length + 1).padStart(4, '0')}`,
      contaBancariaId: 'cta-master-01',
      bancoNome: bancoNome || '341 - Itaú Unibanco S.A.',
      saldoAplicado: valor,
      taxaRendimentoPercentCdi: 100.0,
      rendimentoAcumulado: Number(((valor * 0.00045)).toFixed(2)), // ~1 dia de DI
      status: 'APLICADO',
      dataAplicacao: new Date().toISOString(),
      dataResgate: null,
    };

    this.inMemoryCashSweeps.unshift(novoSweep);
    return novoSweep;
  }
}
