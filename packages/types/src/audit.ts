export interface AuditLogEntry {
  id: string;
  usuarioId?: string | null;
  usuarioNome?: string | null;
  usuarioEmail?: string | null;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  valorAnterior?: string | null;
  valorNovo?: string | null;
  motivo?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  criadoEm: string;
}
