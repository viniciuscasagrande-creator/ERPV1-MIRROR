import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TipoContaBancaria } from '@prisma/client';

@Injectable()
export class BancosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const accounts = await this.prisma.bankAccount.findMany({
      orderBy: { bancoNome: 'asc' },
      include: {
        _count: {
          select: {
            statementItems: true,
            ofxImports: true,
          },
        },
      },
    });

    return accounts.map((acc) => ({
      id: acc.id,
      bancoNome: acc.bancoNome,
      bancoCodigo: acc.bancoCodigo,
      agencia: acc.agencia,
      conta: acc.conta,
      digito: acc.digito,
      tipo: acc.tipo,
      saldoAtual: Number(acc.saldoAtual),
      saldoDisponivel: Number(acc.saldoDisponivel),
      saldoBloqueado: Number(acc.saldoBloqueado),
      limiteCredito: Number(acc.limiteCredito),
      chavePix: acc.chavePix,
      ativo: acc.ativo,
      totalTransacoesImportadas: acc._count.statementItems,
      totalArquivosOfx: acc._count.ofxImports,
      createdAt: acc.createdAt.toISOString(),
      updatedAt: acc.updatedAt.toISOString(),
    }));
  }

  async findById(id: string) {
    const acc = await this.prisma.bankAccount.findUnique({
      where: { id },
      include: {
        ofxImports: {
          orderBy: { criadoEm: 'desc' },
          take: 5,
        },
      },
    });

    if (!acc) {
      throw new NotFoundException('Conta bancária não encontrada');
    }

    return {
      ...acc,
      saldoAtual: Number(acc.saldoAtual),
      saldoDisponivel: Number(acc.saldoDisponivel),
      saldoBloqueado: Number(acc.saldoBloqueado),
      limiteCredito: Number(acc.limiteCredito),
    };
  }

  async create(data: {
    bancoNome: string;
    bancoCodigo: string;
    agencia: string;
    conta: string;
    digito?: string;
    tipo?: TipoContaBancaria;
    saldoAtual?: number;
    saldoDisponivel?: number;
    limiteCredito?: number;
    chavePix?: string;
  }) {
    const created = await this.prisma.bankAccount.create({
      data: {
        bancoNome: data.bancoNome,
        bancoCodigo: data.bancoCodigo,
        agencia: data.agencia,
        conta: data.conta,
        digito: data.digito || '0',
        tipo: data.tipo || TipoContaBancaria.CORRENTE,
        saldoAtual: data.saldoAtual || 0,
        saldoDisponivel: data.saldoDisponivel || data.saldoAtual || 0,
        limiteCredito: data.limiteCredito || 0,
        chavePix: data.chavePix || null,
      },
    });

    return created;
  }

  async update(id: string, data: any) {
    const acc = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!acc) throw new NotFoundException('Conta bancária não encontrada');

    return this.prisma.bankAccount.update({
      where: { id },
      data,
    });
  }
}
