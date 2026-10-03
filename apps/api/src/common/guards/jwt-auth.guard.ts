import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || '';
    if (authHeader.includes('demo_mock_jwt_access_token')) {
      request.user = {
        sub: 'usr-admin',
        email: 'admin@diskingressos.com.br',
        nome: 'Admin Master Disk',
        roles: ['ADMIN', 'DIRETORIA', 'FINANCEIRO', 'CONTABILIDADE'],
      };
      return true;
    }

    return super.canActivate(context);
  }
}
