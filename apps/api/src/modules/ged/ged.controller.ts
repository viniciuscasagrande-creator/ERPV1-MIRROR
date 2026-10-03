import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GedService } from './ged.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload, CreateDocumentDto } from '@diskingressos/types';

@ApiTags('Documentos & GED Contábil')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class GedController {
  constructor(private readonly gedService: GedService) {}

  @Get()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.OPERACIONAL
  )
  @ApiOperation({ summary: 'Listar documentos eletrônicos do repositório GED' })
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('referenciaTipo') referenciaTipo?: string,
    @Query('referenciaId') referenciaId?: string,
    @Query('search') search?: string
  ) {
    return this.gedService.findAll({ categoria, referenciaTipo, referenciaId, search });
  }

  @Post()
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE
  )
  @ApiOperation({ summary: 'Fazer upload / cadastrar documento eletrônico com hash SHA-256' })
  async create(@Body() dto: CreateDocumentDto, @CurrentUser() user: JwtPayload) {
    return this.gedService.create(dto, user.nome);
  }

  @Delete(':id')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Excluir documento do GED' })
  async delete(@Param('id') id: string) {
    await this.gedService.delete(id);
    return { success: true, message: 'Documento excluído com sucesso.' };
  }
}
