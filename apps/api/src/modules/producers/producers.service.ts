import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProducerDto) {
    const existing = await this.prisma.producer.findUnique({
      where: { cnpj: dto.cnpj.replace(/\D/g, '') },
    });

    if (existing) {
      throw new ConflictException('Já existe um produtor cadastrado com este CNPJ');
    }

    return this.prisma.producer.create({
      data: {
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj.replace(/\D/g, ''),
        email: dto.email,
        telefone: dto.telefone,
        cidade: dto.cidade || 'Curitiba',
        estado: dto.estado || 'PR',
        taxaComissao: dto.taxaComissao,
        taxaMdr: dto.taxaMdr,
        bancoNome: dto.bancoNome,
        bancoCodigo: dto.bancoCodigo,
        agencia: dto.agencia,
        contaCorrente: dto.contaCorrente,
        chavePix: dto.chavePix,
      },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { razaoSocial: { contains: params.search, mode: 'insensitive' } },
        { nomeFantasia: { contains: params.search, mode: 'insensitive' } },
        { cnpj: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, producers] = await Promise.all([
      this.prisma.producer.count({ where }),
      this.prisma.producer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nomeFantasia: 'asc' },
        include: {
          events: {
            include: {
              financialSummary: true,
            },
          },
        },
      }),
    ]);

    const items = producers.map((p) => {
      const activeEvents = p.events.filter((e) => e.status !== 'ENCERRADO').length;
      let totalVendasBrutas = 0;
      let totalLiquidoProdutor = 0;

      p.events.forEach((e) => {
        if (e.financialSummary) {
          totalVendasBrutas += Number(e.financialSummary.vendasBrutas);
          totalLiquidoProdutor += Number(e.financialSummary.valorLiquidoProdutor);
        }
      });

      return {
        id: p.id,
        razaoSocial: p.razaoSocial,
        nomeFantasia: p.nomeFantasia,
        cnpj: p.cnpj,
        email: p.email,
        telefone: p.telefone,
        status: p.status,
        cidade: p.cidade,
        estado: p.estado,
        taxaComissao: Number(p.taxaComissao),
        taxaMdr: Number(p.taxaMdr),
        bancoNome: p.bancoNome,
        bancoCodigo: p.bancoCodigo,
        agencia: p.agencia,
        contaCorrente: p.contaCorrente,
        chavePix: p.chavePix,
        totalEventos: p.events.length,
        eventosAtivos: activeEvents,
        totalVendasBrutas,
        totalLiquidoProdutor,
        createdAt: p.createdAt.toISOString(),
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            financialSummary: true,
            closingChecklist: true,
          },
          orderBy: { dataEvento: 'desc' },
        },
        users: {
          select: { id: true, nome: true, email: true, cargo: true, ativo: true },
        },
      },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, dto: UpdateProducerDto) {
    await this.findOne(id);

    return this.prisma.producer.update({
      where: { id },
      data: dto as any,
    });
  }
}
