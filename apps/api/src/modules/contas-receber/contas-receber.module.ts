import { Module } from '@nestjs/common';
import { ContasReceberService } from './contas-receber.service';
import { ContasReceberController } from './contas-receber.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ContasReceberController],
  providers: [ContasReceberService, PrismaService],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}
