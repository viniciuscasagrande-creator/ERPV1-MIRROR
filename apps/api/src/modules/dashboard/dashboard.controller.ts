import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PerfilUsuario, JwtPayload } from '@diskingressos/types';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Obter indicadores executivos reais calculados no banco' })
  @ApiQuery({ name: 'producerId', required: false })
  async getKpis(
    @CurrentUser() user: JwtPayload,
    @Query('producerId') producerId?: string,
  ) {
    const effectiveProducerId = user.roles.includes(PerfilUsuario.PRODUTOR)
      ? user.producerId || 'none'
      : producerId;

    return this.dashboardService.getKpis(effectiveProducerId);
  }
}
