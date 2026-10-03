import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  ArtistRoyaltyAgreementDto,
  InternationalWithholdingTaxDto,
  ForeignRemittanceOrderDto,
  ArtistRoyaltyDashboardKpisDto,
  CalcularWithholdingTaxRequestDto,
  CalcularWithholdingTaxResponseDto,
} from '@diskingressos/types';

@Injectable()
export class ArtistRoyaltiesService {
  private readonly logger = new Logger(ArtistRoyaltiesService.name);

  private inMemoryContratos: ArtistRoyaltyAgreementDto[] = [];
  private inMemoryWithholdings: InternationalWithholdingTaxDto[] = [];
  private inMemoryRemessas: ForeignRemittanceOrderDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Royalties Internacionais e Withholding Tax (Fase 42)...');

    const c1: ArtistRoyaltyAgreementDto = {
      id: 'ctr-001',
      codigoContrato: 'CTR-ROY-2026-ROCK-USA',
      artistaNome: 'Foo Fighters / Red Hot Management',
      agenciaInternacional: 'WME - William Morris Endeavor LLC',
      paisOrigemIso: 'USA',
      possuiTratadoDuplaTrib: true,
      moedaContratual: 'USD',
      valorCacheMoedaOrigem: 450000.0,
      statusContrato: 'HOMOLOGADO_JURIDICO',
      criadoEm: '2026-03-15T10:00:00Z',
    };

    this.inMemoryContratos = [c1];

    const w1: InternationalWithholdingTaxDto = {
      id: 'wht-001',
      contratoId: 'ctr-001',
      codigoRetencao: 'RET-WHT-2026-0012',
      aliquotaIrrfPercent: 15.0, // 15% com tratado contra bitributação
      valorIrrfRetidoBrl: 371250.0, // 450k * 5.50 * 15%
      aliquotaCidePercent: 10.0, // 10% CIDE remessas
      valorCideDevidoBrl: 247500.0, // 450k * 5.50 * 10%
      darfIrrfNumero: 'DARF-IRRF-2026-99124',
      darfCideNumero: 'DARF-CIDE-2026-88123',
      dataCalculo: '2026-04-01T14:00:00Z',
    };

    this.inMemoryWithholdings = [w1];

    const r1: ForeignRemittanceOrderDto = {
      id: 'rem-001',
      codigoRemessa: 'REM-SWIFT-2026-0042',
      contratoId: 'ctr-001',
      bancoCambioIspb: '60701190',
      taxaCambioPtaxBrl: 5.50,
      valorLiquidoEnviadoMoeda: 382500.0, // 450k - 15% IRRF líquido
      swiftReference: 'SWIFT-CITIUS33-2026-88124',
      statusRemessa: 'LIQUIDADO_SWIFT',
      dataEfetivacao: '2026-04-01T15:00:00Z',
    };

    this.inMemoryRemessas = [r1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<ArtistRoyaltyDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalContratosInternacionais: 8,
      volumeTotalRemessasUsd: 3850000.0,
      tributosRetidosFonteBrl: 3410000.0,
      remessasSwiftLiquidadas: 8,
      taxaMediaPtaxPraticadaBrl: 5.48,
    };
  }

  async listarContratos(): Promise<ArtistRoyaltyAgreementDto[]> {
    await this.ensureSeedData();
    return this.inMemoryContratos;
  }

  async listarWithholdings(): Promise<InternationalWithholdingTaxDto[]> {
    await this.ensureSeedData();
    return this.inMemoryWithholdings;
  }

  async listarRemessas(): Promise<ForeignRemittanceOrderDto[]> {
    await this.ensureSeedData();
    return this.inMemoryRemessas;
  }

  async calcularWithholding(dto: CalcularWithholdingTaxRequestDto): Promise<CalcularWithholdingTaxResponseDto> {
    await this.ensureSeedData();
    const valorBrutoBrl = dto.valorCacheMoedaOrigem * dto.cotacaoPtaxBrl;
    const aliquotaIrrf = dto.possuiTratadoDuplaTrib ? 15.0 : 25.0;
    const aliquotaCide = 10.0;

    const valorIrrfBrl = Number(((valorBrutoBrl * aliquotaIrrf) / 100).toFixed(2));
    const valorCideBrl = Number(((valorBrutoBrl * aliquotaCide) / 100).toFixed(2));

    const valorLiquidoRemessaBrl = Number((valorBrutoBrl - valorIrrfBrl).toFixed(2));
    const valorLiquidoRemessaMoeda = Number((valorLiquidoRemessaBrl / dto.cotacaoPtaxBrl).toFixed(2));

    return {
      codigoRetencao: `RET-WHT-2026-${Date.now().toString().slice(-4)}`,
      valorBrutoBrl,
      aliquotaIrrfPercent: aliquotaIrrf,
      valorIrrfBrl,
      aliquotaCidePercent: aliquotaCide,
      valorCideBrl,
      valorLiquidoRemessaBrl,
      valorLiquidoRemessaMoeda,
    };
  }
}
