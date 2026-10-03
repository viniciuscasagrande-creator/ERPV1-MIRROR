import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ScpInvestorsService } from './scp-investors.service';
import {
  CriarContratoScpDto,
  CriarInvestidorDto,
  RegistrarAporteDto,
  SimularDistribuicaoScpRequestDto,
  AprovarDistribuicaoDto,
  LiquidarDividendoPixDto,
} from '@diskingressos/types';

@Controller('scp')
export class ScpInvestorsController {
  constructor(private readonly scpService: ScpInvestorsService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.scpService.getDashboardKpis();
  }

  @Get('contratos')
  async listarContratos() {
    return this.scpService.listarContratos();
  }

  @Post('contratos')
  async criarContrato(@Body() dto: CriarContratoScpDto) {
    return this.scpService.criarContrato(dto);
  }

  @Get('contratos/:id')
  async obterContratoPorId(@Param('id') id: string) {
    return this.scpService.obterContratoPorId(id);
  }

  @Get('investidores')
  async listarInvestidores() {
    return this.scpService.listarInvestidores();
  }

  @Post('investidores')
  async criarInvestidor(@Body() dto: CriarInvestidorDto) {
    return this.scpService.criarInvestidor(dto);
  }

  @Post('aportes')
  async registrarAporte(@Body() dto: RegistrarAporteDto) {
    return this.scpService.registrarAporte(dto);
  }

  @Post('simular-distribuicao')
  async simularDistribuicao(@Body() dto: SimularDistribuicaoScpRequestDto) {
    return this.scpService.simularDistribuicao(dto);
  }

  @Post('distribuicoes/calcular')
  async calcularEEfetivarDistribuicao(@Body() dto: SimularDistribuicaoScpRequestDto) {
    return this.scpService.calcularEEfetivarDistribuicao(dto);
  }

  @Get('distribuicoes')
  async listarDistribuicoes() {
    return this.scpService.listarDistribuicoes();
  }

  @Patch('distribuicoes/:id/aprovar')
  async aprovarDistribuicao(
    @Param('id') id: string,
    @Body() dto: AprovarDistribuicaoDto,
  ) {
    return this.scpService.aprovarDistribuicao(id, dto);
  }

  @Patch('distribuicoes/:id/liquidar')
  async liquidarDividendo(
    @Param('id') id: string,
    @Body() dto: LiquidarDividendoPixDto,
  ) {
    return this.scpService.liquidarDividendo(id, dto);
  }
}
