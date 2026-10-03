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
import { GovernanceSodService } from './governance-sod.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  CreateApprovalRequestDto,
  ReviewApprovalDto,
} from '@diskingressos/types';

@ApiTags('Governança Financeira, Alçadas Multinível & SoD')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('governance-sod')
export class GovernanceSodController {
  constructor(private readonly govService: GovernanceSodService) {}

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar indicadores de governança, fila de aprovações e SoD' })
  async getKpis() {
    return this.govService.getKpis();
  }

  @Get('rules')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Listar matriz de alçadas ativas por faixa monetária e operação' })
  async getRules() {
    return this.govService.getRules();
  }

  @Get('approvals')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Listar solicitações pendentes e histórico de aprovações com regras de SoD' })
  async getApprovals(
    @Query('status') status?: string,
    @Query('tipo') tipo?: string,
    @Req() req?: any,
  ) {
    const currentUserId = req?.user?.id || 'admin-master-id';
    return this.govService.getApprovals(status, tipo, currentUserId);
  }

  @Post('approvals/solicitar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Submeter nova solicitação de liberação/repasse para esteira de alçadas' })
  async createApprovalRequest(
    @Body() body: CreateApprovalRequestDto,
    @Req() req: any,
  ) {
    const user = {
      id: req.user?.id || 'usr-default',
      nome: req.user?.nome || 'Usuário Solicitante',
    };
    return this.govService.createApprovalRequest(body, user);
  }

  @Post('approvals/:id/review')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Aprovar ou rejeitar solicitação com validação anti-violação SoD' })
  async reviewApproval(
    @Param('id') id: string,
    @Body() body: ReviewApprovalDto,
    @Req() req: any,
  ) {
    const user = {
      id: req.user?.id || 'usr-approver',
      nome: req.user?.nome || 'Aprovador Autorizado',
    };
    return this.govService.reviewApproval(id, body, user);
  }

  @Get('sensitive-operations')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar trilha de operações sensíveis e status de quarentena de 48h' })
  async getSensitiveOperations() {
    return this.govService.getSensitiveOperations();
  }

  @Post('sensitive-operations/:id/release')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Liberar antecipadamente operação sensível em quarentena preventiva' })
  async releaseQuarantine(
    @Param('id') id: string,
    @Body('parecer') parecer: string,
    @Req() req: any,
  ) {
    const user = {
      id: req.user?.id || 'admin-id',
      nome: req.user?.nome || 'Diretoria Executiva',
    };
    return this.govService.releaseQuarantine(
      id,
      user,
      parecer || 'Liberação formal homologada pela Diretoria Financeira',
    );
  }
}
