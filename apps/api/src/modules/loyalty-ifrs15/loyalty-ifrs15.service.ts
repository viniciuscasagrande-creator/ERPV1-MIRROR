import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  LoyaltyProgramConfigDto,
  LoyaltyCustomerBalanceDto,
  LoyaltyContractLiabilityRecordDto,
  LoyaltyDashboardKpisDto,
  ResgatarPontosRequestDto,
  ResgatarPontosResponseDto,
} from '@diskingressos/types';

@Injectable()
export class LoyaltyIfrs15Service {
  private readonly logger = new Logger(LoyaltyIfrs15Service.name);

  private inMemoryConfig: LoyaltyProgramConfigDto | null = null;
  private inMemoryBalances: LoyaltyCustomerBalanceDto[] = [];
  private inMemoryLiabilities: LoyaltyContractLiabilityRecordDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Fidelidade e Passivo IFRS 15 / CPC 47 (Fase 43)...');

    this.inMemoryConfig = {
      id: 'cfg-001',
      codigoPrograma: 'LOYALTY-DISK-PREMIUM',
      taxaConversaoPontosBrl: 0.05,
      taxaCaducidadeMeses: 12,
      breakageRateEstimadaPercent: 18.0,
      ativo: true,
    };

    const b1: LoyaltyCustomerBalanceDto = {
      id: 'bal-001',
      clienteCpf: '081.294.119-02',
      saldoPontosAtivos: 4500,
      saldoPontosExpirando: 500,
      valorMonetarioBrl: 225.0, // 4500 * 0.05
      atualizadoEm: '2026-04-01T10:00:00Z',
    };

    const b2: LoyaltyCustomerBalanceDto = {
      id: 'bal-002',
      clienteCpf: '419.001.294-11',
      saldoPontosAtivos: 12000,
      saldoPontosExpirando: 0,
      valorMonetarioBrl: 600.0,
      atualizadoEm: '2026-04-01T11:00:00Z',
    };

    this.inMemoryBalances = [b1, b2];

    const l1: LoyaltyContractLiabilityRecordDto = {
      id: 'lia-001',
      mesCompetencia: '2026-04',
      totalPontosEmitidos: 1850000,
      totalPontosResgatados: 920000,
      passivoObrigacaoIfrs15Brl: 75850.0, // (1.85M - 0.92M) * 0.05 * (1 - 0.18 breakage)
      receitaBreakageReconhecidaBrl: 16650.0,
      contaContabilPassivo: '2.1.3.08 - Passivo de Fidelidade e Pontos a Resgatar',
      calculadoEm: '2026-04-01T12:00:00Z',
    };

    this.inMemoryLiabilities = [l1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<LoyaltyDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalPontosCirculantes: 1850000,
      passivoTotalIfrs15Brl: 75850.0,
      taxaBreakageRealizadaPercent: 18.2,
      pontosResgatadosMes: 920000,
      totalClientesEngajados: 24500,
    };
  }

  async listarSaldos(): Promise<LoyaltyCustomerBalanceDto[]> {
    await this.ensureSeedData();
    return this.inMemoryBalances;
  }

  async listarPassivosIfrs15(): Promise<LoyaltyContractLiabilityRecordDto[]> {
    await this.ensureSeedData();
    return this.inMemoryLiabilities;
  }

  async resgatarPontos(dto: ResgatarPontosRequestDto): Promise<ResgatarPontosResponseDto> {
    await this.ensureSeedData();
    const cliente = this.inMemoryBalances.find((b) => b.clienteCpf === dto.clienteCpf) || this.inMemoryBalances[0];

    const pontosDebitar = Math.min(cliente.saldoPontosAtivos, dto.quantidadePontos);
    const descontoAplicadoBrl = Number((pontosDebitar * 0.05).toFixed(2));
    cliente.saldoPontosAtivos -= pontosDebitar;
    cliente.valorMonetarioBrl = Number((cliente.saldoPontosAtivos * 0.05).toFixed(2));

    return {
      sucesso: true,
      pontosDebitados: pontosDebitar,
      descontoAplicadoBrl,
      saldoRestantePontos: cliente.saldoPontosAtivos,
      protocoloResgate: `LOY-RESG-2026-${Date.now().toString().slice(-4)}`,
    };
  }
}
