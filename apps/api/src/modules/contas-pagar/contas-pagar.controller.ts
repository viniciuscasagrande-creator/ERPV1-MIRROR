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
import { ContasPagarService } from './contas-pagar.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, StatusContaPagar, CategoriaDespesa } from '@diskingressos/types';

@ApiTags('Contas a Pagar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar contas a pagar com filtros' })
  @ApiQuery({ name: 'status', required: false, enum: StatusContaPagar })
  @ApiQuery({ name: 'categoria', required: false, enum: CategoriaDespesa })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: StatusContaPagar,
    @Query('categoria') categoria?: CategoriaDespesa,
    @Query('eventId') eventId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('search') search?: string,
  ) {
    return this.contasPagarService.findAll(
      { status, categoria, eventId, dataInicio, dataFim, search },
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
  @ApiOperation({ summary: 'KPIs de contas a pagar' })
  @ApiQuery({ name: 'eventId', required: false })
  async getKpis(
    @CurrentUser() user: JwtPayload,
    @Query('eventId') eventId?: string,
  ) {
    return this.contasPagarService.getKpis(eventId, user);
  }

  @Post()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Cadastrar nova obrigação a pagar' })
  async create(@Body() dto: CreatePayableDto, @CurrentUser() user: JwtPayload) {
    return this.contasPagarService.create(dto, user);
  }

  @Patch(':id/pagar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Efetivar liquidação e pagamento de título' })
  async pay(
    @Param('id') id: string,
    @Body('comprovanteRef') comprovanteRef: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.contasPagarService.pay(id, comprovanteRef, user);
  }

  @Patch(':id/agendar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Agendar título para liquidação' })
  async schedule(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.contasPagarService.schedule(id, user);
  }

  @Patch(':id/cancelar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Cancelar conta a pagar' })
  async cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.contasPagarService.cancel(id, user);
  }
}
