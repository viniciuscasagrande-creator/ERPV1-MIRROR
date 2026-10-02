import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';

@ApiTags('Eventos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.OPERACIONAL)
  @ApiOperation({ summary: 'Cadastrar novo evento com lotes e tipos de ingressos' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventosService.create(dto);
  }

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.OPERACIONAL,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar eventos com filtros e apuração financeira' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'producerId', required: false })
  @ApiQuery({ name: 'statusFinanceiro', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('producerId') producerId?: string,
    @Query('statusFinanceiro') statusFinanceiro?: string,
    @Query('search') search?: string,
  ) {
    // Se o usuário logado for produtor, isola estritamente seu producerId
    const effectiveProducerId =
      user.roles.includes(PerfilUsuario.PRODUTOR) ? user.producerId || 'none' : producerId;

    return this.eventosService.findAll({
      page,
      limit,
      producerId: effectiveProducerId,
      statusFinanceiro,
      search,
    });
  }

  @Get(':id')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.OPERACIONAL,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Consultar dossiê operacional e financeiro do evento' })
  async findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id/checklist')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Atualizar portões do checklist na Central de Fechamento' })
  async updateChecklist(
    @Param('id') id: string,
    @Body() dto: UpdateChecklistDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.eventosService.updateChecklist(id, dto, user.sub);
  }
}
