import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoyaltyIfrs15Service } from './loyalty-ifrs15.service';
import type { ResgatarPontosRequestDto } from '@diskingressos/types';

@Controller('loyalty-ifrs15')
export class LoyaltyIfrs15Controller {
  constructor(private readonly service: LoyaltyIfrs15Service) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('customer-balances')
  async listarSaldos() {
    return this.service.listarSaldos();
  }

  @Get('contract-liabilities')
  async listarPassivosIfrs15() {
    return this.service.listarPassivosIfrs15();
  }

  @Post('redeem')
  async resgatarPontos(@Body() dto: ResgatarPontosRequestDto) {
    return this.service.resgatarPontos(dto);
  }
}
