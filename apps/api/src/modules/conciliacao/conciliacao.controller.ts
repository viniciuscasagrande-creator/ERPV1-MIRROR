import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConciliacaoService } from './conciliacao.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, StatusConciliacao } from '@diskingressos/types';

@ApiTags('Conciliação Bancária & OFX')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conciliacao')
export class ConciliacaoController {
  constructor(private readonly conciliacaoService: ConciliacaoService) {}

  @Get('summary')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Resumo e indicadores de conciliação bancária' })
  @ApiQuery({ name: 'bankAccountId', required: false })
  async getSummary(@Query('bankAccountId') bankAccountId?: string) {
    return this.conciliacaoService.getSummary(bankAccountId);
  }

  @Get('extrato/:bankAccountId')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Consultar extrato bancário com status de conciliação e candidatos a match' })
  @ApiQuery({ name: 'status', required: false, enum: StatusConciliacao })
  @ApiQuery({ name: 'search', required: false })
  async getStatement(
    @Param('bankAccountId') bankAccountId: string,
    @Query('status') status?: StatusConciliacao,
    @Query('search') search?: string,
  ) {
    return this.conciliacaoService.getStatement(bankAccountId, { status, search });
  }

  @Post('importar-ofx')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Importar arquivo OFX de extrato bancário' })
  async importOfx(
    @Body() body: { bankAccountId: string; filename: string; content: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.conciliacaoService.importOfx(
      body.bankAccountId,
      body.filename,
      body.content,
      user,
    );
  }

  @Post('auto-conciliar/:bankAccountId')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Executar motor de conciliação automática com tolerância heurística' })
  async autoReconcile(@Param('bankAccountId') bankAccountId: string) {
    return this.conciliacaoService.runAutoReconciliation(bankAccountId);
  }

  @Post('conciliar-manual')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Vincular manualmente item do extrato a um título (recebível, conta a pagar ou repasse)' })
  async manualReconcile(
    @Body() body: { statementItemId: string; target: { tipo: 'RECEBIVEL' | 'CONTA_PAGAR' | 'REPASSE'; id: string } },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.conciliacaoService.manualReconcile(
      body.statementItemId,
      body.target,
      user,
    );
  }

  @Patch('ignorar/:statementItemId')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Ignorar item de extrato não contábil' })
  async ignoreItem(@Param('statementItemId') statementItemId: string) {
    return this.conciliacaoService.ignoreItem(statementItemId);
  }
}
