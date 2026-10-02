export enum CanalVenda {
  ONLINE = 'ONLINE',
  PDV = 'PDV',
  POS = 'POS',
  TOTEM = 'TOTEM',
}

export enum StatusVenda {
  APROVADO = 'APROVADO',
  PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO',
  ESTORNADO = 'ESTORNADO',
}

export interface SaleItemSummary {
  id: string;
  ticketTypeId: string;
  ticketNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  taxaCalculada: number;
}

export interface SaleSummary {
  id: string;
  codigoPedido: string;
  eventId: string;
  eventoNome?: string;
  canal: CanalVenda;
  compradorNome: string;
  compradorCpf: string;
  compradorEmail: string;
  totalBruto: number;
  totalTaxas: number;
  totalDescontos: number;
  totalLiquido: number;
  status: StatusVenda;
  metodoPagamento?: string;
  gateway?: string;
  createdAt: string;
  items?: SaleItemSummary[];
}
