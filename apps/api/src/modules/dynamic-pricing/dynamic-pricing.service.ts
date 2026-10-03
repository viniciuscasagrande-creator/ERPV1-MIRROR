import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  SetorIngressoDynamic,
  StatusPoliticaDynamic,
} from '@diskingressos/types';
import type {
  DynamicPricingPolicyDto,
  DynamicTicketBatchPriceDto,
  PriceSurgeAuditLogDto,
  DynamicPricingDashboardKpisDto,
  SimularAjusteDinamicoRequestDto,
  SimularAjusteDinamicoResponseDto,
} from '@diskingressos/types';

@Injectable()
export class DynamicPricingService {
  private readonly logger = new Logger(DynamicPricingService.name);

  private inMemoryPoliticas: DynamicPricingPolicyDto[] = [];
  private inMemoryLotes: DynamicTicketBatchPriceDto[] = [];
  private inMemorySurges: PriceSurgeAuditLogDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Precificação Dinâmica & Yield Management (Fase 41)...');

    const p1: DynamicPricingPolicyDto = {
      id: 'pol-001',
      codigoPolitica: 'POL-DYN-2026-0041',
      eventoId: 'evt-rock-arena',
      setorIngresso: SetorIngressoDynamic.PISTA_PREMIUM,
      precoBaseBrl: 450.0,
      precoPisoMinimoBrl: 350.0,
      precoTetoMaximoBrl: 750.0,
      fatorElasticidadeIa: 1.35,
      statusPolitica: StatusPoliticaDynamic.ATIVA_OPERACIONAL,
      criadoEm: '2026-04-01T08:00:00Z',
    };

    const p2: DynamicPricingPolicyDto = {
      id: 'pol-002',
      codigoPolitica: 'POL-DYN-2026-0042',
      eventoId: 'evt-rock-arena',
      setorIngresso: SetorIngressoDynamic.CAMAROTE_OPEN_BAR,
      precoBaseBrl: 850.0,
      precoPisoMinimoBrl: 700.0,
      precoTetoMaximoBrl: 1500.0,
      fatorElasticidadeIa: 1.5,
      statusPolitica: StatusPoliticaDynamic.ATIVA_OPERACIONAL,
      criadoEm: '2026-04-01T08:00:00Z',
    };

    this.inMemoryPoliticas = [p1, p2];

    const l1: DynamicTicketBatchPriceDto = {
      id: 'lot-001',
      politicaId: 'pol-001',
      loteNumero: 3,
      precoAtualVigenteBrl: 540.0,
      percentualAgio: 20.0,
      ingressosDisponiveis: 420,
      velocidadeVendasMinuto: 35.5,
      atualizadoEm: '2026-04-01T12:00:00Z',
    };

    this.inMemoryLotes = [l1];

    const s1: PriceSurgeAuditLogDto = {
      id: 'srg-001',
      codigoSurgeLog: 'SRG-IA-2026-9912',
      eventoId: 'evt-rock-arena',
      precoAnteriorBrl: 450.0,
      precoNovoBrl: 540.0,
      motivoGatilhoIa: 'ALTA_DEMANDA_SPIKE_VELOCIDADE_35_VENDAS_MINUTO',
      autorizadoPor: 'MOTOR_IA_PREDITIVO_YIELD',
      timestampGatilho: '2026-04-01T11:45:00Z',
    };

    this.inMemorySurges = [s1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<DynamicPricingDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalPoliticasAtivas: 12,
      receitaIncrementalAgioBrl: 485000.0,
      fatorMedioOcupacaoPercent: 88.4,
      disparosSurgePricingHoje: 14,
      ticketMedioDinamicoBrl: 495.0,
    };
  }

  async listarPoliticas(): Promise<DynamicPricingPolicyDto[]> {
    await this.ensureSeedData();
    return this.inMemoryPoliticas;
  }

  async listarLotes(): Promise<DynamicTicketBatchPriceDto[]> {
    await this.ensureSeedData();
    return this.inMemoryLotes;
  }

  async listarSurgeLogs(): Promise<PriceSurgeAuditLogDto[]> {
    await this.ensureSeedData();
    return this.inMemorySurges;
  }

  async simularAjuste(dto: SimularAjusteDinamicoRequestDto): Promise<SimularAjusteDinamicoResponseDto> {
    await this.ensureSeedData();
    const pol = this.inMemoryPoliticas.find((p) => p.id === dto.politicaId) || this.inMemoryPoliticas[0];

    let fatorMultiplicador = 1.0;
    if (dto.velocidadeVendasMinuto > 30 && dto.percentualEstoqueRestante < 30) {
      fatorMultiplicador = 1.25;
    } else if (dto.velocidadeVendasMinuto < 5 && dto.percentualEstoqueRestante > 70) {
      fatorMultiplicador = 0.9;
    }

    let precoCalculado = pol.precoBaseBrl * fatorMultiplicador;
    let dentroDasTravas = true;

    if (precoCalculado > pol.precoTetoMaximoBrl) {
      precoCalculado = pol.precoTetoMaximoBrl;
      dentroDasTravas = false;
    } else if (precoCalculado < pol.precoPisoMinimoBrl) {
      precoCalculado = pol.precoPisoMinimoBrl;
      dentroDasTravas = false;
    }

    const precoRecomendadoBrl = Number(precoCalculado.toFixed(2));
    const percentualVariacao = Number((((precoRecomendadoBrl - pol.precoBaseBrl) / pol.precoBaseBrl) * 100).toFixed(2));

    return {
      politicaId: pol.id,
      precoRecomendadoBrl,
      percentualVariacao,
      motivoAjuste: fatorMultiplicador > 1 ? 'SURGE_ALTA_DEMANDA' : fatorMultiplicador < 1 ? 'PROMO_ACELERACAO_GIRO' : 'PRECO_ESTAVEL',
      dentroDasTravas,
    };
  }
}
