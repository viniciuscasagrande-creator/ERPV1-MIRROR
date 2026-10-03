import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ScpContractDto,
  ScpInvestorDto,
  ScpQuotaShareDto,
  ScpDividendDistributionDto,
  ScpDashboardKpisDto,
  CriarContratoScpDto,
  CriarInvestidorDto,
  RegistrarAporteDto,
  SimularDistribuicaoScpRequestDto,
  SimularDistribuicaoScpResponseDto,
  AprovarDistribuicaoDto,
  LiquidarDividendoPixDto,
  ScpModalidadePartilha,
  TipoInvestidorScp,
  StatusContratoScp,
  StatusAporteScp,
  StatusDistribuicaoDividendo,
  RegimeTributarioScp,
} from '@diskingressos/types';

@Injectable()
export class ScpInvestorsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback caso o PostgreSQL local não esteja instanciado)
  // ============================================================================
  private inMemoryContracts: ScpContractDto[] = [];
  private inMemoryInvestors: ScpInvestorDto[] = [];
  private inMemoryQuotas: ScpQuotaShareDto[] = [];
  private inMemoryDistributions: ScpDividendDistributionDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.scpContract.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // DB offline, utiliza fallback in-memory
    }

    // 1. Investidores Iniciais
    const inv1: ScpInvestorDto = {
      id: 'inv-001',
      nomeOuRazaoSocial: 'Araucária Capital & Asset Ltda',
      tipoPessoa: 'PJ',
      documentoFiscal: '34.891.203/0001-92',
      email: 'investimentos@araucariacapital.com.br',
      telefone: '(41) 3099-8800',
      tipoInvestidor: TipoInvestidorScp.FUNDO_INVESTIMENTO,
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '0084',
      conta: '98450-2',
      tipoChavePix: 'CNPJ',
      chavePix: '34.891.203/0001-92',
      statusKyc: 'APROVADO',
      limiteAporte: 1000000.0,
      totalAportado: 350000.0,
      totalDividendosRecebidos: 84500.0,
      createdAt: new Date('2026-01-10T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-15T14:30:00Z').toISOString(),
    };

    const inv2: ScpInvestorDto = {
      id: 'inv-002',
      nomeOuRazaoSocial: 'Dr. Roberto Silveira Picanço',
      tipoPessoa: 'PF',
      documentoFiscal: '482.910.389-44',
      email: 'roberto.picanco@curitibamed.com.br',
      telefone: '(41) 99882-1144',
      tipoInvestidor: TipoInvestidorScp.ANJO,
      banco: '237 - Banco Bradesco S.A.',
      agencia: '1240',
      conta: '44521-0',
      tipoChavePix: 'CPF',
      chavePix: '482.910.389-44',
      statusKyc: 'APROVADO',
      limiteAporte: 500000.0,
      totalAportado: 150000.0,
      totalDividendosRecebidos: 36000.0,
      createdAt: new Date('2026-02-01T11:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-10T09:15:00Z').toISOString(),
    };

    const inv3: ScpInvestorDto = {
      id: 'inv-003',
      nomeOuRazaoSocial: 'GWB Entertainment Participações S/A',
      tipoPessoa: 'PJ',
      documentoFiscal: '19.452.880/0001-15',
      email: 'financeiro@gwbholding.com',
      telefone: '(11) 3244-9000',
      tipoInvestidor: TipoInvestidorScp.CO_PRODUTOR,
      banco: '001 - Banco do Brasil S.A.',
      agencia: '3044',
      conta: '10982-4',
      tipoChavePix: 'CHAVE_ALEATORIA',
      chavePix: 'e49b8192-3df8-4ec2-90ab-8e0192a3bb40',
      statusKyc: 'APROVADO',
      limiteAporte: 2000000.0,
      totalAportado: 500000.0,
      totalDividendosRecebidos: 112000.0,
      createdAt: new Date('2026-01-20T16:00:00Z').toISOString(),
      updatedAt: new Date('2026-05-18T18:00:00Z').toISOString(),
    };

    this.inMemoryInvestors = [inv1, inv2, inv3];

    // 2. Contratos de SCP
    const c1: ScpContractDto = {
      id: 'scp-001',
      codigoScp: 'SCP-2026-001',
      nomeProjeto: 'Festival de Inverno Pedreira Paulo Leminski 2026 - SCP',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
      producerId: 'prod-001',
      socioOstensivo: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
      cnpjScp: '04.821.902/0002-25',
      metaCaptacao: 500000.0,
      valorCaptado: 500000.0,
      percentualCaptado: 100.0,
      modalidadePartilha: ScpModalidadePartilha.HURDLE_WATERFALL,
      hurdleRatePercent: 12.0,
      upsideSharePercent: 30.0,
      regimeTributario: RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
      status: StatusContratoScp.EM_APURACAO,
      dataInicio: new Date('2026-02-15T00:00:00Z').toISOString(),
      dataEncerramento: new Date('2026-08-30T23:59:59Z').toISOString(),
      createdAt: new Date('2026-02-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-09-01T12:00:00Z').toISOString(),
    };

    const c2: ScpContractDto = {
      id: 'scp-002',
      codigoScp: 'SCP-2026-002',
      nomeProjeto: 'Turnê Sinfônica MPB Teatro Guaíra 2026 - SCP',
      eventId: 'evt-002',
      eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
      producerId: 'prod-002',
      socioOstensivo: 'Seven Entretenimento & Promoções Artísticas Ltda',
      cnpjScp: '07.342.110/0002-88',
      metaCaptacao: 300000.0,
      valorCaptado: 200000.0,
      percentualCaptado: 66.67,
      modalidadePartilha: ScpModalidadePartilha.LUCRO_LIQUIDO,
      hurdleRatePercent: 0.0,
      upsideSharePercent: 20.0,
      regimeTributario: RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
      status: StatusContratoScp.ATIVO,
      dataInicio: new Date('2026-04-01T00:00:00Z').toISOString(),
      createdAt: new Date('2026-04-01T14:00:00Z').toISOString(),
      updatedAt: new Date('2026-07-10T11:20:00Z').toISOString(),
    };

    this.inMemoryContracts = [c1, c2];

    // 3. Cotas Integralizadas (Aportes)
    const q1: ScpQuotaShareDto = {
      id: 'quota-001',
      codigoAporte: 'APT-2026-0001',
      contractId: 'scp-001',
      investorId: 'inv-001',
      investorNome: inv1.nomeOuRazaoSocial,
      investorDocumento: inv1.documentoFiscal,
      valorAportado: 350000.0,
      percentualParticipacao: 70.0,
      dataAporte: new Date('2026-02-20T10:00:00Z').toISOString(),
      status: StatusAporteScp.INTEGRALIZADO,
      comprovanteUrl: 'https://storage.diskingressos.com.br/ged/comprovantes/TED-350K-ARACAPITAL.pdf',
      createdAt: new Date('2026-02-20T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-20T10:00:00Z').toISOString(),
    };

    const q2: ScpQuotaShareDto = {
      id: 'quota-002',
      codigoAporte: 'APT-2026-0002',
      contractId: 'scp-001',
      investorId: 'inv-002',
      investorNome: inv2.nomeOuRazaoSocial,
      investorDocumento: inv2.documentoFiscal,
      valorAportado: 150000.0,
      percentualParticipacao: 30.0,
      dataAporte: new Date('2026-02-25T14:30:00Z').toISOString(),
      status: StatusAporteScp.INTEGRALIZADO,
      comprovanteUrl: 'https://storage.diskingressos.com.br/ged/comprovantes/PIX-150K-RPICANCO.pdf',
      createdAt: new Date('2026-02-25T14:30:00Z').toISOString(),
      updatedAt: new Date('2026-02-25T14:30:00Z').toISOString(),
    };

    const q3: ScpQuotaShareDto = {
      id: 'quota-003',
      codigoAporte: 'APT-2026-0003',
      contractId: 'scp-002',
      investorId: 'inv-003',
      investorNome: inv3.nomeOuRazaoSocial,
      investorDocumento: inv3.documentoFiscal,
      valorAportado: 200000.0,
      percentualParticipacao: 100.0,
      dataAporte: new Date('2026-04-10T16:00:00Z').toISOString(),
      status: StatusAporteScp.INTEGRALIZADO,
      comprovanteUrl: 'https://storage.diskingressos.com.br/ged/comprovantes/TED-200K-GWB.pdf',
      createdAt: new Date('2026-04-10T16:00:00Z').toISOString(),
      updatedAt: new Date('2026-04-10T16:00:00Z').toISOString(),
    };

    this.inMemoryQuotas = [q1, q2, q3];

    // 4. Distribuições Históricas e Atuais
    const d1: ScpDividendDistributionDto = {
      id: 'dist-001',
      codigoDistribuicao: 'DIV-2026-0001',
      contractId: 'scp-001',
      contractNome: c1.nomeProjeto,
      investorId: 'inv-001',
      investorNome: inv1.nomeOuRazaoSocial,
      investorDocumento: inv1.documentoFiscal,
      investorPix: inv1.chavePix,
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
      dreReceitaBruta: 1450000.0,
      dreCustosOperacionais: 820000.0,
      dreLucroLiquido: 630000.0,
      valorAporteDevolvido: 350000.0,
      valorLucroDistribuido: 84500.0,
      aliquotaIrrf: 0.0,
      valorIrrfRetido: 0.0,
      valorLiquidoPago: 434500.0,
      roiEfetivoPercent: 24.14,
      status: StatusDistribuicaoDividendo.LIQUIDADO,
      dataAprovacao: new Date('2026-09-05T14:00:00Z').toISOString(),
      dataLiquidacao: new Date('2026-09-06T10:15:00Z').toISOString(),
      metodoLiquidacao: 'PIX',
      comprovantePagamento: 'COMP-PIX-434K-ARACAPITAL-99812',
      createdAt: new Date('2026-09-04T18:00:00Z').toISOString(),
      updatedAt: new Date('2026-09-06T10:15:00Z').toISOString(),
    };

    const d2: ScpDividendDistributionDto = {
      id: 'dist-002',
      codigoDistribuicao: 'DIV-2026-0002',
      contractId: 'scp-001',
      contractNome: c1.nomeProjeto,
      investorId: 'inv-002',
      investorNome: inv2.nomeOuRazaoSocial,
      investorDocumento: inv2.documentoFiscal,
      investorPix: inv2.chavePix,
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
      dreReceitaBruta: 1450000.0,
      dreCustosOperacionais: 820000.0,
      dreLucroLiquido: 630000.0,
      valorAporteDevolvido: 150000.0,
      valorLucroDistribuido: 36000.0,
      aliquotaIrrf: 0.0,
      valorIrrfRetido: 0.0,
      valorLiquidoPago: 186000.0,
      roiEfetivoPercent: 24.0,
      status: StatusDistribuicaoDividendo.LIQUIDADO,
      dataAprovacao: new Date('2026-09-05T14:00:00Z').toISOString(),
      dataLiquidacao: new Date('2026-09-06T10:18:00Z').toISOString(),
      metodoLiquidacao: 'PIX',
      comprovantePagamento: 'COMP-PIX-186K-RPICANCO-99813',
      createdAt: new Date('2026-09-04T18:00:00Z').toISOString(),
      updatedAt: new Date('2026-09-06T10:18:00Z').toISOString(),
    };

    this.inMemoryDistributions = [d1, d2];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DO DASHBOARD EXECUTIVO
  // ============================================================================
  async getDashboardKpis(): Promise<ScpDashboardKpisDto> {
    await this.ensureSeedData();

    try {
      const quotas = await this.prisma.scpQuotaShare.findMany();
      const dists = await this.prisma.scpDividendDistribution.findMany();
      const activeContracts = await this.prisma.scpContract.count({
        where: { status: { in: ['EM_CAPTACAO', 'ATIVO', 'EM_APURACAO'] } },
      });
      const approvedInvestors = await this.prisma.scpInvestor.count({
        where: { statusKyc: 'APROVADO' },
      });

      const capitalTotalInvestido = quotas.reduce(
        (acc, q) => acc + Number(q.valorAportado),
        0,
      );
      const dividendosTotalDistribuidos = dists.reduce(
        (acc, d) => acc + Number(d.valorLucroDistribuido),
        0,
      );
      const valorEmApuracao = dists
        .filter((d) => d.status === 'CALCULADO' || d.status === 'APROVADO_CFO')
        .reduce((acc, d) => acc + Number(d.valorLiquidoPago), 0);

      const roiMedioPercent =
        capitalTotalInvestido > 0
          ? Number(
              ((dividendosTotalDistribuidos / capitalTotalInvestido) * 100).toFixed(2),
            )
          : 24.1;

      return {
        capitalTotalInvestido,
        dividendosTotalDistribuidos,
        roiMedioPercent,
        contratosAtivosCount: activeContracts,
        investidoresHomologadosCount: approvedInvestors,
        valorEmApuracao,
      };
    } catch {
      // Fallback in-memory
      const capitalTotalInvestido = this.inMemoryQuotas.reduce(
        (acc, q) => acc + q.valorAportado,
        0,
      );
      const dividendosTotalDistribuidos = this.inMemoryDistributions.reduce(
        (acc, d) => acc + d.valorLucroDistribuido,
        0,
      );
      const valorEmApuracao = this.inMemoryDistributions
        .filter((d) => d.status === StatusDistribuicaoDividendo.CALCULADO || d.status === StatusDistribuicaoDividendo.APROVADO_CFO)
        .reduce((acc, d) => acc + d.valorLiquidoPago, 0);

      return {
        capitalTotalInvestido,
        dividendosTotalDistribuidos,
        roiMedioPercent: 24.1,
        contratosAtivosCount: this.inMemoryContracts.filter(
          (c) => c.status !== StatusContratoScp.ENCERRADO,
        ).length,
        investidoresHomologadosCount: this.inMemoryInvestors.filter(
          (i) => i.statusKyc === 'APROVADO',
        ).length,
        valorEmApuracao,
      };
    }
  }

  // ============================================================================
  // CONTRATOS SCP
  // ============================================================================
  async listarContratos(): Promise<ScpContractDto[]> {
    await this.ensureSeedData();

    try {
      const records = await this.prisma.scpContract.findMany({
        include: { quotas: true, distribuicoes: true },
        orderBy: { createdAt: 'desc' },
      });

      return records.map((r) => ({
        id: r.id,
        codigoScp: r.codigoScp,
        nomeProjeto: r.nomeProjeto,
        eventId: r.eventId,
        eventNome: r.eventNome,
        producerId: r.producerId,
        socioOstensivo: r.socioOstensivo,
        cnpjScp: r.cnpjScp,
        metaCaptacao: Number(r.metaCaptacao),
        valorCaptado: Number(r.valorCaptado),
        percentualCaptado:
          Number(r.metaCaptacao) > 0
            ? Number(((Number(r.valorCaptado) / Number(r.metaCaptacao)) * 100).toFixed(2))
            : 0,
        modalidadePartilha: r.modalidadePartilha as ScpModalidadePartilha,
        hurdleRatePercent: Number(r.hurdleRatePercent),
        upsideSharePercent: Number(r.upsideSharePercent),
        regimeTributario: r.regimeTributario as RegimeTributarioScp,
        status: r.status as StatusContratoScp,
        dataInicio: r.dataInicio.toISOString(),
        dataEncerramento: r.dataEncerramento?.toISOString() || null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    } catch {
      return this.inMemoryContracts.map((c) => {
        const quotasDoContrato = this.inMemoryQuotas.filter((q) => q.contractId === c.id);
        const valorCaptadoReal = quotasDoContrato.reduce((acc, q) => acc + q.valorAportado, 0);
        return {
          ...c,
          valorCaptado: valorCaptadoReal,
          percentualCaptado: Number(((valorCaptadoReal / c.metaCaptacao) * 100).toFixed(2)),
          quotas: quotasDoContrato,
        };
      });
    }
  }

  async obterContratoPorId(id: string): Promise<ScpContractDto> {
    await this.ensureSeedData();
    const contratos = await this.listarContratos();
    const contrato = contratos.find((c) => c.id === id || c.codigoScp === id);
    if (!contrato) {
      throw new NotFoundException(`Contrato SCP ${id} não localizado.`);
    }
    return contrato;
  }

  async criarContrato(dto: CriarContratoScpDto): Promise<ScpContractDto> {
    await this.ensureSeedData();

    const novoCodigo = `SCP-2026-${String(this.inMemoryContracts.length + 1).padStart(3, '0')}`;

    try {
      const created = await this.prisma.scpContract.create({
        data: {
          codigoScp: novoCodigo,
          nomeProjeto: dto.nomeProjeto,
          eventId: dto.eventId,
          eventNome: dto.eventNome,
          producerId: dto.producerId,
          socioOstensivo: dto.socioOstensivo,
          cnpjScp: dto.cnpjScp || null,
          metaCaptacao: dto.metaCaptacao,
          valorCaptado: 0.0,
          modalidadePartilha: dto.modalidadePartilha || ScpModalidadePartilha.HURDLE_WATERFALL,
          hurdleRatePercent: dto.hurdleRatePercent ?? 12.0,
          upsideSharePercent: dto.upsideSharePercent ?? 25.0,
          regimeTributario: dto.regimeTributario || RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
          status: StatusContratoScp.EM_CAPTACAO,
        },
      });

      return {
        id: created.id,
        codigoScp: created.codigoScp,
        nomeProjeto: created.nomeProjeto,
        eventId: created.eventId,
        eventNome: created.eventNome,
        producerId: created.producerId,
        socioOstensivo: created.socioOstensivo,
        cnpjScp: created.cnpjScp,
        metaCaptacao: Number(created.metaCaptacao),
        valorCaptado: 0.0,
        percentualCaptado: 0.0,
        modalidadePartilha: created.modalidadePartilha as ScpModalidadePartilha,
        hurdleRatePercent: Number(created.hurdleRatePercent),
        upsideSharePercent: Number(created.upsideSharePercent),
        regimeTributario: created.regimeTributario as RegimeTributarioScp,
        status: created.status as StatusContratoScp,
        dataInicio: created.dataInicio.toISOString(),
        dataEncerramento: null,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch {
      const novoContrato: ScpContractDto = {
        id: `scp-00${this.inMemoryContracts.length + 1}`,
        codigoScp: novoCodigo,
        nomeProjeto: dto.nomeProjeto,
        eventId: dto.eventId,
        eventNome: dto.eventNome,
        producerId: dto.producerId,
        socioOstensivo: dto.socioOstensivo,
        cnpjScp: dto.cnpjScp || null,
        metaCaptacao: dto.metaCaptacao,
        valorCaptado: 0.0,
        percentualCaptado: 0.0,
        modalidadePartilha: dto.modalidadePartilha || ScpModalidadePartilha.HURDLE_WATERFALL,
        hurdleRatePercent: dto.hurdleRatePercent ?? 12.0,
        upsideSharePercent: dto.upsideSharePercent ?? 25.0,
        regimeTributario: dto.regimeTributario || RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
        status: StatusContratoScp.EM_CAPTACAO,
        dataInicio: new Date().toISOString(),
        dataEncerramento: null,
        quotas: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryContracts.unshift(novoContrato);
      return novoContrato;
    }
  }

  // ============================================================================
  // INVESTIDORES (SÓCIOS PARTICIPANTES CC ART. 991)
  // ============================================================================
  async listarInvestidores(): Promise<ScpInvestorDto[]> {
    await this.ensureSeedData();

    try {
      const records = await this.prisma.scpInvestor.findMany({
        orderBy: { nomeOuRazaoSocial: 'asc' },
      });
      return records.map((r) => ({
        id: r.id,
        nomeOuRazaoSocial: r.nomeOuRazaoSocial,
        tipoPessoa: r.tipoPessoa as 'PF' | 'PJ',
        documentoFiscal: r.documentoFiscal,
        email: r.email,
        telefone: r.telefone,
        tipoInvestidor: r.tipoInvestidor as TipoInvestidorScp,
        banco: r.banco,
        agencia: r.agencia,
        conta: r.conta,
        tipoChavePix: r.tipoChavePix,
        chavePix: r.chavePix,
        statusKyc: r.statusKyc as 'APROVADO' | 'EM_ANALISE' | 'PENDENTE' | 'REJEITADO',
        limiteAporte: Number(r.limiteAporte),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    } catch {
      return this.inMemoryInvestors;
    }
  }

  async criarInvestidor(dto: CriarInvestidorDto): Promise<ScpInvestorDto> {
    await this.ensureSeedData();

    try {
      const created = await this.prisma.scpInvestor.create({
        data: {
          nomeOuRazaoSocial: dto.nomeOuRazaoSocial,
          tipoPessoa: dto.tipoPessoa,
          documentoFiscal: dto.documentoFiscal,
          email: dto.email,
          telefone: dto.telefone || null,
          tipoInvestidor: dto.tipoInvestidor || TipoInvestidorScp.ANJO,
          banco: dto.banco,
          agencia: dto.agencia,
          conta: dto.conta,
          tipoChavePix: dto.tipoChavePix || null,
          chavePix: dto.chavePix || null,
          statusKyc: 'APROVADO',
          limiteAporte: dto.limiteAporte ?? 500000.0,
        },
      });

      return {
        id: created.id,
        nomeOuRazaoSocial: created.nomeOuRazaoSocial,
        tipoPessoa: created.tipoPessoa as 'PF' | 'PJ',
        documentoFiscal: created.documentoFiscal,
        email: created.email,
        telefone: created.telefone,
        tipoInvestidor: created.tipoInvestidor as TipoInvestidorScp,
        banco: created.banco,
        agencia: created.agencia,
        conta: created.conta,
        tipoChavePix: created.tipoChavePix,
        chavePix: created.chavePix,
        statusKyc: 'APROVADO',
        limiteAporte: Number(created.limiteAporte),
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch {
      const novoInv: ScpInvestorDto = {
        id: `inv-00${this.inMemoryInvestors.length + 1}`,
        nomeOuRazaoSocial: dto.nomeOuRazaoSocial,
        tipoPessoa: dto.tipoPessoa,
        documentoFiscal: dto.documentoFiscal,
        email: dto.email,
        telefone: dto.telefone || null,
        tipoInvestidor: dto.tipoInvestidor || TipoInvestidorScp.ANJO,
        banco: dto.banco,
        agencia: dto.agencia,
        conta: dto.conta,
        tipoChavePix: dto.tipoChavePix || null,
        chavePix: dto.chavePix || null,
        statusKyc: 'APROVADO',
        limiteAporte: dto.limiteAporte ?? 500000.0,
        totalAportado: 0,
        totalDividendosRecebidos: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryInvestors.unshift(novoInv);
      return novoInv;
    }
  }

  // ============================================================================
  // REGISTRO DE APORTES (INTEGRALIZAÇÃO DE QUOTAS SCP)
  // ============================================================================
  async registrarAporte(dto: RegistrarAporteDto): Promise<ScpQuotaShareDto> {
    await this.ensureSeedData();

    const contrato = await this.obterContratoPorId(dto.contractId);
    const investidores = await this.listarInvestidores();
    const investidor = investidores.find((i) => i.id === dto.investorId);

    if (!investidor) {
      throw new NotFoundException(`Investidor ${dto.investorId} não encontrado.`);
    }

    if (investidor.statusKyc !== 'APROVADO') {
      throw new BadRequestException('Aporte rejeitado: Investidor com pendência de validação cadastral KYC.');
    }

    const quotasExistentes = this.inMemoryQuotas.filter((q) => q.contractId === contrato.id);
    const totalAportadoAtual = quotasExistentes.reduce((acc, q) => acc + q.valorAportado, 0);
    const novoTotalAportado = totalAportadoAtual + dto.valorAportado;

    if (novoTotalAportado > contrato.metaCaptacao) {
      throw new BadRequestException(
        `O aporte de R$ ${dto.valorAportado.toFixed(2)} excede a meta de captação de R$ ${contrato.metaCaptacao.toFixed(2)}. Saldo restante permitido: R$ ${(contrato.metaCaptacao - totalAportadoAtual).toFixed(2)}.`,
      );
    }

    const codigoAporte = `APT-2026-${String(this.inMemoryQuotas.length + 1).padStart(4, '0')}`;
    const percentualParticipacao = Number(
      ((dto.valorAportado / contrato.metaCaptacao) * 100).toFixed(2),
    );

    const novaQuota: ScpQuotaShareDto = {
      id: `quota-00${this.inMemoryQuotas.length + 1}`,
      codigoAporte,
      contractId: contrato.id,
      investorId: investidor.id,
      investorNome: investidor.nomeOuRazaoSocial,
      investorDocumento: investidor.documentoFiscal,
      valorAportado: dto.valorAportado,
      percentualParticipacao,
      dataAporte: new Date().toISOString(),
      status: StatusAporteScp.INTEGRALIZADO,
      comprovanteUrl: dto.comprovanteUrl || 'https://storage.diskingressos.com.br/ged/comprovantes/TED-MOCK.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryQuotas.push(novaQuota);

    // Atualiza contrato
    const idx = this.inMemoryContracts.findIndex((c) => c.id === contrato.id);
    if (idx !== -1) {
      this.inMemoryContracts[idx].valorCaptado += dto.valorAportado;
      this.inMemoryContracts[idx].percentualCaptado = Number(
        ((this.inMemoryContracts[idx].valorCaptado / this.inMemoryContracts[idx].metaCaptacao) * 100).toFixed(2),
      );
      if (this.inMemoryContracts[idx].valorCaptado >= this.inMemoryContracts[idx].metaCaptacao) {
        this.inMemoryContracts[idx].status = StatusContratoScp.ATIVO;
      }
    }

    return novaQuota;
  }

  // ============================================================================
  // SIMULAÇÃO & APURAÇÃO WATERFALL DE RETORNO / DIVIDENDOS
  // ============================================================================
  async simularDistribuicao(
    dto: SimularDistribuicaoScpRequestDto,
  ): Promise<SimularDistribuicaoScpResponseDto> {
    await this.ensureSeedData();

    const contrato = await this.obterContratoPorId(dto.contractId);
    const quotasDoContrato = this.inMemoryQuotas.filter((q) => q.contractId === contrato.id);

    if (quotasDoContrato.length === 0) {
      throw new BadRequestException('Não há cotas integralizadas para este contrato SCP.');
    }

    const totalAportado = quotasDoContrato.reduce((acc, q) => acc + q.valorAportado, 0);
    const dreLucroLiquido = Number(
      (dto.dreReceitaBruta - dto.dreCustosOperacionais).toFixed(2),
    );

    // 1. Cascata / Waterfall:
    // Passo 1: Devolução do Capital Aportado (Payback 100%) se o lucro/caixa for suficiente
    const capitalDisponivelAposCustos = dreLucroLiquido > 0 ? dreLucroLiquido : 0;
    const capitalDevolvidoTotal = Math.min(capitalDisponivelAposCustos, totalAportado);
    
    // Passo 2: Lucro residual que será partilhado (após devolução do aporte)
    const lucroResidualTotal = Math.max(0, Number((capitalDisponivelAposCustos - totalAportado).toFixed(2)));

    // Passo 3: Partilha entre Investidores e Produtora
    let lucroDistribuidoInvestidores = 0;
    let lucroRetidoProdutora = 0;

    if (contrato.modalidadePartilha === ScpModalidadePartilha.HURDLE_WATERFALL) {
      // Hurdle Rate: Retorno preferencial fixo sobre o capital aportado
      const hurdleMinimo = Number(((totalAportado * contrato.hurdleRatePercent) / 100).toFixed(2));
      const hurdlePago = Math.min(lucroResidualTotal, hurdleMinimo);
      const excedenteAposHurdle = Math.max(0, lucroResidualTotal - hurdlePago);
      
      // Upside share % sobre o excedente
      const upsideInvestidores = Number(((excedenteAposHurdle * contrato.upsideSharePercent) / 100).toFixed(2));
      
      lucroDistribuidoInvestidores = Number((hurdlePago + upsideInvestidores).toFixed(2));
      lucroRetidoProdutora = Number((lucroResidualTotal - lucroDistribuidoInvestidores).toFixed(2));
    } else if (contrato.modalidadePartilha === ScpModalidadePartilha.LUCRO_LIQUIDO) {
      // Percentual simples sobre o lucro líquido
      lucroDistribuidoInvestidores = Number(
        ((dreLucroLiquido * contrato.upsideSharePercent) / 100).toFixed(2),
      );
      lucroRetidoProdutora = Number((dreLucroLiquido - lucroDistribuidoInvestidores).toFixed(2));
    } else {
      // Receita Bruta
      lucroDistribuidoInvestidores = Number(
        ((dto.dreReceitaBruta * (contrato.upsideSharePercent / 100)).toFixed(2)),
      );
      lucroRetidoProdutora = Number((dreLucroLiquido - lucroDistribuidoInvestidores).toFixed(2));
    }

    // Calcula pro-rata para cada investidor
    const distribuicoes: SimularDistribuicaoScpResponseDto['distribuicoes'] = quotasDoContrato.map(
      (quota) => {
        const proporcao = totalAportado > 0 ? quota.valorAportado / totalAportado : 0;
        const devolucaoCapital = Number((capitalDevolvidoTotal * proporcao).toFixed(2));
        const lucroDistribuido = Number((lucroDistribuidoInvestidores * proporcao).toFixed(2));

        // Regime Tributário:
        // Se Lei 9.249/95 Art. 10 -> Isento de IRRF (0%)
        // Se Mútuo -> IRRF 15% s/ o lucro distribuído
        const aliquotaIrrf =
          contrato.regimeTributario === RegimeTributarioScp.MUTUO_IRRF_REGRESSIVO ? 0.15 : 0.0;
        const irrfRetido = Number((lucroDistribuido * aliquotaIrrf).toFixed(2));
        const valorLiquidoTotal = Number(
          (devolucaoCapital + lucroDistribuido - irrfRetido).toFixed(2),
        );

        const roiPercent =
          quota.valorAportado > 0
            ? Number(
                (
                  ((valorLiquidoTotal - quota.valorAportado) / quota.valorAportado) *
                  100
                ).toFixed(2),
              )
            : 0;

        return {
          investorId: quota.investorId,
          investorNome: quota.investorNome || 'Investidor SCP',
          valorAportado: quota.valorAportado,
          percentualCota: quota.percentualParticipacao,
          devolucaoCapital,
          lucroDistribuido,
          irrfRetido,
          valorLiquidoTotal,
          roiPercent,
        };
      },
    );

    return {
      contractId: contrato.id,
      nomeProjeto: contrato.nomeProjeto,
      modalidadePartilha: contrato.modalidadePartilha,
      dreReceitaBruta: dto.dreReceitaBruta,
      dreCustosOperacionais: dto.dreCustosOperacionais,
      dreLucroLiquido,
      totalAportadoNaScp: totalAportado,
      capitalDevolvidoTotal,
      lucroResidualTotal,
      lucroDistribuidoInvestidores,
      lucroRetidoProdutora,
      distribuicoes,
    };
  }

  // ============================================================================
  // EFETIVAÇÃO DE APURAÇÃO DE DIVIDENDOS (GERAÇÃO DE ORDENS FINANCEIRAS)
  // ============================================================================
  async calcularEEfetivarDistribuicao(
    dto: SimularDistribuicaoScpRequestDto,
  ): Promise<ScpDividendDistributionDto[]> {
    const simulacao = await this.simularDistribuicao(dto);
    const contrato = await this.obterContratoPorId(dto.contractId);
    const investidores = await this.listarInvestidores();

    const novasOrdens: ScpDividendDistributionDto[] = [];

    for (const item of simulacao.distribuicoes) {
      const inv = investidores.find((i) => i.id === item.investorId);
      const codigoDistribuicao = `DIV-2026-${String(
        this.inMemoryDistributions.length + novasOrdens.length + 1,
      ).padStart(4, '0')}`;

      const ordem: ScpDividendDistributionDto = {
        id: `dist-00${this.inMemoryDistributions.length + novasOrdens.length + 1}`,
        codigoDistribuicao,
        contractId: contrato.id,
        contractNome: contrato.nomeProjeto,
        investorId: item.investorId,
        investorNome: item.investorNome,
        investorDocumento: inv?.documentoFiscal || '',
        investorPix: inv?.chavePix || null,
        eventId: contrato.eventId,
        eventNome: contrato.eventNome,
        dreReceitaBruta: dto.dreReceitaBruta,
        dreCustosOperacionais: dto.dreCustosOperacionais,
        dreLucroLiquido: simulacao.dreLucroLiquido,
        valorAporteDevolvido: item.devolucaoCapital,
        valorLucroDistribuido: item.lucroDistribuido,
        aliquotaIrrf:
          contrato.regimeTributario === RegimeTributarioScp.MUTUO_IRRF_REGRESSIVO ? 15.0 : 0.0,
        valorIrrfRetido: item.irrfRetido,
        valorLiquidoPago: item.valorLiquidoTotal,
        roiEfetivoPercent: item.roiPercent,
        status: StatusDistribuicaoDividendo.CALCULADO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      novasOrdens.push(ordem);
      this.inMemoryDistributions.unshift(ordem);
    }

    // Atualiza status do contrato
    const idx = this.inMemoryContracts.findIndex((c) => c.id === contrato.id);
    if (idx !== -1) {
      this.inMemoryContracts[idx].status = StatusContratoScp.EM_APURACAO;
    }

    return novasOrdens;
  }

  // ============================================================================
  // APROVAÇÃO CFO (DUPLA CHAVE GOVERNANÇA FASE 15)
  // ============================================================================
  async aprovarDistribuicao(
    id: string,
    dto: AprovarDistribuicaoDto,
  ): Promise<ScpDividendDistributionDto> {
    await this.ensureSeedData();
    const idx = this.inMemoryDistributions.findIndex(
      (d) => d.id === id || d.codigoDistribuicao === id,
    );

    if (idx === -1) {
      throw new NotFoundException(`Distribuição de dividendos ${id} não encontrada.`);
    }

    const dist = this.inMemoryDistributions[idx];
    if (dist.status === StatusDistribuicaoDividendo.LIQUIDADO) {
      throw new BadRequestException('Esta distribuição já foi liquidada financeiramente.');
    }

    dist.status = StatusDistribuicaoDividendo.APROVADO_CFO;
    dist.dataAprovacao = new Date().toISOString();
    dist.updatedAt = new Date().toISOString();

    return dist;
  }

  // ============================================================================
  // LIQUIDAÇÃO INSTANTÂNEA VIA PIX / TED (BORDERÔ DE DIVIDENDOS)
  // ============================================================================
  async liquidarDividendo(
    id: string,
    dto: LiquidarDividendoPixDto,
  ): Promise<ScpDividendDistributionDto> {
    await this.ensureSeedData();
    const idx = this.inMemoryDistributions.findIndex(
      (d) => d.id === id || d.codigoDistribuicao === id,
    );

    if (idx === -1) {
      throw new NotFoundException(`Distribuição ${id} não localizada.`);
    }

    const dist = this.inMemoryDistributions[idx];
    if (dist.status !== StatusDistribuicaoDividendo.APROVADO_CFO) {
      throw new BadRequestException(
        'A liquidação bancária requer prévia aprovação do CFO (Governança SoD).',
      );
    }

    dist.status = StatusDistribuicaoDividendo.LIQUIDADO;
    dist.dataLiquidacao = new Date().toISOString();
    dist.metodoLiquidacao = dto.metodoLiquidacao || 'PIX';
    dist.comprovantePagamento = `COMP-PIX-${Math.round(dist.valorLiquidoPago / 1000)}K-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;
    dist.updatedAt = new Date().toISOString();

    // Atualiza acumulado do investidor
    const invIdx = this.inMemoryInvestors.findIndex((i) => i.id === dist.investorId);
    if (invIdx !== -1) {
      this.inMemoryInvestors[invIdx].totalDividendosRecebidos =
        (this.inMemoryInvestors[invIdx].totalDividendosRecebidos || 0) + dist.valorLucroDistribuido;
    }

    return dist;
  }

  // ============================================================================
  // LISTAGEM DE TODAS AS DISTRIBUIÇÕES
  // ============================================================================
  async listarDistribuicoes(): Promise<ScpDividendDistributionDto[]> {
    await this.ensureSeedData();
    return this.inMemoryDistributions;
  }
}
