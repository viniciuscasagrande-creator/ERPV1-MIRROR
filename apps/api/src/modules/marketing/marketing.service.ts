import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  MarketingChannel,
  CampaignStatus,
  CouponDiscountType,
  MarketingCampaignDto,
  MarketingCouponDto,
  MarketingPromoterAffiliateDto,
  MarketingPixelCapiLogDto,
  MarketingOverviewMetricsDto,
} from '@diskingressos/types';

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  private inMemoryCampaigns: MarketingCampaignDto[] = [
    {
      id: 'cmp-001',
      codigoCampanha: 'CMP-META-VILLAMIX-LOTE1',
      nomeCampanha: 'Meta Ads - VillaMix Festival Curitiba 2026 (Lote Promocional)',
      canal: MarketingChannel.META_ADS,
      eventId: 'evt-001',
      nomeEvento: 'VillaMix Festival Curitiba',
      status: CampaignStatus.ATIVA,
      orcamentoTotal: 45000.0,
      valorInvestido: 38200.0,
      impressoes: 1240000,
      cliques: 48900,
      ingressosVendidos: 3420,
      receitaGerada: 427500.0,
      roasCalculado: 11.19,
      cpaMedio: 11.17,
      utmSource: 'facebook_instagram',
      utmMedium: 'paid_social',
      utmCampaign: 'villamix_curitiba_lote1',
      dataInicio: '2026-03-01T00:00:00Z',
    },
    {
      id: 'cmp-002',
      codigoCampanha: 'CMP-GOOG-ROCKFEST-SEARCH',
      nomeCampanha: 'Google Ads Search - Rock Curitiba Stadium Ingressos Oficiais',
      canal: MarketingChannel.GOOGLE_ADS,
      eventId: 'evt-002',
      nomeEvento: 'Rock Curitiba Stadium',
      status: CampaignStatus.ATIVA,
      orcamentoTotal: 30000.0,
      valorInvestido: 26400.0,
      impressoes: 580000,
      cliques: 62000,
      ingressosVendidos: 2150,
      receitaGerada: 344000.0,
      roasCalculado: 13.03,
      cpaMedio: 12.28,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'rockfest_ingressos_busca_exata',
      dataInicio: '2026-03-10T00:00:00Z',
    },
    {
      id: 'cmp-003',
      codigoCampanha: 'CMP-TIKTOK-STANDUP-VIRAL',
      nomeCampanha: 'TikTok Ads Spark - Noite de Comédia Arena da Baixada',
      canal: MarketingChannel.TIKTOK_ADS,
      eventId: 'evt-003',
      nomeEvento: 'Noite de Comédia Arena',
      status: CampaignStatus.OTIMIZANDO,
      orcamentoTotal: 15000.0,
      valorInvestido: 9800.0,
      impressoes: 920000,
      cliques: 31000,
      ingressosVendidos: 890,
      receitaGerada: 71200.0,
      roasCalculado: 7.27,
      cpaMedio: 11.01,
      utmSource: 'tiktok',
      utmMedium: 'short_video',
      utmCampaign: 'standup_arena_virais',
      dataInicio: '2026-03-15T00:00:00Z',
    },
    {
      id: 'cmp-004',
      codigoCampanha: 'CMP-EMAIL-VIP-BASE-DISKINGRESSOS',
      nomeCampanha: 'Disparo Exclusivo Base Fidelidade DiskIngressos Gold',
      canal: MarketingChannel.EMAIL_MARKETING,
      eventId: 'evt-001',
      nomeEvento: 'VillaMix Festival Curitiba',
      status: CampaignStatus.CONCLUIDA,
      orcamentoTotal: 2500.0,
      valorInvestido: 2500.0,
      impressoes: 180000,
      cliques: 24500,
      ingressosVendidos: 1420,
      receitaGerada: 213000.0,
      roasCalculado: 85.2,
      cpaMedio: 1.76,
      utmSource: 'diskingressos_crm',
      utmMedium: 'email_blast',
      utmCampaign: 'fidelidade_pre_venda_exclusiva',
      dataInicio: '2026-02-20T00:00:00Z',
      dataFim: '2026-02-28T23:59:59Z',
    },
  ];

  private inMemoryCoupons: MarketingCouponDto[] = [
    {
      id: 'cup-001',
      codigoCupom: 'VIPDISK20',
      descricao: '20% de Desconto para Clientes Prime DiskIngressos',
      eventId: 'evt-001',
      nomeEvento: 'VillaMix Festival Curitiba',
      tipoDesconto: CouponDiscountType.PERCENTUAL,
      valorDesconto: 20.0,
      limiteUsosGlobal: 1000,
      usosAtuais: 642,
      limitePorCpf: 1,
      valorMinimoPedido: 100.0,
      receitaTotalGerada: 80250.0,
      descontoTotalConcedido: 16050.0,
      status: 'ATIVO',
      validoAte: '2026-05-30T23:59:59Z',
    },
    {
      id: 'cup-002',
      codigoCupom: 'TAXAZERO',
      descricao: 'Isenção da Taxa de Conveniência DiskIngressos para Lote Família',
      eventId: 'evt-002',
      nomeEvento: 'Rock Curitiba Stadium',
      tipoDesconto: CouponDiscountType.ISENCAO_TAXA,
      valorDesconto: 100.0,
      limiteUsosGlobal: 500,
      usosAtuais: 412,
      limitePorCpf: 2,
      valorMinimoPedido: 200.0,
      receitaTotalGerada: 65920.0,
      descontoTotalConcedido: 6592.0,
      status: 'ATIVO',
      validoAte: '2026-04-30T23:59:59Z',
    },
    {
      id: 'cup-003',
      codigoCupom: 'CURITIBA50',
      descricao: 'R$ 50,00 OFF em compras acima de R$ 300,00',
      eventId: 'evt-003',
      nomeEvento: 'Noite de Comédia Arena',
      tipoDesconto: CouponDiscountType.VALOR_FIXO,
      valorDesconto: 50.0,
      limiteUsosGlobal: 300,
      usosAtuais: 185,
      limitePorCpf: 1,
      valorMinimoPedido: 300.0,
      receitaTotalGerada: 55500.0,
      descontoTotalConcedido: 9250.0,
      status: 'ATIVO',
      validoAte: '2026-06-15T23:59:59Z',
    },
  ];

  private inMemoryPromoters: MarketingPromoterAffiliateDto[] = [
    {
      id: 'prm-001',
      codigoPromoter: 'PRM-LUCAS-VIP',
      nomePromoter: 'Lucas Albuquerque (Influencer PR)',
      email: 'lucas.albuquerque@promoters.com.br',
      telefoneWhatsapp: '(41) 99823-1122',
      chavePix: 'lucas.albuquerque@promoters.com.br',
      tipoComissao: 'PERCENTUAL',
      taxaComissao: 5.0,
      slugLink: 'lucasvip',
      ingressosVendidos: 840,
      volumeVendasBRL: 126000.0,
      comissaoTotalAcumulada: 6300.0,
      comissaoPaga: 4500.0,
      comissaoPendente: 1800.0,
      status: 'ATIVO',
    },
    {
      id: 'prm-002',
      codigoPromoter: 'PRM-CAMILA-FEST',
      nomePromoter: 'Camila Zanin (Promoter Universitária)',
      email: 'camila.zanin@promoters.com.br',
      telefoneWhatsapp: '(41) 99115-4433',
      chavePix: '41991154433',
      tipoComissao: 'FIXO_POR_INGRESSO',
      taxaComissao: 10.0,
      slugLink: 'camilafest',
      ingressosVendidos: 620,
      volumeVendasBRL: 86800.0,
      comissaoTotalAcumulada: 6200.0,
      comissaoPaga: 6200.0,
      comissaoPendente: 0.0,
      status: 'ATIVO',
    },
  ];

  private inMemoryPixelCapiLogs: MarketingPixelCapiLogDto[] = [
    {
      id: 'capi-001',
      eventIdTrace: 'trc-89a12c-99a',
      plataformaDestino: 'META_CAPI',
      tipoEvento: 'Purchase',
      valorTransacao: 380.0,
      moeda: 'BRL',
      statusEnvio: 'ENVIADO_SUCESSO',
      deduplicacaoScore: 9.6,
      respostaPayloadHash: 'sha256-a9f4e2...8831',
      timestampEvento: '2026-04-03T18:10:00Z',
    },
    {
      id: 'capi-002',
      eventIdTrace: 'trc-89a12c-99b',
      plataformaDestino: 'GOOGLE_ENHANCED',
      tipoEvento: 'Purchase',
      valorTransacao: 450.0,
      moeda: 'BRL',
      statusEnvio: 'ENVIADO_SUCESSO',
      deduplicacaoScore: 9.4,
      respostaPayloadHash: 'sha256-c3b12f...4419',
      timestampEvento: '2026-04-03T18:12:30Z',
    },
    {
      id: 'capi-003',
      eventIdTrace: 'trc-89a12c-99c',
      plataformaDestino: 'TIKTOK_EVENTS',
      tipoEvento: 'InitiateCheckout',
      valorTransacao: 160.0,
      moeda: 'BRL',
      statusEnvio: 'ENVIADO_SUCESSO',
      deduplicacaoScore: 9.1,
      respostaPayloadHash: 'sha256-e7e88a...9021',
      timestampEvento: '2026-04-03T18:14:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<MarketingOverviewMetricsDto> {
    const totalInvestido = this.inMemoryCampaigns.reduce((acc, c) => acc + c.valorInvestido, 0);
    const totalReceita = this.inMemoryCampaigns.reduce((acc, c) => acc + c.receitaGerada, 0);
    const totalIngressos = this.inMemoryCampaigns.reduce((acc, c) => acc + c.ingressosVendidos, 0);
    const roasGlobal = totalInvestido > 0 ? Number((totalReceita / totalInvestido).toFixed(2)) : 0;
    const cpaGlobal = totalIngressos > 0 ? Number((totalInvestido / totalIngressos).toFixed(2)) : 0;

    return {
      totalInvestidoAds: totalInvestido,
      totalReceitaAtribuida: totalReceita,
      roasGlobal,
      totalIngressosVendidos: totalIngressos,
      cpaGlobalMedio: cpaGlobal,
      campanhasAtivas: this.inMemoryCampaigns.filter((c) => c.status === CampaignStatus.ATIVA)
        .length,
      cuponsAtivos: this.inMemoryCoupons.filter((c) => c.status === 'ATIVO').length,
      promotersAtivos: this.inMemoryPromoters.filter((p) => p.status === 'ATIVO').length,
      capiServerSuccessRate: 99.85,
    };
  }

  async getCampaigns(): Promise<MarketingCampaignDto[]> {
    try {
      const dbCampaigns = await this.prisma.marketingCampaign.findMany();
      if (dbCampaigns.length > 0) {
        return dbCampaigns.map((c) => ({
          id: c.id,
          codigoCampanha: c.codigoCampanha,
          nomeCampanha: c.nomeCampanha,
          canal: c.canal as MarketingChannel,
          eventId: c.eventId || undefined,
          nomeEvento: c.nomeEvento,
          status: c.status as CampaignStatus,
          orcamentoTotal: Number(c.orcamentoTotal),
          valorInvestido: Number(c.valorInvestido),
          impressoes: c.impressoes,
          cliques: c.cliques,
          ingressosVendidos: c.ingressosVendidos,
          receitaGerada: Number(c.receitaGerada),
          roasCalculado: Number(c.roasCalculado),
          cpaMedio: Number(c.cpaMedio),
          utmSource: c.utmSource,
          utmMedium: c.utmMedium,
          utmCampaign: c.utmCampaign,
          dataInicio: c.dataInicio.toISOString(),
          dataFim: c.dataFim?.toISOString(),
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory campaigns: ${e.message}`);
    }
    return this.inMemoryCampaigns;
  }

  async createCampaign(dto: Partial<MarketingCampaignDto>): Promise<MarketingCampaignDto> {
    const newCamp: MarketingCampaignDto = {
      id: `cmp-${Date.now()}`,
      codigoCampanha: dto.codigoCampanha || `CMP-${Date.now().toString().slice(-6)}`,
      nomeCampanha: dto.nomeCampanha || 'Nova Campanha Multi-Canal',
      canal: dto.canal || MarketingChannel.META_ADS,
      eventId: dto.eventId,
      nomeEvento: dto.nomeEvento || 'Evento Geral DiskIngressos',
      status: CampaignStatus.ATIVA,
      orcamentoTotal: dto.orcamentoTotal || 10000.0,
      valorInvestido: 0.0,
      impressoes: 0,
      cliques: 0,
      ingressosVendidos: 0,
      receitaGerada: 0.0,
      roasCalculado: 0.0,
      cpaMedio: 0.0,
      utmSource: dto.utmSource || 'ads',
      utmMedium: dto.utmMedium || 'cpc',
      utmCampaign: dto.utmCampaign || 'campanha_lote',
      dataInicio: new Date().toISOString(),
    };
    this.inMemoryCampaigns.unshift(newCamp);
    return newCamp;
  }

  async getCoupons(): Promise<MarketingCouponDto[]> {
    try {
      const dbCoupons = await this.prisma.marketingCoupon.findMany();
      if (dbCoupons.length > 0) {
        return dbCoupons.map((c) => ({
          id: c.id,
          codigoCupom: c.codigoCupom,
          descricao: c.descricao,
          eventId: c.eventId || undefined,
          nomeEvento: c.nomeEvento || undefined,
          tipoDesconto: c.tipoDesconto as CouponDiscountType,
          valorDesconto: Number(c.valorDesconto),
          limiteUsosGlobal: c.limiteUsosGlobal,
          usosAtuais: c.usosAtuais,
          limitePorCpf: c.limitePorCpf,
          valorMinimoPedido: Number(c.valorMinimoPedido),
          receitaTotalGerada: Number(c.receitaTotalGerada),
          descontoTotalConcedido: Number(c.descontoTotalConcedido),
          status: c.status as any,
          validoAte: c.validoAte.toISOString(),
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory coupons: ${e.message}`);
    }
    return this.inMemoryCoupons;
  }

  async createCoupon(dto: Partial<MarketingCouponDto>): Promise<MarketingCouponDto> {
    const newCoupon: MarketingCouponDto = {
      id: `cup-${Date.now()}`,
      codigoCupom: (dto.codigoCupom || `CUPOM${Date.now().toString().slice(-4)}`).toUpperCase(),
      descricao: dto.descricao || 'Desconto Promocional Especial',
      eventId: dto.eventId,
      nomeEvento: dto.nomeEvento,
      tipoDesconto: dto.tipoDesconto || CouponDiscountType.PERCENTUAL,
      valorDesconto: dto.valorDesconto || 10.0,
      limiteUsosGlobal: dto.limiteUsosGlobal || 500,
      usosAtuais: 0,
      limitePorCpf: dto.limitePorCpf || 1,
      valorMinimoPedido: dto.valorMinimoPedido || 50.0,
      receitaTotalGerada: 0.0,
      descontoTotalConcedido: 0.0,
      status: 'ATIVO',
      validoAte: dto.validoAte || new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    this.inMemoryCoupons.unshift(newCoupon);
    return newCoupon;
  }

  async getPromoters(): Promise<MarketingPromoterAffiliateDto[]> {
    try {
      const dbPromoters = await this.prisma.marketingPromoterAffiliate.findMany();
      if (dbPromoters.length > 0) {
        return dbPromoters.map((p) => ({
          id: p.id,
          codigoPromoter: p.codigoPromoter,
          nomePromoter: p.nomePromoter,
          email: p.email,
          telefoneWhatsapp: p.telefoneWhatsapp,
          chavePix: p.chavePix,
          tipoComissao: p.tipoComissao as any,
          taxaComissao: Number(p.taxaComissao),
          slugLink: p.slugLink,
          ingressosVendidos: p.ingressosVendidos,
          volumeVendasBRL: Number(p.volumeVendasBRL),
          comissaoTotalAcumulada: Number(p.comissaoTotalAcumulada),
          comissaoPaga: Number(p.comissaoPaga),
          comissaoPendente: Number(p.comissaoPendente),
          status: p.status as any,
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory promoters: ${e.message}`);
    }
    return this.inMemoryPromoters;
  }

  async payPromoterCommission(promoterId: string) {
    const promoter = this.inMemoryPromoters.find((p) => p.id === promoterId);
    if (!promoter) {
      return { success: false, message: 'Promoter não encontrado' };
    }
    const valorPago = promoter.comissaoPendente;
    promoter.comissaoPaga += valorPago;
    promoter.comissaoPendente = 0.0;
    return {
      success: true,
      valorPago,
      chavePix: promoter.chavePix,
      protocoloPix: `E90400888${Date.now()}`,
      mensagem: `Comissão de R$ ${valorPago.toFixed(2)} liquidada com sucesso via Pix.`,
    };
  }

  async getPixelCapiLogs(): Promise<MarketingPixelCapiLogDto[]> {
    return this.inMemoryPixelCapiLogs;
  }

  async getAttributionComparison() {
    return [
      {
        canal: 'Meta Ads (Instagram & Facebook)',
        firstClick: 42.5,
        lastClick: 35.8,
        linear: 38.6,
        dataDrivenAi: 41.2,
        receitaAtribuidaBRL: 434660.0,
      },
      {
        canal: 'Google Ads (Search & Discovery)',
        firstClick: 25.1,
        lastClick: 34.2,
        linear: 29.4,
        dataDrivenAi: 31.8,
        receitaAtribuidaBRL: 335490.0,
      },
      {
        canal: 'TikTok Ads (Spark / Influencers)',
        firstClick: 18.2,
        lastClick: 10.4,
        linear: 14.8,
        dataDrivenAi: 13.9,
        receitaAtribuidaBRL: 146645.0,
      },
      {
        canal: 'CRM DiskIngressos (E-mail & Push)',
        firstClick: 14.2,
        lastClick: 19.6,
        linear: 17.2,
        dataDrivenAi: 13.1,
        receitaAtribuidaBRL: 138205.0,
      },
    ];
  }
}
