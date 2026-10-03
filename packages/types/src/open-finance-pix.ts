/**
 * Tipos e Interfaces da Fase 21: Tesouraria Descentralizada, Open Finance Brasil (ITP) & Pix Cobrança
 * Iniciação de Pagamentos (Resolução BCB nº 109/2021) & Pix Dinâmico SPI com Split Automático
 */

export enum InstituicaoOpenFinance {
  ITAU = 'ITAU',
  BRADESCO = 'BRADESCO',
  BANCO_DO_BRASIL = 'BANCO_DO_BRASIL',
  SANTANDER = 'SANTANDER',
  NUBANK = 'NUBANK',
  INTER = 'INTER',
}

export enum OpenFinanceConsentStatus {
  AWAITING_AUTHORISATION = 'AWAITING_AUTHORISATION',
  AUTHORISED = 'AUTHORISED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
}

export enum PixCobrancaStatus {
  ATIVA = 'ATIVA',
  CONCLUIDA = 'CONCLUIDA',
  EXPIRADA = 'EXPIRADA',
}

export enum StatusOrdemItp {
  INICIADO = 'INICIADO',
  AGUARDANDO_AUTORIZACAO = 'AGUARDANDO_AUTORIZACAO',
  PROCESSANDO = 'PROCESSANDO',
  LIQUIDADO = 'LIQUIDADO',
  REJEITADO = 'REJEITADO',
}

export enum StatusConciliacaoRealtime {
  CONCILIADO_SUCESSO = 'CONCILIADO_SUCESSO',
  DIVERGENCIA_PENDENTE = 'DIVERGENCIA_PENDENTE',
  AJUSTE_TOLERANCIA = 'AJUSTE_TOLERANCIA',
}

export interface OpenFinanceConsentDto {
  id: string;
  consentId: string;
  userId: string;
  producerId?: string | null;
  instituicao: InstituicaoOpenFinance;
  nomeTitular: string;
  documentoTitular: string;
  status: OpenFinanceConsentStatus;
  escopos: string;
  dataValidade: string;
  autorizadoEm?: string | null;
  revogadoEm?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PixCobrancaDynamicDto {
  id: string;
  txid: string;
  endToEndId?: string | null;
  eventId: string;
  eventNome: string;
  producerId: string;
  valorTotal: number;
  valorSplitProdutor: number;
  valorSplitDisk: number;
  chavePixRecebedor: string;
  qrCodePayload: string;
  qrCodeImageUrl?: string | null;
  status: PixCobrancaStatus;
  dataCriacao: string;
  dataExpiracao: string;
  liquidadoEm?: string | null;
}

export interface OpenFinancePaymentOrderDto {
  id: string;
  codigoOrdem: string; // Ex: ITP-2026-0042
  consentId: string;
  consent?: OpenFinanceConsentDto;
  eventId?: string | null;
  tipoFinalidade: string; // REPASSE_PRODUTOR, DIVIDENDO_SCP, ANTECIPACAO, FORNECEDOR
  bancoOrigem: string;
  bancoDestino: string;
  chavePixDestino: string;
  valor: number;
  status: StatusOrdemItp;
  endToEndId?: string | null;
  iniciadoPor: string;
  liquidadoEm?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RealtimeReconciliationLogDto {
  id: string;
  codigoConciliacao: string;
  cobrancaPixId?: string | null;
  endToEndId: string;
  valorEsperado: number;
  valorRecebido: number;
  diferencaCentavos: number;
  metodoMatch: string; // EXATO_TXID, E2E_PREDITIVO_IA, MANUAL_AUDITADO
  tempoProcessamentoMs: number;
  statusConciliacao: StatusConciliacaoRealtime;
  webhookOrigemIp?: string | null;
  conciliadoEm: string;
}

export interface OpenFinanceKpisDto {
  volumePixRealtimeTotal: number;
  ordensItpLiquidadasCount: number;
  taxaConciliacaoPreditivaPercent: number; // Ex: 99.98%
  tempoMedioLiquidacaoSpiMs: number; // Ex: 1140ms (1.14s)
  consentimentosAtivosCount: number;
  splitsSpiProcessadosTotal: number;
}

export interface CriarPixCobrancaRequestDto {
  eventId: string;
  eventNome: string;
  producerId: string;
  valorIngresso: number;
  taxaConveniencia: number;
  chavePixRecebedor: string;
  tempoExpiracaoMinutos?: number;
}

export interface IniciarPagamentoItpRequestDto {
  consentId: string;
  eventId?: string;
  tipoFinalidade: string;
  bancoOrigem: string;
  bancoDestino: string;
  chavePixDestino: string;
  valor: number;
}

export interface WebhookPixBacenPayloadDto {
  pix: Array<{
    endToEndId: string;
    txid: string;
    valor: string;
    horario: string;
    chave: string;
    infoPagador?: string;
  }>;
}
