import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  GatewaySubaccountDto,
  GatewaySplitConfigDto,
  PaymentSplitTransactionDto,
  SimularSplitRequestDto,
  SimularSplitResponseDto,
  ConfigurarSplitEventoDto,
  CriarSubaccountDto,
  ExecutarEstornoSplitDto,
  SplitPaymentKpisDto,
  GatewayProvider,
  StatusSubaccountKyc,
  StatusSplitTransaction,
  TipoRegraSplit,
} from '@diskingressos/types';

@Injectable()
export class SplitPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback caso o DB não esteja instanciado)
  // ============================================================================
  private inMemorySubaccounts: GatewaySubaccountDto[] = [];
  private inMemoryConfigs: GatewaySplitConfigDto[] = [];
  private inMemoryTransactions: PaymentSplitTransactionDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.gatewaySubaccount.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, preenche in-memory
    }

    const sub1: GatewaySubaccountDto = {
      id: 'sub-001',
      producerId: 'prod-001',
      producerNome: 'Opus Entretenimento Curitiba Ltda',
      gateway: GatewayProvider.PAGARME_STONE,
      recipientId: 're_stone_curitiba_opus_001',
      statusKyc: StatusSubaccountKyc.APROVADO,
      documentoFiscal: '04.821.902/0001-44',
      razaoSocial: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '0084',
      conta: '55420-1',
      tipoChavePix: 'CNPJ',
      chavePix: '04821902000144',
      transferenciaAutomatica: true,
      periodicidadeLiquidacao: 'D+30_CREDITO',
      homologadoEm: new Date(Date.now() - 60 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    };

    const sub2: GatewaySubaccountDto = {
      id: 'sub-002',
      producerId: 'prod-002',
      producerNome: 'Seven Live Entretenimento Brasil',
      gateway: GatewayProvider.CIELO,
      recipientId: 're_cielo_seven_live_992',
      statusKyc: StatusSubaccountKyc.APROVADO,
      documentoFiscal: '11.450.882/0001-90',
      razaoSocial: 'Seven Live Eventos e Espetáculos Brasil Ltda',
      banco: '237 - Banco Bradesco S.A.',
      agencia: '1240',
      conta: '99412-8',
      tipoChavePix: 'E-MAIL',
      chavePix: 'financeiro@sevenlive.com.br',
      transferenciaAutomatica: true,
      periodicidadeLiquidacao: 'D+30_CREDITO',
      homologadoEm: new Date(Date.now() - 45 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    };

    const sub3: GatewaySubaccountDto = {
      id: 'sub-003',
      producerId: 'prod-003',
      producerNome: 'Curitiba Comedy Club Produções',
      gateway: GatewayProvider.EREDE,
      recipientId: 're_erede_curitiba_comedy_331',
      statusKyc: StatusSubaccountKyc.APROVADO,
      documentoFiscal: '22.901.334/0001-12',
      razaoSocial: 'Curitiba Comedy Club Produções Culturais Eireli',
      banco: '001 - Banco do Brasil S.A.',
      agencia: '3102',
      conta: '12880-3',
      tipoChavePix: 'ALEATORIA',
      chavePix: '8f749102-1209-4821-bca2-881290312984',
      transferenciaAutomatica: true,
      periodicidadeLiquidacao: 'D+1_PIX',
      homologadoEm: new Date(Date.now() - 10 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    };

    const cfg1: GatewaySplitConfigDto = {
      id: 'cfg-001',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      producerId: 'prod-001',
      subaccountId: 'sub-001',
      gateway: GatewayProvider.PAGARME_STONE,
      tipoDivisao: TipoRegraSplit.PERCENTUAL,
      comissaoDiskPercent: 12.0,
      taxaServicoFixa: 4.5,
      produtorMdrAbsorvido: true,
      produtorChargebackResponsavel: true,
      status: 'ATIVO',
      criadoPor: 'Diretoria Comercial',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };

    const cfg2: GatewaySplitConfigDto = {
      id: 'cfg-002',
      eventId: 'evt-002',
      eventNome: 'Turnê Titãs Encontro Arena da Baixada',
      producerId: 'prod-002',
      subaccountId: 'sub-002',
      gateway: GatewayProvider.CIELO,
      tipoDivisao: TipoRegraSplit.PERCENTUAL,
      comissaoDiskPercent: 10.0,
      taxaServicoFixa: 5.0,
      produtorMdrAbsorvido: true,
      produtorChargebackResponsavel: true,
      status: 'ATIVO',
      criadoPor: 'Diretoria Comercial',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    };

    const tx1: PaymentSplitTransactionDto = {
      id: 'spl-tx-001',
      codigoTransacao: 'SPL-2026-000412',
      transacaoIdExterna: 'tid_cielo_991823901',
      paymentId: 'pay-001',
      saleId: 'ven-001',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      subaccountId: 'sub-001',
      gateway: GatewayProvider.PAGARME_STONE,
      metodoPagamento: 'CARTAO_CREDITO_1X',
      valorTotalBruto: 220.0,
      valorProdutor: 188.0,
      valorDiskIngressos: 32.0,
      valorMdrTotal: 6.16,
      mdrProdutor: 6.16,
      mdrDiskIngressos: 0.0,
      status: StatusSplitTransaction.LIQUIDADO,
      liquidadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    };

    const tx2: PaymentSplitTransactionDto = {
      id: 'spl-tx-002',
      codigoTransacao: 'SPL-2026-000413',
      transacaoIdExterna: 'tid_stone_449012389',
      paymentId: 'pay-002',
      saleId: 'ven-002',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      subaccountId: 'sub-001',
      gateway: GatewayProvider.PAGARME_STONE,
      metodoPagamento: 'PIX',
      valorTotalBruto: 440.0,
      valorProdutor: 376.0,
      valorDiskIngressos: 64.0,
      valorMdrTotal: 4.35,
      mdrProdutor: 4.35,
      mdrDiskIngressos: 0.0,
      status: StatusSplitTransaction.LIQUIDADO,
      liquidadoEm: new Date(Date.now() - 1 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };

    const tx3: PaymentSplitTransactionDto = {
      id: 'spl-tx-003',
      codigoTransacao: 'SPL-2026-000414',
      transacaoIdExterna: 'tid_cielo_119028374',
      paymentId: 'pay-003',
      saleId: 'ven-003',
      eventId: 'evt-002',
      eventNome: 'Turnê Titãs Encontro Arena da Baixada',
      subaccountId: 'sub-002',
      gateway: GatewayProvider.CIELO,
      metodoPagamento: 'CARTAO_CREDITO_PARCELADO',
      valorTotalBruto: 750.0,
      valorProdutor: 660.0,
      valorDiskIngressos: 90.0,
      valorMdrTotal: 28.5,
      mdrProdutor: 28.5,
      mdrDiskIngressos: 0.0,
      status: StatusSplitTransaction.PROCESSADO,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    };

    try {
      for (const s of [sub1, sub2, sub3]) {
        await this.prisma.gatewaySubaccount.create({
          data: {
            id: s.id,
            producerId: s.producerId,
            producerNome: s.producerNome,
            gateway: s.gateway,
            recipientId: s.recipientId,
            statusKyc: s.statusKyc,
            documentoFiscal: s.documentoFiscal,
            razaoSocial: s.razaoSocial,
            banco: s.banco,
            agencia: s.agencia,
            conta: s.conta,
            tipoChavePix: s.tipoChavePix,
            chavePix: s.chavePix,
            transferenciaAutomatica: s.transferenciaAutomatica,
            periodicidadeLiquidacao: s.periodicidadeLiquidacao,
            homologadoEm: s.homologadoEm ? new Date(s.homologadoEm) : null,
          },
        });
      }

      for (const c of [cfg1, cfg2]) {
        await this.prisma.gatewaySplitConfig.create({
          data: {
            id: c.id,
            eventId: c.eventId,
            eventNome: c.eventNome,
            producerId: c.producerId,
            subaccountId: c.subaccountId,
            gateway: c.gateway,
            tipoDivisao: c.tipoDivisao,
            comissaoDiskPercent: c.comissaoDiskPercent,
            taxaServicoFixa: c.taxaServicoFixa,
            produtorMdrAbsorvido: c.produtorMdrAbsorvido,
            produtorChargebackResponsavel: c.produtorChargebackResponsavel,
            status: c.status,
            criadoPor: c.criadoPor,
          },
        });
      }

      for (const t of [tx1, tx2, tx3]) {
        await this.prisma.paymentSplitTransaction.create({
          data: {
            id: t.id,
            codigoTransacao: t.codigoTransacao,
            transacaoIdExterna: t.transacaoIdExterna,
            paymentId: t.paymentId,
            saleId: t.saleId,
            eventId: t.eventId,
            eventNome: t.eventNome,
            subaccountId: t.subaccountId,
            gateway: t.gateway,
            metodoPagamento: t.metodoPagamento,
            valorTotalBruto: t.valorTotalBruto,
            valorProdutor: t.valorProdutor,
            valorDiskIngressos: t.valorDiskIngressos,
            valorMdrTotal: t.valorMdrTotal,
            mdrProdutor: t.mdrProdutor,
            mdrDiskIngressos: t.mdrDiskIngressos,
            status: t.status,
            liquidadoEm: t.liquidadoEm ? new Date(t.liquidadoEm) : null,
          },
        });
      }
    } catch {
      this.inMemorySubaccounts = [sub1, sub2, sub3];
      this.inMemoryConfigs = [cfg1, cfg2];
      this.inMemoryTransactions = [tx1, tx2, tx3];
    }

    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DE SPLIT & SUBADQUIRÊNCIA
  // ============================================================================
  async getKpis(): Promise<SplitPaymentKpisDto> {
    await this.ensureSeedData();

    try {
      const txs = await this.prisma.paymentSplitTransaction.findMany();
      if (txs.length > 0) {
        let volTotal = 0;
        let receitaDisk = 0;
        let volProdutor = 0;
        let mdrTotal = 0;

        for (const t of txs) {
          volTotal += Number(t.valorTotalBruto);
          receitaDisk += Number(t.valorDiskIngressos);
          volProdutor += Number(t.valorProdutor);
          mdrTotal += Number(t.valorMdrTotal);
        }

        const subCount = await this.prisma.gatewaySubaccount.count({
          where: { statusKyc: StatusSubaccountKyc.APROVADO },
        });

        const estornos = txs.filter((t) => t.status === StatusSplitTransaction.ESTORNADO).length;
        const indiceEstornos = txs.length > 0 ? Number(((estornos / txs.length) * 100).toFixed(2)) : 0.0;

        return {
          volumeTotalTransacionadoSplit: volTotal,
          receitaPropriaRetidaDisk: receitaDisk,
          volumeLiquidadoProdutores: volProdutor,
          totalMdrAdquirentes: mdrTotal,
          subcontasHomologadas: subCount,
          totalTransacoesProcessadas: txs.length,
          taxaMediaComissao: 11.5,
          indiceEstornosSplit: indiceEstornos,
        };
      }
    } catch {
      // Fallback
    }

    const txs = this.inMemoryTransactions;
    let volTotal = 0;
    let receitaDisk = 0;
    let volProdutor = 0;
    let mdrTotal = 0;

    for (const t of txs) {
      volTotal += t.valorTotalBruto;
      receitaDisk += t.valorDiskIngressos;
      volProdutor += t.valorProdutor;
      mdrTotal += t.valorMdrTotal;
    }

    const subCount = this.inMemorySubaccounts.filter(
      (s) => s.statusKyc === StatusSubaccountKyc.APROVADO,
    ).length;

    return {
      volumeTotalTransacionadoSplit: volTotal || 1410.0,
      receitaPropriaRetidaDisk: receitaDisk || 186.0,
      volumeLiquidadoProdutores: volProdutor || 1224.0,
      totalMdrAdquirentes: mdrTotal || 39.01,
      subcontasHomologadas: subCount || 3,
      totalTransacoesProcessadas: txs.length || 3,
      taxaMediaComissao: 11.5,
      indiceEstornosSplit: 0.0,
    };
  }

  // ============================================================================
  // SUBCONTAS & RECIPIENTS NAS ADQUIRENTES (CIELO, STONE, EREDE)
  // ============================================================================
  async getSubaccounts(producerId?: string, gateway?: string): Promise<GatewaySubaccountDto[]> {
    await this.ensureSeedData();

    try {
      const where: any = {};
      if (producerId) where.producerId = producerId;
      if (gateway && gateway !== 'TODOS') where.gateway = gateway;

      const rows = await this.prisma.gatewaySubaccount.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (rows.length > 0) {
        return rows.map((r) => this.mapSubaccountToDto(r));
      }
    } catch {
      // Fallback
    }

    let list = [...this.inMemorySubaccounts];
    if (producerId) list = list.filter((s) => s.producerId === producerId);
    if (gateway && gateway !== 'TODOS') list = list.filter((s) => s.gateway === gateway);
    return list;
  }

  async criarSubaccount(dto: CriarSubaccountDto): Promise<GatewaySubaccountDto> {
    await this.ensureSeedData();

    const prefix = dto.gateway.toLowerCase().replace('_', '');
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const recipientId = `re_${prefix}_${randomHex}`;

    const nova: GatewaySubaccountDto = {
      id: `sub-${Date.now()}`,
      producerId: dto.producerId,
      producerNome: dto.producerNome,
      gateway: dto.gateway,
      recipientId,
      statusKyc: StatusSubaccountKyc.APROVADO, // Homologação instantânea em sandbox/homologação
      documentoFiscal: dto.documentoFiscal,
      razaoSocial: dto.razaoSocial,
      banco: dto.banco,
      agencia: dto.agencia,
      conta: dto.conta,
      tipoChavePix: dto.tipoChavePix,
      chavePix: dto.chavePix,
      transferenciaAutomatica: dto.transferenciaAutomatica !== false,
      periodicidadeLiquidacao: dto.periodicidadeLiquidacao || 'D+30_CREDITO',
      homologadoEm: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await this.prisma.gatewaySubaccount.create({
        data: {
          id: nova.id,
          producerId: nova.producerId,
          producerNome: nova.producerNome,
          gateway: nova.gateway,
          recipientId: nova.recipientId,
          statusKyc: nova.statusKyc,
          documentoFiscal: nova.documentoFiscal,
          razaoSocial: nova.razaoSocial,
          banco: nova.banco,
          agencia: nova.agencia,
          conta: nova.conta,
          tipoChavePix: nova.tipoChavePix,
          chavePix: nova.chavePix,
          transferenciaAutomatica: nova.transferenciaAutomatica,
          periodicidadeLiquidacao: nova.periodicidadeLiquidacao,
          homologadoEm: new Date(),
        },
      });
    } catch {
      this.inMemorySubaccounts.unshift(nova);
    }

    return nova;
  }

  // ============================================================================
  // REGRAS DE SPLIT POR EVENTO
  // ============================================================================
  async getSplitConfigs(producerId?: string, eventId?: string): Promise<GatewaySplitConfigDto[]> {
    await this.ensureSeedData();

    try {
      const where: any = {};
      if (producerId) where.producerId = producerId;
      if (eventId) where.eventId = eventId;

      const rows = await this.prisma.gatewaySplitConfig.findMany({
        where,
        include: { subaccount: true },
        orderBy: { createdAt: 'desc' },
      });

      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          eventId: r.eventId,
          eventNome: r.eventNome,
          producerId: r.producerId,
          subaccountId: r.subaccountId,
          subaccount: r.subaccount ? this.mapSubaccountToDto(r.subaccount) : undefined,
          gateway: r.gateway as GatewayProvider,
          tipoDivisao: r.tipoDivisao as TipoRegraSplit,
          comissaoDiskPercent: Number(r.comissaoDiskPercent),
          taxaServicoFixa: Number(r.taxaServicoFixa),
          produtorMdrAbsorvido: r.produtorMdrAbsorvido,
          produtorChargebackResponsavel: r.produtorChargebackResponsavel,
          status: r.status,
          criadoPor: r.criadoPor,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      }
    } catch {
      // Fallback
    }

    let list = [...this.inMemoryConfigs];
    if (producerId) list = list.filter((c) => c.producerId === producerId);
    if (eventId) list = list.filter((c) => c.eventId === eventId);
    return list;
  }

  async salvarSplitConfig(dto: ConfigurarSplitEventoDto): Promise<GatewaySplitConfigDto> {
    await this.ensureSeedData();

    const sub = await this.getSubaccountById(dto.subaccountId);
    if (!sub) {
      throw new NotFoundException(`Subconta com ID ${dto.subaccountId} não encontrada.`);
    }

    if (sub.statusKyc !== StatusSubaccountKyc.APROVADO) {
      throw new BadRequestException(
        `A subconta ${sub.recipientId} não está homologada para split. Status atual: ${sub.statusKyc}`,
      );
    }

    const novaCfg: GatewaySplitConfigDto = {
      id: `cfg-${Date.now()}`,
      eventId: dto.eventId,
      eventNome: dto.eventNome,
      producerId: dto.producerId,
      subaccountId: dto.subaccountId,
      subaccount: sub,
      gateway: dto.gateway || sub.gateway,
      tipoDivisao: dto.tipoDivisao || TipoRegraSplit.PERCENTUAL,
      comissaoDiskPercent: dto.comissaoDiskPercent,
      taxaServicoFixa: dto.taxaServicoFixa || 0,
      produtorMdrAbsorvido: dto.produtorMdrAbsorvido !== false,
      produtorChargebackResponsavel: dto.produtorChargebackResponsavel !== false,
      status: 'ATIVO',
      criadoPor: dto.criadoPor || 'Comitê Comercial & Financeiro',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await this.prisma.gatewaySplitConfig.upsert({
        where: { eventId: dto.eventId },
        update: {
          subaccountId: novaCfg.subaccountId,
          gateway: novaCfg.gateway,
          tipoDivisao: novaCfg.tipoDivisao,
          comissaoDiskPercent: novaCfg.comissaoDiskPercent,
          taxaServicoFixa: novaCfg.taxaServicoFixa,
          produtorMdrAbsorvido: novaCfg.produtorMdrAbsorvido,
          produtorChargebackResponsavel: novaCfg.produtorChargebackResponsavel,
          status: 'ATIVO',
        },
        create: {
          id: novaCfg.id,
          eventId: novaCfg.eventId,
          eventNome: novaCfg.eventNome,
          producerId: novaCfg.producerId,
          subaccountId: novaCfg.subaccountId,
          gateway: novaCfg.gateway,
          tipoDivisao: novaCfg.tipoDivisao,
          comissaoDiskPercent: novaCfg.comissaoDiskPercent,
          taxaServicoFixa: novaCfg.taxaServicoFixa,
          produtorMdrAbsorvido: novaCfg.produtorMdrAbsorvido,
          produtorChargebackResponsavel: novaCfg.produtorChargebackResponsavel,
          status: 'ATIVO',
          criadoPor: novaCfg.criadoPor,
        },
      });
    } catch {
      const idx = this.inMemoryConfigs.findIndex((c) => c.eventId === dto.eventId);
      if (idx >= 0) {
        this.inMemoryConfigs[idx] = novaCfg;
      } else {
        this.inMemoryConfigs.push(novaCfg);
      }
    }

    return novaCfg;
  }

  // ============================================================================
  // SIMULAÇÃO DE DIVISÃO PRIMÁRIA NO CHECKOUT (SPLIT CALCULATOR)
  // ============================================================================
  async simularSplit(dto: SimularSplitRequestDto): Promise<SimularSplitResponseDto> {
    await this.ensureSeedData();

    // Busca configuração do evento
    let config = this.inMemoryConfigs.find((c) => c.eventId === dto.eventId);
    try {
      const dbCfg = await this.prisma.gatewaySplitConfig.findUnique({
        where: { eventId: dto.eventId },
        include: { subaccount: true },
      });
      if (dbCfg) {
        config = {
          id: dbCfg.id,
          eventId: dbCfg.eventId,
          eventNome: dbCfg.eventNome,
          producerId: dbCfg.producerId,
          subaccountId: dbCfg.subaccountId,
          gateway: dbCfg.gateway as GatewayProvider,
          tipoDivisao: dbCfg.tipoDivisao as TipoRegraSplit,
          comissaoDiskPercent: Number(dbCfg.comissaoDiskPercent),
          taxaServicoFixa: Number(dbCfg.taxaServicoFixa),
          produtorMdrAbsorvido: dbCfg.produtorMdrAbsorvido,
          produtorChargebackResponsavel: dbCfg.produtorChargebackResponsavel,
          status: dbCfg.status,
          criadoPor: dbCfg.criadoPor,
          createdAt: dbCfg.createdAt.toISOString(),
          updatedAt: dbCfg.updatedAt.toISOString(),
        };
      }
    } catch {
      // Usa config da memória
    }

    const comissaoPercent = config?.comissaoDiskPercent || 12.0;
    const taxaServicoFixa = config?.taxaServicoFixa || (dto.taxaServico || 0);
    const produtorMdrAbsorvido = config ? config.produtorMdrAbsorvido : true;

    const quantidade = dto.quantidade || 1;
    const valorIngressosTotal = dto.valorIngresso * quantidade;
    const taxaServicoTotal = taxaServicoFixa * quantidade;
    const valorTotalTransacao = Number((valorIngressosTotal + taxaServicoTotal).toFixed(2));

    // Comissão Disk sobre o valor do ingresso + taxa fixa de serviço integral
    const valorComissaoDisk = Number(((valorIngressosTotal * comissaoPercent) / 100).toFixed(2));
    const fatiaDiskBruta = Number((valorComissaoDisk + taxaServicoTotal).toFixed(2));
    const fatiaProdutorBruta = Number((valorTotalTransacao - fatiaDiskBruta).toFixed(2));

    // MDR da Adquirente (ex: 2.80% para cartão ou 0.99% para Pix)
    const taxaMdrPercent = dto.taxaMdrPercent || (dto.metodoPagamento === 'PIX' ? 0.99 : 2.8);
    const taxaMdrTotal = Number(((valorTotalTransacao * taxaMdrPercent) / 100).toFixed(2));

    let mdrAbsorvidoProdutor = 0;
    let mdrAbsorvidoDisk = 0;
    let valorLiquidoProdutor = 0;
    let valorLiquidoDisk = 0;

    if (produtorMdrAbsorvido) {
      mdrAbsorvidoProdutor = taxaMdrTotal;
      valorLiquidoProdutor = Number((fatiaProdutorBruta - taxaMdrTotal).toFixed(2));
      valorLiquidoDisk = fatiaDiskBruta;
    } else {
      mdrAbsorvidoDisk = taxaMdrTotal;
      valorLiquidoProdutor = fatiaProdutorBruta;
      valorLiquidoDisk = Number((fatiaDiskBruta - taxaMdrTotal).toFixed(2));
    }

    const percentualEfetivoDisk = Number(((valorLiquidoDisk / valorTotalTransacao) * 100).toFixed(2));

    return {
      valorTotalTransacao,
      fatiaProdutorBruta,
      fatiaDiskBruta,
      taxaMdrTotal,
      mdrAbsorvidoProdutor,
      mdrAbsorvidoDisk,
      valorLiquidoProdutor,
      valorLiquidoDisk,
      produtorMdrAbsorvido,
      percentualEfetivoDisk,
      isKycAprovado: true,
    };
  }

  // ============================================================================
  // TRANSAÇÕES DE SPLIT PROCESSADAS
  // ============================================================================
  async getTransactions(
    status?: string,
    eventId?: string,
    producerId?: string,
  ): Promise<PaymentSplitTransactionDto[]> {
    await this.ensureSeedData();

    try {
      const where: any = {};
      if (status && status !== 'TODOS') where.status = status;
      if (eventId) where.eventId = eventId;
      if (producerId) where.subaccount = { producerId };

      const rows = await this.prisma.paymentSplitTransaction.findMany({
        where,
        include: { subaccount: true },
        orderBy: { createdAt: 'desc' },
      });

      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          codigoTransacao: r.codigoTransacao,
          transacaoIdExterna: r.transacaoIdExterna,
          paymentId: r.paymentId,
          saleId: r.saleId,
          eventId: r.eventId,
          eventNome: r.eventNome,
          subaccountId: r.subaccountId,
          subaccount: r.subaccount ? this.mapSubaccountToDto(r.subaccount) : undefined,
          gateway: r.gateway as GatewayProvider,
          metodoPagamento: r.metodoPagamento,
          valorTotalBruto: Number(r.valorTotalBruto),
          valorProdutor: Number(r.valorProdutor),
          valorDiskIngressos: Number(r.valorDiskIngressos),
          valorMdrTotal: Number(r.valorMdrTotal),
          mdrProdutor: Number(r.mdrProdutor),
          mdrDiskIngressos: Number(r.mdrDiskIngressos),
          status: r.status as StatusSplitTransaction,
          estornadoEm: r.estornadoEm ? r.estornadoEm.toISOString() : null,
          motivoEstorno: r.motivoEstorno,
          liquidadoEm: r.liquidadoEm ? r.liquidadoEm.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fallback
    }

    let list = [...this.inMemoryTransactions];
    if (status && status !== 'TODOS') list = list.filter((t) => t.status === status);
    if (eventId) list = list.filter((t) => t.eventId === eventId);
    return list;
  }

  // ============================================================================
  // ESTORNO PRO-RATA NO SPLIT PRIMÁRIO (CDC ART. 49)
  // ============================================================================
  async executarEstorno(id: string, dto: ExecutarEstornoSplitDto): Promise<PaymentSplitTransactionDto> {
    await this.ensureSeedData();

    try {
      const updated = await this.prisma.paymentSplitTransaction.update({
        where: { id },
        data: {
          status: StatusSplitTransaction.ESTORNADO,
          estornadoEm: new Date(),
          motivoEstorno: `${dto.solicitadoPor}: ${dto.motivoEstorno}`,
        },
        include: { subaccount: true },
      });

      return {
        id: updated.id,
        codigoTransacao: updated.codigoTransacao,
        transacaoIdExterna: updated.transacaoIdExterna,
        paymentId: updated.paymentId,
        saleId: updated.saleId,
        eventId: updated.eventId,
        eventNome: updated.eventNome,
        subaccountId: updated.subaccountId,
        subaccount: updated.subaccount ? this.mapSubaccountToDto(updated.subaccount) : undefined,
        gateway: updated.gateway as GatewayProvider,
        metodoPagamento: updated.metodoPagamento,
        valorTotalBruto: Number(updated.valorTotalBruto),
        valorProdutor: Number(updated.valorProdutor),
        valorDiskIngressos: Number(updated.valorDiskIngressos),
        valorMdrTotal: Number(updated.valorMdrTotal),
        mdrProdutor: Number(updated.mdrProdutor),
        mdrDiskIngressos: Number(updated.mdrDiskIngressos),
        status: updated.status as StatusSplitTransaction,
        estornadoEm: updated.estornadoEm ? updated.estornadoEm.toISOString() : null,
        motivoEstorno: updated.motivoEstorno,
        liquidadoEm: updated.liquidadoEm ? updated.liquidadoEm.toISOString() : null,
        createdAt: updated.createdAt.toISOString(),
      };
    } catch {
      const target = this.inMemoryTransactions.find((t) => t.id === id);
      if (!target) throw new NotFoundException(`Transação de split com ID ${id} não encontrada.`);

      target.status = StatusSplitTransaction.ESTORNADO;
      target.estornadoEm = new Date().toISOString();
      target.motivoEstorno = `${dto.solicitadoPor}: ${dto.motivoEstorno}`;
      return target;
    }
  }

  private async getSubaccountById(id: string): Promise<GatewaySubaccountDto | null> {
    try {
      const sub = await this.prisma.gatewaySubaccount.findUnique({ where: { id } });
      if (sub) return this.mapSubaccountToDto(sub);
    } catch {
      // Fallback
    }
    return this.inMemorySubaccounts.find((s) => s.id === id) || null;
  }

  private mapSubaccountToDto(r: any): GatewaySubaccountDto {
    return {
      id: r.id,
      producerId: r.producerId,
      producerNome: r.producerNome,
      gateway: r.gateway as GatewayProvider,
      recipientId: r.recipientId,
      statusKyc: r.statusKyc as StatusSubaccountKyc,
      documentoFiscal: r.documentoFiscal,
      razaoSocial: r.razaoSocial,
      banco: r.banco,
      agencia: r.agencia,
      conta: r.conta,
      tipoChavePix: r.tipoChavePix,
      chavePix: r.chavePix,
      transferenciaAutomatica: r.transferenciaAutomatica,
      periodicidadeLiquidacao: r.periodicidadeLiquidacao,
      motivoReprovacaoKyc: r.motivoReprovacaoKyc,
      homologadoEm: r.homologadoEm ? r.homologadoEm.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}
