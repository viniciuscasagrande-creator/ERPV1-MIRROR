import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AiBankReconciliationService } from './ai-bank-reconciliation.service';
import type { ExecutarCicloConciliacaoIaRequestDto } from '@diskingressos/types';

@Controller('ai-bank-reconciliation')
export class AiBankReconciliationController {
  constructor(private readonly service: AiBankReconciliationService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('cycles')
  async listarCiclos() {
    return this.service.listarCiclos();
  }

  @Get('bank-fees')
  async listarTarifasIdentificadas() {
    return this.service.listarTarifasIdentificadas();
  }

  @Get('escrow-thresholds')
  async listarTravasEscrow() {
    return this.service.listarTravasEscrow();
  }

  @Post('run-cycle')
  async executarCicloConciliacaoIa(@Body() dto: ExecutarCicloConciliacaoIaRequestDto) {
    return this.service.executarCicloConciliacaoIa(dto);
  }

  @Patch('escrow-thresholds/:eventoId')
  async atualizarTravaEscrow(
    @Param('eventoId') eventoId: string,
    @Body('percentual') percentual: number,
  ) {
    return this.service.atualizarTravaEscrow(eventoId, percentual);
  }
}
