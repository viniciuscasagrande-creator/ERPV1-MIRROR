import { Module } from '@nestjs/common';
import { GlobalFxController } from './global-fx.controller';
import { GlobalFxService } from './global-fx.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [GlobalFxController],
  providers: [GlobalFxService, PrismaService],
  exports: [GlobalFxService],
})
export class GlobalFxModule {}
