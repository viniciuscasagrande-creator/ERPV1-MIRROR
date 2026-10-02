export enum StatusLote {
  ABERTO = 'ABERTO',
  ESGOTADO = 'ESGOTADO',
  ENCERRADO = 'ENCERRADO',
}

export interface TicketTypeSummary {
  id: string;
  nome: string;
  precoUnitario: number;
  taxaServico: number;
  quantidadeTotal: number;
  quantidadeVendida: number;
  disponivel: number;
}

export interface TicketBatchSummary {
  id: string;
  nome: string;
  inicioVendas: string;
  fimVendas?: string | null;
  status: StatusLote;
  ticketTypes: TicketTypeSummary[];
}
