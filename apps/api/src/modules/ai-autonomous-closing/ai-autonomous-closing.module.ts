import { Module } from '@nestjs/common';
import { AiAutonomousClosingService } from './ai-autonomous-closing.service';
import { AiAutonomousClosingController } from './ai-autonomous-closing.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AiAutonomousClosingController],
  providers: [AiAutonomousClosingService, PrismaService],
  exports: [AiAutonomousClosingService],
})
export class AiAutonomousClosingModule {}
