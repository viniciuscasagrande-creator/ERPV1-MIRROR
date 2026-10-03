import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DebtRecoveryService } from './debt-recovery.service';
import type {
  ProducerDebtCollectionDto,
  CreditBureauProtestRecordDto,
  Ifrs9ExpectedCreditLossDto,
  DebtRecoveryDashboardKpisDto,
  NegociarDividaRequestDto,
  NegociarDividaResponseDto,
} from '@diskingressos/types';

@ApiTags('Fase 47 - Cobrança Judicial & PECLD IFRS 9')
@Controller('api/v1/debt-recovery')
export class DebtRecoveryController {
  constructor(private readonly service: DebtRecoveryService) {}

  @Get('debts')
  @ApiOperation({ summary: 'Listar títulos de produtores em cobrança extrajudicial/judicial' })
  async getDebts(): Promise<ProducerDebtCollectionDto[]> {
    return this.service.getDebts();
  }

  @Get('protests')
  @ApiOperation({ summary: 'Listar certidões de protesto e negativações nos birôs (Serasa/Boa Vista)' })
  async getProtests(): Promise<CreditBureauProtestRecordDto[]> {
    return this.service.getProtests();
  }

  @Get('ifrs9-losses')
  @ApiOperation({ summary: 'Obter apurações atuariais de PECLD (IFRS 9 / CPC 48)' })
  async getIfrs9Losses(): Promise<Ifrs9ExpectedCreditLossDto[]> {
    return this.service.getIfrs9Losses();
  }

  @Post('negotiate')
  @ApiOperation({ summary: 'Firmar acordo de renegociação/parcelamento de dívida' })
  async negociarDivida(@Body() dto: NegociarDividaRequestDto): Promise<NegociarDividaResponseDto> {
    return this.service.negociarDivida(dto);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs do dashboard de recuperação de crédito e provisão PECLD' })
  async getKpis(): Promise<DebtRecoveryDashboardKpisDto> {
    return this.service.getKpis();
  }
}
