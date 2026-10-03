import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DigitalSignatureService } from './digital-signature.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  CreateSignatureDocumentDto,
  SignDocumentActionDto,
} from '@diskingressos/types';

@ApiTags('Assinaturas Digitais Jurídicas, Borderôs & Conta Azul')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('digital-signature')
export class DigitalSignatureController {
  constructor(private readonly sigService: DigitalSignatureService) {}

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Obter indicadores de documentos em assinatura e integrados ao Conta Azul' })
  async getKpis() {
    return this.sigService.getKpis();
  }

  @Get('documents')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar documentos e borderôs com status das assinaturas sequenciais' })
  async getDocuments(
    @Query('status') status?: string,
    @Query('tipo') tipo?: string,
    @Req() req?: any,
  ) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.sigService.getDocuments(status, tipo, producerId);
  }

  @Get('documents/:id')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Consultar documento, signatários e trilha de auditoria digital' })
  async getDocumentById(@Param('id') id: string) {
    return this.sigService.getDocumentById(id);
  }

  @Post('documents')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Criar e despachar documento/borderô para coleta de assinaturas' })
  async createDocument(
    @Body() body: CreateSignatureDocumentDto,
    @Req() req: any,
  ) {
    const userNome = req.user?.nome || 'Operador Financeiro';
    return this.sigService.createDocument(body, userNome);
  }

  @Post('documents/:id/sign')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Assinar digitalmente documento respeitando a ordem sequencial probatória' })
  async signDocument(
    @Param('id') id: string,
    @Body() body: SignDocumentActionDto,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.sigService.signDocument(id, body, String(ip));
  }

  @Get('sync-queue')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar fila de sincronização de pagamentos com ERP Conta Azul / Omie' })
  async getSyncQueue() {
    return this.sigService.getSyncQueue();
  }

  @Post('sync-queue/:id/retry')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Reprocessar item com divergência ou erro de integração' })
  async retrySync(@Param('id') id: string) {
    return this.sigService.retrySync(id);
  }
}
