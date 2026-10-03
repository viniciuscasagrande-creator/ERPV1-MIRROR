import { Module } from '@nestjs/common';
import { AiTreasuryController } from './ai-treasury.controller';
import { AiTreasuryService } from './ai-treasury.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AiTreasuryController],
  providers: [AiTreasuryService, PrismaService],
  exports: [AiTreasuryService],
})
export class AiTreasuryModule {}
