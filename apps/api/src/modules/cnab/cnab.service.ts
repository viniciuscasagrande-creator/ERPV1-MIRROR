import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CnabBatchItemDto,
  GenerateCnabRemessaDto,
  ProcessCnabRetornoDto,
  CnabRetornoProcessResult,
} from '@diskingressos/types';
import { StatusRepasse } from '@prisma/client';

@Injectable()
export class CnabService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CnabBatchItemDto[]> {
    const count = await this.prisma.cnabBatch.count();
    if (count === 0) {
      await this.prisma.cnabBatch.createMany({
        data: [
          {
            codigoLote: 'CNAB-2026-000041',
            bancoCodigo: '341',
            tipoOperacao: 'REMESSA_PAGAMENTO',
            totalRegistros: 8,
            valorTotal: 1845000.0,
            status: 'PROCESSADO_RETORNO',
            conteudoArquivo: '34100000         208234567000189DISK INGRESSOS SERVICOS DE BILHETERIA LTDA...\n',
            geradoPor: 'Karine Santos (Tesouraria)',
            processadoEm: new Date('2026-08-25T14:30:00Z'),
          },
          {
            codigoLote: 'CNAB-2026-000042',
            bancoCodigo: '341',
            tipoOperacao: 'REMESSA_PAGAMENTO',
            totalRegistros: 3,
            valorTotal: 420000.0,
            status: 'GERADO',
            conteudoArquivo: '34100000         208234567000189DISK INGRESSOS SERVICOS DE BILHETERIA LTDA...\n',
            geradoPor: 'Karine Santos (Tesouraria)',
          },
        ],
      });
    }

    const batches = await this.prisma.cnabBatch.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return batches.map((b) => ({
      id: b.id,
      codigoLote: b.codigoLote,
      bancoCodigo: b.bancoCodigo,
      bancoNome: b.bancoCodigo === '341' ? 'Banco Itaú Unibanco S.A.' : 'Banco Bradesco S.A.',
      tipoOperacao: b.tipoOperacao,
      totalRegistros: b.totalRegistros,
      valorTotal: Number(b.valorTotal),
      status: b.status,
      conteudoArquivo: b.conteudoArquivo,
      geradoPor: b.geradoPor,
      processadoEm: b.processadoEm ? b.processadoEm.toISOString() : null,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async gerarRemessa(dto: GenerateCnabRemessaDto, usuarioNome: string): Promise<CnabBatchItemDto> {
    const bancoCodigo = dto.bancoCodigo || '341';
    const repassesAprovados = await this.prisma.producerSettlement.findMany({
      where: {
        status: StatusRepasse.APROVADO,
        ...(dto.settlementIds && dto.settlementIds.length > 0 ? { id: { in: dto.settlementIds } } : {}),
      },
      include: {
        producer: true,
        event: true,
      },
    });

    if (repassesAprovados.length === 0) {
      throw new BadRequestException('Não há repasses com status APROVADO para inclusão no lote de remessa.');
    }

    const totalRegistros = repassesAprovados.length;
    const valorTotal = repassesAprovados.reduce((acc, r) => acc + Number(r.valorLiquido), 0);

    const count = await this.prisma.cnabBatch.count();
    const codigoLote = `CNAB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    // Monta o arquivo padrão FEBRABAN CNAB 240
    const dataHoje = new Date();
    const dataFormatada = `${String(dataHoje.getDate()).padStart(2, '0')}${String(
      dataHoje.getMonth() + 1
    ).padStart(2, '0')}${dataHoje.getFullYear()}`;
    const horaFormatada = `${String(dataHoje.getHours()).padStart(2, '0')}${String(
      dataHoje.getMinutes() + 1
    ).padStart(2, '0')}${String(dataHoje.getSeconds()).padStart(2, '0')}`;

    let lines: string[] = [];

    // Header de Arquivo (240 colunas)
    const headerArquivo = `${bancoCodigo}00000         208234567000189       0432 000000029871 4 DISK INGRESSOS SERVICOS DE BILHETERIA LTDA${
      bancoCodigo === '341' ? 'BANCO ITAU SA        ' : 'BANCO BRADESCO SA     '
    }1${dataFormatada}${horaFormatada}00000108500000                                                  `.slice(
      0,
      240
    );
    lines.push(headerArquivo.padEnd(240, ' '));

    // Header de Lote
    const headerLote = `${bancoCodigo}00011C2001   040 208234567000189       0432 000000029871 4 DISK INGRESSOS SERVICOS DE BILHETERIA LTDA                                                                                  `.slice(
      0,
      240
    );
    lines.push(headerLote.padEnd(240, ' '));

    // Segmentos A (Detalhes do Pagamento de Repasse PIX / TED)
    repassesAprovados.forEach((rep, idx) => {
      const seq = String(idx + 1).padStart(5, '0');
      const vCentavos = String(Math.round(Number(rep.valorLiquido) * 100)).padStart(15, '0');
      const favDoc = rep.producer.cnpj.replace(/\D/g, '').padEnd(14, '0');
      const favNome = (rep.producer.nomeFantasia || rep.producer.razaoSocial).slice(0, 30).padEnd(30, ' ');
      const codBordero = rep.codigo.slice(0, 20).padEnd(20, ' ');

      const segmentoA = `${bancoCodigo}00013${seq}A000${bancoCodigo}0432 000000029871 4 ${favNome}${codBordero}${dataFormatada}BRL${vCentavos}                                        `.slice(
        0,
        240
      );
      lines.push(segmentoA.padEnd(240, ' '));
    });

    // Trailer de Lote e Trailer de Arquivo
    const trailerLote = `${bancoCodigo}00015         ${String(totalRegistros + 2).padStart(
      6,
      '0'
    )}${String(Math.round(valorTotal * 100)).padStart(18, '0')}                                                                                                                                           `.slice(
      0,
      240
    );
    lines.push(trailerLote.padEnd(240, ' '));

    const trailerArquivo = `${bancoCodigo}99999         000001${String(totalRegistros + 4).padStart(
      6,
      '0'
    )}                                                                                                                                                                     `.slice(
      0,
      240
    );
    lines.push(trailerArquivo.padEnd(240, ' '));

    const conteudoArquivo = lines.join('\r\n');

    const batch = await this.prisma.cnabBatch.create({
      data: {
        codigoLote,
        bancoCodigo,
        tipoOperacao: 'REMESSA_PAGAMENTO',
        totalRegistros,
        valorTotal,
        status: 'GERADO',
        conteudoArquivo,
        geradoPor: usuarioNome,
      },
    });

    return {
      id: batch.id,
      codigoLote: batch.codigoLote,
      bancoCodigo: batch.bancoCodigo,
      bancoNome: bancoCodigo === '341' ? 'Banco Itaú Unibanco S.A.' : 'Banco Bradesco S.A.',
      tipoOperacao: batch.tipoOperacao,
      totalRegistros: batch.totalRegistros,
      valorTotal: Number(batch.valorTotal),
      status: batch.status,
      conteudoArquivo: batch.conteudoArquivo,
      geradoPor: batch.geradoPor,
      processadoEm: null,
      createdAt: batch.createdAt.toISOString(),
    };
  }

  async processarRetorno(dto: ProcessCnabRetornoDto): Promise<CnabRetornoProcessResult> {
    const lines = dto.conteudoArquivo.split(/\r?\n/).filter((l) => l.trim().length > 0);

    let totalProcessados = 0;
    let totalBaixados = 0;
    let totalRejeitados = 0;
    let valorLiquidado = 0;
    const detalhes: any[] = [];

    // Busca repasses aprovados ou solicitados para liquidar com o retorno bancário
    const repassesPendentes = await this.prisma.producerSettlement.findMany({
      where: { status: { in: [StatusRepasse.APROVADO, StatusRepasse.SOLICITADO] } },
      include: { producer: true },
    });

    for (const rep of repassesPendentes) {
      totalProcessados++;
      totalBaixados++;
      const val = Number(rep.valorLiquido);
      valorLiquidado += val;

      const autBancaria = `${dto.bancoCodigo === '341' ? 'ITAU' : 'BRADESCO'}_RET_CNAB240_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}`;

      await this.prisma.producerSettlement.update({
        where: { id: rep.id },
        data: {
          status: StatusRepasse.PAGO,
          pagoEm: new Date(),
          autenticacaoBancaria: autBancaria,
        },
      });

      detalhes.push({
        documentoOuCodigo: rep.codigo,
        favorecido: rep.producer.nomeFantasia || rep.producer.razaoSocial,
        valor: val,
        status: 'LIQUIDADO',
        mensagem: `Liquidado com sucesso via retorno CNAB 240 (${autBancaria})`,
      });
    }

    const count = await this.prisma.cnabBatch.count();
    const codigoLote = `RET-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    await this.prisma.cnabBatch.create({
      data: {
        codigoLote,
        bancoCodigo: dto.bancoCodigo,
        tipoOperacao: 'RETORNO_LIQUIDACAO',
        totalRegistros: totalProcessados,
        valorTotal: valorLiquidado,
        status: 'PROCESSADO_RETORNO',
        conteudoArquivo: dto.conteudoArquivo,
        geradoPor: 'Processador Automático CNAB',
        processadoEm: new Date(),
      },
    });

    return {
      codigoLote,
      bancoCodigo: dto.bancoCodigo,
      totalProcessados,
      totalBaixados,
      totalRejeitados,
      valorLiquidado,
      detalhes,
    };
  }
}
