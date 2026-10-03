import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  TipoEquipamentoPos,
  StatusTurnoCaixa,
} from '@diskingressos/types';
import type {
  PhysicalPosTerminalDto,
  CashierSessionShiftDto,
  PosCashBleedReconciliationDto,
  PosDashboardKpisDto,
  FecharTurnoRequestDto,
  FecharTurnoResponseDto,
} from '@diskingressos/types';

@Injectable()
export class PosCashierService {
  private readonly logger = new Logger(PosCashierService.name);

  private inMemoryTerminais: PhysicalPosTerminalDto[] = [];
  private inMemoryTurnos: CashierSessionShiftDto[] = [];
  private inMemorySangrias: PosCashBleedReconciliationDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Gestão de PDVs Físicos e Totens (Fase 44)...');

    const t1: PhysicalPosTerminalDto = {
      id: 'term-001',
      codigoTerminalPos: 'POS-CURITIBA-TOTEM-01',
      localizacaoPontoVenda: 'Teatro Positivo - Foyer Principal',
      tipoEquipamento: TipoEquipamentoPos.TOTEM_AUTOATENDIMENTO,
      numeroSerieHardware: 'GERTEC-TOTEM-2026-9912',
      statusTerminal: 'OPERACIONAL_ONLINE',
      ultimoHeartbeat: '2026-04-01T17:00:00Z',
    };

    const t2: PhysicalPosTerminalDto = {
      id: 'term-002',
      codigoTerminalPos: 'POS-MUELLER-BALCAO-02',
      localizacaoPontoVenda: 'Shopping Mueller Curitiba - Loja DiskIngressos',
      tipoEquipamento: TipoEquipamentoPos.BALCAO_TEF_DEDICADO,
      numeroSerieHardware: 'INGENICO-ICT250-2026-8812',
      statusTerminal: 'OPERACIONAL_ONLINE',
      ultimoHeartbeat: '2026-04-01T17:01:00Z',
    };

    this.inMemoryTerminais = [t1, t2];

    const sh1: CashierSessionShiftDto = {
      id: 'shift-001',
      terminalId: 'term-002',
      operadorNome: 'Fernanda Caroline Dias',
      aberturaTimestamp: '2026-04-01T10:00:00Z',
      fundoCaixaInicialBrl: 500.0,
      totalVendasEspecieBrl: 4850.0,
      totalVendasTefCartaoBrl: 22400.0,
      totalVendasPixQrcodeBrl: 11200.0,
      statusTurno: StatusTurnoCaixa.TURNO_ABERTO,
    };

    this.inMemoryTurnos = [sh1];

    const s1: PosCashBleedReconciliationDto = {
      id: 'bld-001',
      shiftId: 'shift-001',
      codigoSangria: 'SANG-2026-04-001',
      valorSangriaEspecieBrl: 4500.0,
      envelopeLacradoNumero: 'ENV-LACRE-88219',
      transportadoraValores: 'Brinks Transporte de Valores S.A.',
      statusConciliacao: 'CONCILIADO_DEPOSITO_CONFIRMADO',
      dataSangria: '2026-04-01T16:00:00Z',
    };

    this.inMemorySangrias = [s1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<PosDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      terminaisAtivosOnline: 28,
      volumeTotalPdvsHojeBrl: 184500.0,
      sangriasCustodiadasBrl: 48500.0,
      divergenciaCaixasPercent: 0.0,
      turnosAbertosAgora: 14,
    };
  }

  async listarTerminais(): Promise<PhysicalPosTerminalDto[]> {
    await this.ensureSeedData();
    return this.inMemoryTerminais;
  }

  async listarTurnos(): Promise<CashierSessionShiftDto[]> {
    await this.ensureSeedData();
    return this.inMemoryTurnos;
  }

  async listarSangrias(): Promise<PosCashBleedReconciliationDto[]> {
    await this.ensureSeedData();
    return this.inMemorySangrias;
  }

  async fecharTurno(dto: FecharTurnoRequestDto): Promise<FecharTurnoResponseDto> {
    await this.ensureSeedData();
    const turno = this.inMemoryTurnos.find((t) => t.id === dto.shiftId) || this.inMemoryTurnos[0];
    const esperadoEspecie = turno.fundoCaixaInicialBrl + turno.totalVendasEspecieBrl - dto.sangriaRealizadaBrl;
    const diferenca = Number((dto.totalEspecieInformadoBrl - esperadoEspecie).toFixed(2));

    turno.statusTurno = Math.abs(diferenca) < 0.01 ? StatusTurnoCaixa.TURNO_FECHADO_AUDITADO : StatusTurnoCaixa.DIVERGENCIA_CAIXA;
    turno.fechamentoTimestamp = new Date().toISOString();

    return {
      shiftId: turno.id,
      diferencaCaixaBrl: diferenca,
      statusFinal: turno.statusTurno,
      protocoloFechamento: `SHF-CLS-2026-${Date.now().toString().slice(-4)}`,
    };
  }
}
