import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret:
        process.env.JWT_ACCESS_SECRET ||
        'disk_ingressos_jwt_access_secret_super_seguro_2026_enterprise_key',
    }),
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsGatewayModule {}
