import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario, ErpSystemSettings } from '@diskingressos/types';

@ApiTags('Configurações & Parâmetros Globais do ERP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Obter parâmetros e configurações fiscais/contábeis do ERP' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles(PerfilUsuario.ADMIN)
  @ApiOperation({ summary: 'Atualizar parâmetros e configurações do ERP' })
  async updateSettings(@Body() body: Partial<ErpSystemSettings>) {
    return this.settingsService.updateSettings(body);
  }
}
