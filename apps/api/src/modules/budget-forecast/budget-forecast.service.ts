import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CategoriaOrcamentaria,
  StatusVarianciaOrcamentaria,
} from '@diskingressos/types';
import type {
  CorporateBudgetDto,
  BudgetLineItemDto,
  ForecastVarianceRecordDto,
  BudgetDashboardKpisDto,
  SimularCenarioOrcamentarioRequestDto,
  SimularCenarioOrcamentarioResponseDto,
} from '@diskingressos/types';

@Injectable()
export class BudgetForecastService {
  private readonly logger = new Logger(BudgetForecastService.name);

  private inMemoryOrcamentos: CorporateBudgetDto[] = [];
  private inMemoryForecasts: ForecastVarianceRecordDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Gestão Orçamentária e Rolling Forecast (Fase 35)...');

    const item1: BudgetLineItemDto = {
      id: 'bli-001',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CAPEX_INFRAESTRUTURA,
      centroCustoCodigo: 'CC-TECH-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 450000.0,
      valorRealizadoBrl: 420000.0,
      varianciaPercentual: -6.67,
      statusVariancia: StatusVarianciaOrcamentaria.SOBRECAPACIDADE_ECONOMIA,
    };

    const item2: BudgetLineItemDto = {
      id: 'bli-002',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.CUSTO_TRANSACIONAL_GATEWAYS,
      centroCustoCodigo: 'CC-OPS-GATEWAY',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 180000.0,
      valorRealizadoBrl: 175000.0,
      varianciaPercentual: -2.78,
      statusVariancia: StatusVarianciaOrcamentaria.DENTRO_DA_META,
    };

    const item3: BudgetLineItemDto = {
      id: 'bli-003',
      orcamentoId: 'bgt-2026',
      categoria: CategoriaOrcamentaria.OPEX_MARKETING_DIGITAL,
      centroCustoCodigo: 'CC-MKT-01',
      mesCompetencia: '2026-04',
      valorOrcadoBrl: 90000.0,
      valorRealizadoBrl: 105000.0,
      varianciaPercentual: 16.67,
      statusVariancia: StatusVarianciaOrcamentaria.ALERTA_ESTOURO,
    };

    const orcamento1: CorporateBudgetDto = {
      id: 'bgt-2026',
      codigoOrcamento: 'BGT-2026-CORP',
      anoExercicio: 2026,
      descricao: 'Orçamento Anual Master DiskIngressos Corp 2026',
      valorTotalPrevistoBrl: 8500000.0,
      valorTotalExecutadoBrl: 2450000.0,
      statusAprovacao: 'APROVADO_CONSELHO',
      criadoEm: '2026-01-01T08:00:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
      itens: [item1, item2, item3],
    };

    this.inMemoryOrcamentos = [orcamento1];

    const fc1: ForecastVarianceRecordDto = {
      id: 'fc-001',
      codigoForecast: 'FC-IA-2026-04',
      mesReferencia: '2026-04',
      projecaoProximosMeses: [
        { mes: '2026-05', projecaoReceitaBrl: 3200000, projecaoDespesaBrl: 1400000, ebitdaProjetadoBrl: 1800000 },
        { mes: '2026-06', projecaoReceitaBrl: 4100000, projecaoDespesaBrl: 1650000, ebitdaProjetadoBrl: 2450000 },
        { mes: '2026-07', projecaoReceitaBrl: 5800000, projecaoDespesaBrl: 2100000, ebitdaProjetadoBrl: 3700000 },
      ],
      confiancaIaPercent: 96.8,
      fatorSazonalidade: 1.42,
      criadoEm: '2026-04-01T10:00:00Z',
    };

    this.inMemoryForecasts = [fc1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<BudgetDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      orcamentoTotalAnoBrl: 8500000.0,
      executadoAcumuladoBrl: 2450000.0,
      varianciaConsolidadaPercent: -4.2,
      totalLinhasOrcamentarias: 42,
      linhasEmAlertaEstouro: 3,
      economiaProjetadaRollingBrl: 350000.0,
    };
  }

  async listarOrcamentos(): Promise<CorporateBudgetDto[]> {
    await this.ensureSeedData();
    return this.inMemoryOrcamentos;
  }

  async listarForecasts(): Promise<ForecastVarianceRecordDto[]> {
    await this.ensureSeedData();
    return this.inMemoryForecasts;
  }

  async simularCenario(dto: SimularCenarioOrcamentarioRequestDto): Promise<SimularCenarioOrcamentarioResponseDto> {
    await this.ensureSeedData();
    const ebitdaBase = 2450000.0;
    const impactoReceita = ebitdaBase * (dto.ajustePercentualReceita / 100);
    const impactoDespesas = ebitdaBase * 0.45 * ((dto.ajustePercentualOpex + dto.ajustePercentualCapex) / 200);

    const novoEbitdaProjetadoBrl = Number((ebitdaBase + impactoReceita - impactoDespesas).toFixed(2));
    const impactoMargemPercentual = Number((((novoEbitdaProjetadoBrl - ebitdaBase) / ebitdaBase) * 100).toFixed(2));

    return {
      cenarioId: `CEN-${Date.now().toString().slice(-4)}`,
      novoEbitdaProjetadoBrl,
      impactoMargemPercentual,
      riscoEstouroClassificacao: impactoMargemPercentual >= 0 ? 'CONTROLADO_DENTRO_DA_META' : 'ALERTA_PRESSAO_MARGEM',
    };
  }
}
