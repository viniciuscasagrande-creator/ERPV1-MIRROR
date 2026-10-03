import { Module } from '@nestjs/common';
import { ConsolidationIfrsController } from './consolidation-ifrs.controller';
import { ConsolidationIfrsService } from './consolidation-ifrs.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ConsolidationIfrsController],
  providers: [ConsolidationIfrsService, PrismaService],
  exports: [ConsolidationIfrsService],
})
export class ConsolidationIfrsModule {}
