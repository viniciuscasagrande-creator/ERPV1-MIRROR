import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingPeriodService } from './accounting-period.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  PerfilUsuario,
  JwtPayload,
  FecharPeriodoDto,
  ReabrirPeriodoDto,
} from '@diskingressos/types';

@ApiTags('Governança Contábil, Travas de Período & Fechamento Mensal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounting-periods')
export class AccountingPeriodController {
  constructor(private readonly periodService: AccountingPeriodService) {}

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO
  )
  @ApiOperation({ summary: 'Listar períodos contábeis do ano com status de trava' })
  async getPeriods(@Query('ano') ano?: string) {
    const anoInt = ano ? parseInt(ano, 10) : undefined;
    return this.periodService.getPeriods(anoInt);
  }

  @Get(':competencia')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO
  )
  @ApiOperation({ summary: 'Obter detalhes de uma competência contábil' })
  async getPeriod(@Param('competencia') competencia: string) {
    return this.periodService.getPeriodByCompetencia(competencia);
  }

  @Get(':competencia/checklist')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO
  )
  @ApiOperation({ summary: 'Auditar checklist de fechamento dos 5 pilares contábeis' })
  async getChecklist(@Param('competencia') competencia: string) {
    return this.periodService.runChecklist(competencia);
  }

  @Post(':competencia/fechar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Encerrar período contábil e ativar trava de movimentações' })
  async fecharPeriodo(
    @Param('competencia') competencia: string,
    @Body() body: FecharPeriodoDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.periodService.fecharPeriodo(competencia, body.justificativa, user);
  }

  @Post(':competencia/reabrir')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({
    summary: 'Reabertura emergencial de período contábil com alerta de governança',
  })
  async reabrirPeriodo(
    @Param('competencia') competencia: string,
    @Body() body: ReabrirPeriodoDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.periodService.reabrirPeriodo(competencia, body.motivo, user);
  }
}
