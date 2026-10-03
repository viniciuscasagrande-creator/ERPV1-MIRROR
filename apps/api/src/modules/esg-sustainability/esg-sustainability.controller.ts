import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { EsgSustainabilityService } from './esg-sustainability.service';
import type { CalcularPegadaEventoRequestDto } from '@diskingressos/types';

@Controller('esg-sustainability')
export class EsgSustainabilityController {
  constructor(private readonly esgService: EsgSustainabilityService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.esgService.getDashboardKpis();
  }

  @Get('inventarios')
  async listarInventarios() {
    return this.esgService.listarInventarios();
  }

  @Get('inventarios/:id')
  async obterInventarioPorId(@Param('id') id: string) {
    return this.esgService.obterInventarioPorId(id);
  }

  @Post('calcular-pegada')
  async calcularPegadaEvento(@Body() dto: CalcularPegadaEventoRequestDto) {
    return this.esgService.calcularPegadaEvento(dto);
  }

  @Get('creditos')
  async listarCreditosCarbono() {
    return this.esgService.listarCreditosCarbono();
  }

  @Post('creditos/:id/aposentar')
  async aposentarCredito(@Param('id') id: string) {
    return this.esgService.aposentarCredito(id);
  }

  @Get('borderos-verdes')
  async listarBorderosVerdes() {
    return this.esgService.listarBorderosVerdes();
  }

  @Get('relatorios-ifrs')
  async listarRelatoriosIfrs() {
    return this.esgService.listarRelatoriosIfrs();
  }
}
