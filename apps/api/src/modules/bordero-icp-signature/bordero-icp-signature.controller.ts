import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BorderoIcpSignatureService } from './bordero-icp-signature.service';
import type { AssinarBorderoRequestDto } from '@diskingressos/types';

@Controller('bordero-icp-signature')
export class BorderoIcpSignatureController {
  constructor(private readonly service: BorderoIcpSignatureService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('seals')
  async listarBorderos() {
    return this.service.listarBorderos();
  }

  @Get('audit-trails')
  async listarTrilhasAuditoria(@Query('borderoId') borderoId?: string) {
    return this.service.listarTrilhasAuditoria(borderoId);
  }

  @Post('sign')
  async assinarBordero(@Body() dto: AssinarBorderoRequestDto) {
    return this.service.assinarBordero(dto);
  }
}
