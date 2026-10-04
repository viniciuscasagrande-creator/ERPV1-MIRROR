import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CentralUtmService } from './central-utm.service';
import { AdsTelemetryService } from './ads-telemetry.service';
import { MarketingController } from './marketing.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingController],
  providers: [MarketingService, CentralUtmService, AdsTelemetryService],
  exports: [MarketingService, CentralUtmService, AdsTelemetryService],
})
export class MarketingModule {}
