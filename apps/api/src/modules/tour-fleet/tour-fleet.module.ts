import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TourFleetService } from './tour-fleet.service';
import { TourFleetController } from './tour-fleet.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TourFleetController],
  providers: [TourFleetService],
  exports: [TourFleetService],
})
export class TourFleetModule {}
