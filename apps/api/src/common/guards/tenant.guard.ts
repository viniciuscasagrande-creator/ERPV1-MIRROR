import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return true;
    }

    // Se o usuário tem o perfil PRODUTOR, ele DEVE ter um producerId válido
    if (user.roles.includes(PerfilUsuario.PRODUTOR)) {
      if (!user.producerId) {
        throw new ForbiddenException('Acesso negado: Usuário produtor sem tenant vinculado');
      }

      // Se houver parâmetro producerId na rota ou query, deve ser estritamente igual
      const requestedProducerId =
        request.params.producerId || request.query.producerId || request.body?.producerId;

      if (requestedProducerId && requestedProducerId !== user.producerId) {
        throw new ForbiddenException(
          'Violação de Tenant: Tentativa de acessar recursos de outro produtor',
        );
      }
    }

    return true;
  }
}
