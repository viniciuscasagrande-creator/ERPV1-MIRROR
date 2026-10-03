import { Module } from '@nestjs/common';
import { TaxReformController } from './tax-reform.controller';
import { TaxReformService } from './tax-reform.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [TaxReformController],
  providers: [TaxReformService, PrismaService],
  exports: [TaxReformService],
})
export class TaxReformModule {}
