import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SponsorshipBarterService } from './sponsorship-barter.service';
import type {
  SponsorshipNamingAgreementDto,
  BarterTradeExchangeRecordDto,
  SponsorshipRevenueAmortizationDto,
  SponsorshipDashboardKpisDto,
  RegistrarBarterRequestDto,
  RegistrarBarterResponseDto,
} from '@diskingressos/types';

@ApiTags('Fase 48 - Patrocínios, Naming Rights & Barter IFRS 15')
@Controller('api/v1/sponsorship-barter')
export class SponsorshipBarterController {
  constructor(private readonly service: SponsorshipBarterService) {}

  @Get('agreements')
  @ApiOperation({ summary: 'Listar acordos de patrocínio corporativo e naming rights' })
  async getAgreements(): Promise<SponsorshipNamingAgreementDto[]> {
    return this.service.getAgreements();
  }

  @Get('barters')
  @ApiOperation({ summary: 'Listar operações de permuta comercial (Barter Trade)' })
  async getBarters(): Promise<BarterTradeExchangeRecordDto[]> {
    return this.service.getBarters();
  }

  @Get('amortizations')
  @ApiOperation({ summary: 'Obter amortizações contábeis de receita diferida de patrocínio' })
  async getAmortizations(): Promise<SponsorshipRevenueAmortizationDto[]> {
    return this.service.getAmortizations();
  }

  @Post('barter')
  @ApiOperation({ summary: 'Registrar operação de permuta comercial com notas fiscais' })
  async registrarBarter(@Body() dto: RegistrarBarterRequestDto): Promise<RegistrarBarterResponseDto> {
    return this.service.registrarBarter(dto);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs do dashboard de patrocínios e permutas' })
  async getKpis(): Promise<SponsorshipDashboardKpisDto> {
    return this.service.getKpis();
  }
}
