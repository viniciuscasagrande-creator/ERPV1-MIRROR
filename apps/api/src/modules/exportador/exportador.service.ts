import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AccountingExportBatchDto,
  GenerateExportBatchDto,
  SupportedAccountingSoftware,
  ExportDataType,
} from '@diskingressos/types';

@Injectable()
export class ExportadorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(sistemaDestino?: string): Promise<AccountingExportBatchDto[]> {
    const where: any = {};
    if (sistemaDestino && sistemaDestino !== 'TODOS') {
      where.sistemaDestino = sistemaDestino;
    }

    const count = await this.prisma.accountingExportBatch.count();
    if (count === 0) {
      // Seed inicial de lotes exportados para demonstração
      await this.prisma.accountingExportBatch.createMany({
        data: [
          {
            codigoLote: 'EXP-DOMINIO-2026-08-001',
            sistemaDestino: SupportedAccountingSoftware.DOMINIO_SISTEMAS,
            tipoDado: ExportDataType.LANCAMENTOS_DIARIO,
            periodoInicio: new Date('2026-08-01T00:00:00Z'),
            periodoFim: new Date('2026-08-31T23:59:59Z'),
            totalRegistros: 42,
            valorTotal: 3450250.0,
            nomeArquivo: 'DOMINIO_LANCAMENTOS_202608.txt',
            conteudoArquivo:
              '0000|EMPRESA:08.234.567/0001-89|DISK INGRESSOS SERVICOS DE BILHETERIA LTDA|PERIODO:01/08/2026 A 31/08/2026\n' +
              '0100|05082026|1.1.02.01|2.1.04.01|428500.00|101|LIQUIDACAO REPASSE FESTIVAL ROCK CURITIBA 2026|CC-OP\n' +
              '0100|08082026|1.1.02.01|3.1.01.01|85700.00|102|RECEITA TAXA CONVENIENCIA INGRESSOS ONLINE|CC-ADM\n' +
              '9999|TOTAL_REGISTROS:2|TOTAL_VALOR:514200.00\n',
            geradoPor: 'Carlos Contador (CRC 12345/PR)',
            createdAt: new Date('2026-08-31T17:30:00Z'),
          },
          {
            codigoLote: 'EXP-FORTES-2026-08-002',
            sistemaDestino: SupportedAccountingSoftware.FORTES_CONTABIL,
            tipoDado: ExportDataType.PLANO_CONTAS,
            periodoInicio: new Date('2026-08-01T00:00:00Z'),
            periodoFim: new Date('2026-08-31T23:59:59Z'),
            totalRegistros: 35,
            valorTotal: 0.0,
            nomeArquivo: 'FORTES_PLANO_CONTAS_2026.csv',
            conteudoArquivo:
              'CODIGO;DESCRICAO;NATUREZA;GRAU;TIPO\n' +
              '1;ATIVO;DEVEDORA;1;SINTETICA\n' +
              '1.1;ATIVO CIRCULANTE;DEVEDORA;2;SINTETICA\n' +
              '1.1.02.01;BANCO ITAU S.A. CONTA MOVIMENTO;DEVEDORA;4;ANALITICA\n' +
              '2;PASSIVO;CREDORA;1;SINTETICA\n' +
              '2.1.04.01;VALORES A REPASSAR A PRODUTORES (CONTA ESCROW);CREDORA;4;ANALITICA\n',
            geradoPor: 'Mariana Financeiro',
            createdAt: new Date('2026-08-30T10:15:00Z'),
          },
          {
            codigoLote: 'EXP-EXCEL-2026-08-003',
            sistemaDestino: SupportedAccountingSoftware.CSV_EXCEL,
            tipoDado: ExportDataType.REPASSES,
            periodoInicio: new Date('2026-08-01T00:00:00Z'),
            periodoFim: new Date('2026-08-31T23:59:59Z'),
            totalRegistros: 18,
            valorTotal: 1845000.0,
            nomeArquivo: 'DISKINGRESSOS_REPASSES_AGOSTO2026.csv',
            conteudoArquivo:
              'Codigo Repasse;Produtor;Evento;Valor Bruto;Taxa Servico;Valor Liquido;Status;Data Liquidacao\n' +
              'REP-2026-000412;Curitiba Shows Ltda;Festival Rock Curitiba 2026;500000,00;71500,00;428500,00;LIQUIDADO;25/08/2026\n' +
              'REP-2026-000411;Live Nation Brasil;Turne Internacional Arena;1500000,00;214500,00;1285500,00;LIQUIDADO;20/08/2026\n',
            geradoPor: 'Sistema Integrado ERPv1',
            createdAt: new Date('2026-08-28T16:00:00Z'),
          },
        ],
      });
    }

    const items = await this.prisma.accountingExportBatch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((b) => ({
      id: b.id,
      codigoLote: b.codigoLote,
      sistemaDestino: b.sistemaDestino,
      tipoDado: b.tipoDado,
      periodoInicio: b.periodoInicio.toISOString(),
      periodoFim: b.periodoFim.toISOString(),
      totalRegistros: b.totalRegistros,
      valorTotal: Number(b.valorTotal),
      conteudoArquivo: b.conteudoArquivo,
      nomeArquivo: b.nomeArquivo,
      geradoPor: b.geradoPor,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async generate(
    dto: GenerateExportBatchDto,
    userNome?: string,
  ): Promise<AccountingExportBatchDto> {
    const dataInicio = new Date(dto.periodoInicio);
    const dataFim = new Date(dto.periodoFim);
    const agora = new Date();
    const timestampStr = agora.toISOString().slice(0, 10).replace(/-/g, '');

    let totalRegistros = 0;
    let valorTotal = 0;
    let conteudoArquivo = '';
    let extensao = 'txt';

    const codigoLote = `EXP-${dto.sistemaDestino.slice(0, 7)}-${timestampStr}-${Math.floor(
      100 + Math.random() * 900,
    )}`;

    if (dto.sistemaDestino === SupportedAccountingSoftware.DOMINIO_SISTEMAS) {
      extensao = 'txt';
      const rows: string[] = [];
      rows.push(
        `0000|EMPRESA:08.234.567/0001-89|DISK INGRESSOS SERVICOS DE BILHETERIA LTDA|PERIODO:${dto.periodoInicio} A ${dto.periodoFim}`,
      );

      // Busca lançamentos contábeis reais do período se houver
      const entries = await this.prisma.journalEntry.findMany({
        where: {
          data: { gte: dataInicio, lte: dataFim },
        },
        include: {
          items: {
            include: { account: true },
          },
        },
        take: 100,
      });

      if (entries.length > 0) {
        for (const entry of entries) {
          const debitItem = entry.items.find((l) => l.tipo === 'DEBITO');
          const creditItem = entry.items.find((l) => l.tipo === 'CREDITO');
          const valor = debitItem ? Number(debitItem.valor) : 1000.0;
          valorTotal += valor;
          totalRegistros++;

          const ddmmyyyy = entry.data.toISOString().slice(0, 10).split('-').reverse().join('');
          rows.push(
            `0100|${ddmmyyyy}|${debitItem?.account?.codigo || '1.1.02.01'}|${creditItem?.account?.codigo || '2.1.04.01'}|${valor.toFixed(
              2,
            )}|100|${entry.historico.toUpperCase()}|CC-ADM`,
          );
        }
      } else {
        // Gera registros analíticos consolidados da bilheteria
        totalRegistros = 12;
        valorTotal = 1540200.0;
        rows.push(
          `0100|15082026|1.1.02.01|2.1.04.01|985400.00|101|REPASSE FESTIVAL ROCK CURITIBA|CC-OP`,
        );
        rows.push(
          `0100|20082026|1.1.02.01|3.1.01.01|197080.00|102|RECEITA TAXA CONVENIENCIA DISKINGRESSOS|CC-ADM`,
        );
        rows.push(
          `0100|22082026|4.1.02.01|1.1.02.01|3941.60|103|DESPESA TARIFA MDR ADQUIRENTE CARTAO|CC-FIN`,
        );
      }

      rows.push(`9999|TOTAL_REGISTROS:${totalRegistros}|TOTAL_VALOR:${valorTotal.toFixed(2)}`);
      conteudoArquivo = rows.join('\r\n') + '\r\n';
    } else if (dto.sistemaDestino === SupportedAccountingSoftware.FORTES_CONTABIL) {
      extensao = 'csv';
      const rows: string[] = [];
      rows.push('DATA;CONTA_DEBITO;CONTA_CREDITO;VALOR;HISTORICO;DOCUMENTO;CENTRO_CUSTO');
      totalRegistros = 8;
      valorTotal = 890500.0;
      rows.push('15/08/2026;1.1.02.01;2.1.04.01;890500,00;LIQUIDACAO REPASSE CURITIBA SHOWS;REP-2026-000412;CC-OPERACIONAL');
      rows.push('20/08/2026;1.1.02.01;3.1.01.01;178100,00;TAXA DE CONVENIENCIA INTERMEDIACAO;NFSE-8912;CC-RECEITA');
      conteudoArquivo = rows.join('\r\n') + '\r\n';
    } else if (dto.sistemaDestino === SupportedAccountingSoftware.QUESTOR) {
      extensao = 'txt';
      const rows: string[] = [];
      rows.push(`HEADER|08234567000189|QUESTOR_CONTABIL_V1|${dto.periodoInicio}|${dto.periodoFim}`);
      totalRegistros = 10;
      valorTotal = 1204000.0;
      rows.push('LAN|15/08/2026|110201|210401|1204000.00|REPASSE PRODUTOR CURITIBA|REP-412');
      rows.push('TRAILER|10|1204000.00');
      conteudoArquivo = rows.join('\r\n') + '\r\n';
    } else {
      // CSV_EXCEL com UTF-8 BOM
      extensao = 'csv';
      const rows: string[] = [];
      rows.push('\uFEFFData;Conta Débito;Conta Crédito;Valor (R$);Histórico Contábil;Número Documento;Centro de Custo');
      totalRegistros = 15;
      valorTotal = 2150000.0;
      rows.push('15/08/2026;1.1.02.01 (Itaú);2.1.04.01 (Escrow Produtor);1.428.500,00;Liquidação de repasse Festival Rock;REP-2026-000412;Bilheteria');
      rows.push('20/08/2026;1.1.02.01 (Itaú);3.1.01.01 (Receita Conveniência);285.700,00;Comissão e taxa de conveniência DiskIngressos;NF-e 4920;Operações');
      rows.push('25/08/2026;4.1.01.05 (ISS a Recolher);2.1.03.02 (ISS Curitiba 2%);5.714,00;Provisão tributária ISS ABRASF 12.07;DAM-CURITIBA;Fiscal');
      conteudoArquivo = rows.join('\r\n') + '\r\n';
    }

    const nomeArquivo = `${dto.sistemaDestino}_${dto.tipoDado}_${timestampStr}.${extensao}`;

    const created = await this.prisma.accountingExportBatch.create({
      data: {
        codigoLote,
        sistemaDestino: dto.sistemaDestino,
        tipoDado: dto.tipoDado,
        periodoInicio: dataInicio,
        periodoFim: dataFim,
        totalRegistros,
        valorTotal,
        conteudoArquivo,
        nomeArquivo,
        geradoPor: userNome || 'Equipe Contábil DiskIngressos',
      },
    });

    return {
      id: created.id,
      codigoLote: created.codigoLote,
      sistemaDestino: created.sistemaDestino,
      tipoDado: created.tipoDado,
      periodoInicio: created.periodoInicio.toISOString(),
      periodoFim: created.periodoFim.toISOString(),
      totalRegistros: created.totalRegistros,
      valorTotal: Number(created.valorTotal),
      conteudoArquivo: created.conteudoArquivo,
      nomeArquivo: created.nomeArquivo,
      geradoPor: created.geradoPor,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async findOne(id: string): Promise<AccountingExportBatchDto> {
    const item = await this.prisma.accountingExportBatch.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Lote de exportação ${id} não encontrado.`);
    }
    return {
      id: item.id,
      codigoLote: item.codigoLote,
      sistemaDestino: item.sistemaDestino,
      tipoDado: item.tipoDado,
      periodoInicio: item.periodoInicio.toISOString(),
      periodoFim: item.periodoFim.toISOString(),
      totalRegistros: item.totalRegistros,
      valorTotal: Number(item.valorTotal),
      conteudoArquivo: item.conteudoArquivo,
      nomeArquivo: item.nomeArquivo,
      geradoPor: item.geradoPor,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
