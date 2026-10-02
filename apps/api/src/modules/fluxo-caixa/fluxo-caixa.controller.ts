import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Fluxo de Caixa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fluxo-caixa')
export class FluxoCaixaController {
  constructor(private readonly fluxoCaixaService: FluxoCaixaService) {}

  @Get('summary')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Obter resumo executivo do fluxo de caixa e projeção 30d' })
  async getSummary() {
    return this.fluxoCaixaService.getSummary();
  }

  @Get('transactions')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Extrato de movimentações de tesouraria e conciliações' })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getTransactions(
    @Query('tipo') tipo?: string,
    @Query('categoria') categoria?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('search') search?: string,
  ) {
    return this.fluxoCaixaService.getTransactions({
      tipo,
      categoria,
      dataInicio,
      dataFim,
      search,
    });
  }
}
