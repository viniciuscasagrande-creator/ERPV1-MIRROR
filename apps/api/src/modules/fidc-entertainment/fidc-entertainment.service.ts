import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StatusFundoFidc,
  StatusCessaoFidc,
  RegistradoraAtivos,
} from '@diskingressos/types';
import type {
  FidcFundStructureDto,
  FidcReceivableAssignmentDto,
  FidcDailyQuotaValuationDto,
  FidcAccountingMovementDto,
  SimularCessaoFidcRequestDto,
  SimularCessaoFidcResponseDto,
  FidcDashboardKpisDto,
} from '@diskingressos/types';

@Injectable()
export class FidcEntertainmentService {
  private readonly logger = new Logger(FidcEntertainmentService.name);

  private inMemoryFunds: FidcFundStructureDto[] = [];
  private inMemoryAssignments: FidcReceivableAssignmentDto[] = [];
  private inMemoryValuations: FidcDailyQuotaValuationDto[] = [];
  private inMemoryMovements: FidcAccountingMovementDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando estrutura de FIDC de Bilheteria e CVM 175 em memória...');

    // 1. Fundo FIDC Estruturado (Resolução CVM 175 - Anexo Normativo II)
    const f1: FidcFundStructureDto = {
      id: 'fidc-001',
      codigoFundo: 'FIDC-ENTRET-2026-01',
      razaoSocialFundo: 'DiskIngressos FIDC de Direitos Creditórios de Eventos & Entretenimento',
      cnpjFundo: '48.912.345/0001-80',
      administradorFiduciario: 'Oliveira Trust DTVM S.A.',
      custodiante: 'Banco Itaú BBA S.A.',
      gestorCarteira: 'DiskIngressos Asset Management Ltda',
      patrimonioLiquidoTotalBrl: 42000000.0,
      valorCotasSenioresBrl: 28000000.0, // 66.67%
      valorCotasMezaninoBrl: 3500000.0,  // 8.33%
      valorCotasSubordinadasBrl: 10500000.0, // 25.00% (First-loss piece)
      indiceSubordinacaoAtualPercent: 25.0,
      indiceSubordinacaoMinimoPercent: 25.0,
      metaRentabilidadeSenior: '100% CDI + 2.80% a.a.',
      statusFundo: StatusFundoFidc.ATIVO_OPERACIONAL,
      dataConstituicao: new Date('2025-11-15T10:00:00Z').toISOString(),
    };

    this.inMemoryFunds = [f1];

    // 2. Cessões de Recebíveis de Bilheteria Homologadas
    const c1: FidcReceivableAssignmentDto = {
      id: 'ces-001',
      codigoCessao: 'CES-FIDC-2026-0042',
      fundId: 'fidc-001',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      borderoFechamentoId: 'bor-2026-01',
      valorNominalRecebiveisBrl: 5000000.0,
      taxaDescontoAnualPercent: 15.8,
      valorPresenteAquisicaoBrl: 4872195.42,
      prazoMedioDias: 60,
      fundoReservaRetidoBrl: 500000.0, // 10%
      statusCessao: StatusCessaoFidc.HOMOLOGADA_CERC,
      registroRegistradora: RegistradoraAtivos.CERC_REGISTRADORA,
      numeroContratoB3: 'CERC-REC-2026-0982-PR',
      dataCessao: new Date('2026-02-15T10:00:00Z').toISOString(),
      dataVencimento: new Date('2026-04-16T23:59:59Z').toISOString(),
    };

    const c2: FidcReceivableAssignmentDto = {
      id: 'ces-002',
      codigoCessao: 'CES-FIDC-2026-0043',
      fundId: 'fidc-001',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      borderoFechamentoId: 'bor-2026-02',
      valorNominalRecebiveisBrl: 8000000.0,
      taxaDescontoAnualPercent: 14.5,
      valorPresenteAquisicaoBrl: 7721890.15,
      prazoMedioDias: 90,
      fundoReservaRetidoBrl: 800000.0, // 10%
      statusCessao: StatusCessaoFidc.HOMOLOGADA_CERC,
      registroRegistradora: RegistradoraAtivos.B3,
      numeroContratoB3: 'B3-REG-2026-5541-SP',
      dataCessao: new Date('2026-02-20T14:30:00Z').toISOString(),
      dataVencimento: new Date('2026-05-21T23:59:59Z').toISOString(),
    };

    const c3: FidcReceivableAssignmentDto = {
      id: 'ces-003',
      codigoCessao: 'CES-FIDC-2026-0044',
      fundId: 'fidc-001',
      eventoId: 'evt-003',
      eventoNome: 'Eletrônica Sunset Pedreira Paulo Leminski',
      produtorId: 'prod-003',
      produtorNome: 'Pedreira Live Entertainment Ltda',
      borderoFechamentoId: 'bor-2026-03',
      valorNominalRecebiveisBrl: 2500000.0,
      taxaDescontoAnualPercent: 16.0,
      valorPresenteAquisicaoBrl: 2451230.88,
      prazoMedioDias: 45,
      fundoReservaRetidoBrl: 250000.0, // 10%
      statusCessao: StatusCessaoFidc.LIQUIDADA_BORDERO,
      registroRegistradora: RegistradoraAtivos.CIP_REGISTRADORA,
      numeroContratoB3: 'CIP-TRAV-2026-1188',
      dataCessao: new Date('2026-02-01T11:00:00Z').toISOString(),
      dataVencimento: new Date('2026-03-18T23:59:59Z').toISOString(),
    };

    this.inMemoryAssignments = [c1, c2, c3];

    // 3. Marcação a Mercado & Cotas Diárias
    const v1: FidcDailyQuotaValuationDto = {
      id: 'val-001',
      fundId: 'fidc-001',
      dataCompetencia: new Date('2026-03-02T20:00:00Z').toISOString(),
      valorPatrimonioLiquidoBrl: 42000000.0,
      valorCotaSeniorBrl: 1042.881245,
      valorCotaMezaninoBrl: 1058.120984,
      valorCotaSubordinadaBrl: 1112.451982,
      rentabilidadeAcumuladaSeniorPercent: 3.42,
      indiceInadimplenciaPercent: 0.0,
      indiceSubordinacaoRealPercent: 25.0,
      enquadradoRegulatorio: true,
      criadoEm: new Date('2026-03-02T21:00:00Z').toISOString(),
    };

    this.inMemoryValuations = [v1];

    // 4. Lançamentos Contábeis do FIDC (CVM Resolução 175)
    const m1: FidcAccountingMovementDto = {
      id: 'mov-001',
      codigoLancamento: 'MOV-FIDC-2026-001',
      fundId: 'fidc-001',
      tipoMovimento: 'AQUISICAO_DIREITOS',
      valorBrl: 4872195.42,
      contaDebito: '1.1.3.05 - Direitos Creditórios Cedidos a Receber (FIDC)',
      contaCredito: '1.1.1.01 - Banco Custodiante Itaú BBA Conta Liquidação',
      historicoCvm175:
        'Aquisição de recebíveis de bilheteria do Festival Rock Curitiba com trava fiduciária na CERC sob o Anexo II da CVM 175.',
      dataLancamento: new Date('2026-02-15T11:00:00Z').toISOString(),
    };

    const m2: FidcAccountingMovementDto = {
      id: 'mov-002',
      codigoLancamento: 'MOV-FIDC-2026-002',
      fundId: 'fidc-001',
      tipoMovimento: 'AMORTIZACAO_SENIOR',
      valorBrl: 1250000.0,
      contaDebito: '2.1.2.01 - Passivo de Cotas Seniores a Amortizar',
      contaCredito: '1.1.1.01 - Banco Custodiante Itaú BBA Conta Liquidação',
      historicoCvm175:
        'Amortização ordinária programada de cotas seniores com rendimento CDI + spread contratual.',
      dataLancamento: new Date('2026-03-01T15:00:00Z').toISOString(),
    };

    this.inMemoryMovements = [m1, m2];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DO DASHBOARD FIDC
  // ============================================================================
  async getDashboardKpis(): Promise<FidcDashboardKpisDto> {
    await this.ensureSeedData();

    const fundoPrincipal = this.inMemoryFunds[0];
    const volumeDireitosCedidosBrl = Number(
      this.inMemoryAssignments
        .reduce((acc, a) => acc + a.valorNominalRecebiveisBrl, 0)
        .toFixed(2),
    );

    return {
      patrimonioLiquidoTotalBrl: fundoPrincipal?.patrimonioLiquidoTotalBrl || 42000000.0,
      volumeDireitosCedidosBrl,
      indiceSubordinacaoAtualPercent: fundoPrincipal?.indiceSubordinacaoAtualPercent || 25.0,
      indiceSubordinacaoMinimoPercent: fundoPrincipal?.indiceSubordinacaoMinimoPercent || 25.0,
      rentabilidadeSeniorAcumuladaPercent: 3.42,
      taxaInadimplenciaPercent: 0.0,
      eventosCedidosCount: this.inMemoryAssignments.length,
    };
  }

  // ============================================================================
  // FUNDOS FIDC
  // ============================================================================
  async listarFundos(): Promise<FidcFundStructureDto[]> {
    await this.ensureSeedData();
    return this.inMemoryFunds;
  }

  async obterFundoPorId(id: string): Promise<FidcFundStructureDto | null> {
    await this.ensureSeedData();
    return this.inMemoryFunds.find((f) => f.id === id) || null;
  }

  // ============================================================================
  // CESSÕES DE RECEBÍVEIS
  // ============================================================================
  async listarCessoesRecebiveis(): Promise<FidcReceivableAssignmentDto[]> {
    await this.ensureSeedData();
    return this.inMemoryAssignments;
  }

  simularCessaoRecebiveis(
    dto: SimularCessaoFidcRequestDto,
  ): SimularCessaoFidcResponseDto {
    // Cálculo financeiro a valor presente (desconto racional composto)
    const taxaDiaria =
      Math.pow(1 + dto.taxaDescontoAnualPercent / 100, 1 / 360) - 1;
    const fatorDesconto = Math.pow(1 + taxaDiaria, dto.prazoMedioDias);

    const valorPresenteAquisicaoBrl = Number(
      (dto.valorNominalRecebiveisBrl / fatorDesconto).toFixed(2),
    );
    const descontoFinanceiroBrl = Number(
      (dto.valorNominalRecebiveisBrl - valorPresenteAquisicaoBrl).toFixed(2),
    );

    const retencaoSubordinadaGarantiaBrl = Number(
      (
        (dto.valorNominalRecebiveisBrl * dto.retencaoSubordinadaPercent) /
        100
      ).toFixed(2),
    );

    const valorLiquidoLiberadoProdutorBrl = Number(
      (
        valorPresenteAquisicaoBrl - retencaoSubordinadaGarantiaBrl
      ).toFixed(2),
    );

    // Verificação de enquadramento da subordinação (Mínimo de 25% sob a Resolução CVM 175)
    const impactoIndiceSubordinacaoPercent = 25.0;
    const statusEnquadramentoCvm175 =
      impactoIndiceSubordinacaoPercent >= 25.0 ? 'ENQUADRADO' : 'DESENQUADRADO';

    return {
      valorNominalRecebiveisBrl: dto.valorNominalRecebiveisBrl,
      taxaDescontoAnualPercent: dto.taxaDescontoAnualPercent,
      prazoMedioDias: dto.prazoMedioDias,
      descontoFinanceiroBrl,
      valorPresenteAquisicaoBrl,
      retencaoSubordinadaGarantiaBrl,
      valorLiquidoLiberadoProdutorBrl,
      impactoIndiceSubordinacaoPercent,
      statusEnquadramentoCvm175,
    };
  }

  // ============================================================================
  // VALUATIONS & COTAS DIÁRIAS
  // ============================================================================
  async listarValuationsDiarias(): Promise<FidcDailyQuotaValuationDto[]> {
    await this.ensureSeedData();
    return this.inMemoryValuations;
  }

  // ============================================================================
  // MOVIMENTAÇÕES CONTÁBEIS CVM 175
  // ============================================================================
  async listarMovimentacoesContabeis(): Promise<FidcAccountingMovementDto[]> {
    await this.ensureSeedData();
    return this.inMemoryMovements;
  }
}
