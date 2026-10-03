import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { SponsorshipBarterService } from './sponsorship-barter.service';
import { SponsorshipBarterController } from './sponsorship-barter.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SponsorshipBarterController],
  providers: [SponsorshipBarterService],
  exports: [SponsorshipBarterService],
})
export class SponsorshipBarterModule {}
