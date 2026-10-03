import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { FidcEntertainmentService } from './fidc-entertainment.service';
import type { SimularCessaoFidcRequestDto } from '@diskingressos/types';

@Controller('fidc-entertainment')
export class FidcEntertainmentController {
  constructor(private readonly fidcService: FidcEntertainmentService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.fidcService.getDashboardKpis();
  }

  @Get('funds')
  async listarFundos() {
    return this.fidcService.listarFundos();
  }

  @Get('funds/:id')
  async obterFundoPorId(@Param('id') id: string) {
    return this.fidcService.obterFundoPorId(id);
  }

  @Get('assignments')
  async listarCessoesRecebiveis() {
    return this.fidcService.listarCessoesRecebiveis();
  }

  @Post('assignments/simulate')
  async simularCessaoRecebiveis(@Body() dto: SimularCessaoFidcRequestDto) {
    return this.fidcService.simularCessaoRecebiveis(dto);
  }

  @Get('valuations')
  async listarValuationsDiarias() {
    return this.fidcService.listarValuationsDiarias();
  }

  @Get('accounting-movements')
  async listarMovimentacoesContabeis() {
    return this.fidcService.listarMovimentacoesContabeis();
  }
}
