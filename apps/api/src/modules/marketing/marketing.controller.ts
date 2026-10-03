import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Central de Marketing Digital & Crescimento (DiskIngressos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('overview')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'KPIs e métricas consolidadas de campanhas e crescimento' })
  async getOverview() {
    return this.marketingService.getOverview();
  }

  @Get('campaigns')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listagem de campanhas multi-canal (Meta, Google, TikTok)' })
  async getCampaigns() {
    return this.marketingService.getCampaigns();
  }

  @Post('campaigns')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Criar nova campanha com rastreamento UTM automático' })
  async createCampaign(@Body() body: any) {
    return this.marketingService.createCampaign(body);
  }

  @Get('coupons')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Cupons de desconto dinâmicos e controle de conversão' })
  async getCoupons() {
    return this.marketingService.getCoupons();
  }

  @Post('coupons')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Emitir novo cupom de desconto ou taxa zero' })
  async createCoupon(@Body() body: any) {
    return this.marketingService.createCoupon(body);
  }

  @Get('promoters')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Gestão de Promoters e links de afiliados comissionados' })
  async getPromoters() {
    return this.marketingService.getPromoters();
  }

  @Post('promoters/:id/pay')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Liquidação de comissão pendente do promoter via PIX' })
  async payPromoterCommission(@Param('id') id: string) {
    return this.marketingService.payPromoterCommission(id);
  }

  @Get('pixel-capi-logs')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Traces da API de Conversões Server-Side (Meta CAPI / Google)' })
  async getPixelCapiLogs() {
    return this.marketingService.getPixelCapiLogs();
  }

  @Get('attribution-models')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Comparativo de modelos de atribuição multi-toque' })
  async getAttributionComparison() {
    return this.marketingService.getAttributionComparison();
  }
}
