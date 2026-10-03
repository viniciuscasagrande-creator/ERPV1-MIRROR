import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { EventCostCenterDreService } from './event-cost-center-dre.service';
import type { SimularRateioAbcRequestDto } from '@diskingressos/types';

@Controller('event-cost-center-dre')
export class EventCostCenterDreController {
  constructor(private readonly service: EventCostCenterDreService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('cost-centers')
  async listarCentrosCusto() {
    return this.service.listarCentrosCusto();
  }

  @Get('statements/:centroCustoId')
  async obterDrePorCentroCusto(@Param('centroCustoId') centroCustoId: string) {
    return this.service.obterDrePorCentroCusto(centroCustoId);
  }

  @Get('allocations')
  async listarAlocacoesAbc(@Query('centroCustoId') centroCustoId?: string) {
    return this.service.listarAlocacoesAbc(centroCustoId);
  }

  @Post('simulate-allocation')
  async simularRateioAbc(@Body() dto: SimularRateioAbcRequestDto) {
    return this.service.simularRateioAbc(dto);
  }
}
