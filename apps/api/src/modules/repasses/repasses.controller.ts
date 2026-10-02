import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RepassesService } from './repasses.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { ApproveSettlementDto, ExecuteSettlementDto } from './dto/settlement-actions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, StatusRepasse } from '@diskingressos/types';

@ApiTags('Repasses a Produtores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('repasses')
export class RepassesController {
  constructor(private readonly repassesService: RepassesService) {}

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar repasses e borderôs com isolamento de perfil' })
  @ApiQuery({ name: 'producerId', required: false })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: StatusRepasse })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Query('status') status?: StatusRepasse,
    @Query('search') search?: string,
  ) {
    return this.repassesService.findAll(
      { producerId, eventId, status, search },
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
  @ApiOperation({ summary: 'KPIs de repasses' })
  @ApiQuery({ name: 'eventId', required: false })
  async getKpis(
    @CurrentUser() user: JwtPayload,
    @Query('eventId') eventId?: string,
  ) {
    return this.repassesService.getKpis(eventId, user);
  }

  @Get('calculo-evento/:eventId')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Calcular DRE e saldo disponível para repasse de um evento' })
  async calculateEventLiquid(@Param('eventId') eventId: string) {
    return this.repassesService.calculateEventLiquid(eventId);
  }

  @Post()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.PRODUTOR)
  @ApiOperation({ summary: 'Solicitar novo repasse para um evento' })
  async create(
    @Body() dto: CreateSettlementDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.repassesService.create(dto, user);
  }

  @Patch(':id/aprovar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Aprovar ou rejeitar solicitação de repasse' })
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveSettlementDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.repassesService.approve(id, dto, user);
  }

  @Patch(':id/executar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Registrar execução bancária do repasse (PIX/TED)' })
  async execute(
    @Param('id') id: string,
    @Body() dto: ExecuteSettlementDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.repassesService.execute(id, dto, user);
  }
}
