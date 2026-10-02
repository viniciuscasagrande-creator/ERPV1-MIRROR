import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PerfilUsuario, StatusOperacao } from '@diskingressos/types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail');
    }

    if (dto.roles.includes(PerfilUsuario.PRODUTOR) && !dto.producerId) {
      throw new BadRequestException('Usuários com perfil PRODUTOR exigem um producerId vinculado');
    }

    const roles = await this.prisma.role.findMany({
      where: { nome: { in: dto.roles } },
    });

    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash: this.hashPassword(dto.senha),
        cargo: dto.cargo,
        telefone: dto.telefone,
        producerId: dto.producerId || null,
        roles: {
          create: roles.map((r) => ({ roleId: r.id })),
        },
      },
      include: {
        roles: { include: { role: true } },
        producer: { select: { id: true, nomeFantasia: true } },
      },
    });

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      telefone: user.telefone,
      ativo: user.ativo,
      status: user.status,
      producerId: user.producerId,
      producerName: user.producer?.nomeFantasia || null,
      roles: user.roles.map((r) => r.role.nome),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { nome: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { cargo: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nome: 'asc' },
        include: {
          roles: { include: { role: true } },
          producer: { select: { id: true, nomeFantasia: true } },
        },
      }),
    ]);

    return {
      items: users.map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        cargo: u.cargo,
        telefone: u.telefone,
        ativo: u.ativo,
        status: u.status,
        producerId: u.producerId,
        producerName: u.producer?.nomeFantasia || null,
        roles: u.roles.map((r) => r.role.nome),
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        producer: { select: { id: true, nomeFantasia: true, razaoSocial: true, cnpj: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      telefone: user.telefone,
      ativo: user.ativo,
      status: user.status,
      producerId: user.producerId,
      producer: user.producer,
      roles: user.roles.map((r) => r.role.nome),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const updateData: any = {};
    if (dto.nome !== undefined) updateData.nome = dto.nome;
    if (dto.cargo !== undefined) updateData.cargo = dto.cargo;
    if (dto.telefone !== undefined) updateData.telefone = dto.telefone;
    if (dto.ativo !== undefined) updateData.ativo = dto.ativo;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.senha) updateData.senhaHash = this.hashPassword(dto.senha);

    if (dto.roles) {
      const roles = await this.prisma.role.findMany({
        where: { nome: { in: dto.roles } },
      });

      // Remove roles antigas e adiciona novas
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.createMany({
        data: roles.map((r) => ({ userId: id, roleId: r.id })),
      });
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: { include: { role: true } },
        producer: { select: { id: true, nomeFantasia: true } },
      },
    });

    return {
      id: updated.id,
      nome: updated.nome,
      email: updated.email,
      cargo: updated.cargo,
      telefone: updated.telefone,
      ativo: updated.ativo,
      status: updated.status,
      producerId: updated.producerId,
      producerName: updated.producer?.nomeFantasia || null,
      roles: updated.roles.map((r) => r.role.nome),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { success: true, message: 'Usuário removido com sucesso' };
  }
}
