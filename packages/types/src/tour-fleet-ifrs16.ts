/**
 * Tipos e Interfaces da Fase 49: Logística de Turnês, Frota & Leasing (CPC 06 R2 / IFRS 16)
 */

export enum TipoVeiculoLogistica {
  VAN_EXECUTIVA = 'VAN_EXECUTIVA',
  ONIBUS_LEITO = 'ONIBUS_LEITO',
  CARRETA_SOM = 'CARRETA_SOM',
  CARRO_VIP_BLINDADO = 'CARRO_VIP_BLINDADO',
}

export interface TourLogisticsVehicleDto {
  id: string;
  placaVeiculo: string;
  tipoVeiculo: TipoVeiculoLogistica;
  identificadorFrota: string;
  motoristaResponsavel: string;
  capacidadePassageirosCarga: string;
  statusOperacional: string;
}

export interface FieldExpenseFleetReportDto {
  id: string;
  veiculoId: string;
  eventoId: string;
  cartaoCombustivelNumero: string;
  litrosAbastecidos: number;
  valorTotalAbastecimentoBrl: number;
  quilometragemOdometro: number;
  pedagioSemPararBrl: number;
  dataDespesa: string;
}

export interface Ifrs16LeaseVehicleContractDto {
  id: string;
  veiculoId: string;
  empresaLocadora: string;
  valorAluguelMensalBrl: number;
  prazoMeses: number;
  taxaDescontoArrendamento: number;
  ativoDireitoDeUsoBrl: number;
  passivoArrendamentoBrl: number;
  dataAssinatura: string;
}

export interface FleetDashboardKpisDto {
  veiculosOperacionaisAtivos: number;
  despesaTotalCombustivelMesBrl: number;
  despesaTotalPedagiosBrl: number;
  ativoDireitoDeUsoTotalBrl: number;
  passivoArrendamentoIfrs16Brl: number;
}

export interface LancarDespesaCombustivelRequestDto {
  veiculoId: string;
  eventoId: string;
  cartaoCombustivelNumero: string;
  litrosAbastecidos: number;
  valorTotalAbastecimentoBrl: number;
  quilometragemOdometro: number;
  pedagioSemPararBrl?: number;
}

export interface LancarDespesaCombustivelResponseDto {
  sucesso: boolean;
  relatorioDespesaId: string;
  custoKmRodadoBrl: number;
  statusIntegracaoContabil: string;
}
