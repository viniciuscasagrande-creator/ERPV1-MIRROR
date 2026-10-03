import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  TaxReformConfigDto,
  TaxSplitCheckoutDto,
  TaxCreditApropriacaoDto,
  TaxApuracaoMensalDto,
  TaxReformKpisDto,
  SimularTransicaoTributariaRequestDto,
  SimularTransicaoTributariaResponseDto,
  SimularSplitCheckoutRequestDto,
  RegistrarCreditoTributarioDto,
  StatusSplitTributario,
  CategoriaCreditoTributario,
} from '@diskingressos/types';

@Injectable()
export class TaxReformService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback local com dados pré-configurados)
  // ============================================================================
  private inMemoryConfig: TaxReformConfigDto = {
    id: 'cfg-001',
    vigenciaAno: 2026,
    cbsAliquotaPadraoPercent: 8.8,
    ibsAliquotaPadraoPercent: 17.7,
    reducaoEventosPercent: 60.0,
    cbsAliquotaEventosPercent: 3.52, // 8.80% * (1 - 0.60)
    ibsAliquotaEventosPercent: 7.08, // 17.70% * (1 - 0.60)
    aliquotaTeste2026Ativa: true,
    splitTributarioAtivo: true,
    ambienteHomologacao: true,
    createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-01T00:00:00Z').toISOString(),
  };

  private inMemorySplits: TaxSplitCheckoutDto[] = [];
  private inMemoryCreditos: TaxCreditApropriacaoDto[] = [];
  private inMemoryApuracoes: TaxApuracaoMensalDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.taxSplitCheckout.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, utiliza fallback in-memory
    }

    // 1. Splits Retidos no Checkout
    const s1: TaxSplitCheckoutDto = {
      id: 'split-tax-001',
      codigoTransacao: 'SPL-TAX-2026-0001',
      paymentId: 'pay-001',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      valorBrutoTransacao: 220.0,
      baseCalculoTributavel: 20.0, // Apenas a taxa de serviço (conveniência) da Disk
      aliquotaCbsEfetivaPercent: 3.52,
      valorCbsRetido: 0.7,
      aliquotaIbsEfetivaPercent: 7.08,
      valorIbsRetido: 1.42,
      totalSplitTributario: 2.12,
      valorLiquidoRecebedor: 217.88,
      status: StatusSplitTributario.RETIDO_NO_GATEWAY,
      idComiteGestor: 'CG-IBS-2026-9812401',
      createdAt: new Date('2026-03-01T14:20:00Z').toISOString(),
    };

    const s2: TaxSplitCheckoutDto = {
      id: 'split-tax-002',
      codigoTransacao: 'SPL-TAX-2026-0002',
      paymentId: 'pay-002',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      valorBrutoTransacao: 440.0,
      baseCalculoTributavel: 40.0,
      aliquotaCbsEfetivaPercent: 3.52,
      valorCbsRetido: 1.41,
      aliquotaIbsEfetivaPercent: 7.08,
      valorIbsRetido: 2.83,
      totalSplitTributario: 4.24,
      valorLiquidoRecebedor: 435.76,
      status: StatusSplitTributario.RETIDO_NO_GATEWAY,
      idComiteGestor: 'CG-IBS-2026-9812402',
      createdAt: new Date('2026-03-01T15:10:00Z').toISOString(),
    };

    const s3: TaxSplitCheckoutDto = {
      id: 'split-tax-003',
      codigoTransacao: 'SPL-TAX-2026-0003',
      paymentId: 'pay-003',
      eventId: 'evt-002',
      eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
      valorBrutoTransacao: 350.0,
      baseCalculoTributavel: 35.0,
      aliquotaCbsEfetivaPercent: 3.52,
      valorCbsRetido: 1.23,
      aliquotaIbsEfetivaPercent: 7.08,
      valorIbsRetido: 2.48,
      totalSplitTributario: 3.71,
      valorLiquidoRecebedor: 346.29,
      status: StatusSplitTributario.RETIDO_NO_GATEWAY,
      idComiteGestor: 'CG-IBS-2026-9812403',
      createdAt: new Date('2026-03-02T10:05:00Z').toISOString(),
    };

    this.inMemorySplits = [s1, s2, s3];

    // 2. Créditos Tributários Homologados sobre Custos de Espetáculos (Não-cumulatividade)
    const crd1: TaxCreditApropriacaoDto = {
      id: 'crd-001',
      codigoCredito: 'CRD-2026-0001',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      numeroNfOrigem: 'NFE-88412',
      chaveNfe: '41260304821902000144550010000884121004128912',
      fornecedorCnpj: '08.991.442/0001-90',
      fornecedorNome: 'Loud & Clear Sonorizações e Riders Profissionais Ltda',
      categoriaDespesa: CategoriaCreditoTributario.SOM_ILUMINACAO,
      valorTotalNf: 120000.0,
      baseCalculoCredito: 120000.0,
      cbsCreditoApurado: 4224.0, // 3.52%
      ibsCreditoApurado: 8496.0, // 7.08%
      totalCreditoApurado: 12720.0, // 10.60%
      status: 'HOMOLOGADO',
      homologadoEm: new Date('2026-03-05T11:00:00Z').toISOString(),
      createdAt: new Date('2026-03-05T10:00:00Z').toISOString(),
    };

    const crd2: TaxCreditApropriacaoDto = {
      id: 'crd-002',
      codigoCredito: 'CRD-2026-0002',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      numeroNfOrigem: 'NFE-4091',
      chaveNfe: '41260309981231000120550010000040911009182310',
      fornecedorCnpj: '09.981.231/0001-20',
      fornecedorNome: 'MegaStage Estruturas e Coberturas Geodésicas Ltda',
      categoriaDespesa: CategoriaCreditoTributario.ESTRUTURA_PALCO,
      valorTotalNf: 80000.0,
      baseCalculoCredito: 80000.0,
      cbsCreditoApurado: 2816.0,
      ibsCreditoApurado: 5664.0,
      totalCreditoApurado: 8480.0,
      status: 'HOMOLOGADO',
      homologadoEm: new Date('2026-03-06T15:30:00Z').toISOString(),
      createdAt: new Date('2026-03-06T14:00:00Z').toISOString(),
    };

    this.inMemoryCreditos = [crd1, crd2];

    // 3. Apurações Mensais Comparativas
    const ap1: TaxApuracaoMensalDto = {
      id: 'apur-001',
      competencia: '2026-02',
      receitaBrutaIngressos: 1450000.0,
      receitaPropriaTaxas: 174000.0, // 12% comissão e taxas
      totalDebitoCbs: 6124.8, // 3.52% s/ 174.000
      totalDebitoIbs: 12319.2, // 7.08% s/ 174.000
      totalCreditoCbs: 2112.0,
      totalCreditoIbs: 4248.0,
      saldoPagarCbs: 4012.8,
      saldoPagarIbs: 8071.2,
      totalIvaDualPagar: 12084.0,
      impostoRegimeAntigo: 15051.0, // 8.65% s/ 174.000 (PIS 0.65% + COFINS 3% + ISS 5%)
      diferencaEconomia: 2967.0, // Economia de R$ 2.967,00 graças à não-cumulatividade
      splitTributarioJaPago: 12084.0,
      saldoResidualGuia: 0.0,
      statusApuracao: 'FECHADA',
      dfeUnificadoChave: 'DFE-IBS-CBS-202602-PR-4106902-8812',
      createdAt: new Date('2026-03-01T00:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-01T00:00:00Z').toISOString(),
    };

    this.inMemoryApuracoes = [ap1];
    this.isInitialized = true;
  }

  // ============================================================================
  // CONFIGURAÇÕES DA REFORMA TRIBUTÁRIA
  // ============================================================================
  async getConfig(): Promise<TaxReformConfigDto> {
    await this.ensureSeedData();
    try {
      const dbConfig = await this.prisma.taxReformConfig.findFirst();
      if (dbConfig) {
        return {
          id: dbConfig.id,
          vigenciaAno: dbConfig.vigenciaAno,
          cbsAliquotaPadraoPercent: Number(dbConfig.cbsAliquotaPadraoPercent),
          ibsAliquotaPadraoPercent: Number(dbConfig.ibsAliquotaPadraoPercent),
          reducaoEventosPercent: Number(dbConfig.reducaoEventosPercent),
          cbsAliquotaEventosPercent: Number(dbConfig.cbsAliquotaEventosPercent),
          ibsAliquotaEventosPercent: Number(dbConfig.ibsAliquotaEventosPercent),
          aliquotaTeste2026Ativa: dbConfig.aliquotaTeste2026Ativa,
          splitTributarioAtivo: dbConfig.splitTributarioAtivo,
          ambienteHomologacao: dbConfig.ambienteHomologacao,
          createdAt: dbConfig.createdAt.toISOString(),
          updatedAt: dbConfig.updatedAt.toISOString(),
        };
      }
    } catch {
      // Fallback in-memory
    }
    return this.inMemoryConfig;
  }

  // ============================================================================
  // DASHBOARD KPIS EXECUTIVOS
  // ============================================================================
  async getDashboardKpis(): Promise<TaxReformKpisDto> {
    await this.ensureSeedData();

    const totalSplitRetidoCheckout = this.inMemorySplits.reduce(
      (acc, s) => acc + s.totalSplitTributario,
      0,
    );
    const creditosIvaApropriados = this.inMemoryCreditos.reduce(
      (acc, c) => acc + c.totalCreditoApurado,
      0,
    );
    const economiaTributariaAcumulada = this.inMemoryApuracoes.reduce(
      (acc, a) => acc + a.diferencaEconomia,
      0,
    );

    return {
      totalSplitRetidoCheckout,
      creditosIvaApropriados,
      economiaTributariaAcumulada,
      aliquotaEfetivaEventosPercent: 10.6, // CBS 3.52% + IBS 7.08%
      transacoesSplitContabilizadasCount: this.inMemorySplits.length,
      nfsComCreditoHomologadasCount: this.inMemoryCreditos.length,
    };
  }

  // ============================================================================
  // SIMULADOR COMPARATIVO DE TRANSIÇÃO (REGIME ATUAL VS NOVO IVA DUAL)
  // ============================================================================
  async simularTransicao(
    dto: SimularTransicaoTributariaRequestDto,
  ): Promise<SimularTransicaoTributariaResponseDto> {
    await this.ensureSeedData();
    const config = await this.getConfig();

    // 1. Regime Atual (Lucro Presumido - Cumulativo)
    // Base de cálculo tributável da DiskIngressos: Apenas comissões e taxas (LC 116/03)
    const baseCalculo = dto.receitaPropriaTaxas;

    // Tributos Atuais:
    // PIS = 0.65%, COFINS = 3.00%, ISS Curitiba = 5.00% -> Total = 8.65% (Sem direito a crédito sobre despesas)
    const pisValor = Number(((baseCalculo * 0.0065)).toFixed(2));
    const cofinsValor = Number(((baseCalculo * 0.03)).toFixed(2));
    const issCuritibaValor = Number(((baseCalculo * 0.05)).toFixed(2));
    const totalImpostosAtual = Number((pisValor + cofinsValor + issCuritibaValor).toFixed(2));

    // 2. Novo Regime da Reforma Tributária (IVA Dual CBS + IBS)
    // Alíquota de Eventos (Redução de 60%): CBS 3.52% e IBS 7.08% = 10.60%
    const cbsAliquota = config.cbsAliquotaEventosPercent;
    const ibsAliquota = config.ibsAliquotaEventosPercent;

    const cbsDebitoBruto = Number(((baseCalculo * cbsAliquota) / 100).toFixed(2));
    const ibsDebitoBruto = Number(((baseCalculo * ibsAliquota) / 100).toFixed(2));

    // Não-Cumulatividade Plena: Créditos sobre custos comprovados com NF
    const cbsCreditoSobreCustos = Number(
      ((dto.custosComprovadosComNf * (cbsAliquota / 100))).toFixed(2),
    );
    const ibsCreditoSobreCustos = Number(
      ((dto.custosComprovadosComNf * (ibsAliquota / 100))).toFixed(2),
    );

    const cbsLiquidoPagar = Math.max(0, Number((cbsDebitoBruto - cbsCreditoSobreCustos).toFixed(2)));
    const ibsLiquidoPagar = Math.max(0, Number((ibsDebitoBruto - ibsCreditoSobreCustos).toFixed(2)));
    const totalIvaDualPagar = Number((cbsLiquidoPagar + ibsLiquidoPagar).toFixed(2));
    const totalCreditosNaoCumulativos = Number(
      (cbsCreditoSobreCustos + ibsCreditoSobreCustos).toFixed(2),
    );

    // 3. Regime de Teste 2026 (Transição: CBS 0.90% + IBS 0.10%)
    const cbsTesteValor = Number(((baseCalculo * 0.009)).toFixed(2));
    const ibsTesteValor = Number(((baseCalculo * 0.001)).toFixed(2));
    const totalTesteValor = Number((cbsTesteValor + ibsTesteValor).toFixed(2));

    const diferencaValor = Number((totalImpostosAtual - totalIvaDualPagar).toFixed(2));
    const saldoFavoravelNovoRegime = diferencaValor >= 0;

    return {
      receitaTotal: dto.receitaBrutaIngressos + dto.receitaPropriaTaxas,
      custosComNf: dto.custosComprovadosComNf,
      regimeAtual: {
        nome: 'Regime Atual (Lucro Presumido - PIS/COFINS Cumulativo + ISS Curitiba)',
        pisPercent: 0.65,
        pisValor,
        cofinsPercent: 3.0,
        cofinsValor,
        issCuritibaPercent: 5.0,
        issCuritibaValor,
        totalImpostos: totalImpostosAtual,
        aliquotaEfetivaPercent: 8.65,
        creditosAproveitados: 0.0, // Cumulativo veda créditos
      },
      novoRegimeIvaDual: {
        nome: 'Reforma Tributária (IVA Dual CBS + IBS com Redução de 60% p/ Eventos Culturais)',
        cbsAliquota,
        cbsDebitoBruto,
        cbsCreditoSobreCustos,
        cbsLiquidoPagar,
        ibsAliquota,
        ibsDebitoBruto,
        ibsCreditoSobreCustos,
        ibsLiquidoPagar,
        totalIvaDualPagar,
        aliquotaEfetivaPercent: Number(((totalIvaDualPagar / baseCalculo) * 100).toFixed(2)),
        totalCreditosNaoCumulativos,
      },
      regimeTeste2026: {
        nome: 'Ano-Base 2026 (Alíquota de Teste Compensável)',
        cbsTestePercent: 0.9,
        cbsTesteValor,
        ibsTestePercent: 0.1,
        ibsTesteValor,
        totalTesteValor,
      },
      diferencaValor,
      saldoFavoravelNovoRegime,
      observacaoLegal:
        'Conforme o art. 138 do PLP 68/2024, eventos, festivais e produções culturais gozam de 60% de redução nas alíquotas do IVA Dual, permitindo a apropriação irrestrita de créditos sobre rider, palcos e infraestrutura.',
    };
  }

  // ============================================================================
  // PROCESSAMENTO DE SPLIT TRIBUTÁRIO NO CHECKOUT (INSTANTÂNEO NA ADQUIRENTE)
  // ============================================================================
  async processarSplitCheckout(
    dto: SimularSplitCheckoutRequestDto,
  ): Promise<TaxSplitCheckoutDto> {
    await this.ensureSeedData();
    const config = await this.getConfig();

    const valorBrutoTransacao = dto.valorIngresso + dto.taxaConveniencia;
    // Base de cálculo da plataforma = taxa de conveniência
    const baseCalculoTributavel = dto.taxaConveniencia;

    const valorCbsRetido = Number(
      ((baseCalculoTributavel * config.cbsAliquotaEventosPercent) / 100).toFixed(2),
    );
    const valorIbsRetido = Number(
      ((baseCalculoTributavel * config.ibsAliquotaEventosPercent) / 100).toFixed(2),
    );
    const totalSplitTributario = Number((valorCbsRetido + valorIbsRetido).toFixed(2));
    const valorLiquidoRecebedor = Number(
      (valorBrutoTransacao - totalSplitTributario).toFixed(2),
    );

    const novoSplit: TaxSplitCheckoutDto = {
      id: `split-tax-00${this.inMemorySplits.length + 1}`,
      codigoTransacao: `SPL-TAX-2026-${String(this.inMemorySplits.length + 1).padStart(4, '0')}`,
      paymentId: `pay-${Date.now()}`,
      eventId: dto.eventId,
      eventNome: dto.eventNome,
      valorBrutoTransacao,
      baseCalculoTributavel,
      aliquotaCbsEfetivaPercent: config.cbsAliquotaEventosPercent,
      valorCbsRetido,
      aliquotaIbsEfetivaPercent: config.ibsAliquotaEventosPercent,
      valorIbsRetido,
      totalSplitTributario,
      valorLiquidoRecebedor,
      status: StatusSplitTributario.RETIDO_NO_GATEWAY,
      idComiteGestor: `CG-IBS-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString(),
    };

    this.inMemorySplits.unshift(novoSplit);
    return novoSplit;
  }

  async listarSplitsCheckout(): Promise<TaxSplitCheckoutDto[]> {
    await this.ensureSeedData();
    return this.inMemorySplits;
  }

  // ============================================================================
  // CRÉDITOS TRIBUTÁRIOS (NÃO-CUMULATIVIDADE PLENA)
  // ============================================================================
  async registrarCredito(
    dto: RegistrarCreditoTributarioDto,
  ): Promise<TaxCreditApropriacaoDto> {
    await this.ensureSeedData();
    const config = await this.getConfig();

    const cbsCreditoApurado = Number(
      ((dto.valorTotalNf * config.cbsAliquotaEventosPercent) / 100).toFixed(2),
    );
    const ibsCreditoApurado = Number(
      ((dto.valorTotalNf * config.ibsAliquotaEventosPercent) / 100).toFixed(2),
    );
    const totalCreditoApurado = Number((cbsCreditoApurado + ibsCreditoApurado).toFixed(2));

    const novoCredito: TaxCreditApropriacaoDto = {
      id: `crd-00${this.inMemoryCreditos.length + 1}`,
      codigoCredito: `CRD-2026-${String(this.inMemoryCreditos.length + 1).padStart(4, '0')}`,
      eventId: dto.eventId,
      eventNome: dto.eventNome,
      numeroNfOrigem: dto.numeroNfOrigem,
      chaveNfe: `412603${dto.fornecedorCnpj.replace(/\D/g, '').padEnd(14, '0')}55001000088123100${Date.now().toString().slice(-8)}`,
      fornecedorCnpj: dto.fornecedorCnpj,
      fornecedorNome: dto.fornecedorNome,
      categoriaDespesa: dto.categoriaDespesa,
      valorTotalNf: dto.valorTotalNf,
      baseCalculoCredito: dto.valorTotalNf,
      cbsCreditoApurado,
      ibsCreditoApurado,
      totalCreditoApurado,
      status: 'HOMOLOGADO',
      homologadoEm: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.inMemoryCreditos.unshift(novoCredito);
    return novoCredito;
  }

  async listarCreditos(): Promise<TaxCreditApropriacaoDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCreditos;
  }

  // ============================================================================
  // APURAÇÃO MENSAL E COMPARAÇÃO
  // ============================================================================
  async listarApuracoesMensais(): Promise<TaxApuracaoMensalDto[]> {
    await this.ensureSeedData();
    return this.inMemoryApuracoes;
  }

  async gerarApuracaoMensal(competencia: string): Promise<TaxApuracaoMensalDto> {
    await this.ensureSeedData();

    // Valores padrão da competência
    const receitaBrutaIngressos = 1850000.0;
    const receitaPropriaTaxas = 222000.0; // 12%
    const totalDebitoCbs = Number(((receitaPropriaTaxas * 0.0352)).toFixed(2)); // 7.814,40
    const totalDebitoIbs = Number(((receitaPropriaTaxas * 0.0708)).toFixed(2)); // 15.717,60

    const totalCreditoCbs = this.inMemoryCreditos.reduce((acc, c) => acc + c.cbsCreditoApurado, 0);
    const totalCreditoIbs = this.inMemoryCreditos.reduce((acc, c) => acc + c.ibsCreditoApurado, 0);

    const saldoPagarCbs = Math.max(0, Number((totalDebitoCbs - totalCreditoCbs).toFixed(2)));
    const saldoPagarIbs = Math.max(0, Number((totalDebitoIbs - totalCreditoIbs).toFixed(2)));
    const totalIvaDualPagar = Number((saldoPagarCbs + saldoPagarIbs).toFixed(2));

    const impostoRegimeAntigo = Number(((receitaPropriaTaxas * 0.0865)).toFixed(2)); // 19.203,00
    const diferencaEconomia = Number((impostoRegimeAntigo - totalIvaDualPagar).toFixed(2));

    const splitTributarioJaPago = Number(
      this.inMemorySplits.reduce((acc, s) => acc + s.totalSplitTributario, 0).toFixed(2),
    );
    const saldoResidualGuia = Math.max(0, Number((totalIvaDualPagar - splitTributarioJaPago).toFixed(2)));

    const novaApuracao: TaxApuracaoMensalDto = {
      id: `apur-00${this.inMemoryApuracoes.length + 1}`,
      competencia,
      receitaBrutaIngressos,
      receitaPropriaTaxas,
      totalDebitoCbs,
      totalDebitoIbs,
      totalCreditoCbs,
      totalCreditoIbs,
      saldoPagarCbs,
      saldoPagarIbs,
      totalIvaDualPagar,
      impostoRegimeAntigo,
      diferencaEconomia,
      splitTributarioJaPago,
      saldoResidualGuia,
      statusApuracao: 'FECHADA',
      dfeUnificadoChave: `DFE-IBS-CBS-${competencia.replace('-', '')}-PR-4106902-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryApuracoes.unshift(novaApuracao);
    return novaApuracao;
  }
}
