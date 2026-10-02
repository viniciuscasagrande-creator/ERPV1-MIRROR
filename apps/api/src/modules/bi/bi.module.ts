import { Module } from '@nestjs/common';
import { BiService } from './bi.service';
import { BiController } from './bi.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [BiController],
  providers: [BiService, PrismaService],
  exports: [BiService],
})
export class BiModule {}
