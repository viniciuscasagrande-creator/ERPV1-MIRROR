import { Module } from '@nestjs/common';
import { RwaDrexService } from './rwa-drex.service';
import { RwaDrexController } from './rwa-drex.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [RwaDrexController],
  providers: [RwaDrexService, PrismaService],
  exports: [RwaDrexService],
})
export class RwaDrexModule {}
