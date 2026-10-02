import { Module } from '@nestjs/common';
import { ContabilidadeService } from './contabilidade.service';
import { ContabilidadeController } from './contabilidade.controller';
import { PrismaService } from '../../database/prisma.service';

import { AccountingPeriodModule } from '../accounting-period/accounting-period.module';

@Module({
  imports: [AccountingPeriodModule],
  controllers: [ContabilidadeController],
  providers: [ContabilidadeService, PrismaService],
  exports: [ContabilidadeService],
})
export class ContabilidadeModule {}
