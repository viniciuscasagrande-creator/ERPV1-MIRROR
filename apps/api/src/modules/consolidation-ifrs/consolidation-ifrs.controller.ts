import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ConsolidationIfrsService } from './consolidation-ifrs.service';
import {
  SimularConversaoIfrsRequestDto,
  TipoOperacaoIntercompany,
} from '@diskingressos/types';

@Controller('consolidation-ifrs')
export class ConsolidationIfrsController {
  constructor(private readonly consolidationService: ConsolidationIfrsService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.consolidationService.getDashboardKpis();
  }

  @Get('entities')
  async listarEntidades() {
    return this.consolidationService.listarEntidades();
  }

  @Get('eliminations')
  async listarEliminacoes() {
    return this.consolidationService.listarEliminacoes();
  }

  @Post('eliminations')
  async criarEliminacao(
    @Body()
    body: {
      periodoAnoMes: string;
      tipoOperacao: TipoOperacaoIntercompany;
      entidadeOrigemId: string;
      entidadeDestinoId: string;
      valorEliminadoBrl: number;
      contaContabilDebito: string;
      contaContabilCredito: string;
      justificativaIfrs: string;
    },
  ) {
    return this.consolidationService.criarEliminacao(body);
  }

  @Get('mep')
  async listarApuracoesMep() {
    return this.consolidationService.listarApuracoesMep();
  }

  @Get('financial-statements')
  async listarDemonstracoesConsolidadas(
    @Query('moeda') moeda?: 'BRL' | 'USD' | 'EUR',
  ) {
    return this.consolidationService.listarDemonstracoesConsolidadas(moeda);
  }

  @Post('convert-currency')
  async simularConversaoIfrs(@Body() dto: SimularConversaoIfrsRequestDto) {
    return this.consolidationService.simularConversaoIfrs(dto);
  }
}
