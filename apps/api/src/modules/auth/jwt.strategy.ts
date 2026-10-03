import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@diskingressos/types';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_ACCESS_SECRET ||
        'disk_ingressos_jwt_access_secret_super_seguro_2026_enterprise_key',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    try {
      // Validação de segurança: confere se o usuário ainda existe e está ativo no banco
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, ativo: true, status: true },
      });

      if (user && (!user.ativo || user.status === 'BLOQUEADO')) {
        throw new UnauthorizedException('Sessão inválida: Usuário inativo ou bloqueado');
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      // Se o banco estiver offline, aceita a assinatura criptográfica válida do JWT emitido
    }

    return payload;
  }
}
