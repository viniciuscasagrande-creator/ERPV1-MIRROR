import { Module } from '@nestjs/common';
import { OpenFinanceController } from './open-finance.controller';
import { OpenFinanceService } from './open-finance.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [OpenFinanceController],
  providers: [OpenFinanceService, PrismaService],
  exports: [OpenFinanceService],
})
export class OpenFinanceModule {}
