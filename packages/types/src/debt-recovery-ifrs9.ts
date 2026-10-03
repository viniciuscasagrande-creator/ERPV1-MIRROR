/**
 * Tipos e Interfaces da Fase 47: Cobrança Judicial, Recuperação de Crédito & PECLD (CPC 48 / IFRS 9)
 */

export enum EstagioCobrancaDivida {
  AMIGAVEL = 'AMIGAVEL',
  NOTIFICACAO_EXTRAJUDICIAL = 'NOTIFICACAO_EXTRAJUDICIAL',
  PROTESTO_CARTORIO = 'PROTESTO_CARTORIO',
  EXECUCAO_JUDICIAL = 'EXECUCAO_JUDICIAL',
}

export interface ProducerDebtCollectionDto {
  id: string;
  produtorId: string;
  codigoDivida: string;
  valorOriginalDividaBrl: number;
  saldoDevedorAtualBrl: number;
  diasEmAtrasoAging: number;
  estagioCobranca: EstagioCobrancaDivida;
  taxaJurosMoraMensalPercent: number;
  criadoEm: string;
}

export interface CreditBureauProtestRecordDto {
  id: string;
  dividaId: string;
  cartorioProtestoComarca: string;
  protocoloCertidaoProtesto: string;
  statusSerasaBoaVista: string;
  dataNegativacao: string;
  dataBaixaProtesto?: string;
}

export interface Ifrs9ExpectedCreditLossDto {
  id: string;
  competenciaMesAno: string;
  categoriaAgingCarteira: string;
  exposicaoAoRiscoBrl: number;
  probabilidadeInadimplenciaPd: number;
  perdaDadoIncumprimentoLgd: number;
  provisaoPecldCalculadaBrl: number;
  dataApuracao: string;
}

export interface DebtRecoveryDashboardKpisDto {
  carteiraTotalInadimplenteBrl: number;
  provisaoPecldAcumuladaBrl: number;
  taxaRecuperacaoCreditoPercent: number;
  titulosEmProtestoCartorio: number;
  acoesJudiciaisAtivas: number;
}

export interface NegociarDividaRequestDto {
  dividaId: string;
  numeroParcelas: number;
  descontoJurosPercent: number;
}

export interface NegociarDividaResponseDto {
  dividaId: string;
  novoSaldoAcordadoBrl: number;
  valorParcelaBrl: number;
  termoConfissaoDividaHash: string;
  statusNegociacao: string;
}
