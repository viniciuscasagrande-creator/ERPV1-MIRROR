import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TipoVeiculoLogistica } from '@diskingressos/types';
import type {
  TourLogisticsVehicleDto,
  FieldExpenseFleetReportDto,
  Ifrs16LeaseVehicleContractDto,
  FleetDashboardKpisDto,
  LancarDespesaCombustivelRequestDto,
  LancarDespesaCombustivelResponseDto,
} from '@diskingressos/types';

@Injectable()
export class TourFleetService {
  private readonly logger = new Logger(TourFleetService.name);

  private inMemoryVehicles: TourLogisticsVehicleDto[] = [
    {
      id: 'veh-001',
      placaVeiculo: 'BRA-2E19',
      tipoVeiculo: TipoVeiculoLogistica.VAN_EXECUTIVA,
      identificadorFrota: 'VAN-TRANSFER-01',
      motoristaResponsavel: 'José Ribamar Silva',
      capacidadePassageirosCarga: '15 passageiros',
      statusOperacional: 'EM_ROTA_EVENTO',
    },
    {
      id: 'veh-002',
      placaVeiculo: 'PRC-9941',
      tipoVeiculo: TipoVeiculoLogistica.CARRETA_SOM,
      identificadorFrota: 'CARRETA-RIDER-SP',
      motoristaResponsavel: 'Antônio Fagundes Filho',
      capacidadePassageirosCarga: '28 toneladas de som/luz',
      statusOperacional: 'DISPONIVEL',
    },
  ];

  private inMemoryExpenses: FieldExpenseFleetReportDto[] = [
    {
      id: 'exp-001',
      veiculoId: 'veh-001',
      eventoId: 'evt-rock-fest-2026',
      cartaoCombustivelNumero: 'TICKET-LOG-991204',
      litrosAbastecidos: 75.0,
      valorTotalAbastecimentoBrl: 450.0,
      quilometragemOdometro: 48500,
      pedagioSemPararBrl: 85.0,
      dataDespesa: '2026-03-28T14:00:00Z',
    },
  ];

  private inMemoryLeases: Ifrs16LeaseVehicleContractDto[] = [
    {
      id: 'lse-001',
      veiculoId: 'veh-001',
      empresaLocadora: 'Localiza Fleet S.A.',
      valorAluguelMensalBrl: 4800.0,
      prazoMeses: 24,
      taxaDescontoArrendamento: 11.5,
      ativoDireitoDeUsoBrl: 102500.0,
      passivoArrendamentoBrl: 102500.0,
      dataAssinatura: '2026-01-10T10:00:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getVehicles(): Promise<TourLogisticsVehicleDto[]> {
    try {
      const records = await this.prisma.tourLogisticsVehicle.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          placaVeiculo: r.placaVeiculo,
          tipoVeiculo: r.tipoVeiculo as TipoVeiculoLogistica,
          identificadorFrota: r.identificadorFrota,
          motoristaResponsavel: r.motoristaResponsavel,
          capacidadePassageirosCarga: r.capacidadePassageirosCarga,
          statusOperacional: r.statusOperacional,
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory vehicles');
    }
    return this.inMemoryVehicles;
  }

  async getExpenses(): Promise<FieldExpenseFleetReportDto[]> {
    try {
      const records = await this.prisma.fieldExpenseFleetReport.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          veiculoId: r.veiculoId,
          eventoId: r.eventoId,
          cartaoCombustivelNumero: r.cartaoCombustivelNumero,
          litrosAbastecidos: Number(r.litrosAbastecidos),
          valorTotalAbastecimentoBrl: Number(r.valorTotalAbastecimentoBrl),
          quilometragemOdometro: r.quilometragemOdometro,
          pedagioSemPararBrl: Number(r.pedagioSemPararBrl),
          dataDespesa: r.dataDespesa.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory expenses');
    }
    return this.inMemoryExpenses;
  }

  async getLeaseContracts(): Promise<Ifrs16LeaseVehicleContractDto[]> {
    try {
      const records = await this.prisma.ifrs16LeaseVehicleContract.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          veiculoId: r.veiculoId,
          empresaLocadora: r.empresaLocadora,
          valorAluguelMensalBrl: Number(r.valorAluguelMensalBrl),
          prazoMeses: r.prazoMeses,
          taxaDescontoArrendamento: Number(r.taxaDescontoArrendamento),
          ativoDireitoDeUsoBrl: Number(r.ativoDireitoDeUsoBrl),
          passivoArrendamentoBrl: Number(r.passivoArrendamentoBrl),
          dataAssinatura: r.dataAssinatura.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory lease contracts');
    }
    return this.inMemoryLeases;
  }

  async lancarDespesaCombustivel(dto: LancarDespesaCombustivelRequestDto): Promise<LancarDespesaCombustivelResponseDto> {
    const novaDespesa: FieldExpenseFleetReportDto = {
      id: `exp-${Date.now()}`,
      veiculoId: dto.veiculoId,
      eventoId: dto.eventoId,
      cartaoCombustivelNumero: dto.cartaoCombustivelNumero,
      litrosAbastecidos: dto.litrosAbastecidos,
      valorTotalAbastecimentoBrl: dto.valorTotalAbastecimentoBrl,
      quilometragemOdometro: dto.quilometragemOdometro,
      pedagioSemPararBrl: dto.pedagioSemPararBrl ?? 0,
      dataDespesa: new Date().toISOString(),
    };

    this.inMemoryExpenses.push(novaDespesa);

    return {
      sucesso: true,
      relatorioDespesaId: novaDespesa.id,
      custoKmRodadoBrl: Number((dto.valorTotalAbastecimentoBrl / (dto.litrosAbastecidos * 3.5)).toFixed(2)),
      statusIntegracaoContabil: 'CONTABILIZADO_DRE_EVENTO',
    };
  }

  async getKpis(): Promise<FleetDashboardKpisDto> {
    return {
      veiculosOperacionaisAtivos: this.inMemoryVehicles.length,
      despesaTotalCombustivelMesBrl: 18450.0,
      despesaTotalPedagiosBrl: 4200.0,
      ativoDireitoDeUsoTotalBrl: 102500.0,
      passivoArrendamentoIfrs16Brl: 102500.0,
    };
  }
}
