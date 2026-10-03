import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AiTreasuryService } from './ai-treasury.service';
import { SimularCurvaVendasRequestDto } from '@diskingressos/types';

@Controller('ai-treasury')
export class AiTreasuryController {
  constructor(private readonly aiTreasuryService: AiTreasuryService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.aiTreasuryService.getDashboardKpis();
  }

  @Get('forecast')
  async getForecast(@Query('horizonteDias') horizonteDias?: string) {
    const dias = horizonteDias ? parseInt(horizonteDias, 10) : 30;
    return this.aiTreasuryService.obterPrevisaoFluxoCaixa(dias);
  }

  @Post('simulate-yield')
  async simulateYield(@Body() dto: SimularCurvaVendasRequestDto) {
    return this.aiTreasuryService.simularCurvaVendasYield(dto);
  }

  @Get('pricing-rules')
  async listarRegrasPrecificacao() {
    return this.aiTreasuryService.listarRegrasPrecificacaoDinamica();
  }

  @Patch('pricing-rules/:id/apply')
  async aplicarPrecoDinamico(@Param('id') id: string) {
    return this.aiTreasuryService.aplicarPrecoDinamico(id);
  }

  @Get('producer-scores')
  async listarScoresProdutores() {
    return this.aiTreasuryService.listarScoresProdutores();
  }

  @Get('producer-scores/:id')
  async obterScoreProdutor(@Param('id') id: string) {
    return this.aiTreasuryService.obterScoreProdutor(id);
  }

  @Get('cash-sweep')
  async listarAplicacoesCashSweep() {
    return this.aiTreasuryService.listarAplicacoesCashSweep();
  }

  @Post('cash-sweep')
  async executarCashSweep(
    @Body() body: { valor: number; bancoNome?: string },
  ) {
    return this.aiTreasuryService.executarCashSweep(body.valor, body.bancoNome || '341 - Itaú Unibanco S.A.');
  }
}
