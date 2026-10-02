export enum MetodoPagamento {
  PIX = 'PIX',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  BOLETO = 'BOLETO',
  OUTRO = 'OUTRO',
}

export enum StatusPagamento {
  APROVADO = 'APROVADO',
  PENDENTE = 'PENDENTE',
  ESTORNADO = 'ESTORNADO',
  RECUSADO = 'RECUSADO',
}

export interface PaymentSummary {
  id: string;
  saleId: string;
  metodo: MetodoPagamento;
  parcelas: number;
  gateway: string;
  transacaoId: string;
  valorPago: number;
  taxaMdrPercent: number;
  taxaMdrValor: number;
  valorLiquidoGateway: number;
  status: StatusPagamento;
  pagoEm: string;
}
