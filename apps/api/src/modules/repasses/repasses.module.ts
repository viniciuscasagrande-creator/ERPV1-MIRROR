import { Module } from '@nestjs/common';
import { RepassesService } from './repasses.service';
import { RepassesController } from './repasses.controller';
import { PrismaService } from '../../database/prisma.service';
import { EventsGatewayModule } from '../events-gateway/events-gateway.module';

@Module({
  imports: [EventsGatewayModule],
  controllers: [RepassesController],
  providers: [RepassesService, PrismaService],
  exports: [RepassesService],
})
export class RepassesModule {}
