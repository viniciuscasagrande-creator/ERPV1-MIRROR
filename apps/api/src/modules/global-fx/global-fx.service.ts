import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CurrencyExchangeRateDto,
  InternationalTicketSaleDto,
  FxHedgeContractDto,
  FxAccountingEntryDto,
  SimularCotacaoInternacionalRequestDto,
  SimularCotacaoInternacionalResponseDto,
  GlobalFxKpisDto,
  MoedaEstrangeira,
  StatusVendaInternacional,
  StatusHedgeCambial,
  TipoVariacaoCambial,
} from '@diskingressos/types';

@Injectable()
export class GlobalFxService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback local com dados pré-configurados)
  // ============================================================================
  private inMemoryRates: CurrencyExchangeRateDto[] = [];
  private inMemorySales: InternationalTicketSaleDto[] = [];
  private inMemoryHedges: FxHedgeContractDto[] = [];
  private inMemoryAccounting: FxAccountingEntryDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.currencyExchangeRate.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, utiliza fallback local
    }

    // 1. Cotações Oficiais PTAX e Taxas Spot Ativas
    const r1: CurrencyExchangeRateDto = {
      id: 'fx-rate-01',
      moedaOrigem: MoedaEstrangeira.USD,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 5.6540,
      spreadPercent: 2.5,
      taxaEfetivaSpot: 5.7954, // PTAX * (1 + 0.025)
      dataHoraCotacao: new Date('2026-03-02T13:00:00Z').toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    };

    const r2: CurrencyExchangeRateDto = {
      id: 'fx-rate-02',
      moedaOrigem: MoedaEstrangeira.EUR,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 6.1280,
      spreadPercent: 2.5,
      taxaEfetivaSpot: 6.2812,
      dataHoraCotacao: new Date('2026-03-02T13:00:00Z').toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    };

    const r3: CurrencyExchangeRateDto = {
      id: 'fx-rate-03',
      moedaOrigem: MoedaEstrangeira.GBP,
      moedaDestino: 'BRL',
      taxaPtaxOficial: 7.1850,
      spreadPercent: 2.8,
      taxaEfetivaSpot: 7.3862,
      dataHoraCotacao: new Date('2026-03-02T13:00:00Z').toISOString(),
      fonteCotacao: 'BACEN_SISBACEN_PTAX',
      ativa: true,
    };

    this.inMemoryRates = [r1, r2, r3];

    // 2. Vendas Internacionais de Ingressos
    const s1: InternationalTicketSaleDto = {
      id: 'fx-sale-01',
      codigoTransacao: 'INT-TRX-2026-0041',
      vendaId: 'vnd-intl-01',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      paisComprador: 'US',
      moedaEstrangeira: MoedaEstrangeira.USD,
      valorMoedaEstrangeira: 120.0,
      taxaCambioAplicada: 5.7954,
      aliquotaIofPercent: 4.38,
      valorIofBrl: 30.46,
      valorTotalBrl: 725.91,
      valorLiquidoProdutorBrl: 678.48, // 120 * 5.654
      spreadReceitaDiskBrl: 16.97, // Spread capturado pela Disk
      statusCambial: StatusVendaInternacional.LIQUIDADO_BORDERO,
      dataTransacao: new Date('2026-03-01T16:20:00Z').toISOString(),
    };

    const s2: InternationalTicketSaleDto = {
      id: 'fx-sale-02',
      codigoTransacao: 'INT-TRX-2026-0042',
      vendaId: 'vnd-intl-02',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      paisComprador: 'DE',
      moedaEstrangeira: MoedaEstrangeira.EUR,
      valorMoedaEstrangeira: 240.0,
      taxaCambioAplicada: 6.2812,
      aliquotaIofPercent: 4.38,
      valorIofBrl: 66.03,
      valorTotalBrl: 1573.52,
      valorLiquidoProdutorBrl: 1470.72,
      spreadReceitaDiskBrl: 36.77,
      statusCambial: StatusVendaInternacional.LIQUIDADO_BORDERO,
      dataTransacao: new Date('2026-03-02T10:15:00Z').toISOString(),
    };

    this.inMemorySales = [s1, s2];

    // 3. Contratos de Hedge / Trava Cambial Spot (FX Lock)
    const hdg1: FxHedgeContractDto = {
      id: 'hdg-001',
      codigoContratoHedge: 'HDG-2026-0008',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      produtorId: 'prod-001',
      moedaProtegida: MoedaEstrangeira.USD,
      volumeMoedaProtegido: 150000.0,
      taxaCambioTravadaSpot: 5.7500,
      valorBrlGarantido: 862500.0,
      instituicaoFinanceira: '341 - Itaú BBA S.A.',
      dataAbertura: new Date('2026-02-10T14:00:00Z').toISOString(),
      dataLiquidacaoPrevista: new Date('2026-05-30T18:00:00Z').toISOString(),
      status: StatusHedgeCambial.ATIVO,
    };

    this.inMemoryHedges = [hdg1];

    // 4. Lançamentos Contábeis de Variação Cambial (NBC TG 02 / IAS 21)
    const acc1: FxAccountingEntryDto = {
      id: 'acc-fx-001',
      codigoLancamento: 'LCT-FX-2026-001',
      eventoId: 'evt-001',
      tipoVariacao: TipoVariacaoCambial.ATIVA_RECEITA,
      moedaOrigem: MoedaEstrangeira.USD,
      taxaCotacaoInicial: 5.6000,
      taxaLiquidacao: 5.6540,
      valorDiferencaBrl: 8100.0,
      contaContabilDebito: '1.1.1.03 - Disponibilidades em Moeda Estrangeira',
      contaContabilCredito: '4.1.3.01 - Variação Cambial Ativa (Receitas Financeiras)',
      historicoContabil:
        'Reconhecimento de variação cambial ativa positiva na liquidação do lote internacional Pedreira (NBC TG 02).',
      dataLancamento: new Date('2026-03-01T23:59:59Z').toISOString(),
    };

    this.inMemoryAccounting = [acc1];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS GLOBAIS DE CÂMBIO & MULTI-MOEDA
  // ============================================================================
  async getDashboardKpis(): Promise<GlobalFxKpisDto> {
    await this.ensureSeedData();

    const volumeTotalUsdEquivalente = 420000.0;
    const receitaSpreadCambialBrl = 84500.0;
    const totalIofRecolhidoBrl = 18450.0;
    const volumeHedgeTravadoUsd = this.inMemoryHedges
      .filter((h) => h.status === StatusHedgeCambial.ATIVO)
      .reduce((acc, h) => acc + h.volumeMoedaProtegido, 0);

    return {
      volumeTotalUsdEquivalente,
      receitaSpreadCambialBrl,
      totalIofRecolhidoBrl,
      volumeHedgeTravadoUsd,
      paisesAtendidosCount: 38,
      taxaConversaoCheckoutFxPercent: 92.4,
    };
  }

  // ============================================================================
  // COTAÇÕES SPOT PTAX
  // ============================================================================
  async listarCotacoes(): Promise<CurrencyExchangeRateDto[]> {
    await this.ensureSeedData();
    return this.inMemoryRates;
  }

  // ============================================================================
  // SIMULADOR DE CHECKOUT MULTI-MOEDA COM IOF
  // ============================================================================
  async simularCotacaoCheckout(
    dto: SimularCotacaoInternacionalRequestDto,
  ): Promise<SimularCotacaoInternacionalResponseDto> {
    await this.ensureSeedData();

    const rate = this.inMemoryRates.find((r) => r.moedaOrigem === dto.moedaDesejada);
    const taxaPtax = rate ? rate.taxaPtaxOficial : 5.6540;
    const spreadPercent = rate ? rate.spreadPercent : 2.5;
    const taxaSpotFinal = Number((taxaPtax * (1 + spreadPercent / 100)).toFixed(4));

    const aliquotaIofPercent = dto.tipoCartao === 'CONTA_GLOBAL_DEBITO' ? 1.1 : 4.38;
    const valorMoedaEstrangeira = Number((dto.valorBrl / taxaSpotFinal).toFixed(2));
    const valorIofBrl = Number(((dto.valorBrl * aliquotaIofPercent) / 100).toFixed(2));
    const custoTotalEstimadoBrl = Number((dto.valorBrl + valorIofBrl).toFixed(2));

    return {
      valorOriginalBrl: dto.valorBrl,
      moedaDesejada: dto.moedaDesejada,
      taxaPtax,
      spreadPercent,
      taxaSpotFinal,
      valorMoedaEstrangeira,
      aliquotaIofPercent,
      valorIofBrl,
      custoTotalEstimadoBrl,
    };
  }

  // ============================================================================
  // VENDAS INTERNACIONAIS
  // ============================================================================
  async listarVendasInternacionais(): Promise<InternationalTicketSaleDto[]> {
    await this.ensureSeedData();
    return this.inMemorySales;
  }

  // ============================================================================
  // HEDGE CAMBIAL (FX LOCK)
  // ============================================================================
  async listarContratosHedge(): Promise<FxHedgeContractDto[]> {
    await this.ensureSeedData();
    return this.inMemoryHedges;
  }

  async criarContratoHedge(dto: {
    eventoId: string;
    eventoNome: string;
    produtorId: string;
    moedaProtegida: MoedaEstrangeira;
    volumeMoedaProtegido: number;
    taxaCambioTravadaSpot: number;
    instituicaoFinanceira?: string;
  }): Promise<FxHedgeContractDto> {
    await this.ensureSeedData();

    const valorBrlGarantido = Number(
      (dto.volumeMoedaProtegido * dto.taxaCambioTravadaSpot).toFixed(2),
    );

    const prazo = new Date();
    prazo.setMonth(prazo.getMonth() + 3);

    const novoHedge: FxHedgeContractDto = {
      id: `hdg-00${this.inMemoryHedges.length + 1}`,
      codigoContratoHedge: `HDG-2026-${String(this.inMemoryHedges.length + 1).padStart(4, '0')}`,
      eventoId: dto.eventoId,
      eventoNome: dto.eventoNome,
      produtorId: dto.produtorId,
      moedaProtegida: dto.moedaProtegida,
      volumeMoedaProtegido: dto.volumeMoedaProtegido,
      taxaCambioTravadaSpot: dto.taxaCambioTravadaSpot,
      valorBrlGarantido,
      instituicaoFinanceira: dto.instituicaoFinanceira || '341 - Itaú BBA S.A.',
      dataAbertura: new Date().toISOString(),
      dataLiquidacaoPrevista: prazo.toISOString(),
      status: StatusHedgeCambial.ATIVO,
    };

    this.inMemoryHedges.unshift(novoHedge);
    return novoHedge;
  }

  // ============================================================================
  // ESCRITURAÇÃO CONTÁBIL DE VARIAÇÃO CAMBIAL (NBC TG 02 / IAS 21)
  // ============================================================================
  async listarLancamentosVariacaoCambial(): Promise<FxAccountingEntryDto[]> {
    await this.ensureSeedData();
    return this.inMemoryAccounting;
  }
}
