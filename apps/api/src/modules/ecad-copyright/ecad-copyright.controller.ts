import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EcadCopyrightService } from './ecad-copyright.service';
import type { CalcularEcadRequestDto } from '@diskingressos/types';

@Controller('ecad-copyright')
export class EcadCopyrightController {
  constructor(private readonly service: EcadCopyrightService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('calculations')
  async listarApuracoes() {
    return this.service.listarApuracoes();
  }

  @Get('cue-sheets')
  async listarCueSheet(@Query('eventoId') eventoId?: string) {
    return this.service.listarCueSheet(eventoId);
  }

  @Post('calculate')
  async calcularEcad(@Body() dto: CalcularEcadRequestDto) {
    return this.service.calcularEcad(dto);
  }
}
