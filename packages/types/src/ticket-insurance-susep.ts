/**
 * Tipos e Interfaces da Fase 45: Central de Seguros de Ingressos & Sinistros SUSEP Circular 621/2021
 */

export interface TicketInsurancePolicyDto {
  id: string;
  numeroApoliceSusep: string;
  pedidoId: string;
  seguradoNome: string;
  seguradoCpf: string;
  seguradoraParceira: string; // Chubb, Porto Seguro, Zurich
  valorPremioTotalBrl: number;
  comissaoCorretagemBrl: number;
  premioLiquidoCiaBrl: number;
  statusApolice: string;
  emitidaEm: string;
}

export interface InsuranceClaimRecordDto {
  id: string;
  codigoSinistro: string;
  apoliceId: string;
  motivoSinistro: string; // EMERGENCIA_MEDICA, CANCELAMENTO_TRANSPORTE
  valorIndenizacaoBrl: number;
  statusSinistro: string;
  dataAprovacao: string;
}

export interface SusepBrokerageCommissionDto {
  id: string;
  codigoLoteComissao: string;
  mesCompetencia: string;
  totalApolicesEmitidas: number;
  volumePremiosBrl: number;
  receitaComissaoBrl: number;
  contaReceitaContabil: string;
  apuradoEm: string;
}

export interface InsuranceDashboardKpisDto {
  totalApolicesVigentes: number;
  volumePremiosEmitidosBrl: number;
  receitaCorretagemBrl: number;
  taxaSinistralidadePercent: number;
  sinistrosLiquidadosMes: number;
}

export interface EmitirApoliceRequestDto {
  pedidoId: string;
  seguradoNome: string;
  seguradoCpf: string;
  valorIngressoBrl: number;
  seguradoraParceira: string;
}

export interface EmitirApoliceResponseDto {
  sucesso: boolean;
  numeroApoliceSusep: string;
  valorPremioTotalBrl: number;
  comissaoCorretagemBrl: number;
  premioLiquidoCiaBrl: number;
  protocoloHomologacaoSusep: string;
}
