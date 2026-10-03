export enum ContractStatus {
  VIGENTE = 'VIGENTE',
  EM_RENOVACAO = 'EM_RENOVACAO',
  SUSPENSO = 'SUSPENSO',
  ENCERRADO = 'ENCERRADO',
}

export enum ComplianceStatus {
  REGULAR = 'REGULAR',
  PENDENTE = 'PENDENTE',
  RESTRITO = 'RESTRITO',
}

export enum EscrowMovementType {
  RETENCAO_BILHETERIA = 'RETENCAO_BILHETERIA',
  LIBERACAO_ESCROW = 'LIBERACAO_ESCROW',
  DEDUCAO_CHARGEBACK = 'DEDUCAO_CHARGEBACK',
  REPASSE_ANTECIPADO = 'REPASSE_ANTECIPADO',
}

export interface ProducerCommercialContractDto {
  id: string;
  producerId: string;
  numeroContrato: string;
  razaoSocial: string;
  cnpj: string;
  taxaComissaoPadrao: number; // ex: 10.00%
  taxaMdrGateway: number; // ex: 2.85%
  retencaoSegurancaPercent: number; // ex: 15.00%
  prazoLiquidacaoDias: number; // ex: 2
  limiteAdiantamentoGlobal: number;
  saldoAdiantadoAtual: number;
  statusContrato: ContractStatus;
  statusComplianceCnd: ComplianceStatus;
  scoreCredito: number;
  dataInicio: string;
  dataTermino: string;
}

export interface ProducerEscrowLedgerDto {
  id: string;
  producerId: string;
  eventId?: string;
  tipoMovimento: EscrowMovementType;
  descricao: string;
  valorCredito: number;
  valorDebito: number;
  saldoGarantiaApos: number;
  referenciaDocumento?: string;
  dataMovimento: string;
}

export interface Producer360SummaryDto {
  producerId: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  scoreCredito: number;
  statusOperacional: string;
  totalEventos: number;
  eventosAtivos: number;
  ingressosVendidosTotal: number;
  receitaBrutaAcumulada: number;
  receitaLiquidaApurada: number;
  saldoEscrowRetido: number;
  saldoDisponivelRepasse: number;
  saldoAdiantadoVigente: number;
  limiteAdiantamentoDisponivel: number;
  taxaComissaoVigente: number;
  taxaMdrVigente: number;
  retencaoSegurancaPercent: number;
  cndStatus: ComplianceStatus;
  proximoBorderoFechamento: string;
  certificacaoIcpBrasilValida: boolean;
}

export interface ProducerAdvanceSimulateDto {
  producerId: string;
  valorSolicitado: number;
  prazoDias: number;
  taxaDescontoPercent: number;
  valorLiquidoLiberado: number;
  custoFinanceiroDisk: number;
  saldoGarantiaMinimoExigido: number;
  statusAprovacaoAlcada: 'APROVADO_AUTOMATICO' | 'REQUER_ALCADA_DIRETORIA';
}
