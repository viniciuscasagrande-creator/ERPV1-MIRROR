import { Controller, Get, Post, Body } from '@nestjs/common';
import { DynamicPricingService } from './dynamic-pricing.service';
import type { SimularAjusteDinamicoRequestDto } from '@diskingressos/types';

@Controller('dynamic-pricing')
export class DynamicPricingController {
  constructor(private readonly service: DynamicPricingService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('policies')
  async listarPoliticas() {
    return this.service.listarPoliticas();
  }

  @Get('batches')
  async listarLotes() {
    return this.service.listarLotes();
  }

  @Get('surge-logs')
  async listarSurgeLogs() {
    return this.service.listarSurgeLogs();
  }

  @Post('simulate')
  async simularAjuste(@Body() dto: SimularAjusteDinamicoRequestDto) {
    return this.service.simularAjuste(dto);
  }
}
