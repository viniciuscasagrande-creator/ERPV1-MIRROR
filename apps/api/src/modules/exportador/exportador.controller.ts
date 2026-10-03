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
import { ExportadorService } from './exportador.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario, GenerateExportBatchDto } from '@diskingressos/types';

@ApiTags('Exportadores Contábeis & Integrações Externas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exportador')
export class ExportadorController {
  constructor(private readonly exportadorService: ExportadorService) {}

  @Get('batches')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar lotes gerados de exportação contábil' })
  async getBatches(@Query('sistemaDestino') sistemaDestino?: string) {
    return this.exportadorService.findAll(sistemaDestino);
  }

  @Post('gerar')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.CONTABILIDADE, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Gerar novo lote de integração contábil externa' })
  async generateBatch(@Body() body: GenerateExportBatchDto, @Req() req: any) {
    const userNome = req.user?.nome || 'Usuário Contábil';
    return this.exportadorService.generate(body, userNome);
  }

  @Get('batches/:id')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Obter detalhes e prévia de um lote de exportação' })
  async getBatchById(@Param('id') id: string) {
    return this.exportadorService.findOne(id);
  }

  @Get('batches/:id/download')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Baixar arquivo de integração gerado (.txt / .csv)' })
  async downloadBatch(@Param('id') id: string, @Res() res: Response) {
    const batch = await this.exportadorService.findOne(id);
    const contentType = batch.nomeArquivo.endsWith('.csv') ? 'text/csv; charset=utf-8' : 'text/plain; charset=utf-8';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${batch.nomeArquivo}"`);
    return res.send(batch.conteudoArquivo);
  }
}
