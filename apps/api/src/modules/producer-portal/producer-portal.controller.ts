import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProducerPortalService } from './producer-portal.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, ProducerBankData } from '@diskingressos/types';

@ApiTags('Portal Contábil do Produtor (Acesso Externo)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producer-portal')
export class ProducerPortalController {
  constructor(private readonly portalService: ProducerPortalService) {}

  /**
   * Helper que extrai com segurança o producerId baseado no perfil do usuário
   */
  private resolveProducerId(user: JwtPayload, queryProducerId?: string): string {
    const isProducer = user.roles.includes(PerfilUsuario.PRODUTOR);
    if (isProducer) {
      if (!user.producerId) {
        throw new ForbiddenException('Usuário com perfil Produtor sem empresa vinculada.');
      }
      return user.producerId;
    }

    // Administradores e Diretoria podem auditar o portal passando producerId via query
    if (queryProducerId) {
      return queryProducerId;
    }

    // Default para primeiro produtor cadastrado em modo admin preview
    return '12.345.678/0001-90'; // ou producerId
  }

  @Get('dashboard')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Dashboard financeiro restrito do produtor' })
  async getDashboard(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.getDashboard(producerId);
  }

  @Get('eventos')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Meus eventos e vendas de ingressos' })
  async getEvents(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.getEvents(producerId);
  }

  @Get('eventos/:id')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Detalhes e borderô financeiro do evento' })
  async getEventDetails(
    @Param('id') eventId: string,
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.getEventDetails(producerId, eventId);
  }

  @Get('repasses')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Extrato de repasses e borderôs' })
  async getSettlements(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.getSettlements(producerId);
  }

  @Post('repasses/solicitar-adiantamento')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN)
  @ApiOperation({ summary: 'Solicitar adiantamento/repasse parcial de bilheteria' })
  async solicitarAdiantamento(
    @CurrentUser() user: JwtPayload,
    @Body('eventId') eventId: string,
    @Body('valor') valor: number,
    @Body('justificativa') justificativa: string,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.solicitarAdiantamento(
      producerId,
      eventId,
      valor,
      justificativa,
      user.sub
    );
  }

  @Get('documentos/notas')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Notas fiscais de serviço (NFS-e) emitidas pela DiskIngressos' })
  async getInvoices(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.getInvoices(producerId);
  }

  @Get('dados-bancarios')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Consultar dados bancários homologados' })
  async getBankData(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    const dash = await this.portalService.getDashboard(producerId);
    return dash.dadosBancarios;
  }

  @Put('dados-bancarios')
  @Roles(PerfilUsuario.PRODUTOR, PerfilUsuario.ADMIN)
  @ApiOperation({ summary: 'Atualizar dados bancários e chave PIX para repasses' })
  async updateBankData(
    @CurrentUser() user: JwtPayload,
    @Body() bankData: ProducerBankData,
    @Query('producerId') queryProducerId?: string,
  ) {
    const producerId = this.resolveProducerId(user, queryProducerId);
    return this.portalService.updateBankData(producerId, bankData);
  }
}
