import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { TaxSplitCheckoutService } from './tax-split-checkout.service';
import type {
  CalcularSplitTributarioRequestDto,
  TaxSplitFiscalParamDto,
} from '@diskingressos/types';

@Controller('tax-split-checkout')
export class TaxSplitCheckoutController {
  constructor(private readonly service: TaxSplitCheckoutService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('executions')
  async listarSplits() {
    return this.service.listarSplits();
  }

  @Post('simulate-split')
  async calcularExecutarSplitCheckout(@Body() dto: CalcularSplitTributarioRequestDto) {
    return this.service.calcularExecutarSplitCheckout(dto);
  }

  @Get('tax-credits')
  async listarCreditosNaoCumulatividade() {
    return this.service.listarCreditosNaoCumulatividade();
  }

  @Get('fiscal-params')
  async obterParametrosFiscais() {
    return this.service.obterParametrosFiscais();
  }

  @Post('fiscal-params')
  async atualizarParametrosFiscais(@Body() dto: Partial<TaxSplitFiscalParamDto>) {
    return this.service.atualizarParametrosFiscais(dto);
  }
}
