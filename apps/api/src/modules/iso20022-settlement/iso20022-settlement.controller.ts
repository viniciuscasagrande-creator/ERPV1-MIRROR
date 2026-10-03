import { Controller, Get, Post, Body } from '@nestjs/common';
import { Iso20022SettlementService } from './iso20022-settlement.service';
import type { DespacharMensagemIsoRequestDto } from '@diskingressos/types';

@Controller('iso20022-settlement')
export class Iso20022SettlementController {
  constructor(private readonly service: Iso20022SettlementService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('messages')
  async listarMensagens() {
    return this.service.listarMensagens();
  }

  @Get('settlements')
  async listarLiquidacoes() {
    return this.service.listarLiquidacoes();
  }

  @Post('dispatch')
  async despacharMensagemIso(@Body() dto: DespacharMensagemIsoRequestDto) {
    return this.service.despacharMensagemIso(dto);
  }
}
