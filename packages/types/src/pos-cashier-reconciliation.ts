/**
 * Tipos e Interfaces da Fase 44: Gestão Contábil de PDVs Físicos, Totens & Sangria de Caixa
 */

export enum TipoEquipamentoPos {
  TOTEM_AUTOATENDIMENTO = 'TOTEM_AUTOATENDIMENTO',
  MAQUININHA_SMART_POS = 'MAQUININHA_SMART_POS',
  BALCAO_TEF_DEDICADO = 'BALCAO_TEF_DEDICADO',
}

export enum StatusTurnoCaixa {
  TURNO_ABERTO = 'TURNO_ABERTO',
  TURNO_FECHADO_AUDITADO = 'TURNO_FECHADO_AUDITADO',
  DIVERGENCIA_CAIXA = 'DIVERGENCIA_CAIXA',
}

export interface PhysicalPosTerminalDto {
  id: string;
  codigoTerminalPos: string;
  localizacaoPontoVenda: string;
  tipoEquipamento: TipoEquipamentoPos;
  numeroSerieHardware: string;
  statusTerminal: string;
  ultimoHeartbeat: string;
}

export interface CashierSessionShiftDto {
  id: string;
  terminalId: string;
  operadorNome: string;
  aberturaTimestamp: string;
  fechamentoTimestamp?: string;
  fundoCaixaInicialBrl: number;
  totalVendasEspecieBrl: number;
  totalVendasTefCartaoBrl: number;
  totalVendasPixQrcodeBrl: number;
  statusTurno: StatusTurnoCaixa;
}

export interface PosCashBleedReconciliationDto {
  id: string;
  shiftId: string;
  codigoSangria: string;
  valorSangriaEspecieBrl: number;
  envelopeLacradoNumero: string;
  transportadoraValores: string;
  statusConciliacao: string;
  dataSangria: string;
}

export interface PosDashboardKpisDto {
  terminaisAtivosOnline: number;
  volumeTotalPdvsHojeBrl: number;
  sangriasCustodiadasBrl: number;
  divergenciaCaixasPercent: number;
  turnosAbertosAgora: number;
}

export interface FecharTurnoRequestDto {
  shiftId: string;
  totalEspecieInformadoBrl: number;
  sangriaRealizadaBrl: number;
  envelopeNumero: string;
}

export interface FecharTurnoResponseDto {
  shiftId: string;
  diferencaCaixaBrl: number;
  statusFinal: StatusTurnoCaixa;
  protocoloFechamento: string;
}
