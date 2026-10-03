import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TicketInsuranceController } from './ticket-insurance.controller';
import { TicketInsuranceService } from './ticket-insurance.service';

@Module({
  imports: [PrismaModule],
  controllers: [TicketInsuranceController],
  providers: [TicketInsuranceService],
  exports: [TicketInsuranceService],
})
export class TicketInsuranceModule {}
