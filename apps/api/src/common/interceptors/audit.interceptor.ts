import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import { JwtPayload } from '@diskingressos/types';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Apenas mutações (POST, PUT, PATCH, DELETE) são auditadas automaticamente
    const shouldAudit = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (!shouldAudit) {
      return next.handle();
    }

    const path = request.url;
    const user = request.user as JwtPayload | undefined;
    const body = request.body;
    const ip = request.ip || request.headers['x-forwarded-for'] || request.socket?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap({
        next: (result) => {
          // Extrai a entidade aproximada da rota (ex: /api/v1/users -> User)
          const segments = path.split('?')[0].split('/').filter(Boolean);
          const rawEntity = segments[2] || segments[1] || 'Unknown';
          const entity = rawEntity.charAt(0).toUpperCase() + rawEntity.slice(1);

          this.auditService.log({
            usuarioId: user?.sub || null,
            acao: `${method}_${entity.toUpperCase()}`,
            entidade: entity,
            entidadeId: result?.id || request.params?.id || null,
            valorAnterior: null,
            valorNovo: body,
            ip: typeof ip === 'string' ? ip : null,
            userAgent: typeof userAgent === 'string' ? userAgent : null,
          });
        },
      }),
    );
  }
}
