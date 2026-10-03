import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DocumentItemDto, CreateDocumentDto, DocumentCategory } from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class GedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    categoria?: string;
    referenciaTipo?: string;
    referenciaId?: string;
    search?: string;
  }): Promise<DocumentItemDto[]> {
    const where: any = {};
    if (filters?.categoria && filters.categoria !== 'TODOS') {
      where.categoria = filters.categoria;
    }
    if (filters?.referenciaTipo) {
      where.referenciaTipo = filters.referenciaTipo;
    }
    if (filters?.referenciaId) {
      where.referenciaId = filters.referenciaId;
    }
    if (filters?.search) {
      where.OR = [
        { nomeArquivo: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const count = await this.prisma.documentItem.count();
    if (count === 0) {
      // Cria sementes demonstrativas ricas de GED
      await this.prisma.documentItem.createMany({
        data: [
          {
            nomeArquivo: 'CONTRATO-PRESTACAO-SERVICOS-CURITIBA-SHOWS-2026.pdf',
            descricao: 'Contrato Master de Intermediação e Gestão de Bilheteria com Curitiba Shows Ltda.',
            categoria: DocumentCategory.CONTRATO_PRODUTOR,
            tamanhoBytes: 2458200,
            formato: 'PDF',
            urlArquivo: '/docs/contrato-curitiba-shows.pdf',
            hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            referenciaTipo: 'PRODUTOR',
            referenciaId: '12345678000190',
            criadoPor: 'Carlos Contador (CRC 12345/PR)',
          },
          {
            nomeArquivo: 'ALVARA-CORPO-BOMBEIROS-PEDREIRA-ROCK-ARENA.pdf',
            descricao: 'Alvará de Vistoria e Segurança do Corpo de Bombeiros (AVCB) - Pedreira Paulo Leminski.',
            categoria: DocumentCategory.ALVARA_EVENTO,
            tamanhoBytes: 1845100,
            formato: 'PDF',
            urlArquivo: '/docs/alvara-pedreira.pdf',
            hashSha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
            referenciaTipo: 'EVENTO',
            referenciaId: 'evt-rock-arena',
            criadoPor: 'Equipe Operacional DiskIngressos',
          },
          {
            nomeArquivo: 'COMPROVANTE-LIQUIDACAO-ITAU-REP-2026-000101.pdf',
            descricao: 'Comprovante Oficial de Transferência PIX Itaú Unibanco referente ao Borderô REP-2026-000101.',
            categoria: DocumentCategory.COMPROVANTE_PAGAMENTO,
            tamanhoBytes: 420900,
            formato: 'PDF',
            urlArquivo: '/docs/comp-itau-rep101.pdf',
            hashSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
            referenciaTipo: 'REPASSE',
            referenciaId: 'rep-1',
            criadoPor: 'Karine Santos (Tesouraria)',
          },
          {
            nomeArquivo: 'DANFSE-CURITIBA-ABRASF-NFS-2026-000412.xml',
            descricao: 'Arquivo XML Original da Nota Fiscal Eletrônica de Serviços de Curitiba (NFS-e 412).',
            categoria: DocumentCategory.DOCUMENTO_FISCAL,
            tamanhoBytes: 15400,
            formato: 'XML',
            urlArquivo: '/docs/nfs-412.xml',
            hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
            referenciaTipo: 'EVENTO',
            referenciaId: 'evt-rock-arena',
            criadoPor: 'Sistema Fiscal Integrado',
          },
        ],
      });
    }

    const docs = await this.prisma.documentItem.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
    });

    return docs.map((d) => ({
      id: d.id,
      nomeArquivo: d.nomeArquivo,
      descricao: d.descricao,
      categoria: d.categoria,
      tamanhoBytes: d.tamanhoBytes,
      formato: d.formato,
      urlArquivo: d.urlArquivo,
      hashSha256: d.hashSha256,
      referenciaTipo: d.referenciaTipo,
      referenciaId: d.referenciaId,
      criadoPor: d.criadoPor,
      criadoEm: d.criadoEm.toISOString(),
    }));
  }

  async create(dto: CreateDocumentDto, usuarioNome: string): Promise<DocumentItemDto> {
    const hash =
      dto.conteudoBase64
        ? crypto.createHash('sha256').update(dto.conteudoBase64).digest('hex')
        : crypto.createHash('sha256').update(`${dto.nomeArquivo}-${Date.now()}`).digest('hex');

    const created = await this.prisma.documentItem.create({
      data: {
        nomeArquivo: dto.nomeArquivo,
        descricao: dto.descricao,
        categoria: dto.categoria,
        tamanhoBytes: dto.tamanhoBytes,
        formato: dto.formato.toUpperCase(),
        urlArquivo: `/docs/${dto.nomeArquivo}`,
        hashSha256: hash,
        referenciaTipo: dto.referenciaTipo || 'GERAL',
        referenciaId: dto.referenciaId || null,
        criadoPor: usuarioNome,
      },
    });

    return {
      id: created.id,
      nomeArquivo: created.nomeArquivo,
      descricao: created.descricao,
      categoria: created.categoria,
      tamanhoBytes: created.tamanhoBytes,
      formato: created.formato,
      urlArquivo: created.urlArquivo,
      hashSha256: created.hashSha256,
      referenciaTipo: created.referenciaTipo,
      referenciaId: created.referenciaId,
      criadoPor: created.criadoPor,
      criadoEm: created.criadoEm.toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    const doc = await this.prisma.documentItem.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException(`Documento ${id} não encontrado.`);
    }
    await this.prisma.documentItem.delete({ where: { id } });
  }
}
