import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { RwaDrexService } from './rwa-drex.service';
import type { SimularRevendaSecundariaRequestDto } from '@diskingressos/types';

@Controller('rwa-drex')
export class RwaDrexController {
  constructor(private readonly rwaService: RwaDrexService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.rwaService.getDashboardKpis();
  }

  @Get('pools')
  async listarPools() {
    return this.rwaService.listarPools();
  }

  @Get('pools/:id')
  async obterPoolPorId(@Param('id') id: string) {
    return this.rwaService.obterPoolPorId(id);
  }

  @Get('triggers')
  async listarTriggersEscrow() {
    return this.rwaService.listarTriggersEscrow();
  }

  @Post('triggers/:id/executar')
  async executarTriggerEscrow(@Param('id') id: string) {
    return this.rwaService.executarTriggerEscrow(id);
  }

  @Get('secondary-trades')
  async listarTradesSecundarios() {
    return this.rwaService.listarTradesSecundarios();
  }

  @Post('secondary-trades/simular')
  async simularRevendaSecundaria(@Body() dto: SimularRevendaSecundariaRequestDto) {
    return this.rwaService.simularRevendaSecundaria(dto);
  }

  @Get('accounting-registers')
  async listarRegistrosContabeis() {
    return this.rwaService.listarRegistrosContabeis();
  }
}
