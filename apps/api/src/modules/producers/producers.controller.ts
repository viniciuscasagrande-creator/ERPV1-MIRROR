import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Produtores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Cadastrar novo produtor parceiro com regras comerciais' })
  async create(@Body() dto: CreateProducerDto) {
    return this.producersService.create(dto);
  }

  @Get()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO, PerfilUsuario.OPERACIONAL)
  @ApiOperation({ summary: 'Listar produtores com métricas consolidadas de vendas' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.producersService.findAll({ page, limit, search });
  }

  @Get(':id')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Consultar dossiê completo do produtor e histórico de eventos' })
  async findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Atualizar dados cadastrais, bancários ou taxas do produtor' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return this.producersService.update(id, dto);
  }
}
