import { Module } from '@nestjs/common';
import { BudgetForecastService } from './budget-forecast.service';
import { BudgetForecastController } from './budget-forecast.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BudgetForecastController],
  providers: [BudgetForecastService],
  exports: [BudgetForecastService],
})
export class BudgetForecastModule {}
