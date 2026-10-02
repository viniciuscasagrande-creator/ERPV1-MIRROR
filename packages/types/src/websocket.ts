/**
 * Catálogo Canônico de Eventos Socket.IO para o DiskIngressos ERP
 */
export enum SocketEvent {
  // Financeiro
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_CREATED = 'refund.created',
  REFUND_COMPLETED = 'refund.completed',
  SETTLEMENT_UPDATED = 'settlement.updated',

  // Eventos
  EVENT_CREATED = 'event.created',
  EVENT_UPDATED = 'event.updated',
  EVENT_CLOSED = 'event.closed',

  // Vendas
  SALE_CREATED = 'sale.created',
  SALE_CANCELLED = 'sale.cancelled',
  TICKET_ISSUED = 'ticket.issued',

  // Conciliação
  RECONCILIATION_UPDATED = 'reconciliation.updated',
  BANK_TRANSACTION_IMPORTED = 'bank.transaction.imported',

  // Produtor
  PRODUCER_SETTLEMENT_UPDATED = 'producer.settlement.updated',
  PRODUCER_DOCUMENT_AVAILABLE = 'producer.document.available',

  // Central de Fechamento
  CHECKLIST_GATE_UPDATED = 'checklist.gate.updated',
}

/**
 * Utilitários para formatação padronizada de Rooms no Socket.IO
 */
export const SocketRooms = {
  admin: () => 'erp:admin',
  financeiro: () => 'erp:financeiro',
  contabilidade: () => 'erp:contabilidade',
  operacional: () => 'erp:operacional',
  producer: (producerId: string) => `producer:${producerId}`,
  event: (eventId: string) => `event:${eventId}`,
  settlement: (settlementId: string) => `settlement:${settlementId}`,
};

export interface WsSalePayload {
  saleId: string;
  codigoPedido: string;
  eventId: string;
  eventoNome: string;
  producerId: string;
  canal: string;
  totalBruto: number;
  totalLiquido: number;
  metodoPagamento: string;
  ingressosQtd: number;
  createdAt: string;
}

export interface WsGateUpdatedPayload {
  eventId: string;
  gateKey: string;
  value: boolean;
  updatedBy?: string;
  updatedAt: string;
}
