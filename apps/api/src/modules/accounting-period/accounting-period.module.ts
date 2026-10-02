import { Module } from '@nestjs/common';
import { AccountingPeriodController } from './accounting-period.controller';
import { AccountingPeriodService } from './accounting-period.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AccountingPeriodController],
  providers: [AccountingPeriodService, PrismaService],
  exports: [AccountingPeriodService],
})
export class AccountingPeriodModule {}
