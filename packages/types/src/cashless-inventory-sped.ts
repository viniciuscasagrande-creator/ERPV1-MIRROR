/**
 * Tipos e Interfaces da Fase 46: Gestão de A&B, Cashless RFID / NFC & Estoque SPED Bloco K
 */

export enum StatusPulseiraCashless {
  ATIVA = 'ATIVA',
  BLOQUEADA = 'BLOQUEADA',
  REEMBOLSADA = 'REEMBOLSADA',
}

export interface CashlessRfidWristbandDto {
  id: string;
  tagRfidUid: string;
  eventoId: string;
  saldoAtualBrl: number;
  saldoNaoResgatadoBrl: number;
  taxaAtivacaoPagaBrl: number;
  statusPulseira: StatusPulseiraCashless;
  ultimaCargaEm: string;
}

export interface EventFoodBeverageSaleDto {
  id: string;
  pulseiraId: string;
  eventoId: string;
  pontoVendaBar: string;
  itemDescricao: string;
  quantidade: number;
  valorTotalBrl: number;
  custoMercadoriaVendidaBrl: number;
  timestampVenda: string;
}

export interface SpedInventoryBlockKRecordDto {
  id: string;
  eventoId: string;
  mesCompetencia: string;
  codigoItemInsumo: string;
  quantidadeEstoqueInicial: number;
  quantidadeConsumida: number;
  quantidadeEstoqueFinal: number;
  perdaApuradaQuebra: number;
  dataFechamento: string;
}

export interface CashlessDashboardKpisDto {
  totalPulseirasAtivas: number;
  volumeTotalRecargasBrl: number;
  consumoTotalBaresBrl: number;
  saldoSobraNaoResgatadoBrl: number;
  margemBrutaAlimentosBebidasPercent: number;
}

export interface RecarregarPulseiraRequestDto {
  tagRfidUid: string;
  valorRecargaBrl: number;
  eventoId: string;
  metodoPagamento: string; // PIX, CARTAO, DINHEIRO
}

export interface RecarregarPulseiraResponseDto {
  tagRfidUid: string;
  novoSaldoBrl: number;
  comprovanteRecargaId: string;
  timestamp: string;
}
