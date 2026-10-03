import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CashlessInventoryService } from './cashless-inventory.service';
import type {
  CashlessRfidWristbandDto,
  EventFoodBeverageSaleDto,
  SpedInventoryBlockKRecordDto,
  CashlessDashboardKpisDto,
  RecarregarPulseiraRequestDto,
  RecarregarPulseiraResponseDto,
} from '@diskingressos/types';

@ApiTags('Fase 46 - Cashless RFID, A&B e SPED Bloco K')
@Controller('api/v1/cashless-inventory')
export class CashlessInventoryController {
  constructor(private readonly service: CashlessInventoryService) {}

  @Get('wristbands')
  @ApiOperation({ summary: 'Listar pulseiras cashless RFID/NFC emitidas' })
  async getWristbands(): Promise<CashlessRfidWristbandDto[]> {
    return this.service.getWristbands();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Listar transações de consumo de alimentos e bebidas nos bares' })
  async getSales(): Promise<EventFoodBeverageSaleDto[]> {
    return this.service.getSales();
  }

  @Get('sped-block-k')
  @ApiOperation({ summary: 'Obter registros de inventário SPED Fiscal Bloco K' })
  async getSpedBlockKRecords(): Promise<SpedInventoryBlockKRecordDto[]> {
    return this.service.getSpedBlockKRecords();
  }

  @Post('recharge')
  @ApiOperation({ summary: 'Efetuar recarga de crédito em pulseira RFID' })
  async recarregarPulseira(@Body() dto: RecarregarPulseiraRequestDto): Promise<RecarregarPulseiraResponseDto> {
    return this.service.recarregarPulseira(dto);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs do dashboard de Cashless A&B e Estoque' })
  async getKpis(): Promise<CashlessDashboardKpisDto> {
    return this.service.getKpis();
  }
}
