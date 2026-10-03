import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PldCoafComplianceService } from './pld-coaf-compliance.service';
import type { TriagemPldRequestDto } from '@diskingressos/types';

@Controller('pld-coaf-compliance')
export class PldCoafComplianceController {
  constructor(private readonly service: PldCoafComplianceService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('alerts')
  async listarAlertas() {
    return this.service.listarAlertas();
  }

  @Get('pep-check/:cpf')
  async consultarPep(@Param('cpf') cpf: string) {
    return this.service.consultarPep(cpf);
  }

  @Post('screening')
  async triagemTransacao(@Body() dto: TriagemPldRequestDto) {
    return this.service.triagemTransacao(dto);
  }
}
