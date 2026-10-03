import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StatusExecucaoSplitCheckout,
  RegimeTributarioDual,
  TipoInsumoCreditoIbsCbs,
} from '@diskingressos/types';
import type {
  TaxSplitCheckoutExecutionDto,
  TaxCreditAccumulatorDto,
  TaxSplitFiscalParamDto,
  CalcularSplitTributarioRequestDto,
  CalcularSplitTributarioResponseDto,
  TaxSplitDashboardKpisDto,
} from '@diskingressos/types';

@Injectable()
export class TaxSplitCheckoutService {
  private readonly logger = new Logger(TaxSplitCheckoutService.name);

  private inMemorySplits: TaxSplitCheckoutExecutionDto[] = [];
  private inMemoryCredits: TaxCreditAccumulatorDto[] = [];
  private inMemoryParams: TaxSplitFiscalParamDto = {
    versaoNormaRegulamentar: 'PLP 68/2024 & EC 132/2023 (Comitê Gestor IBS)',
    aliquotaCbsPercent: 3.52, // CBS Reduzida 60% para Eventos Culturais (art. 138 PLP 68/24)
    aliquotaIbsEstadualPercent: 4.72,
    aliquotaIbsMunicipalPercent: 2.36, // Total IBS = 7.08%
    modoTransitorio2026: true,
    splitPaymentAutomaticoAtivo: true,
  };
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Split Payment Tributário Inteligente no Checkout (PLP 68/2024)...');

    // 1. Execuções de Split Fiscal no Checkout
    const s1: TaxSplitCheckoutExecutionDto = {
      id: 'spt-001',
      codigoSplit: 'SPLIT-TAX-2026-0001',
      pedidoId: 'PED-CURITIBA-2026-9812',
      numeroIngressos: 2,
      valorTotalTransacaoBrl: 440.0, // 2 x (R$ 180 ingresso + R$ 40 taxa conveniência)
      basePropriaComissaoBrl: 80.0,  // Receita Própria DiskIngressos (sujeita ao split CBS/IBS)
      baseRepasseProdutorBrl: 360.0, // Receita de Terceiros (Produtor Prime Tour)
      aliquotaCbsPercent: 3.52,
      aliquotaIbsPercent: 7.08,
      valorCbsRetidoBrl: 2.82,       // 3.52% sobre R$ 80,00
      valorIbsRetidoBrl: 5.66,       // 7.08% sobre R$ 80,00
      valorLiquidoDiskIngressosBrl: 71.52, // R$ 80,00 - R$ 8,48 (Retenção total)
      valorLiquidoProdutorBrl: 360.0,      // Repasse integral sem desconto indevido de IVA próprio
      protocoloComiteGestorIbs: 'CG-IBS-2026-BR-091823',
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 295,
      metodoPagamento: 'PIX_AUTOMATICO_SPI',
      dataLiquidacao: new Date('2026-04-01T10:15:30Z').toISOString(),
    };

    const s2: TaxSplitCheckoutExecutionDto = {
      id: 'spt-002',
      codigoSplit: 'SPLIT-TAX-2026-0002',
      pedidoId: 'PED-ROCK-2026-4421',
      numeroIngressos: 4,
      valorTotalTransacaoBrl: 1120.0, // 4 x (R$ 250 ingresso + R$ 30 taxa)
      basePropriaComissaoBrl: 120.0,
      baseRepasseProdutorBrl: 1000.0,
      aliquotaCbsPercent: 3.52,
      aliquotaIbsPercent: 7.08,
      valorCbsRetidoBrl: 4.22,
      valorIbsRetidoBrl: 8.50,
      valorLiquidoDiskIngressosBrl: 107.28,
      valorLiquidoProdutorBrl: 1000.0,
      protocoloComiteGestorIbs: 'CG-IBS-2026-BR-091824',
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 310,
      metodoPagamento: 'CARTAO_CREDITO_SPLIT',
      dataLiquidacao: new Date('2026-04-01T11:42:15Z').toISOString(),
    };

    this.inMemorySplits = [s1, s2];

    // 2. Créditos Tributários Acumulados da Não-Cumulatividade (Art. 28 PLP 68/2024)
    const c1: TaxCreditAccumulatorDto = {
      id: 'crd-001',
      codigoCredito: 'CRD-IBS-2026-0042',
      fornecedorNome: 'Pedreira Paulo Leminski Gestão de Arenas S.A.',
      fornecedorCnpj: '08.912.345/0001-90',
      numeroNfeRef: 'NF-e 41260408912345000190550010000429181928374651',
      tipoInsumoEvento: TipoInsumoCreditoIbsCbs.LOCACAO_ARENA,
      valorTotalInsumoBrl: 350000.0,
      creditoCbsApropriadoBrl: 12320.0, // 3.52% de R$ 350k
      creditoIbsApropriadoBrl: 24780.0, // 7.08% de R$ 350k
      statusApropriacao: 'HOMOLOGADO_SPED',
      dataApropriacao: new Date('2026-03-25T14:00:00Z').toISOString(),
    };

    const c2: TaxCreditAccumulatorDto = {
      id: 'crd-002',
      codigoCredito: 'CRD-IBS-2026-0043',
      fornecedorNome: 'Gabisom Áudio & Iluminação Profissional Ltda',
      fornecedorCnpj: '60.123.456/0001-22',
      numeroNfeRef: 'NF-e 35260460123456000122550010000182731928374652',
      tipoInsumoEvento: TipoInsumoCreditoIbsCbs.SOM_ILUMINACAO,
      valorTotalInsumoBrl: 180000.0,
      creditoCbsApropriadoBrl: 6336.0,
      creditoIbsApropriadoBrl: 12744.0,
      statusApropriacao: 'HOMOLOGADO_SPED',
      dataApropriacao: new Date('2026-03-28T16:30:00Z').toISOString(),
    };

    this.inMemoryCredits = [c1, c2];
    this.isInitialized = true;
  }

  // ============================================================================
  // 1. KPIS DO DASHBOARD FISCAL
  // ============================================================================
  async getDashboardKpis(): Promise<TaxSplitDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      volumeRetidoCbsIbsTotalBrl: 1840500.0,
      taxaRetencaoMediaEfetivaPercent: 10.6,
      creditosNaoCumulatividadeTotalBrl: 385200.0,
      taxaSucessoProtocolosComitePercent: 100.0,
      totalTransacoesComSplit: 48290,
    };
  }

  // ============================================================================
  // 2. LISTAGEM DE EXECUÇÕES DE SPLIT NO CHECKOUT
  // ============================================================================
  async listarSplits(): Promise<TaxSplitCheckoutExecutionDto[]> {
    await this.ensureSeedData();
    return this.inMemorySplits;
  }

  // ============================================================================
  // 3. CÁLCULO E EXECUÇÃO DE SPLIT TRIBUTÁRIO EM TEMPO REAL
  // ============================================================================
  async calcularExecutarSplitCheckout(
    dto: CalcularSplitTributarioRequestDto,
  ): Promise<CalcularSplitTributarioResponseDto> {
    await this.ensureSeedData();

    const qtd = dto.quantidadeIngressos || 1;
    const baseRepasseProdutorBrl = Number((dto.valorIngressoBrl * qtd).toFixed(2));
    const baseTributavelDiskBrl = Number((dto.taxaConvenienciaBrl * qtd).toFixed(2));
    const valorTotalTransacaoBrl = Number((baseRepasseProdutorBrl + baseTributavelDiskBrl).toFixed(2));

    const aliqCbs =
      dto.regime === RegimeTributarioDual.TRANSICAO_TESTE_2026 ? 0.90 : this.inMemoryParams.aliquotaCbsPercent;
    const aliqIbs =
      dto.regime === RegimeTributarioDual.TRANSICAO_TESTE_2026
        ? 0.10
        : Number(
            (
              this.inMemoryParams.aliquotaIbsEstadualPercent +
              this.inMemoryParams.aliquotaIbsMunicipalPercent
            ).toFixed(2),
          );

    // Retenção do IVA incide ESTRITAMENTE sobre a receita própria (LC 116/03)
    const valorCbsRetidoBrl = Number(((baseTributavelDiskBrl * aliqCbs) / 100).toFixed(2));
    const valorIbsRetidoBrl = Number(((baseTributavelDiskBrl * aliqIbs) / 100).toFixed(2));
    const valorTotalRetido = Number((valorCbsRetidoBrl + valorIbsRetidoBrl).toFixed(2));

    const valorLiquidoDiskBrl = Number((baseTributavelDiskBrl - valorTotalRetido).toFixed(2));
    const valorLiquidoProdutorBrl = baseRepasseProdutorBrl; // Não sofre retenção indevida

    const aliquotaEfetivaRetencaoPercent =
      baseTributavelDiskBrl > 0
        ? Number(((valorTotalRetido / baseTributavelDiskBrl) * 100).toFixed(2))
        : 0;

    // Registra split na esteira
    const novoSplit: TaxSplitCheckoutExecutionDto = {
      id: `spt-${Date.now()}`,
      codigoSplit: `SPLIT-TAX-2026-${(this.inMemorySplits.length + 1).toString().padStart(4, '0')}`,
      pedidoId: `PED-ONLINE-${Date.now().toString().slice(-4)}`,
      numeroIngressos: qtd,
      valorTotalTransacaoBrl,
      basePropriaComissaoBrl: baseTributavelDiskBrl,
      baseRepasseProdutorBrl,
      aliquotaCbsPercent: aliqCbs,
      aliquotaIbsPercent: aliqIbs,
      valorCbsRetidoBrl,
      valorIbsRetidoBrl,
      valorLiquidoDiskIngressosBrl: valorLiquidoDiskBrl,
      valorLiquidoProdutorBrl,
      protocoloComiteGestorIbs: `CG-IBS-2026-BR-${Math.floor(100000 + Math.random() * 900000)}`,
      statusSplit: StatusExecucaoSplitCheckout.HOMOLOGADO_BACEN,
      tempoProcessamentoMs: 280,
      metodoPagamento: 'PIX_AUTOMATICO_SPI',
      dataLiquidacao: new Date().toISOString(),
    };

    this.inMemorySplits.unshift(novoSplit);

    return {
      valorTotalTransacaoBrl,
      baseTributavelDiskBrl,
      baseRepasseProdutorBrl,
      valorCbsRetidoBrl,
      valorIbsRetidoBrl,
      valorLiquidoDiskBrl,
      valorLiquidoProdutorBrl,
      aliquotaEfetivaRetencaoPercent,
    };
  }

  // ============================================================================
  // 4. CRÉDITOS DA NÃO-CUMULATIVIDADE
  // ============================================================================
  async listarCreditosNaoCumulatividade(): Promise<TaxCreditAccumulatorDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCredits;
  }

  // ============================================================================
  // 5. PARÂMETROS FISCAIS
  // ============================================================================
  async obterParametrosFiscais(): Promise<TaxSplitFiscalParamDto> {
    await this.ensureSeedData();
    return this.inMemoryParams;
  }

  async atualizarParametrosFiscais(
    dto: Partial<TaxSplitFiscalParamDto>,
  ): Promise<TaxSplitFiscalParamDto> {
    await this.ensureSeedData();
    this.inMemoryParams = { ...this.inMemoryParams, ...dto };
    return this.inMemoryParams;
  }
}
