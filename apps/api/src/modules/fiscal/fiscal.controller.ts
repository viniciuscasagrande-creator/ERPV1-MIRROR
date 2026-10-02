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
import { FiscalService } from './fiscal.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  PerfilUsuario,
  JwtPayload,
  EmitirNfseDto,
  EmitirLoteEventoDto,
  CancelarNfDto,
  TipoDocumentoFiscal,
  StatusDocumentoFiscal,
  StatusGuiaRecolhimento,
  TipoSped,
} from '@diskingressos/types';

@ApiTags('Fiscal, Tributário, NF-e & SPED')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Get('dashboard')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'KPIs e resumo executivo fiscal' })
  @ApiQuery({ name: 'competencia', required: false, description: 'Formato YYYY-MM' })
  async getDashboardSummary(@Query('competencia') competencia?: string) {
    return this.fiscalService.getDashboardSummary(competencia);
  }

  @Get('notas')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Listar notas fiscais (NFS-e/NF-e)' })
  @ApiQuery({ name: 'status', required: false, enum: StatusDocumentoFiscal })
  @ApiQuery({ name: 'tipo', required: false, enum: TipoDocumentoFiscal })
  @ApiQuery({ name: 'competencia', required: false })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'busca', required: false })
  async getInvoices(
    @Query('status') status?: StatusDocumentoFiscal,
    @Query('tipo') tipo?: TipoDocumentoFiscal,
    @Query('competencia') competencia?: string,
    @Query('eventId') eventId?: string,
    @Query('busca') busca?: string,
  ) {
    return this.fiscalService.getInvoices({
      status,
      tipo,
      competencia,
      eventId,
      busca,
    });
  }

  @Get('notas/:id')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Buscar nota fiscal por ID com XML' })
  async getInvoiceById(@Param('id') id: string) {
    return this.fiscalService.getInvoiceById(id);
  }

  @Post('notas/emitir')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Emissão individual de NFS-e (Taxa/Comissão DiskIngressos)' })
  async emitirNfse(
    @Body() dto: EmitirNfseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.fiscalService.emitirNfse(dto, user.sub);
  }

  @Post('notas/emitir-lote-evento')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Emissão de NFS-e em lote por evento (Comissões e Taxas)' })
  async emitirLoteEvento(
    @Body() dto: EmitirLoteEventoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.fiscalService.emitirLoteEvento(dto, user.sub);
  }

  @Post('notas/:id/cancelar')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Cancelar nota fiscal autorizada com justificativa' })
  async cancelarNf(
    @Param('id') id: string,
    @Body() dto: CancelarNfDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.fiscalService.cancelarNf(id, dto, user.sub);
  }

  @Get('retencoes')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Relatório de retenções na fonte (IRRF, CSRF, ISS, INSS)' })
  @ApiQuery({ name: 'competencia', required: false })
  async getTaxRetentions(@Query('competencia') competencia?: string) {
    return this.fiscalService.getTaxRetentions(competencia);
  }

  @Get('apuracao')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Demonstrativo de apuração mensal de impostos (Lucro Presumido)' })
  @ApiQuery({ name: 'competencia', required: false })
  async getTaxSummary(@Query('competencia') competencia?: string) {
    return this.fiscalService.getTaxSummary(competencia);
  }

  @Post('apuracao/fechar')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Fechar apuração mensal e gerar guias DARF / DAM' })
  async fecharApuracao(
    @Body('competencia') competencia: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.fiscalService.fecharApuracao(competencia, user.sub);
  }

  @Get('guias')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.FINANCEIRO,
  )
  @ApiOperation({ summary: 'Listar guias de recolhimento tributário (DARF, DAM)' })
  @ApiQuery({ name: 'competencia', required: false })
  @ApiQuery({ name: 'status', required: false, enum: StatusGuiaRecolhimento })
  async getTaxGuides(
    @Query('competencia') competencia?: string,
    @Query('status') status?: StatusGuiaRecolhimento,
  ) {
    return this.fiscalService.getTaxGuides(competencia, status);
  }

  @Patch('guias/:id/baixar')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Dar baixa em guia de recolhimento como paga' })
  async baixarGuia(@Param('id') id: string) {
    return this.fiscalService.baixarGuia(id);
  }

  @Get('sped/historico')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Histórico de arquivos SPED e EFD-Reinf gerados' })
  @ApiQuery({ name: 'competencia', required: false })
  async getSpedHistory(@Query('competencia') competencia?: string) {
    return this.fiscalService.getSpedHistory(competencia);
  }

  @Post('sped/gerar')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Gerar arquivo SPED oficial (EFD-Reinf ou SPED Contribuições)' })
  async gerarSped(
    @Body('tipo') tipo: TipoSped,
    @Body('competencia') competencia: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.fiscalService.gerarSped(tipo, competencia, user.sub);
  }
}
