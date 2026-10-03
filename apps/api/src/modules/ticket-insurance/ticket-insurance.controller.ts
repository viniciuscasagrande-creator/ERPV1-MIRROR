import { Controller, Get, Post, Body } from '@nestjs/common';
import { TicketInsuranceService } from './ticket-insurance.service';
import type { EmitirApoliceRequestDto } from '@diskingressos/types';

@Controller('ticket-insurance')
export class TicketInsuranceController {
  constructor(private readonly service: TicketInsuranceService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('policies')
  async listarApolices() {
    return this.service.listarApolices();
  }

  @Get('claims')
  async listarSinistros() {
    return this.service.listarSinistros();
  }

  @Post('issue-policy')
  async emitirApolice(@Body() dto: EmitirApoliceRequestDto) {
    return this.service.emitirApolice(dto);
  }
}
