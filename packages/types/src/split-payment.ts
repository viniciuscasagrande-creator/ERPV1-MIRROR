/**
 * Tipos e Interfaces da Fase 18: Split de Pagamento Nativo em Gateway & Adquirentes
 * Segregação Primária de Receita no Checkout (LC 116/03 & IN RFB 2.179 / COSIT 23/14)
 */

export enum GatewayProvider {
  CIELO = 'CIELO',
  PAGARME_STONE = 'PAGARME_STONE',
  EREDE = 'EREDE',
  PAGBANK = 'PAGBANK',
  ASAAS = 'ASAAS',
}

export enum StatusSubaccountKyc {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
}

export enum StatusSplitTransaction {
  PROCESSADO = 'PROCESSADO',
  RETIDO_ESCROW = 'RETIDO_ESCROW',
  LIQUIDADO = 'LIQUIDADO',
  ESTORNADO = 'ESTORNADO',
  CONTESTADO_CHARGEBACK = 'CONTESTADO_CHARGEBACK',
}

export enum TipoRegraSplit {
  PERCENTUAL = 'PERCENTUAL',
  VALOR_FIXO_MAIS_PERCENTUAL = 'VALOR_FIXO_MAIS_PERCENTUAL',
}

export interface GatewaySubaccountDto {
  id: string;
  producerId: string;
  producerNome: string;
  gateway: GatewayProvider;
  recipientId: string;
  statusKyc: StatusSubaccountKyc;
  documentoFiscal: string;
  razaoSocial: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoChavePix?: string | null;
  chavePix?: string | null;
  transferenciaAutomatica: boolean;
  periodicidadeLiquidacao: string;
  motivoReprovacaoKyc?: string | null;
  homologadoEm?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GatewaySplitConfigDto {
  id: string;
  eventId: string;
  eventNome: string;
  producerId: string;
  subaccountId: string;
  subaccount?: GatewaySubaccountDto;
  gateway: GatewayProvider;
  tipoDivisao: TipoRegraSplit;
  comissaoDiskPercent: number; // Ex: 12.00%
  taxaServicoFixa: number; // Ex: R$ 5.00
  produtorMdrAbsorvido: boolean; // Se true, o produtor arca com o MDR; se false, a Disk
  produtorChargebackResponsavel: boolean;
  status: string;
  criadoPor: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSplitTransactionDto {
  id: string;
  codigoTransacao: string;
  transacaoIdExterna: string;
  paymentId?: string | null;
  saleId?: string | null;
  eventId: string;
  eventNome: string;
  subaccountId: string;
  subaccount?: GatewaySubaccountDto;
  gateway: GatewayProvider;
  metodoPagamento: string;
  valorTotalBruto: number;
  valorProdutor: number;
  valorDiskIngressos: number;
  valorMdrTotal: number;
  mdrProdutor: number;
  mdrDiskIngressos: number;
  status: StatusSplitTransaction;
  estornadoEm?: string | null;
  motivoEstorno?: string | null;
  liquidadoEm?: string | null;
  createdAt: string;
}

export interface SimularSplitRequestDto {
  eventId: string;
  valorIngresso: number;
  taxaServico?: number;
  quantidade?: number;
  metodoPagamento?: string; // PIX, CARTAO_CREDITO_1X, CARTAO_CREDITO_6X
  taxaMdrPercent?: number; // padrão 2.80%
  gateway?: GatewayProvider;
}

export interface SimularSplitResponseDto {
  valorTotalTransacao: number;
  fatiaProdutorBruta: number;
  fatiaDiskBruta: number;
  taxaMdrTotal: number;
  mdrAbsorvidoProdutor: number;
  mdrAbsorvidoDisk: number;
  valorLiquidoProdutor: number;
  valorLiquidoDisk: number;
  produtorMdrAbsorvido: boolean;
  percentualEfetivoDisk: number;
  isKycAprovado: boolean;
}

export interface ConfigurarSplitEventoDto {
  eventId: string;
  eventNome: string;
  producerId: string;
  subaccountId: string;
  gateway?: GatewayProvider;
  tipoDivisao?: TipoRegraSplit;
  comissaoDiskPercent: number;
  taxaServicoFixa?: number;
  produtorMdrAbsorvido?: boolean;
  produtorChargebackResponsavel?: boolean;
  criadoPor?: string;
}

export interface CriarSubaccountDto {
  producerId: string;
  producerNome: string;
  gateway: GatewayProvider;
  documentoFiscal: string;
  razaoSocial: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoChavePix?: string;
  chavePix?: string;
  transferenciaAutomatica?: boolean;
  periodicidadeLiquidacao?: string;
}

export interface ExecutarEstornoSplitDto {
  motivoEstorno: string;
  solicitadoPor: string;
  valorEstornoParcial?: number;
}

export interface SplitPaymentKpisDto {
  volumeTotalTransacionadoSplit: number;
  receitaPropriaRetidaDisk: number;
  volumeLiquidadoProdutores: number;
  totalMdrAdquirentes: number;
  subcontasHomologadas: number;
  totalTransacoesProcessadas: number;
  taxaMediaComissao: number;
  indiceEstornosSplit: number;
}
