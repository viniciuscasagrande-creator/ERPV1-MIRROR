import { Module } from '@nestjs/common';
import { CnabController } from './cnab.controller';
import { CnabService } from './cnab.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [CnabController],
  providers: [CnabService, PrismaService],
  exports: [CnabService],
})
export class CnabModule {}
