import { Module } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService, PrismaService],
  exports: [ProducersService],
})
export class ProducersModule {}
