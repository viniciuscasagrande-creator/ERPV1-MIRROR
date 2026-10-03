import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArtistRoyaltiesService } from './artist-royalties.service';
import type { CalcularWithholdingTaxRequestDto } from '@diskingressos/types';

@Controller('artist-royalties')
export class ArtistRoyaltiesController {
  constructor(private readonly service: ArtistRoyaltiesService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.service.getDashboardKpis();
  }

  @Get('agreements')
  async listarContratos() {
    return this.service.listarContratos();
  }

  @Get('withholdings')
  async listarWithholdings() {
    return this.service.listarWithholdings();
  }

  @Get('remittances')
  async listarRemessas() {
    return this.service.listarRemessas();
  }

  @Post('calculate-withholding')
  async calcularWithholding(@Body() dto: CalcularWithholdingTaxRequestDto) {
    return this.service.calcularWithholding(dto);
  }
}
