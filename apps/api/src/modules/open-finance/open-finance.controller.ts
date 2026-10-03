import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { OpenFinanceService } from './open-finance.service';
import {
  CriarPixCobrancaRequestDto,
  IniciarPagamentoItpRequestDto,
  WebhookPixBacenPayloadDto,
} from '@diskingressos/types';

@Controller('open-finance')
export class OpenFinanceController {
  constructor(private readonly openFinanceService: OpenFinanceService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.openFinanceService.getDashboardKpis();
  }

  @Get('consents')
  async listarConsentimentos() {
    return this.openFinanceService.listarConsentimentos();
  }

  @Post('pix-cobranca')
  async gerarPixCobranca(@Body() dto: CriarPixCobrancaRequestDto) {
    return this.openFinanceService.gerarPixCobranca(dto);
  }

  @Get('pix-cobranca')
  async listarPixCobrancas() {
    return this.openFinanceService.listarPixCobrancas();
  }

  @Post('itp-payment')
  async iniciarPagamentoItp(@Body() dto: IniciarPagamentoItpRequestDto) {
    return this.openFinanceService.iniciarPagamentoItp(dto);
  }

  @Get('itp-orders')
  async listarOrdensItp() {
    return this.openFinanceService.listarOrdensItp();
  }

  @Post('webhook-pix')
  async processarWebhookPixBacen(@Body() payload: WebhookPixBacenPayloadDto) {
    return this.openFinanceService.processarWebhookPixBacen(payload);
  }

  @Get('reconciliations')
  async listarLogsConciliacaoRealtime() {
    return this.openFinanceService.listarLogsConciliacaoRealtime();
  }
}
