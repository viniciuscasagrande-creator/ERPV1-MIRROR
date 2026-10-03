import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { GlobalFxService } from './global-fx.service';
import {
  SimularCotacaoInternacionalRequestDto,
  MoedaEstrangeira,
} from '@diskingressos/types';

@Controller('global-fx')
export class GlobalFxController {
  constructor(private readonly globalFxService: GlobalFxService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.globalFxService.getDashboardKpis();
  }

  @Get('rates')
  async listarCotacoes() {
    return this.globalFxService.listarCotacoes();
  }

  @Post('simulate-checkout')
  async simularCotacaoCheckout(@Body() dto: SimularCotacaoInternacionalRequestDto) {
    return this.globalFxService.simularCotacaoCheckout(dto);
  }

  @Get('sales')
  async listarVendasInternacionais() {
    return this.globalFxService.listarVendasInternacionais();
  }

  @Get('hedges')
  async listarContratosHedge() {
    return this.globalFxService.listarContratosHedge();
  }

  @Post('hedges')
  async criarContratoHedge(
    @Body()
    body: {
      eventoId: string;
      eventoNome: string;
      produtorId: string;
      moedaProtegida: MoedaEstrangeira;
      volumeMoedaProtegido: number;
      taxaCambioTravadaSpot: number;
      instituicaoFinanceira?: string;
    },
  ) {
    return this.globalFxService.criarContratoHedge(body);
  }

  @Get('accounting-entries')
  async listarLancamentosVariacaoCambial() {
    return this.globalFxService.listarLancamentosVariacaoCambial();
  }
}
