import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateAuditLogParams {
  usuarioId?: string | null;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  valorAnterior?: any;
  valorNovo?: any;
  motivo?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          usuarioId: params.usuarioId || null,
          acao: params.acao,
          entidade: params.entidade,
          entidadeId: params.entidadeId || null,
          valorAnterior: params.valorAnterior ? JSON.stringify(params.valorAnterior) : null,
          valorNovo: params.valorNovo ? JSON.stringify(params.valorNovo) : null,
          motivo: params.motivo || null,
          ip: params.ip || null,
          userAgent: params.userAgent || null,
        },
      });
    } catch (error) {
      this.logger.error(`Falha ao registrar log de auditoria: ${error.message}`);
      // Nunca interrompe o fluxo principal caso a auditoria falhe silenciosamente
      return null;
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    entidade?: string;
    usuarioId?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.entidade) where.entidade = params.entidade;
    if (params.usuarioId) where.usuarioId = params.usuarioId;

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' },
        include: {
          usuario: {
            select: { id: true, nome: true, email: true, cargo: true },
          },
        },
      }),
    ]);

    return {
      items: logs.map((log) => ({
        id: log.id,
        acao: log.acao,
        entidade: log.entidade,
        entidadeId: log.entidadeId,
        valorAnterior: log.valorAnterior,
        valorNovo: log.valorNovo,
        motivo: log.motivo,
        ip: log.ip,
        userAgent: log.userAgent,
        criadoEm: log.criadoEm.toISOString(),
        usuarioId: log.usuarioId,
        usuarioNome: log.usuario?.nome || 'Sistema',
        usuarioEmail: log.usuario?.email || null,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
