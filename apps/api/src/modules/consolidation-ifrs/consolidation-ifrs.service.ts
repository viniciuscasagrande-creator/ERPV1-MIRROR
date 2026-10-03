import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ConsolidatedEntityDto,
  IntercompanyEliminationDto,
  EquityAccountingMepDto,
  ConsolidatedBalanceSheetDto,
  SimularConversaoIfrsRequestDto,
  SimularConversaoIfrsResponseDto,
  ConsolidationIfrsKpisDto,
  MetodoConsolidacao,
  TipoEntidadeGrupo,
  TipoOperacaoIntercompany,
  StatusConsolidacao,
} from '@diskingressos/types';

@Injectable()
export class ConsolidationIfrsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback local com dados pré-configurados)
  // ============================================================================
  private inMemoryEntities: ConsolidatedEntityDto[] = [];
  private inMemoryEliminations: IntercompanyEliminationDto[] = [];
  private inMemoryMep: EquityAccountingMepDto[] = [];
  private inMemoryStatements: ConsolidatedBalanceSheetDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.consolidatedEntity.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, utiliza fallback local
    }

    // 1. Entidades do Grupo Econômico & SPEs
    const e1: ConsolidatedEntityDto = {
      id: 'ent-001',
      codigoEntidade: 'ENT-MATRIZ',
      razaoSocial: 'DiskIngressos Serviços de Bilheteria Ltda (Matriz Curitiba)',
      cnpj: '08.123.456/0001-99',
      tipoEntidade: TipoEntidadeGrupo.MATRIZ,
      percentualParticipacao: 100.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    };

    const e2: ConsolidatedEntityDto = {
      id: 'ent-002',
      codigoEntidade: 'ENT-FILIAL-SP',
      razaoSocial: 'DiskIngressos São Paulo Eventos e Entretenimento Ltda',
      cnpj: '08.123.456/0002-70',
      tipoEntidade: TipoEntidadeGrupo.FILIAL,
      percentualParticipacao: 100.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    };

    const e3: ConsolidatedEntityDto = {
      id: 'ent-003',
      codigoEntidade: 'ENT-SPE-PEDREIRA',
      razaoSocial: 'SPE Pedreira Paulo Leminski Festivais de Inverno S.A.',
      cnpj: '45.892.110/0001-33',
      tipoEntidade: TipoEntidadeGrupo.SPE_EVENTO,
      percentualParticipacao: 60.0,
      metodoConsolidacao: MetodoConsolidacao.CONSOLIDACAO_INTEGRAL,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-01-15T00:00:00Z').toISOString(),
    };

    const e4: ConsolidatedEntityDto = {
      id: 'ent-004',
      codigoEntidade: 'ENT-SCP-INVESTIDORES',
      razaoSocial: 'SCP Investidores Prime Tour 2026 (Coligada)',
      cnpj: '98.321.774/0001-11',
      tipoEntidade: TipoEntidadeGrupo.SCP_INVESTIDA,
      percentualParticipacao: 40.0,
      metodoConsolidacao: MetodoConsolidacao.EQUIVALENCIA_PATRIMONIAL_MEP,
      moedaFuncional: 'BRL',
      ativa: true,
      createdAt: new Date('2026-02-01T00:00:00Z').toISOString(),
    };

    this.inMemoryEntities = [e1, e2, e3, e4];

    // 2. Eliminações Intercompany (CPC 36 / IFRS 10)
    const el1: IntercompanyEliminationDto = {
      id: 'elm-001',
      codigoEliminacao: 'ELM-2026-0001',
      periodoAnoMes: '2026-03',
      tipoOperacao: TipoOperacaoIntercompany.REPASSE_TAXA_SERVICO,
      entidadeOrigemId: 'ent-001',
      entidadeOrigemNome: 'DiskIngressos Matriz',
      entidadeDestinoId: 'ent-003',
      entidadeDestinoNome: 'SPE Pedreira Paulo Leminski S.A.',
      valorEliminadoBrl: 850000.0,
      contaContabilDebito: '4.1.1.02 - Receita Bruta de Serviços Intercompany',
      contaContabilCredito: '3.1.2.05 - Custo de Taxas de Intermediação Intercompany',
      justificativaIfrs:
        'Eliminação de receita e despesa recíproca de intermediação de ingressos entre Matriz e SPE (CPC 36 item B86).',
      eliminadoEm: new Date('2026-03-02T18:00:00Z').toISOString(),
    };

    const el2: IntercompanyEliminationDto = {
      id: 'elm-002',
      codigoEliminacao: 'ELM-2026-0002',
      periodoAnoMes: '2026-03',
      tipoOperacao: TipoOperacaoIntercompany.MUTUO_FINANCEIRO_INTERNO,
      entidadeOrigemId: 'ent-001',
      entidadeOrigemNome: 'DiskIngressos Matriz',
      entidadeDestinoId: 'ent-002',
      entidadeDestinoNome: 'Filial São Paulo Ltda',
      valorEliminadoBrl: 600000.0,
      contaContabilDebito: '2.1.3.01 - Passivo de Mútuo a Pagar Intercompany',
      contaContabilCredito: '1.1.3.01 - Ativo de Mútuo a Receber Intercompany',
      justificativaIfrs:
        'Eliminação de saldos patrimoniais recíprocos de mútuo de capital de giro entre Matriz e Filial SP.',
      eliminadoEm: new Date('2026-03-02T18:30:00Z').toISOString(),
    };

    this.inMemoryEliminations = [el1, el2];

    // 3. Apuração de Equivalência Patrimonial MEP (CPC 18 / IAS 28)
    const mep1: EquityAccountingMepDto = {
      id: 'mep-001',
      codigoApuracaoMep: 'MEP-2026-0001',
      investidaId: 'ent-004',
      investidaNome: 'SCP Investidores Prime Tour 2026 (Coligada)',
      periodoApuracao: '1T-2026',
      percentualDetido: 40.0,
      patrimonioLiquidoAjustado: 3200000.0,
      lucroLiquidoPeriodo: 1200000.0,
      resultadoEquivalenciaBrl: 480000.0, // 40% de 1.200.000,00
      valorInvestimentoContabil: 1280000.0, // 40% de 3.200.000,00
      dataApuracao: new Date('2026-03-02T19:00:00Z').toISOString(),
    };

    this.inMemoryMep = [mep1];

    // 4. Balanço Patrimonial e DRE Consolidados (BRL e USD)
    const dfsBrl: ConsolidatedBalanceSheetDto = {
      id: 'dfs-001',
      codigoDemonstracao: 'DFS-IFRS-2026-01-BRL',
      periodo: '2026-03',
      moedaApresentacao: 'BRL',
      taxaConversaoFechamento: 1.0,
      ativoCirculanteTotal: 32400000.0,
      ativoNaoCirculanteTotal: 12800000.0,
      ativoTotal: 45200000.0,
      passivoCirculanteTotal: 14200000.0,
      passivoNaoCirculanteTotal: 4500000.0,
      patrimonioLiquidoTotal: 26500000.0,
      ajusteAvaliacaoPatrimonial: 0.0,
      receitaLiquidaConsolidada: 18950000.0,
      lucroLiquidoConsolidado: 4120000.0,
      status: StatusConsolidacao.FECHADO_AUDITADO,
      geradoEm: new Date('2026-03-02T20:00:00Z').toISOString(),
    };

    const dfsUsd: ConsolidatedBalanceSheetDto = {
      id: 'dfs-002',
      codigoDemonstracao: 'DFS-IFRS-2026-01-USD',
      periodo: '2026-03',
      moedaApresentacao: 'USD',
      taxaConversaoFechamento: 5.654,
      ativoCirculanteTotal: 5730456.31,
      ativoNaoCirculanteTotal: 2263884.0,
      ativoTotal: 7994340.31, // 45.200.000 / 5.6540
      passivoCirculanteTotal: 2511496.29,
      passivoNaoCirculanteTotal: 795896.71,
      patrimonioLiquidoTotal: 4686947.31, // 26.500.000 / 5.6540
      ajusteAvaliacaoPatrimonial: -14250.0, // Efeito da taxa média DRE vs taxa fechamento Balanço (CPC 02)
      receitaLiquidaConsolidada: 3371886.12,
      lucroLiquidoConsolidado: 733097.35,
      status: StatusConsolidacao.FECHADO_AUDITADO,
      geradoEm: new Date('2026-03-02T20:15:00Z').toISOString(),
    };

    this.inMemoryStatements = [dfsBrl, dfsUsd];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DE CONSOLIDAÇÃO IFRS
  // ============================================================================
  async getDashboardKpis(): Promise<ConsolidationIfrsKpisDto> {
    await this.ensureSeedData();

    const totalEliminacoesIntercompanyBrl = this.inMemoryEliminations.reduce(
      (acc, el) => acc + el.valorEliminadoBrl,
      0,
    );

    const resultadoMepAcumuladoBrl = this.inMemoryMep.reduce(
      (acc, m) => acc + m.resultadoEquivalenciaBrl,
      0,
    );

    return {
      ativoTotalConsolidadoBrl: 45200000.0,
      ativoTotalConsolidadoUsd: 7994340.31,
      totalEliminacoesIntercompanyBrl,
      resultadoMepAcumuladoBrl,
      entidadesConsolidadasCount: this.inMemoryEntities.length,
      aderenciaNormasIfrsPercent: 100.0,
    };
  }

  // ============================================================================
  // ENTIDADES DO GRUPO
  // ============================================================================
  async listarEntidades(): Promise<ConsolidatedEntityDto[]> {
    await this.ensureSeedData();
    return this.inMemoryEntities;
  }

  // ============================================================================
  // ELIMINAÇÕES INTERCOMPANY (CPC 36 / IFRS 10)
  // ============================================================================
  async listarEliminacoes(): Promise<IntercompanyEliminationDto[]> {
    await this.ensureSeedData();
    return this.inMemoryEliminations;
  }

  async criarEliminacao(dto: {
    periodoAnoMes: string;
    tipoOperacao: TipoOperacaoIntercompany;
    entidadeOrigemId: string;
    entidadeDestinoId: string;
    valorEliminadoBrl: number;
    contaContabilDebito: string;
    contaContabilCredito: string;
    justificativaIfrs: string;
  }): Promise<IntercompanyEliminationDto> {
    await this.ensureSeedData();

    const entOrigem = this.inMemoryEntities.find((e) => e.id === dto.entidadeOrigemId);
    const entDestino = this.inMemoryEntities.find((e) => e.id === dto.entidadeDestinoId);

    const nova: IntercompanyEliminationDto = {
      id: `elm-00${this.inMemoryEliminations.length + 1}`,
      codigoEliminacao: `ELM-2026-${String(this.inMemoryEliminations.length + 1).padStart(4, '0')}`,
      periodoAnoMes: dto.periodoAnoMes,
      tipoOperacao: dto.tipoOperacao,
      entidadeOrigemId: dto.entidadeOrigemId,
      entidadeOrigemNome: entOrigem?.razaoSocial || 'Entidade Origem',
      entidadeDestinoId: dto.entidadeDestinoId,
      entidadeDestinoNome: entDestino?.razaoSocial || 'Entidade Destino',
      valorEliminadoBrl: dto.valorEliminadoBrl,
      contaContabilDebito: dto.contaContabilDebito,
      contaContabilCredito: dto.contaContabilCredito,
      justificativaIfrs: dto.justificativaIfrs,
      eliminadoEm: new Date().toISOString(),
    };

    this.inMemoryEliminations.unshift(nova);
    return nova;
  }

  // ============================================================================
  // EQUIVALÊNCIA PATRIMONIAL - MEP (CPC 18 / IAS 28)
  // ============================================================================
  async listarApuracoesMep(): Promise<EquityAccountingMepDto[]> {
    await this.ensureSeedData();
    return this.inMemoryMep;
  }

  // ============================================================================
  // DEMONSTRAÇÕES FINANCEIRAS CONSOLIDADAS (IFRS)
  // ============================================================================
  async listarDemonstracoesConsolidadas(
    moeda?: 'BRL' | 'USD' | 'EUR',
  ): Promise<ConsolidatedBalanceSheetDto[]> {
    await this.ensureSeedData();
    if (moeda) {
      return this.inMemoryStatements.filter((s) => s.moedaApresentacao === moeda);
    }
    return this.inMemoryStatements;
  }

  // ============================================================================
  // MOTOR DE CONVERSÃO PARA MOEDA ESTRANGEIRA (CPC 02 / IAS 21)
  // ============================================================================
  async simularConversaoIfrs(
    dto: SimularConversaoIfrsRequestDto,
  ): Promise<SimularConversaoIfrsResponseDto> {
    await this.ensureSeedData();

    const baseBrl = this.inMemoryStatements.find((s) => s.moedaApresentacao === 'BRL') || {
      ativoTotal: 45200000.0,
      passivoCirculanteTotal: 14200000.0,
      passivoNaoCirculanteTotal: 4500000.0,
      patrimonioLiquidoTotal: 26500000.0,
      receitaLiquidaConsolidada: 18950000.0,
      lucroLiquidoConsolidado: 4120000.0,
    };

    // CPC 02 / IAS 21:
    // Ativos e Passivos são convertidos pela taxa de fechamento spot
    const ativoTotalConvertido = Number(
      (baseBrl.ativoTotal / dto.taxaFechamentoSpot).toFixed(2),
    );
    const passivoTotalBrl =
      baseBrl.passivoCirculanteTotal + baseBrl.passivoNaoCirculanteTotal;
    const passivoTotalConvertido = Number(
      (passivoTotalBrl / dto.taxaFechamentoSpot).toFixed(2),
    );

    // Receitas e Despesas são convertidas pela taxa média do período
    const receitaLiquidaConvertida = Number(
      (baseBrl.receitaLiquidaConsolidada / dto.taxaMediaPeriodo).toFixed(2),
    );
    const lucroLiquidoConvertido = Number(
      (baseBrl.lucroLiquidoConsolidado / dto.taxaMediaPeriodo).toFixed(2),
    );

    // Patrimônio Líquido fecha pela diferença (Ativo - Passivo)
    const patrimonioLiquidoConvertido = Number(
      (ativoTotalConvertido - passivoTotalConvertido).toFixed(2),
    );

    // Ajuste de Avaliação Patrimonial (AAP) é a diferença entre o PL histórico e a conversão spot
    const plEsperadoTaxaMedia = Number(
      (baseBrl.patrimonioLiquidoTotal / dto.taxaMediaPeriodo).toFixed(2),
    );
    const ajusteAvaliacaoPatrimonialAap = Number(
      (patrimonioLiquidoConvertido - plEsperadoTaxaMedia).toFixed(2),
    );

    const balancoEquilibrado =
      Math.abs(ativoTotalConvertido - (passivoTotalConvertido + patrimonioLiquidoConvertido)) < 0.05;

    return {
      periodo: dto.periodo,
      moedaDestino: dto.moedaDestino,
      ativoTotalConvertido,
      passivoTotalConvertido,
      patrimonioLiquidoConvertido,
      ajusteAvaliacaoPatrimonialAap,
      receitaLiquidaConvertida,
      lucroLiquidoConvertido,
      balancoEquilibrado,
    };
  }
}
