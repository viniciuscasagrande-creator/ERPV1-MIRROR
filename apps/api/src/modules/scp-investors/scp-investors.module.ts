import { Module } from '@nestjs/common';
import { ScpInvestorsController } from './scp-investors.controller';
import { ScpInvestorsService } from './scp-investors.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ScpInvestorsController],
  providers: [ScpInvestorsService, PrismaService],
  exports: [ScpInvestorsService],
})
export class ScpInvestorsModule {}
