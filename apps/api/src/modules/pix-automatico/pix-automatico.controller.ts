import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { PixAutomaticoService } from './pix-automatico.service';
import type {
  CriarMandatoPixRequestDto,
  ExecutarCobrancaPixRequestDto,
} from '@diskingressos/types';

@Controller('pix-automatico')
export class PixAutomaticoController {
  constructor(private readonly service: PixAutomaticoService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('mandates')
  async listarMandatos() {
    return this.service.listarMandatos();
  }

  @Get('mandates/:id')
  async obterMandatoPorId(@Param('id') id: string) {
    return this.service.obterMandatoPorId(id);
  }

  @Post('mandates')
  async criarMandato(@Body() dto: CriarMandatoPixRequestDto) {
    return this.service.criarMandato(dto);
  }

  @Post('mandates/:id/cancel')
  async cancelarMandato(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ) {
    return this.service.cancelarMandato(id, motivo || 'Solicitação do usuário');
  }

  @Get('charges')
  async listarCobrancas() {
    return this.service.listarCobrancas();
  }

  @Post('charges/execute')
  async executarCobranca(@Body() dto: ExecutarCobrancaPixRequestDto) {
    return this.service.executarCobranca(dto);
  }

  @Post('charges/:id/smart-retry')
  async simularSmartRetry(@Param('id') id: string) {
    return this.service.simularSmartRetry(id);
  }
}
