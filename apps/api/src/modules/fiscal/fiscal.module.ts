import { Module } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { FiscalController } from './fiscal.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [FiscalController],
  providers: [FiscalService, PrismaService],
  exports: [FiscalService],
})
export class FiscalModule {}
