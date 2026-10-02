import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  EmitirNfseDto,
  EmitirLoteEventoDto,
  CancelarNfDto,
  FiscalDashboardSummary,
  TipoDocumentoFiscal,
  StatusDocumentoFiscal,
  RegimeTributario,
  TipoTributo,
  StatusGuiaRecolhimento,
  TipoSped,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class FiscalService {
  private readonly logger = new Logger(FiscalService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resumo de KPIs do módulo fiscal para o mês/competência atual
   */
  async getDashboardSummary(competencia?: string): Promise<FiscalDashboardSummary> {
    const comp = competencia || new Date().toISOString().slice(0, 7);

    // Notas emitidas e autorizadas na competência
    const notas = await this.prisma.fiscalInvoice.findMany({
      where: { competencia: comp },
    });

    const autorizadas = notas.filter((n) => n.status === StatusDocumentoFiscal.AUTORIZADO);
    const canceladas = notas.filter((n) => n.status === StatusDocumentoFiscal.CANCELADO);

    const totalEmitidoMes = autorizadas.reduce((acc, n) => acc + Number(n.valorLiquido), 0);
    const totalIssMes = autorizadas.reduce((acc, n) => acc + Number(n.valorIss), 0);
    const totalPisCofinsMes = autorizadas.reduce(
      (acc, n) => acc + Number(n.valorPis) + Number(n.valorCofins),
      0
    );

    // Retenções
    const retencoes = await this.prisma.taxRetention.findMany({
      where: { competencia: comp },
    });
    const totalRetencoesMes = retencoes.reduce((acc, r) => acc + Number(r.valorRetido), 0);

    // Eventos com vendas ou fechamento que ainda não possuem NFS-e emitida para as taxas
    const eventosComVendas = await this.prisma.event.findMany({
      include: {
        fiscalInvoices: true,
        financialSummary: true,
      },
    });
    const eventosPendentesEmissao = eventosComVendas.filter(
      (e) => e.fiscalInvoices.length === 0 && Number(e.financialSummary?.taxasServicoDisk || 0) > 0
    ).length;

    // Guias pendentes
    const guiasPendentesRecolhimento = await this.prisma.taxGuide.count({
      where: {
        status: StatusGuiaRecolhimento.A_RECOLHER,
      },
    });

    return {
      totalEmitidoMes: Math.round(totalEmitidoMes * 100) / 100,
      totalIssMes: Math.round(totalIssMes * 100) / 100,
      totalPisCofinsMes: Math.round(totalPisCofinsMes * 100) / 100,
      totalRetencoesMes: Math.round(totalRetencoesMes * 100) / 100,
      totalNotasAutorizadas: autorizadas.length,
      totalNotasCanceladas: canceladas.length,
      eventosPendentesEmissao,
      guiasPendentesRecolhimento,
    };
  }

  /**
   * Listar notas fiscais com filtros
   */
  async getInvoices(filters?: {
    status?: StatusDocumentoFiscal;
    tipo?: TipoDocumentoFiscal;
    competencia?: string;
    eventId?: string;
    busca?: string;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.competencia) where.competencia = filters.competencia;
    if (filters?.eventId) where.eventId = filters.eventId;

    if (filters?.busca) {
      where.OR = [
        { numeroNota: { contains: filters.busca, mode: 'insensitive' } },
        { tomadorNome: { contains: filters.busca, mode: 'insensitive' } },
        { tomadorDoc: { contains: filters.busca, mode: 'insensitive' } },
        { chaveAcesso: { contains: filters.busca, mode: 'insensitive' } },
      ];
    }

    const invoices = await this.prisma.fiscalInvoice.findMany({
      where,
      orderBy: { dataEmissao: 'desc' },
      include: {
        event: {
          select: { id: true, nome: true },
        },
      },
    });

    return invoices.map((inv) => ({
      ...inv,
      valorServicos: Number(inv.valorServicos),
      valorDeducoes: Number(inv.valorDeducoes),
      baseCalculo: Number(inv.baseCalculo),
      aliquotaIss: Number(inv.aliquotaIss),
      valorIss: Number(inv.valorIss),
      aliquotaPis: Number(inv.aliquotaPis),
      valorPis: Number(inv.valorPis),
      aliquotaCofins: Number(inv.aliquotaCofins),
      valorCofins: Number(inv.valorCofins),
      valorInss: Number(inv.valorInss),
      valorIr: Number(inv.valorIr),
      valorCsll: Number(inv.valorCsll),
      valorLiquido: Number(inv.valorLiquido),
      eventNome: inv.event?.nome || null,
    }));
  }

  /**
   * Buscar nota individual por ID com XML
   */
  async getInvoiceById(id: string) {
    const inv = await this.prisma.fiscalInvoice.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, nome: true, dataEvento: true },
        },
      },
    });

    if (!inv) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada.`);
    }

    return {
      ...inv,
      valorServicos: Number(inv.valorServicos),
      valorDeducoes: Number(inv.valorDeducoes),
      baseCalculo: Number(inv.baseCalculo),
      aliquotaIss: Number(inv.aliquotaIss),
      valorIss: Number(inv.valorIss),
      aliquotaPis: Number(inv.aliquotaPis),
      valorPis: Number(inv.valorPis),
      aliquotaCofins: Number(inv.aliquotaCofins),
      valorCofins: Number(inv.valorCofins),
      valorInss: Number(inv.valorInss),
      valorIr: Number(inv.valorIr),
      valorCsll: Number(inv.valorCsll),
      valorLiquido: Number(inv.valorLiquido),
      eventNome: inv.event?.nome || null,
    };
  }

  /**
   * Emissão individual de NFS-e (Taxa de Conveniência ou Comissão DiskIngressos)
   */
  async emitirNfse(dto: EmitirNfseDto, userId?: string) {
    if (!dto.valorServicos || dto.valorServicos <= 0) {
      throw new BadRequestException('O valor dos serviços deve ser maior que zero.');
    }

    const ano = new Date().getFullYear();
    const count = await this.prisma.fiscalInvoice.count();
    const numeroNota = `NFS-${ano}-${String(count + 1).padStart(6, '0')}`;
    const codigoVerificacao = crypto.randomBytes(4).toString('hex').toUpperCase();
    const chaveAcesso = `${ano}${String(count + 1).padStart(9, '0')}${crypto.randomBytes(16).toString('hex').slice(0, 31).toUpperCase()}`;
    const competencia = dto.competencia || new Date().toISOString().slice(0, 7);

    // Cálculos tributários municipais e federais
    const baseCalculo = dto.valorServicos;
    const aliquotaIss = dto.aliquotaIss ?? 5.0; // 5% ISS Curitiba (item 12.07)
    const valorIss = Math.round(baseCalculo * (aliquotaIss / 100) * 100) / 100;
    const issRetido = dto.issRetido ?? false;

    // Tributos Federais (Lucro Presumido PIS 0.65%, COFINS 3%)
    const aliquotaPis = 0.65;
    const valorPis = Math.round(baseCalculo * (aliquotaPis / 100) * 100) / 100;
    const aliquotaCofins = 3.0;
    const valorCofins = Math.round(baseCalculo * (aliquotaCofins / 100) * 100) / 100;

    const valorLiquido = issRetido ? baseCalculo - valorIss : baseCalculo;

    // Gerar XML no padrão ABRASF v2.04
    const dataEmissao = new Date();
    const xmlContent = this.generateNfseXml({
      numeroNota,
      codigoVerificacao,
      dataEmissao: dataEmissao.toISOString(),
      competencia,
      tomadorNome: dto.tomadorNome,
      tomadorDoc: dto.tomadorDoc,
      tomadorCidade: dto.tomadorCidade || 'Curitiba',
      tomadorUf: dto.tomadorUf || 'PR',
      discriminacao: dto.discriminacao,
      valorServicos: baseCalculo,
      valorIss,
      aliquotaIss,
      valorPis,
      valorCofins,
      valorLiquido,
    });

    const novaNota = await this.prisma.fiscalInvoice.create({
      data: {
        numeroNota,
        serie: '1',
        tipo: TipoDocumentoFiscal.NFSE as any,
        status: StatusDocumentoFiscal.AUTORIZADO as any,
        dataEmissao,
        competencia,
        codigoVerificacao,
        chaveAcesso,
        tomadorTipo: dto.tomadorTipo,
        tomadorNome: dto.tomadorNome,
        tomadorDoc: dto.tomadorDoc,
        tomadorEmail: dto.tomadorEmail || null,
        tomadorCidade: dto.tomadorCidade || 'Curitiba',
        tomadorUf: dto.tomadorUf || 'PR',
        prestadorCnpj: '08.123.456/0001-99',
        prestadorIm: '123456-7',
        codigoServico: '12.07', // 12.07 - Bilheteria e intermediação
        discriminacao: dto.discriminacao,
        valorServicos: baseCalculo,
        valorDeducoes: 0,
        baseCalculo,
        aliquotaIss,
        valorIss,
        issRetido,
        aliquotaPis,
        valorPis,
        aliquotaCofins,
        valorCofins,
        valorInss: 0,
        valorIr: 0,
        valorCsll: 0,
        valorLiquido,
        eventId: dto.eventId || null,
        xmlContent,
      },
    });

    // Se houver integração com contabilidade oficial, registrar partidas dobradas
    try {
      await this.integrarContabilNfse(novaNota, userId);
    } catch (e) {
      this.logger.warn(`Lançamento contábil automático não realizado para NF ${numeroNota}: ${e}`);
    }

    return this.getInvoiceById(novaNota.id);
  }

  /**
   * Emissão em Lote por Evento (Taxas e Comissões do Evento)
   */
  async emitirLoteEvento(dto: EmitirLoteEventoDto, userId?: string) {
    const evento = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: {
        producer: true,
        financialSummary: true,
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento ${dto.eventId} não encontrado.`);
    }

    const notasGeradas = [];
    const competencia = new Date().toISOString().slice(0, 7);

    // 1. NFS-e de Comissão da DiskIngressos emitida contra o Produtor
    if (
      dto.emitirPara === 'PRODUTOR_COMISSAO' ||
      dto.emitirPara === 'TODOS'
    ) {
      const valorComissao = Number(evento.financialSummary?.comissaoDisk || 15000);

      if (valorComissao > 0) {
        const nfProdutor = await this.emitirNfse(
          {
            tomadorTipo: 'PRODUTOR',
            tomadorNome: evento.producer.razaoSocial,
            tomadorDoc: evento.producer.cnpj,
            tomadorEmail: evento.producer.email,
            tomadorCidade: evento.cidade || 'Curitiba',
            tomadorUf: evento.estado || 'PR',
            discriminacao: `Comissão contratual de agenciamento e venda de ingressos do evento "${evento.nome}" realizado em ${evento.local}. Conforme borderô de liquidação.`,
            valorServicos: valorComissao,
            aliquotaIss: 5.0,
            issRetido: false,
            eventId: evento.id,
            competencia,
          },
          userId
        );
        notasGeradas.push(nfProdutor);
      }
    }

    // 2. NFS-e Consolidada das Taxas de Conveniência cobradas dos Clientes
    if (
      dto.emitirPara === 'CLIENTES_CONVENIENCIA' ||
      dto.emitirPara === 'TODOS'
    ) {
      const valorTaxas = Number(evento.financialSummary?.taxasServicoDisk || 8500);

      if (valorTaxas > 0) {
        const nfConsolidada = await this.emitirNfse(
          {
            tomadorTipo: 'CLIENTE',
            tomadorNome: 'CONSUMIDORES FINAIS CONSOLIDADOS (CURITIBA/PR)',
            tomadorDoc: '00.000.000/0000-00',
            tomadorEmail: 'contato@diskingressos.com.br',
            tomadorCidade: 'Curitiba',
            tomadorUf: 'PR',
            discriminacao: `Consolidação de taxas de conveniência/serviço da bilheteria online e totens relativas ao evento "${evento.nome}". Total de ingressos emitidos com taxa.`,
            valorServicos: valorTaxas,
            aliquotaIss: 5.0,
            issRetido: false,
            eventId: evento.id,
            competencia,
          },
          userId
        );
        notasGeradas.push(nfConsolidada);
      }
    }

    return {
      evento: evento.nome,
      totalNotasEmitidas: notasGeradas.length,
      notas: notasGeradas,
    };
  }

  /**
   * Cancelamento de Nota Fiscal com justificativa
   */
  async cancelarNf(id: string, dto: CancelarNfDto, userId?: string) {
    const nf = await this.prisma.fiscalInvoice.findUnique({ where: { id } });

    if (!nf) {
      throw new NotFoundException(`Nota fiscal ${id} não encontrada.`);
    }

    if (nf.status === StatusDocumentoFiscal.CANCELADO) {
      throw new BadRequestException('Esta nota fiscal já está cancelada.');
    }

    const updated = await this.prisma.fiscalInvoice.update({
      where: { id },
      data: {
        status: StatusDocumentoFiscal.CANCELADO as any,
        motivoCancelamento: dto.motivo,
        canceladoEm: new Date(),
      },
    });

    return this.getInvoiceById(updated.id);
  }

  /**
   * Consulta de Retenções na Fonte (IRRF, PIS/COFINS/CSLL, ISS, INSS)
   */
  async getTaxRetentions(competencia?: string) {
    const where: any = {};
    if (competencia) where.competencia = competencia;

    const retencoes = await this.prisma.taxRetention.findMany({
      where,
      orderBy: { dataFatoGerador: 'desc' },
    });

    return retencoes.map((r) => ({
      ...r,
      baseCalculo: Number(r.baseCalculo),
      aliquota: Number(r.aliquota),
      valorRetido: Number(r.valorRetido),
    }));
  }

  /**
   * Apuração Tributária Mensal da DiskIngressos (Lucro Presumido)
   * Separação mandatória de Receita de Ingressos (terceiros) x Taxas/Comissões (própria)
   */
  async getTaxSummary(competencia?: string) {
    const comp = competencia || new Date().toISOString().slice(0, 7);

    // Tenta encontrar registro já apurado no banco
    let summary = await this.prisma.taxSummary.findUnique({
      where: { competencia: comp },
    });

    if (!summary) {
      // Calcular a partir de dados reais de Vendas, Fechamento e Notas da competência
      const notasAutorizadas = await this.prisma.fiscalInvoice.findMany({
        where: {
          competencia: comp,
          status: StatusDocumentoFiscal.AUTORIZADO,
        },
      });

      const totalServicos = notasAutorizadas.reduce((acc, n) => acc + Number(n.valorServicos), 0);
      const totalIss = notasAutorizadas.reduce((acc, n) => acc + Number(n.valorIss), 0);
      const totalPis = notasAutorizadas.reduce((acc, n) => acc + Number(n.valorPis), 0);
      const totalCofins = notasAutorizadas.reduce((acc, n) => acc + Number(n.valorCofins), 0);

      // Total de vendas brutas de ingressos no período (trânsito de terceiros)
      const vendasMes = await this.prisma.sale.findMany({
        where: {
          status: 'APROVADO',
        },
      });
      const receitaBrutaIngressos = vendasMes.reduce((acc, v) => acc + Number(v.totalBruto), 0);

      // Lucro Presumido:
      // IRPJ = Receita Própria * 32% (presunção serviços) * 15% = 4.8%
      // CSLL = Receita Própria * 32% (presunção serviços) * 9% = 2.88%
      const baseCalculoFederal = totalServicos;
      const valorIrpj = Math.round(baseCalculoFederal * 0.32 * 0.15 * 100) / 100;
      const valorCsll = Math.round(baseCalculoFederal * 0.32 * 0.09 * 100) / 100;
      const totalImpostos = Math.round((totalIss + totalPis + totalCofins + valorIrpj + valorCsll) * 100) / 100;

      summary = await this.prisma.taxSummary.create({
        data: {
          competencia: comp,
          regime: RegimeTributario.LUCRO_PRESUMIDO as any,
          receitaBrutaIngressos,
          receitaPropriaTaxasComissoes: totalServicos,
          baseCalculoISS: totalServicos,
          valorIssTotal: totalIss,
          baseCalculoFederal,
          valorPisTotal: totalPis,
          valorCofinsTotal: totalCofins,
          valorIrpjTotal: valorIrpj,
          valorCsllTotal: valorCsll,
          totalImpostos,
          fechado: false,
        },
      });
    }

    return {
      ...summary,
      receitaBrutaIngressos: Number(summary.receitaBrutaIngressos),
      receitaPropriaTaxasComissoes: Number(summary.receitaPropriaTaxasComissoes),
      baseCalculoISS: Number(summary.baseCalculoISS),
      valorIssTotal: Number(summary.valorIssTotal),
      baseCalculoFederal: Number(summary.baseCalculoFederal),
      valorPisTotal: Number(summary.valorPisTotal),
      valorCofinsTotal: Number(summary.valorCofinsTotal),
      valorIrpjTotal: Number(summary.valorIrpjTotal),
      valorCsllTotal: Number(summary.valorCsllTotal),
      totalImpostos: Number(summary.totalImpostos),
    };
  }

  /**
   * Fechar Apuração do Mês e Gerar Guias de Recolhimento (DARF / DAM)
   */
  async fecharApuracao(competencia: string, userId?: string) {
    const apuracao = await this.getTaxSummary(competencia);

    // Atualiza status para fechado
    await this.prisma.taxSummary.update({
      where: { competencia },
      data: {
        fechado: true,
        dataFechamento: new Date(),
      },
    });

    // Gera guias de recolhimento caso ainda não existam para a competência
    const vencimentoMesSeguinte = new Date();
    vencimentoMesSeguinte.setMonth(vencimentoMesSeguinte.getMonth() + 1);
    vencimentoMesSeguinte.setDate(20); // Dia 20 do mês subsequente (padrão DARF/DAM)

    const guiasParaGerar = [
      {
        codigoReceita: 'DAM-ISS-01',
        descricao: `DAM ISSQN - Serviços de Bilheteria Curitiba (${competencia})`,
        tipoTributo: TipoTributo.ISS,
        valor: apuracao.valorIssTotal,
      },
      {
        codigoReceita: 'DARF-8109',
        descricao: `DARF PIS Faturamento 0,65% (${competencia})`,
        tipoTributo: TipoTributo.PIS,
        valor: apuracao.valorPisTotal,
      },
      {
        codigoReceita: 'DARF-2172',
        descricao: `DARF COFINS Faturamento 3,00% (${competencia})`,
        tipoTributo: TipoTributo.COFINS,
        valor: apuracao.valorCofinsTotal,
      },
      {
        codigoReceita: 'DARF-2089',
        descricao: `DARF IRPJ Lucro Presumido Trimestral (${competencia})`,
        tipoTributo: TipoTributo.IRRF,
        valor: apuracao.valorIrpjTotal,
      },
      {
        codigoReceita: 'DARF-2372',
        descricao: `DARF CSLL Lucro Presumido Trimestral (${competencia})`,
        tipoTributo: TipoTributo.CSLL,
        valor: apuracao.valorCsllTotal,
      },
    ];

    for (const g of guiasParaGerar) {
      if (g.valor > 0) {
        const existe = await this.prisma.taxGuide.findFirst({
          where: {
            codigoReceita: g.codigoReceita,
            competencia,
          },
        });

        if (!existe) {
          const codBarraRandom = `858${Math.floor(1000000000 + Math.random() * 9000000000)}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          await this.prisma.taxGuide.create({
            data: {
              codigoReceita: g.codigoReceita,
              descricao: g.descricao,
              tipoTributo: g.tipoTributo as any,
              competencia,
              vencimento: vencimentoMesSeguinte,
              valorPrincipal: g.valor,
              jurosMulta: 0,
              valorTotal: g.valor,
              codigoBarras: codBarraRandom,
              linhaDigitavel: `${codBarraRandom.slice(0, 11)} ${codBarraRandom.slice(11, 22)} ${codBarraRandom.slice(22, 33)}`,
              status: StatusGuiaRecolhimento.A_RECOLHER as any,
            },
          });
        }
      }
    }

    return this.getTaxSummary(competencia);
  }

  /**
   * Listar Guias de Recolhimento
   */
  async getTaxGuides(competencia?: string, status?: StatusGuiaRecolhimento) {
    const where: any = {};
    if (competencia) where.competencia = competencia;
    if (status) where.status = status;

    const guias = await this.prisma.taxGuide.findMany({
      where,
      orderBy: { vencimento: 'asc' },
    });

    return guias.map((g) => ({
      ...g,
      valorPrincipal: Number(g.valorPrincipal),
      jurosMulta: Number(g.jurosMulta),
      valorTotal: Number(g.valorTotal),
    }));
  }

  /**
   * Baixar Guia de Recolhimento como Paga
   */
  async baixarGuia(id: string) {
    const guia = await this.prisma.taxGuide.findUnique({ where: { id } });
    if (!guia) {
      throw new NotFoundException(`Guia ${id} não encontrada.`);
    }

    const updated = await this.prisma.taxGuide.update({
      where: { id },
      data: {
        status: StatusGuiaRecolhimento.PAGA as any,
        pagaEm: new Date(),
      },
    });

    return {
      ...updated,
      valorPrincipal: Number(updated.valorPrincipal),
      jurosMulta: Number(updated.jurosMulta),
      valorTotal: Number(updated.valorTotal),
    };
  }

  /**
   * Gerador SPED Oficial (EFD-Reinf ou SPED Contribuições PIS/COFINS)
   */
  async gerarSped(tipo: TipoSped, competencia: string, userId?: string) {
    const comp = competencia || new Date().toISOString().slice(0, 7);
    const notas = await this.prisma.fiscalInvoice.findMany({
      where: {
        competencia: comp,
        status: StatusDocumentoFiscal.AUTORIZADO,
      },
    });

    let conteudo = '';
    let nomeArquivo = '';

    if (tipo === TipoSped.EFD_REINF) {
      nomeArquivo = `EFD_REINF_${comp.replace('-', '')}_08123456000199.xml`;
      conteudo = this.generateEfdReinfXml(comp, notas);
    } else if (tipo === TipoSped.SPED_CONTRIBUICOES) {
      nomeArquivo = `SPED_PIS_COFINS_${comp.replace('-', '')}_08123456000199.txt`;
      conteudo = this.generateSpedContribuicoesTxt(comp, notas);
    } else {
      nomeArquivo = `SPED_FISCAL_${comp.replace('-', '')}_08123456000199.txt`;
      conteudo = this.generateSpedFiscalTxt(comp, notas);
    }

    const linhas = conteudo.split('\n').length;
    const hashArquivo = crypto.createHash('sha256').update(conteudo).digest('hex');

    const spedExport = await this.prisma.spedExport.create({
      data: {
        tipo: tipo as any,
        competencia: comp,
        versaoLeiaute: 'v2.1',
        nomeArquivo,
        hashArquivo,
        conteudo,
        totalLinhas: linhas,
        geradoPor: userId || 'Sistema Automático',
      },
    });

    return spedExport;
  }

  /**
   * Consulta histórico de arquivos SPED gerados
   */
  async getSpedHistory(competencia?: string) {
    const where: any = {};
    if (competencia) where.competencia = competencia;

    return this.prisma.spedExport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================================
  // GERADORES REGULAMENTARES (XML NFS-e ABRASF, EFD-REINF & SPED CONTRIBUIÇÕES)
  // ============================================================================

  private generateNfseXml(data: {
    numeroNota: string;
    codigoVerificacao: string;
    dataEmissao: string;
    competencia: string;
    tomadorNome: string;
    tomadorDoc: string;
    tomadorCidade: string;
    tomadorUf: string;
    discriminacao: string;
    valorServicos: number;
    valorIss: number;
    aliquotaIss: number;
    valorPis: number;
    valorCofins: number;
    valorLiquido: number;
  }): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd">
  <Nfse versao="2.04">
    <InfNfse Id="${data.numeroNota}">
      <Numero>${data.numeroNota.replace(/\D/g, '')}</Numero>
      <CodigoVerificacao>${data.codigoVerificacao}</CodigoVerificacao>
      <DataEmissao>${data.dataEmissao}</DataEmissao>
      <Competencia>${data.competencia}-01</Competencia>
      <NaturezaOperacao>1</NaturezaOperacao>
      <RegimeEspecialTributacao>6</RegimeEspecialTributacao>
      <OptanteSimplesNacional>2</OptanteSimplesNacional>
      <IncentivadorCultural>2</IncentivadorCultural>
      <ValoresNfse>
        <BaseCalculo>${data.valorServicos.toFixed(2)}</BaseCalculo>
        <Aliquota>${data.aliquotaIss.toFixed(2)}</Aliquota>
        <ValorIss>${data.valorIss.toFixed(2)}</ValorIss>
        <ValorLiquidoNfse>${data.valorLiquido.toFixed(2)}</ValorLiquidoNfse>
      </ValoresNfse>
      <PrestadorServico>
        <IdentificacaoPrestador>
          <CpfCnpj><Cnpj>08123456000199</Cnpj></CpfCnpj>
          <InscricaoMunicipal>1234567</InscricaoMunicipal>
        </IdentificacaoPrestador>
        <RazaoSocial>DISKINGRESSOS SERVICOS DE BILHETERIA E INTERMEDIACAO LTDA</RazaoSocial>
        <Endereco>
          <Endereco>RUA MARECHAL DEODORO</Endereco>
          <Numero>300</Numero>
          <Bairro>CENTRO</Bairro>
          <CodigoMunicipio>4106902</CodigoMunicipio>
          <Uf>PR</Uf>
          <Cep>80010010</Cep>
        </Endereco>
      </PrestadorServico>
      <TomadorServico>
        <IdentificacaoTomador>
          <CpfCnpj>${data.tomadorDoc.length > 14 ? `<Cnpj>${data.tomadorDoc.replace(/\D/g, '')}</Cnpj>` : `<Cpf>${data.tomadorDoc.replace(/\D/g, '')}</Cpf>`}</CpfCnpj>
        </IdentificacaoTomador>
        <RazaoSocial>${data.tomadorNome}</RazaoSocial>
        <Endereco>
          <CodigoMunicipio>4106902</CodigoMunicipio>
          <Uf>${data.tomadorUf}</Uf>
        </Endereco>
      </TomadorServico>
      <Servico>
        <Valores>
          <ValorServicos>${data.valorServicos.toFixed(2)}</ValorServicos>
          <ValorPis>${data.valorPis.toFixed(2)}</ValorPis>
          <ValorCofins>${data.valorCofins.toFixed(2)}</ValorCofins>
          <ValorIss>${data.valorIss.toFixed(2)}</ValorIss>
          <Aliquota>${data.aliquotaIss.toFixed(2)}</Aliquota>
        </Valores>
        <ItemListaServico>12.07</ItemListaServico>
        <CodigoCnae>8230001</CodigoCnae>
        <Discriminacao>${data.discriminacao}</Discriminacao>
        <CodigoMunicipio>4106902</CodigoMunicipio>
      </Servico>
    </InfNfse>
  </Nfse>
</CompNfse>`;
  }

  private generateEfdReinfXml(competencia: string, notas: any[]): string {
    const totalServicos = notas.reduce((acc, n) => acc + Number(n.valorServicos), 0);
    return `<?xml version="1.0" encoding="UTF-8"?>
<Reinf xmlns="http://www.reinf.esocial.gov.br/schemas/evt4020PagtoBeneficiarioPJ/v2_01_02">
  <evtRetPJ id="ID108123456000199${competencia.replace('-', '')}00001">
    <ideEvento>
      <perApur>${competencia}</perApur>
      <tpAmb>1</tpAmb>
      <verProc>DiskIngressos_ERP_v1.0</verProc>
    </ideEvento>
    <ideContri>
      <tpInsc>1</tpInsc>
      <nrInsc>08123456000199</nrInsc>
    </ideContri>
    <ideEstab>
      <tpInscEstab>1</tpInscEstab>
      <nrInscEstab>08123456000199</nrInscEstab>
      <ideBenef>
        <cnpjBenef>11222333000188</cnpjBenef>
        <idePgto>
          <natRend>17001</natRend>
          <vlrBruto>${totalServicos.toFixed(2)}</vlrBruto>
          <vlrBaseIR>${totalServicos.toFixed(2)}</vlrBaseIR>
          <vlrIR>${(totalServicos * 0.015).toFixed(2)}</vlrIR>
        </idePgto>
      </ideBenef>
    </ideEstab>
  </evtRetPJ>
</Reinf>`;
  }

  private generateSpedContribuicoesTxt(competencia: string, notas: any[]): string {
    const ano = competencia.slice(0, 4);
    const mes = competencia.slice(5, 7);
    const dtIni = `01${mes}${ano}`;
    const dtFim = `30${mes}${ano}`;

    const totalServicos = notas.reduce((acc, n) => acc + Number(n.valorServicos), 0);
    const totalPis = notas.reduce((acc, n) => acc + Number(n.valorPis), 0);
    const totalCofins = notas.reduce((acc, n) => acc + Number(n.valorCofins), 0);

    const lines: string[] = [];

    // BLOCO 0: Abertura e Identificação
    lines.push(`|0000|005|0|${dtIni}|${dtFim}|DISKINGRESSOS SERVICOS DE BILHETERIA LTDA|08123456000199|PR|4106902|||0|`);
    lines.push(`|0001|0|`);
    lines.push(`|0110|1|1|`); // Regime Cumulativo / Lucro Presumido
    lines.push(`|0990|4|`);

    // BLOCO A: Documentos Fiscais - Serviços (ISS)
    lines.push(`|A001|0|`);
    notas.forEach((n, idx) => {
      const numDoc = n.numeroNota.replace(/\D/g, '');
      const dtDoc = new Date(n.dataEmissao).toLocaleDateString('pt-BR').replace(/\D/g, '');
      lines.push(
        `|A100|0|0||${numDoc}|${dtDoc}||${Number(n.valorServicos).toFixed(2)}|0|0.00|${Number(n.baseCalculo).toFixed(2)}|0.65|${Number(n.valorPis).toFixed(2)}|3.00|${Number(n.valorCofins).toFixed(2)}|${Number(n.valorLiquido).toFixed(2)}|`
      );
    });
    lines.push(`|A990|${notas.length + 2}|`);

    // BLOCO M: Apuração do PIS e da COFINS
    lines.push(`|M001|0|`);
    lines.push(`|M200|${totalPis.toFixed(2)}|0|0.00|0|0.00|0.00|0.00|${totalPis.toFixed(2)}|`);
    lines.push(`|M210|01|${totalServicos.toFixed(2)}|${totalServicos.toFixed(2)}|0.65|||${totalPis.toFixed(2)}|0.00|0.00|${totalPis.toFixed(2)}|`);
    lines.push(`|M600|${totalCofins.toFixed(2)}|0|0.00|0|0.00|0.00|0.00|${totalCofins.toFixed(2)}|`);
    lines.push(`|M610|01|${totalServicos.toFixed(2)}|${totalServicos.toFixed(2)}|3.00|||${totalCofins.toFixed(2)}|0.00|0.00|${totalCofins.toFixed(2)}|`);
    lines.push(`|M990|6|`);

    // BLOCO 9: Encerramento
    lines.push(`|9001|0|`);
    lines.push(`|9900|0000|1|`);
    lines.push(`|9900|A001|1|`);
    lines.push(`|9900|A100|${notas.length}|`);
    lines.push(`|9900|M001|1|`);
    lines.push(`|9990|7|`);
    lines.push(`|9999|${lines.length + 2}|`);

    return lines.join('\r\n');
  }

  private generateSpedFiscalTxt(competencia: string, notas: any[]): string {
    const ano = competencia.slice(0, 4);
    const mes = competencia.slice(5, 7);
    const dtIni = `01${mes}${ano}`;
    const dtFim = `30${mes}${ano}`;

    const lines: string[] = [];
    lines.push(`|0000|017|0|${dtIni}|${dtFim}|DISKINGRESSOS BILHETERIA LTDA|08123456000199||PR|4106902|||A|1|`);
    lines.push(`|0001|0|`);
    lines.push(`|0990|3|`);
    lines.push(`|9001|0|`);
    lines.push(`|9999|5|`);
    return lines.join('\r\n');
  }

  /**
   * Integração automática de partidas dobradas para a NFS-e emitida
   */
  private async integrarContabilNfse(nf: any, userId?: string) {
    const contaClientes = await this.prisma.chartOfAccounts.findUnique({
      where: { codigo: '1.1.02.01.001' }, // Clientes a Receber
    });
    const contaReceitaTaxas = await this.prisma.chartOfAccounts.findUnique({
      where: { codigo: '4.1.01.02.001' }, // Receitas com Taxas de Conveniência
    });
    const contaDespesaIss = await this.prisma.chartOfAccounts.findUnique({
      where: { codigo: '5.2.01.01.001' }, // ISS sobre Serviços
    });
    const contaIssRecolher = await this.prisma.chartOfAccounts.findUnique({
      where: { codigo: '2.1.03.01.001' }, // ISS a Recolher
    });

    if (!contaClientes || !contaReceitaTaxas) {
      return;
    }

    const valorTotal = Number(nf.valorServicos);
    const valorIss = Number(nf.valorIss);

    const items: any[] = [
      {
        accountId: contaClientes.id,
        tipo: 'DEBITO',
        valor: valorTotal,
        historicoComplementar: `NFS-e ${nf.numeroNota} - ${nf.tomadorNome}`,
      },
      {
        accountId: contaReceitaTaxas.id,
        tipo: 'CREDITO',
        valor: valorTotal,
        historicoComplementar: `Receita prestação de serviços bilheteria NFS-e ${nf.numeroNota}`,
      },
    ];

    if (valorIss > 0 && contaDespesaIss && contaIssRecolher) {
      items.push({
        accountId: contaDespesaIss.id,
        tipo: 'DEBITO',
        valor: valorIss,
        historicoComplementar: `Provisão ISS s/ NFS-e ${nf.numeroNota}`,
      });
      items.push({
        accountId: contaIssRecolher.id,
        tipo: 'CREDITO',
        valor: valorIss,
        historicoComplementar: `ISS a Recolher ref. NFS-e ${nf.numeroNota}`,
      });
    }

    const totalDebito = items
      .filter((i) => i.tipo === 'DEBITO')
      .reduce((acc, i) => acc + Number(i.valor), 0);
    const totalCredito = items
      .filter((i) => i.tipo === 'CREDITO')
      .reduce((acc, i) => acc + Number(i.valor), 0);

    const count = await this.prisma.journalEntry.count();
    const numeroLancamento = `LAN-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    await this.prisma.journalEntry.create({
      data: {
        numeroLancamento,
        data: new Date(nf.dataEmissao),
        historico: `Escrituração fiscal automatizada da NFS-e ${nf.numeroNota} (${nf.tomadorNome})`,
        origem: 'FISCAL_NFSE',
        origemId: nf.id,
        totalDebito,
        totalCredito,
        equilibrado: Math.abs(totalDebito - totalCredito) < 0.01,
        status: 'CONFIRMADO',
        criadoPor: userId || 'FiscalBot Automático',
        items: {
          create: items,
        },
      },
    });
  }
}
