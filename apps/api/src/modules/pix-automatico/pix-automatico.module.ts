import { Module } from '@nestjs/common';
import { PixAutomaticoController } from './pix-automatico.controller';
import { PixAutomaticoService } from './pix-automatico.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PixAutomaticoController],
  providers: [PixAutomaticoService, PrismaService],
  exports: [PixAutomaticoService],
})
export class PixAutomaticoModule {}
