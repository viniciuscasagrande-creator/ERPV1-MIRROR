import { Controller, Get, Post, Body } from '@nestjs/common';
import { PosCashierService } from './pos-cashier.service';
import type { FecharTurnoRequestDto } from '@diskingressos/types';

@Controller('pos-cashier')
export class PosCashierController {
  constructor(private readonly service: PosCashierService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('terminals')
  async listarTerminais() {
    return this.service.listarTerminais();
  }

  @Get('shifts')
  async listarTurnos() {
    return this.service.listarTurnos();
  }

  @Get('bleeds')
  async listarSangrias() {
    return this.service.listarSangrias();
  }

  @Post('close-shift')
  async fecharTurno(@Body() dto: FecharTurnoRequestDto) {
    return this.service.fecharTurno(dto);
  }
}
