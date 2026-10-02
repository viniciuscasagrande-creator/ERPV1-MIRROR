import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BiService } from './bi.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('BI Contábil & Indicadores Executivos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bi')
export class BiController {
  constructor(private readonly biService: BiService) {}

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'KPIs financeiros e operacionais executivos' })
  @ApiQuery({ name: 'periodo', required: false })
  async getExecutiveKpis(@Query('periodo') periodo?: string) {
    return this.biService.getExecutiveKpis(periodo);
  }

  @Get('canais')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Distribuição de vendas por canal (Online, PDV, Totem)' })
  async getSalesByChannel() {
    return this.biService.getSalesByChannel();
  }

  @Get('metodos-pagamento')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Vendas por meio de pagamento com taxa MDR' })
  async getSalesByPaymentMethod() {
    return this.biService.getSalesByPaymentMethod();
  }

  @Get('top-produtores')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Ranking de maiores produtores por volume e comissões' })
  async getTopProducers() {
    return this.biService.getTopProducers();
  }

  @Get('top-eventos')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Ranking de rentabilidade dos eventos para a DiskIngressos' })
  async getTopEvents() {
    return this.biService.getTopEvents();
  }

  @Get('curva-vendas')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Curva de aceleração de vendas de bilheteria' })
  @ApiQuery({ name: 'eventId', required: false })
  async getSalesVelocityCurve(@Query('eventId') eventId?: string) {
    return this.biService.getSalesVelocityCurve(eventId);
  }
}
