import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
      orderBy: { nome: 'asc' },
    });

    return roles.map((r) => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      permissions: r.permissions.map((p) => ({
        id: p.permission.id,
        recurso: p.permission.recurso,
        acao: p.permission.acao,
        descricao: p.permission.descricao,
      })),
    }));
  }
}
