export enum StatusContaPagar {
  EM_ABERTO = 'EM_ABERTO',
  AGENDADO = 'AGENDADO',
  PAGO = 'PAGO',
  ATRASADO = 'ATRASADO',
  CANCELADO = 'CANCELADO',
}

export enum CategoriaDespesa {
  FORNECEDOR = 'FORNECEDOR',
  IMPOSTO = 'IMPOSTO',
  TAXA = 'TAXA',
  REEMBOLSO = 'REEMBOLSO',
  INFRAESTRUTURA = 'INFRAESTRUTURA',
  COMISSAO = 'COMISSAO',
  OUTRO = 'OUTRO',
}

export interface AccountPayable {
  id: string;
  descricao: string;
  categoria: CategoriaDespesa;
  fornecedorNome: string;
  fornecedorCpfCnpj: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string | null;
  status: StatusContaPagar;
  formaPagamento: string;
  comprovanteRef?: string | null;
  aprovadoPor?: string | null;
  eventId?: string | null;
  eventNome?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayableFilterDto {
  status?: StatusContaPagar;
  categoria?: CategoriaDespesa;
  eventId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface CreatePayableDto {
  descricao: string;
  categoria: CategoriaDespesa;
  fornecedorNome: string;
  fornecedorCpfCnpj: string;
  valor: number;
  dataVencimento: string;
  formaPagamento?: string;
  eventId?: string;
}

export interface PayableKpis {
  totalPagar: number;
  totalPago: number;
  totalAberto: number;
  totalAtrasado: number;
  totalAgendado: number;
  contagemTitulos: number;
}
