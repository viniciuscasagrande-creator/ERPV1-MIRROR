import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Relatórios Corporativos & Auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('dre-evento/:eventId')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'DRE e Fechamento Analítico do Evento' })
  async getEventFinancialReport(@Param('eventId') eventId: string) {
    return this.relatoriosService.getEventFinancialReport(eventId);
  }

  @Get('vendas-periodo')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Relatório analítico de vendas e ingressos por período' })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async getPeriodSalesReport(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.relatoriosService.getPeriodSalesReport(dataInicio, dataFim);
  }

  @Get('repasses-produtores')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Relatório de borderôs e repasses a produtores' })
  @ApiQuery({ name: 'producerId', required: false })
  async getSettlementsReport(@Query('producerId') producerId?: string) {
    return this.relatoriosService.getSettlementsReport(producerId);
  }

  @Get('auditoria-compliance')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Relatório de auditoria e conformidade contábil' })
  async getComplianceAuditReport() {
    return this.relatoriosService.getComplianceAuditReport();
  }
}
