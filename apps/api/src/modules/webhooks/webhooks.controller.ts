import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario, CreateWebhookDto, TriggerWebhookTestDto } from '@diskingressos/types';

@ApiTags('Webhooks & Conectores de Mensageria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar inscrições de webhooks ativas' })
  async getWebhooks() {
    return this.webhooksService.findAll();
  }

  @Post()
  @Roles(PerfilUsuario.ADMIN)
  @ApiOperation({ summary: 'Criar nova assinatura de webhook com HMAC-SHA256' })
  async createWebhook(@Body() body: CreateWebhookDto) {
    return this.webhooksService.create(body);
  }

  @Delete(':id')
  @Roles(PerfilUsuario.ADMIN)
  @ApiOperation({ summary: 'Excluir assinatura de webhook' })
  async deleteWebhook(@Param('id') id: string) {
    return this.webhooksService.delete(id);
  }

  @Post(':id/test')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Disparar evento de teste com assinatura HMAC' })
  async triggerTest(
    @Param('id') id: string,
    @Body() body?: { evento?: string; customPayload?: any },
  ) {
    return this.webhooksService.triggerTest(id, body?.evento, body?.customPayload);
  }

  @Get('logs/all')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar histórico geral de entregas de webhooks' })
  async getAllLogs() {
    return this.webhooksService.getLogs();
  }

  @Get(':id/logs')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar histórico de entregas de um webhook específico' })
  async getWebhookLogs(@Param('id') id: string) {
    return this.webhooksService.getLogs(id);
  }
}
