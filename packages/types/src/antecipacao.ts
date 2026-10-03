/**
 * Tipos e Interfaces da Fase 17: Antecipações Financeiras, Cessão de Recebíveis & Travas Bancárias
 * Conforme Resolução BCB nº 4.734/2019 e Circular BCB nº 3.952/2019
 */

export enum StatusAntecipacao {
  RASCUNHO = 'RASCUNHO',
  SOLICITADA = 'SOLICITADA',
  EM_ANALISE = 'EM_ANALISE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
  LIBERADA = 'LIBERADA',
  EM_AMORTIZACAO = 'EM_AMORTIZACAO',
  QUITADA = 'QUITADA',
  INADIMPLENTE = 'INADIMPLENTE',
}

export enum StatusTravaBancaria {
  PENDENTE = 'PENDENTE',
  REGISTRADA = 'REGISTRADA',
  ATIVA = 'ATIVA',
  SUSPENSA = 'SUSPENSA',
  LIBERADA = 'LIBERADA',
}

export enum OrigemAmortizacao {
  REPASSE_AUTOMATICO = 'REPASSE_AUTOMATICO',
  RETENCAO_BILHETERIA = 'RETENCAO_BILHETERIA',
  TRAVA_CRUZADA_OUTRO_EVENTO = 'TRAVA_CRUZADA_OUTRO_EVENTO',
  LIQUIDACAO_AVULSA = 'LIQUIDACAO_AVULSA',
}

export enum RegistradoraRecebiveis {
  CERC = 'CERC',
  CIP = 'CIP',
  B3 = 'B3',
  TAG = 'TAG',
  INTERNA = 'INTERNA',
}

export enum AdquirenteTrava {
  CIELO = 'CIELO',
  REDE = 'REDE',
  STONE = 'STONE',
  GETNET = 'GETNET',
  PAGSEGURO = 'PAGSEGURO',
}

export interface AntecipacaoDto {
  id: string;
  codigoContrato: string;
  producerId: string;
  producerNome: string;
  eventId: string;
  eventNome: string;
  valorSolicitado: number;
  taxaMensal: number;
  prazoDias: number;
  custoFinanceiro: number;
  taxaAdministrativa: number;
  valorLiquidoLiberado: number;
  saldoDevedor: number;
  valorAmortizado: number;
  fundoReservaRetido: number;
  status: StatusAntecipacao;
  dataSolicitacao: string;
  dataAprovacao?: string | null;
  dataLiquidacao?: string | null;
  dataVencimento: string;
  registradora: RegistradoraRecebiveis;
  protocoloRegistroUr?: string | null;
  statusTravaBancaria: StatusTravaBancaria;
  adquirentesTravadas?: string | null;
  aprovadoPor?: string | null;
  motivoRejeicao?: string | null;
  documentoAssinaturaId?: string | null;
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
  amortizacoes?: AmortizacaoAntecipacaoDto[];
  travas?: TravaDomicilioBancarioDto[];
}

export interface AmortizacaoAntecipacaoDto {
  id: string;
  antecipacaoId: string;
  repasseId?: string | null;
  valorAmortizado: number;
  saldoAnterior: number;
  saldoRestante: number;
  dataAmortizacao: string;
  origemAmortizacao: OrigemAmortizacao;
  observacao?: string | null;
  createdAt: string;
}

export interface TravaDomicilioBancarioDto {
  id: string;
  antecipacaoId: string;
  producerId: string;
  adquirente: AdquirenteTrava;
  contaBancariaId?: string | null;
  banco: string;
  agencia: string;
  conta: string;
  registradora: RegistradoraRecebiveis;
  protocoloContrato: string;
  status: StatusTravaBancaria;
  dataEfetivacao: string;
  dataLiberacao?: string | null;
  createdAt: string;
}

export interface CalculoMargemConsignavelDto {
  eventId: string;
  eventNome: string;
  producerId: string;
  producerNome: string;
  vendasBrutasTotal: number;
  taxasTicketeiraRetidas: number;
  vendasLiquidasDisponiveis: number;
  percentualMaximoConsignavel: number; // ex: 75%
  tetoConsignavelBruto: number;
  fundoReservaEscrow: number; // ex: 25% retido
  antecipacoesAtivasTotal: number;
  margemConsignavelDisponivel: number;
  podeAntecipar: boolean;
  mensagemRestricao?: string;
}

export interface SimulacaoAntecipacaoRequestDto {
  eventId: string;
  valorSolicitado: number;
  taxaMensal?: number; // padrão 2.50%
  prazoDias?: number; // padrão 30 dias
}

export interface SimulacaoAntecipacaoResponseDto {
  valorSolicitado: number;
  taxaMensal: number;
  prazoDias: number;
  custoFinanceiro: number;
  taxaAdministrativa: number;
  iofEstimado: number;
  valorLiquidoLiberado: number;
  totalAPagar: number;
  margemConsignavelDisponivel: number;
  isDentroDaMargem: boolean;
  alçadaNecessaria: string; // FAIXA_A, FAIXA_B, FAIXA_C
}

export interface CriarAntecipacaoRequestDto {
  producerId: string;
  producerNome: string;
  eventId: string;
  eventNome: string;
  valorSolicitado: number;
  taxaMensal?: number;
  prazoDias?: number;
  registradora?: RegistradoraRecebiveis;
  adquirentesParaTrava?: string[];
  observacoes?: string;
}

export interface AprovarAntecipacaoDto {
  aprovadorNome: string;
  cargo: string;
  motivoOuParecer?: string;
  registradora?: RegistradoraRecebiveis;
  adquirentesParaTrava?: string[];
}

export interface RejeitarAntecipacaoDto {
  rejeitadoPor: string;
  motivoRejeicao: string;
}

export interface ExecutarAmortizacaoDto {
  valorAmortizado: number;
  origemAmortizacao: OrigemAmortizacao;
  repasseId?: string;
  observacao?: string;
}

export interface AntecipacoesKpisDto {
  totalConcedidoPeriodo: number;
  saldoDevedorAtivo: number;
  totalAmortizado: number;
  fundoReservaEscrowTotal: number;
  taxaMediaPonderada: number;
  totalOperacoesAtivas: number;
  totalQuitadas: number;
  travasBancariasAtivas: number;
}
