import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RemarketingService } from './remarketing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario, RemarketingChannel } from '@diskingressos/types';

@ApiTags('Remarketing, Recuperação de Vendas & RFM (DiskIngressos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('remarketing')
export class RemarketingController {
  constructor(private readonly remarketingService: RemarketingService) {}

  @Get('overview')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Métricas de conversão de carrinhos abandonados e RFM' })
  async getOverview() {
    return this.remarketingService.getOverview();
  }

  @Get('abandoned-carts')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Monitoramento em tempo real de carrinhos abandonados' })
  async getAbandonedCarts() {
    return this.remarketingService.getAbandonedCarts();
  }

  @Post('abandoned-carts/:id/recover')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Disparo manual/reativo de recuperação de carrinho via WhatsApp ou SMS' })
  async triggerRecoveryAction(
    @Param('id') id: string,
    @Body('canal') canal: RemarketingChannel,
  ) {
    return this.remarketingService.triggerRecoveryAction(id, canal);
  }

  @Get('rfm-segments')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Segmentação comportamental de clientes RFM (LTV e Recência)' })
  async getRfmSegments() {
    return this.remarketingService.getRfmSegments();
  }

  @Post('rfm/sync')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Sincronizar audiência com Meta Custom Audiences ou Google Match' })
  async syncAudiencePlatform(
    @Body() body: { plataforma: 'META' | 'GOOGLE'; cluster: string },
  ) {
    return this.remarketingService.syncAudiencePlatform(body.plataforma, body.cluster);
  }

  @Get('triggers')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Regras de automação de gatilhos multicanal' })
  async getAutomatedTriggers() {
    return this.remarketingService.getAutomatedTriggers();
  }

  @Patch('triggers/:id')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Ativar ou pausar gatilho automatizado' })
  async toggleTrigger(
    @Param('id') id: string,
    @Body('ativo') ativo: boolean,
  ) {
    return this.remarketingService.toggleTrigger(id, ativo);
  }
}
