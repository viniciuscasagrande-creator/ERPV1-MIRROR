import { Module } from '@nestjs/common';
import { EventCostCenterDreService } from './event-cost-center-dre.service';
import { EventCostCenterDreController } from './event-cost-center-dre.controller';

@Module({
  controllers: [EventCostCenterDreController],
  providers: [EventCostCenterDreService],
  exports: [EventCostCenterDreService],
})
export class EventCostCenterDreModule {}
