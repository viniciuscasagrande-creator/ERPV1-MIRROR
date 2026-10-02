import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import {
  PerfilUsuario,
  JwtPayload,
  AuthTokens,
  LoginResponse,
} from '@diskingressos/types';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private verifyPassword(inputPassword: string, storedHash: string): boolean {
    // 1. Tenta verificar como Bcrypt
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
      return bcrypt.compareSync(inputPassword, storedHash);
    }
    // 2. Fallback para HMAC-SHA256 (usado no seed padrão)
    const salt = 'disk_ingressos_salt_2026';
    const computedHmac = crypto.createHmac('sha256', salt).update(inputPassword).digest('hex');
    return computedHmac === storedHash;
  }

  async login(loginDto: LoginDto, ip?: string, userAgent?: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        roles: {
          include: { role: true },
        },
        producer: {
          select: { id: true, nomeFantasia: true, razaoSocial: true },
        },
      },
    });

    if (!user) {
      await this.auditService.log({
        acao: 'LOGIN_FALHA',
        entidade: 'User',
        motivo: `Tentativa com e-mail inexistente: ${loginDto.email}`,
        ip,
        userAgent,
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.ativo || user.status === 'BLOQUEADO') {
      await this.auditService.log({
        usuarioId: user.id,
        acao: 'LOGIN_BLOQUEADO',
        entidade: 'User',
        entidadeId: user.id,
        motivo: 'Tentativa de login com usuário inativo ou bloqueado',
        ip,
        userAgent,
      });
      throw new UnauthorizedException('Usuário inativo ou bloqueado. Contate o suporte.');
    }

    const passwordMatch = this.verifyPassword(loginDto.senha, user.senhaHash);

    if (!passwordMatch) {
      await this.auditService.log({
        usuarioId: user.id,
        acao: 'LOGIN_SENHA_INCORRETA',
        entidade: 'User',
        entidadeId: user.id,
        motivo: 'Senha informada não confere',
        ip,
        userAgent,
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const roles = user.roles.map((r) => r.role.nome as PerfilUsuario);

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.nome,
      roles,
      user.producerId,
      ip,
      userAgent,
    );

    await this.auditService.log({
      usuarioId: user.id,
      acao: 'LOGIN_SUCESSO',
      entidade: 'User',
      entidadeId: user.id,
      ip,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        telefone: user.telefone,
        roles,
        producerId: user.producerId,
        producerName: user.producer?.nomeFantasia || null,
      },
      tokens,
    };
  }

  async refreshTokens(refreshDto: RefreshDto, ip?: string, userAgent?: string): Promise<AuthTokens> {
    const tokenHash = this.hashToken(refreshDto.refreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            roles: { include: { role: true } },
          },
        },
      },
    });

    if (!storedToken || storedToken.revogado) {
      throw new UnauthorizedException('Refresh token inválido ou revogado');
    }

    if (new Date() > storedToken.expiraEm) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Revoga o token atual (Rotação estrita de token)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revogado: true, revogadoEm: new Date() },
    });

    const user = storedToken.user;
    const roles = user.roles.map((r) => r.role.nome as PerfilUsuario);

    return this.generateTokens(
      user.id,
      user.email,
      user.nome,
      roles,
      user.producerId,
      ip,
      userAgent,
    );
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    // Revoga todos os tokens ativos do usuário
    await this.prisma.refreshToken.updateMany({
      where: { userId, revogado: false },
      data: { revogado: true, revogadoEm: new Date() },
    });

    await this.auditService.log({
      usuarioId: userId,
      acao: 'LOGOUT',
      entidade: 'User',
      entidadeId: userId,
    });

    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        producer: { select: { id: true, nomeFantasia: true, razaoSocial: true, cnpj: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      telefone: user.telefone,
      roles: user.roles.map((r) => r.role.nome),
      producerId: user.producerId,
      producerName: user.producer?.nomeFantasia || null,
      status: user.status,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    nome: string,
    roles: PerfilUsuario[],
    producerId?: string | null,
    ip?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      nome,
      roles,
      producerId: producerId || null,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_ACCESS_SECRET ||
        'disk_ingressos_jwt_access_secret_super_seguro_2026_enterprise_key',
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7); // 7 dias de validade

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiraEm,
        ipCriacao: ip || null,
        userAgent: userAgent || null,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutos em segundos
    };
  }
}
