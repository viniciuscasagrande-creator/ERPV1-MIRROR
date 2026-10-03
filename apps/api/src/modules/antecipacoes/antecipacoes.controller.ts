import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AntecipacoesService } from './antecipacoes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  CriarAntecipacaoRequestDto,
  SimulacaoAntecipacaoRequestDto,
  AprovarAntecipacaoDto,
  RejeitarAntecipacaoDto,
  ExecutarAmortizacaoDto,
} from '@diskingressos/types';

@ApiTags('Antecipações de Recebíveis, Margem Consignável & Travas Bancárias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('antecipacoes')
export class AntecipacoesController {
  constructor(private readonly antecipacoesService: AntecipacoesService) {}

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Obter indicadores de antecipações, saldo devedor e fundo de reserva' })
  async getKpis() {
    return this.antecipacoesService.getKpis();
  }

  @Get('margem-consignavel/:eventId')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Calcular margem consignável segura e fundo de reserva (escrow) de um evento' })
  async getMargemConsignavel(@Param('eventId') eventId: string) {
    return this.antecipacoesService.calcularMargemConsignavel(eventId);
  }

  @Post('simular')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Simular valores líquidos, juros pro-rata, IOF e alçada necessária' })
  async simular(@Body() dto: SimulacaoAntecipacaoRequestDto) {
    return this.antecipacoesService.simularAntecipacao(dto);
  }

  @Post()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Criar nova solicitação de antecipação de recebíveis' })
  async criarSolicitacao(@Body() dto: CriarAntecipacaoRequestDto, @Req() req: any) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    if (isProdutor && req.user?.producerId) {
      dto.producerId = req.user.producerId;
    }
    return this.antecipacoesService.criarSolicitacao(dto);
  }

  @Get('travas/todas')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Listar travas de domicílio bancário em adquirentes (Cielo/Stone/Rede)' })
  async getTravas(@Query('status') status?: string, @Req() req?: any) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.antecipacoesService.getTravasBancarias(status, producerId);
  }

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar contratos de antecipação com filtros de status e busca' })
  async getAntecipacoes(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Req() req?: any,
  ) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.antecipacoesService.getAntecipacoes(status, producerId, search);
  }

  @Get(':id')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Consultar detalhes da antecipação, amortizações e travas bancárias' })
  async getById(@Param('id') id: string) {
    return this.antecipacoesService.getAntecipacaoById(id);
  }

  @Patch(':id/aprovar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Aprovar antecipação e efetivar travas de domicílio bancário' })
  async aprovar(@Param('id') id: string, @Body() dto: AprovarAntecipacaoDto, @Req() req: any) {
    if (!dto.aprovadorNome && req.user?.nome) {
      dto.aprovadorNome = req.user.nome;
      dto.cargo = req.user.roles?.[0] || 'Gestor Financeiro';
    }
    return this.antecipacoesService.aprovarSolicitacao(id, dto);
  }

  @Patch(':id/rejeitar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Rejeitar solicitação de antecipação com motivo formal' })
  async rejeitar(@Param('id') id: string, @Body() dto: RejeitarAntecipacaoDto, @Req() req: any) {
    if (!dto.rejeitadoPor && req.user?.nome) {
      dto.rejeitadoPor = req.user.nome;
    }
    return this.antecipacoesService.rejeitarSolicitacao(id, dto);
  }

  @Post(':id/amortizar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Executar amortização manual ou vinculada a repasse/trava cruzada' })
  async amortizar(@Param('id') id: string, @Body() dto: ExecutarAmortizacaoDto) {
    return this.antecipacoesService.amortizar(id, dto);
  }
}
