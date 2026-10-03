import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DisasterRecoveryService } from './disaster-recovery.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  CreateBackupSnapshotDto,
  RequestRestoreDrDto,
} from '@diskingressos/types';

@ApiTags('Disaster Recovery, Backup & Retenção Legal (5 Anos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disaster-recovery')
export class DisasterRecoveryController {
  constructor(private readonly drService: DisasterRecoveryService) {}

  @Get('metrics')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Obter indicadores de DR, RTO/RPO e status de retenção contábil (5 anos)' })
  async getMetrics() {
    return this.drService.getMetrics();
  }

  @Get('snapshots')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Listar snapshots e cópias imutáveis de segurança' })
  async getSnapshots(
    @Query('tipo') tipo?: string,
    @Query('status') status?: string,
  ) {
    return this.drService.getSnapshots(tipo, status);
  }

  @Get('snapshots/:id')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar detalhes e inventário de tabelas de um snapshot' })
  async getSnapshotById(@Param('id') id: string) {
    return this.drService.getSnapshotById(id);
  }

  @Post('snapshots/gerar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Gerar snapshot sob demanda com checksum SHA-256 e prazo legal de 5 anos' })
  async createSnapshot(@Body() body: CreateBackupSnapshotDto, @Req() req: any) {
    const userNome = req.user?.nome || 'Administrador do Sistema';
    return this.drService.createSnapshot(body, userNome);
  }

  @Post('restore/solicitar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Solicitar simulação ou execução de restauração (DR) com auditoria' })
  async requestRestore(@Body() body: RequestRestoreDrDto, @Req() req: any) {
    const userNome = req.user?.nome || 'Administrador do Sistema';
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.drService.requestRestore(body, userNome, String(ip));
  }

  @Get('restore/logs')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar trilha forense de restores e testes de contingência' })
  async getRestoreLogs() {
    return this.drService.getRestoreLogs();
  }

  @Get('snapshots/:id/manifest')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Baixar manifesto de conformidade jurídica e integridade criptográfica' })
  async downloadManifest(@Param('id') id: string, @Res() res: Response) {
    const manifest = await this.drService.getManifest(id);
    const filename = `MANIFESTO_DR_${manifest.snapshot.codigo}_SHA256.json`;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(JSON.stringify(manifest, null, 2));
  }
}
