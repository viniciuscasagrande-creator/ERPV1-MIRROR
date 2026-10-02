import { Module } from '@nestjs/common';
import { ContasPagarService } from './contas-pagar.service';
import { ContasPagarController } from './contas-pagar.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ContasPagarController],
  providers: [ContasPagarService, PrismaService],
  exports: [ContasPagarService],
})
export class ContasPagarModule {}
