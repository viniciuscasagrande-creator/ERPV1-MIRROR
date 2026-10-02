import { Module } from '@nestjs/common';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { FluxoCaixaController } from './fluxo-caixa.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [FluxoCaixaController],
  providers: [FluxoCaixaService, PrismaService],
  exports: [FluxoCaixaService],
})
export class FluxoCaixaModule {}
