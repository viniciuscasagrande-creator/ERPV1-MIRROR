export enum NotificationType {
  FECHAMENTO_EVENTO = 'FECHAMENTO_EVENTO',
  REPASSE_LIBERADO = 'REPASSE_LIBERADO',
  DIVERGENCIA_MDR = 'DIVERGENCIA_MDR',
  TRAVA_CONTABIL = 'TRAVA_CONTABIL',
  LOTE_CNAB = 'LOTE_CNAB',
  SISTEMA = 'SISTEMA',
}

export enum NotificationSeverity {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface AppNotificationDto {
  id: string;
  userId?: string | null;
  producerId?: string | null;
  tipo: NotificationType | string;
  titulo: string;
  mensagem: string;
  severidade: NotificationSeverity | string;
  lida: boolean;
  linkAcao?: string | null;
  metadata?: any;
  criadoEm: string;
}

export interface CreateNotificationDto {
  userId?: string;
  producerId?: string;
  tipo: NotificationType | string;
  titulo: string;
  mensagem: string;
  severidade?: NotificationSeverity | string;
  linkAcao?: string;
  metadata?: any;
}
