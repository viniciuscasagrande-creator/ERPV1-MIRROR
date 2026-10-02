import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService, PrismaService],
  exports: [GatewaysService],
})
export class GatewaysModule {}
