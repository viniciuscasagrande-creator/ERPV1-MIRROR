import { Module } from '@nestjs/common';
import { ConciliacaoService } from './conciliacao.service';
import { ConciliacaoController } from './conciliacao.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ConciliacaoController],
  providers: [ConciliacaoService, PrismaService],
  exports: [ConciliacaoService],
})
export class ConciliacaoModule {}
