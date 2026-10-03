import { Module } from '@nestjs/common';
import { ExecutiveBoardroomController } from './executive-boardroom.controller';
import { ExecutiveBoardroomService } from './executive-boardroom.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ExecutiveBoardroomController],
  providers: [ExecutiveBoardroomService, PrismaService],
  exports: [ExecutiveBoardroomService],
})
export class ExecutiveBoardroomModule {}
