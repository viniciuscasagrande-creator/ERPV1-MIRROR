import { Module } from '@nestjs/common';
import { GedController } from './ged.controller';
import { GedService } from './ged.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [GedController],
  providers: [GedService, PrismaService],
  exports: [GedService],
})
export class GedModule {}
