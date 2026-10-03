import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TourFleetService } from './tour-fleet.service';
import type {
  TourLogisticsVehicleDto,
  FieldExpenseFleetReportDto,
  Ifrs16LeaseVehicleContractDto,
  FleetDashboardKpisDto,
  LancarDespesaCombustivelRequestDto,
  LancarDespesaCombustivelResponseDto,
} from '@diskingressos/types';

@ApiTags('Fase 49 - Logística de Turnês, Frota & Leasing IFRS 16')
@Controller('api/v1/tour-fleet')
export class TourFleetController {
  constructor(private readonly service: TourFleetService) {}

  @Get('vehicles')
  @ApiOperation({ summary: 'Listar frota de veículos operacionais de turnês e transfers' })
  async getVehicles(): Promise<TourLogisticsVehicleDto[]> {
    return this.service.getVehicles();
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Listar relatórios de despesas de combustível e pedágios em campo' })
  async getExpenses(): Promise<FieldExpenseFleetReportDto[]> {
    return this.service.getExpenses();
  }

  @Get('leases')
  @ApiOperation({ summary: 'Listar contratos de locação e arrendamento mercantil IFRS 16' })
  async getLeaseContracts(): Promise<Ifrs16LeaseVehicleContractDto[]> {
    return this.service.getLeaseContracts();
  }

  @Post('expense')
  @ApiOperation({ summary: 'Lançar abastecimento com cartão corporativo ou pedágio' })
  async lancarDespesaCombustivel(@Body() dto: LancarDespesaCombustivelRequestDto): Promise<LancarDespesaCombustivelResponseDto> {
    return this.service.lancarDespesaCombustivel(dto);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs do dashboard de frota e contratos IFRS 16' })
  async getKpis(): Promise<FleetDashboardKpisDto> {
    return this.service.getKpis();
  }
}
