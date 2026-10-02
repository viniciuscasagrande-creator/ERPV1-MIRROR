import { Module } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [RelatoriosController],
  providers: [RelatoriosService, PrismaService],
  exports: [RelatoriosService],
})
export class RelatoriosModule {}
