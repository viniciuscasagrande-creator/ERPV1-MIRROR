import { Module } from '@nestjs/common';
import { EsgSustainabilityService } from './esg-sustainability.service';
import { EsgSustainabilityController } from './esg-sustainability.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [EsgSustainabilityController],
  providers: [EsgSustainabilityService, PrismaService],
  exports: [EsgSustainabilityService],
})
export class EsgSustainabilityModule {}

