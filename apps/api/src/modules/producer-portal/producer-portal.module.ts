import { Module } from '@nestjs/common';
import { ProducerPortalService } from './producer-portal.service';
import { ProducerPortalController } from './producer-portal.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ProducerPortalController],
  providers: [ProducerPortalService, PrismaService],
  exports: [ProducerPortalService],
})
export class ProducerPortalModule {}
