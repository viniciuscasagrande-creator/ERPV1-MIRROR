import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TaxReformService } from './tax-reform.service';
import {
  SimularTransicaoTributariaRequestDto,
  SimularSplitCheckoutRequestDto,
  RegistrarCreditoTributarioDto,
} from '@diskingressos/types';

@Controller('tax-reform')
export class TaxReformController {
  constructor(private readonly taxService: TaxReformService) {}

  @Get('config')
  async getConfig() {
    return this.taxService.getConfig();
  }

  @Get('dashboard')
  async getDashboardKpis() {
    return this.taxService.getDashboardKpis();
  }

  @Post('simular')
  async simularTransicao(@Body() dto: SimularTransicaoTributariaRequestDto) {
    return this.taxService.simularTransicao(dto);
  }

  @Post('split-checkout')
  async processarSplitCheckout(@Body() dto: SimularSplitCheckoutRequestDto) {
    return this.taxService.processarSplitCheckout(dto);
  }

  @Get('split-checkout')
  async listarSplitsCheckout() {
    return this.taxService.listarSplitsCheckout();
  }

  @Post('creditos')
  async registrarCredito(@Body() dto: RegistrarCreditoTributarioDto) {
    return this.taxService.registrarCredito(dto);
  }

  @Get('creditos')
  async listarCreditos() {
    return this.taxService.listarCreditos();
  }

  @Get('apuracoes')
  async listarApuracoesMensais() {
    return this.taxService.listarApuracoesMensais();
  }

  @Post('apuracoes/:competencia')
  async gerarApuracaoMensal(@Param('competencia') competencia: string) {
    return this.taxService.gerarApuracaoMensal(competencia);
  }
}
