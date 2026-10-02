import { Module } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { BancosController } from './bancos.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [BancosController],
  providers: [BancosService, PrismaService],
  exports: [BancosService],
})
export class BancosModule {}
