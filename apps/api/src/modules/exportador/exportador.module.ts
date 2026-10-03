import { Module } from '@nestjs/common';
import { ExportadorService } from './exportador.service';
import { ExportadorController } from './exportador.controller';

@Module({
  controllers: [ExportadorController],
  providers: [ExportadorService],
  exports: [ExportadorService],
})
export class ExportadorModule {}
