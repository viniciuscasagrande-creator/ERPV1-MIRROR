import { Module } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { EventosModule } from '../eventos/eventos.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [EventosModule],
  controllers: [VendasController],
  providers: [VendasService, PrismaService],
  exports: [VendasService],
})
export class VendasModule {}
