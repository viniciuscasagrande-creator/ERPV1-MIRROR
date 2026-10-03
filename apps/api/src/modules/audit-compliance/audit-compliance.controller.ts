import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuditComplianceService } from './audit-compliance.service';
import {
  StatusFraudeTransacao,
  TipoSolicitacaoLgpd,
} from '@diskingressos/types';

@Controller('audit-compliance')
export class AuditComplianceController {
  constructor(private readonly auditComplianceService: AuditComplianceService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.auditComplianceService.getDashboardKpis();
  }

  @Get('frauds')
  async listarFraudes(@Query('status') status?: StatusFraudeTransacao) {
    return this.auditComplianceService.listarFraudes(status);
  }

  @Patch('frauds/:id/resolve')
  async resolverFraude(
    @Param('id') id: string,
    @Body() body: { decisao: 'APROVADO' | 'BLOQUEADO'; responsavel: string },
  ) {
    return this.auditComplianceService.resolverFraude(id, body.decisao, body.responsavel);
  }

  @Get('anomalies')
  async listarAnomaliasContabeis() {
    return this.auditComplianceService.listarAnomaliasContabeis();
  }

  @Patch('anomalies/:id/acknowledge')
  async reconhecerAnomalia(
    @Param('id') id: string,
    @Body() body: { responsavel: string },
  ) {
    return this.auditComplianceService.reconhecerAnomalia(id, body.responsavel);
  }

  @Get('lgpd-requests')
  async listarSolicitacoesLgpd() {
    return this.auditComplianceService.listarSolicitacoesLgpd();
  }

  @Post('lgpd-requests')
  async criarSolicitacaoLgpd(
    @Body()
    body: {
      titularNome: string;
      titularEmail: string;
      titularCpf: string;
      tipoSolicitacao: TipoSolicitacaoLgpd;
    },
  ) {
    return this.auditComplianceService.criarSolicitacaoLgpd(body);
  }

  @Post('lgpd-anonymize')
  async executarAnonimizacao(
    @Body() body: { titularCpf: string; dpoResponsavel?: string },
  ) {
    return this.auditComplianceService.executarAnonimizacaoLgpd(
      body.titularCpf,
      body.dpoResponsavel || 'dpo@diskingressos.com.br',
    );
  }
}
