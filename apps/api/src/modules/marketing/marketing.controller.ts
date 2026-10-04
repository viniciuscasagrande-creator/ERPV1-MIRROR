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
import { CentralUtmService } from './central-utm.service';
import { AdsTelemetryService } from './ads-telemetry.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario, CreateUtmLinkRequestDto } from '@diskingressos/types';

@ApiTags('Central de Marketing Digital, UTM & Telemetria Ads (DiskIngressos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('marketing')
export class MarketingController {
  constructor(
    private readonly marketingService: MarketingService,
    private readonly centralUtmService: CentralUtmService,
    private readonly adsTelemetryService: AdsTelemetryService,
  ) {}

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

  // ==========================================
  // CENTRAL UTM ENDPOINTS
  // ==========================================

  @Get('utm/presets')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Presets de canais UTM (Meta, TikTok, Spotify, Google GA4, etc.)' })
  async getUtmPresets() {
    return this.centralUtmService.getChannelPresets();
  }

  @Get('utm/links')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar links UTM parametrizados e métricas de conversão' })
  async getUtmLinks() {
    return this.centralUtmService.getLinks();
  }

  @Post('utm/links')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Gerar novo link UTM parametrizado com link curto e QR Code' })
  async createUtmLink(@Body() body: CreateUtmLinkRequestDto) {
    return this.centralUtmService.createLink(body);
  }

  @Post('utm/validate')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Auditar e validar consistência de URL com parâmetros UTM' })
  async validateUtm(@Body('url') url: string) {
    return this.centralUtmService.validateUtm(url);
  }

  // ==========================================
  // TELEMETRIA INTERNA DE ADS ENDPOINTS
  // ==========================================

  @Get('telemetry/overview')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Visão geral da telemetria de anúncios, latências e gasto 24h' })
  async getTelemetryOverview() {
    return this.adsTelemetryService.getOverview();
  }

  @Get('telemetry/networks')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Status de ping e saúde de cada rede de anúncio (Meta, GA4, TikTok, Spotify)' })
  async getTelemetryNetworks() {
    return this.adsTelemetryService.getNetworkMetrics();
  }

  @Get('telemetry/live-events')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Stream em tempo real de eventos de telemetria de anúncios' })
  async getTelemetryLiveEvents() {
    return this.adsTelemetryService.getLiveEvents();
  }

  @Get('telemetry/anomalies')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Alertas de anomalia de telemetria (queda de ROAS, latência, ATT iOS)' })
  async getTelemetryAnomalies() {
    return this.adsTelemetryService.getAnomalies();
  }

  @Post('telemetry/anomalies/:id/resolve')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Marcar alerta de anomalia como investigado e resolvido' })
  async resolveAnomaly(@Param('id') id: string) {
    return this.adsTelemetryService.resolveAnomaly(id);
  }
}
