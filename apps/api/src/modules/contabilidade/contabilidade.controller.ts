import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContabilidadeService } from './contabilidade.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  PerfilUsuario,
  JwtPayload,
  CreateJournalEntryDto,
  GrupoContabil,
} from '@diskingressos/types';

@ApiTags('Contabilidade Oficial DiskIngressos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contabilidade')
export class ContabilidadeController {
  constructor(private readonly contabilidadeService: ContabilidadeService) {}

  @Get('plano-contas')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Consultar Plano de Contas contábil hierárquico' })
  @ApiQuery({ name: 'grupo', required: false, enum: GrupoContabil })
  @ApiQuery({ name: 'analitica', required: false, type: Boolean })
  async getChartOfAccounts(
    @Query('grupo') grupo?: GrupoContabil,
    @Query('analitica') analitica?: string,
  ) {
    return this.contabilidadeService.getChartOfAccounts({
      grupo,
      analitica: analitica !== undefined ? analitica === 'true' : undefined,
    });
  }

  @Get('diario')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Livro Diário com partidas dobradas' })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'origem', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getJournalEntries(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('origem') origem?: string,
    @Query('search') search?: string,
  ) {
    return this.contabilidadeService.getJournalEntries({
      dataInicio,
      dataFim,
      origem,
      search,
    });
  }

  @Post('diario')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Criar novo lançamento contábil no Livro Diário com validação de Débito = Crédito' })
  async createJournalEntry(
    @Body() dto: CreateJournalEntryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.contabilidadeService.createJournalEntry(dto, user);
  }

  @Get('balancete')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Balancete de Verificação Contábil' })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async getTrialBalance(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.contabilidadeService.getTrialBalance(dataInicio, dataFim);
  }

  @Get('razao/:accountId')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Livro Razão analítico por conta contábil' })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async getGeneralLedger(
    @Param('accountId') accountId: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.contabilidadeService.getGeneralLedger(accountId, dataInicio, dataFim);
  }

  @Get('dre')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Demonstração do Resultado do Exercício (DRE Oficial DiskIngressos)' })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  async getDreOfficial(
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
  ) {
    return this.contabilidadeService.getDreOfficial(ano, mes);
  }
}
