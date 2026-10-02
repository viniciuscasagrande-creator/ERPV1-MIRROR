import { MetodoPagamento } from './payment.js';

export enum StatusRecebivel {
  A_VENCER = 'A_VENCER',
  VENCIDO = 'VENCIDO',
  RECEBIDO = 'RECEBIDO',
  ANTECIPADO = 'ANTECIPADO',
  BAIXADO = 'BAIXADO',
}

export interface AccountReceivable {
  id: string;
  eventId: string;
  eventNome?: string;
  producerNome?: string;
  adquirente: string; // Cielo, Stone, Rede, PagBank
  metodo: MetodoPagamento;
  transacaoRef: string;
  valorBruto: number;
  taxaMdr: number;
  valorLiquido: number;
  dataVencimento: string;
  dataRecebimento?: string | null;
  status: StatusRecebivel;
  antecipado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReceivableFilterDto {
  eventId?: string;
  status?: StatusRecebivel;
  adquirente?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ReceivableKpis {
  totalBruto: number;
  totalLiquido: number;
  totalMdr: number;
  totalRecebido: number;
  totalAVencer: number;
  totalVencido: number;
  totalAntecipado: number;
  contagemTitulos: number;
}
