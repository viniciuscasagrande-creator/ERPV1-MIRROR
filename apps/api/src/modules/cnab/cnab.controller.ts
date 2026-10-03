import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CnabService } from './cnab.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  PerfilUsuario,
  JwtPayload,
  GenerateCnabRemessaDto,
  ProcessCnabRetornoDto,
} from '@diskingressos/types';

@ApiTags('CNAB 240 — Automação Bancária FEBRABAN')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cnab')
export class CnabController {
  constructor(private readonly cnabService: CnabService) {}

  @Get('batches')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar lotes históricos de remessa e retorno CNAB 240' })
  async findAll() {
    return this.cnabService.findAll();
  }

  @Post('gerar-remessa')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Gerar arquivo de remessa CNAB 240 (Itaú / Bradesco) para repasses em lote' })
  async gerarRemessa(@Body() dto: GenerateCnabRemessaDto, @CurrentUser() user: JwtPayload) {
    return this.cnabService.gerarRemessa(dto, user.nome);
  }

  @Post('processar-retorno')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Processar arquivo de retorno CNAB 240 e efetuar conciliação e liquidação automática' })
  async processarRetorno(@Body() dto: ProcessCnabRetornoDto) {
    return this.cnabService.processarRetorno(dto);
  }
}
