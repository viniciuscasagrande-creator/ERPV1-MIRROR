/**
 * Tipos e Interfaces da Fase 43: Fidelidade, Cashback Tokenizado & Passivo IFRS 15 / CPC 47
 */

export interface LoyaltyProgramConfigDto {
  id: string;
  codigoPrograma: string;
  taxaConversaoPontosBrl: number; // 0.05 (1 pt = R$ 0,05)
  taxaCaducidadeMeses: number;
  breakageRateEstimadaPercent: number; // 18%
  ativo: boolean;
}

export interface LoyaltyCustomerBalanceDto {
  id: string;
  clienteCpf: string;
  saldoPontosAtivos: number;
  saldoPontosExpirando: number;
  valorMonetarioBrl: number;
  atualizadoEm: string;
}

export interface LoyaltyContractLiabilityRecordDto {
  id: string;
  mesCompetencia: string;
  totalPontosEmitidos: number;
  totalPontosResgatados: number;
  passivoObrigacaoIfrs15Brl: number;
  receitaBreakageReconhecidaBrl: number;
  contaContabilPassivo: string;
  calculadoEm: string;
}

export interface LoyaltyDashboardKpisDto {
  totalPontosCirculantes: number;
  passivoTotalIfrs15Brl: number;
  taxaBreakageRealizadaPercent: number;
  pontosResgatadosMes: number;
  totalClientesEngajados: number;
}

export interface ResgatarPontosRequestDto {
  clienteCpf: string;
  quantidadePontos: number;
  pedidoId: string;
}

export interface ResgatarPontosResponseDto {
  sucesso: boolean;
  pontosDebitados: number;
  descontoAplicadoBrl: number;
  saldoRestantePontos: number;
  protocoloResgate: string;
}
