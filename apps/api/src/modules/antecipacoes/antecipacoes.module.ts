import { Module } from '@nestjs/common';
import { AntecipacoesService } from './antecipacoes.service';
import { AntecipacoesController } from './antecipacoes.controller';

@Module({
  controllers: [AntecipacoesController],
  providers: [AntecipacoesService],
  exports: [AntecipacoesService],
})
export class AntecipacoesModule {}
