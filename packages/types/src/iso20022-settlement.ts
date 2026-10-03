/**
 * Tipos e Interfaces da Fase 39: Liquidação Interbancária Contínua SPI / STR & Mensageria ISO 20022
 */

export enum TipoMensagemIso20022 {
  PACS_008 = 'pacs.008.001.08', // Transferência de Crédito Interbancária de Clientes
  PACS_004 = 'pacs.004.001.09', // Devolução de Pagamento Interbancária
  PACS_002 = 'pacs.002.001.10', // Relatório de Status de Pagamento
  CAMT_053 = 'camt.053.001.08', // Extrato Eletrônico de Liquidação de Contas (STR/SPI)
  CAMT_054 = 'camt.054.001.08', // Notificação de Débito/Crédito
}

export enum DirecaoMensagemIso {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export interface Iso20022MessageLogDto {
  id: string;
  messageId: string;
  messageType: TipoMensagemIso20022;
  direction: DirecaoMensagemIso;
  senderIspb: string;
  receiverIspb: string;
  xmlPayload: string;
  statusProcessamento: string;
  latenciaMs: number;
  timestampMensagem: string;
}

export interface InterbankSettlementRecordDto {
  id: string;
  codigoLiquidacao: string;
  canalLiquidacao: 'SPI_BACEN' | 'STR_LBTR';
  valorLiquidadoBrl: number;
  statusFinal: string;
  dataLiquidacao: string;
}

export interface RsfnNetworkAuditTrailDto {
  id: string;
  sessaoRsfn: string;
  certificadoTlsThumbprint: string;
  conectividadeStatus: 'ONLINE_OPERACIONAL' | 'DEGRADADO' | 'STANDBY';
}

export interface Iso20022DashboardKpisDto {
  mensagensIsoProcessadasHoje: number;
  latenciaMediaSpiMs: number;
  volumeLiquidadoInterbancarioBrl: number;
  taxaRejeicaoMensageriaPercent: number;
  statusRedeRsfn: string;
}

export interface DespacharMensagemIsoRequestDto {
  tipoMensagem: TipoMensagemIso20022;
  ispbDestinatario: string;
  valorBrl: number;
  chavePixOuIban: string;
  identificadorInstrucao: string;
}

export interface DespacharMensagemIsoResponseDto {
  sucesso: boolean;
  messageId: string;
  protocoloBacen: string;
  latenciaMs: number;
  statusRetorno: string;
}
