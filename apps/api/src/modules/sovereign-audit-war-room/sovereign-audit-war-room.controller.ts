import { Controller, Get, Post, Body } from '@nestjs/common';
import { SovereignAuditWarRoomService } from './sovereign-audit-war-room.service';
import type { DispararAuditoriaKernelRequestDto } from '@diskingressos/types';

@Controller('sovereign-audit-war-room')
export class SovereignAuditWarRoomController {
  constructor(private readonly service: SovereignAuditWarRoomService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('kernel-cycles')
  async listarCiclosKernel() {
    return this.service.listarCiclosKernel();
  }

  @Get('compliance-dossiers')
  async listarDossies() {
    return this.service.listarDossies();
  }

  @Post('audit')
  async dispararAuditoriaKernel(@Body() dto: DispararAuditoriaKernelRequestDto) {
    return this.service.dispararAuditoriaKernel(dto);
  }
}
