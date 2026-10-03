import { Controller, Get, Post, Body } from '@nestjs/common';
import { BudgetForecastService } from './budget-forecast.service';
import type { SimularCenarioOrcamentarioRequestDto } from '@diskingressos/types';

@Controller('budget-forecast')
export class BudgetForecastController {
  constructor(private readonly service: BudgetForecastService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('budgets')
  async listarOrcamentos() {
    return this.service.listarOrcamentos();
  }

  @Get('forecasts')
  async listarForecasts() {
    return this.service.listarForecasts();
  }

  @Post('simulate')
  async simularCenario(@Body() dto: SimularCenarioOrcamentarioRequestDto) {
    return this.service.simularCenario(dto);
  }
}
