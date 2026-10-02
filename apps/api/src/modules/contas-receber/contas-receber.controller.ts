import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContasReceberService } from './contas-receber.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, StatusRecebivel } from '@diskingressos/types';

@ApiTags('Contas a Receber')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar contas a receber / adquirentes' })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: StatusRecebivel })
  @ApiQuery({ name: 'adquirente', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('eventId') eventId?: string,
    @Query('status') status?: StatusRecebivel,
    @Query('adquirente') adquirente?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('search') search?: string,
  ) {
    return this.contasReceberService.findAll(
      { eventId, status, adquirente, dataInicio, dataFim, search },
      user,
    );
  }

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'KPIs consolidados de recebíveis e adquirentes' })
  @ApiQuery({ name: 'eventId', required: false })
  async getKpis(
    @CurrentUser() user: JwtPayload,
    @Query('eventId') eventId?: string,
  ) {
    return this.contasReceberService.getKpis(eventId, user);
  }

  @Patch(':id/antecipar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Solicitar antecipação de recebível junto à adquirente' })
  async antecipar(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.contasReceberService.antecipar(id, user);
  }

  @Patch(':id/baixar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Baixar recebível como liquidado' })
  async baixar(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.contasReceberService.baixar(id, user);
  }
}
