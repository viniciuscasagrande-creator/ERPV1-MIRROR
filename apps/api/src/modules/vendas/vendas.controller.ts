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
import { VendasService } from './vendas.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Vendas & Bilheteria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.OPERACIONAL, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Registrar nova venda de bilheteria multi-canal (Online/POS/Totem)' })
  async create(@Body() dto: CreateSaleDto) {
    return this.vendasService.create(dto);
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
  @ApiOperation({ summary: 'Listar vendas com filtros por canal, evento e status' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'canal', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('eventId') eventId?: string,
    @Query('canal') canal?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.vendasService.findAll({ page, limit, eventId, canal, status, search });
  }

  @Post(':id/refund')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Processar cancelamento e estorno da venda' })
  async refund(@Param('id') id: string, @Body('motivo') motivo: string) {
    return this.vendasService.refund(id, motivo || 'Solicitação de cancelamento');
  }
}
