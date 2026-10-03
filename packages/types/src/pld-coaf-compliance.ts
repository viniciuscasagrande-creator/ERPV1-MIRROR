/**
 * Tipos e Interfaces da Fase 38: Prevenção à Lavagem de Dinheiro (PLD-FT), COAF & Bacen 3.978/2020
 */

export enum TipoInfracaoPld {
  SMURFING_FRACIONAMENTO = 'SMURFING_FRACIONAMENTO',
  CARTAO_MULTIPLO_SUSPEITO = 'CARTAO_MULTIPLO_SUSPEITO',
  ALTO_VALOR_ESPECIE = 'ALTO_VALOR_ESPECIE',
  TRANSACAO_PEP_NAO_DECLARADA = 'TRANSACAO_PEP_NAO_DECLARADA',
  INCONSISTENCIA_CADASTRAL_GRAVE = 'INCONSISTENCIA_CADASTRAL_GRAVE',
}

export enum StatusAlertaPld {
  EM_ANALISE_COMPLIANCE = 'EM_ANALISE_COMPLIANCE',
  ARQUIVADO_JUSTIFICADO = 'ARQUIVADO_JUSTIFICADO',
  COMUNICADO_SISCOAF = 'COMUNICADO_SISCOAF',
  BLOQUEIO_CAUTELAR_ATIVO = 'BLOQUEIO_CAUTELAR_ATIVO',
}

export interface PldTransactionAlertDto {
  id: string;
  codigoAlerta: string;
  transacaoId: string;
  clienteCpfCnpj: string;
  clienteNome: string;
  tipoInfracaoDetectada: TipoInfracaoPld;
  scoreRiscoPld: number; // 0 a 100
  valorOperacaoBrl: number;
  statusAnalise: StatusAlertaPld;
  dataDeteccao: string;
}

export interface PepScreeningRecordDto {
  id: string;
  cpfConsultado: string;
  nomeCompleto: string;
  isPepAtivo: boolean;
  cargoFuncaoPublica?: string;
  orgaoPublico?: string;
  dataConsulta: string;
}

export interface CoafCommunicationReportDto {
  id: string;
  numeroProtocoloSiscoaf: string;
  alertaId: string;
  justificativaLegal: string;
  enviadoAoCoafEm: string;
  statusComunicacao: string;
}

export interface PldDashboardKpisDto {
  alertasPldAtivosMes: number;
  scoreRiscoMedioBase: number;
  consultasPepRealizadas: number;
  comunicacoesSiscoafHomologadas: number;
  volumeFinanceiroSobQuarentenaBrl: number;
}

export interface TriagemPldRequestDto {
  cpfCnpj: string;
  nome: string;
  valorTransacaoBrl: number;
  metodoPagamento: string;
  quantidadeIngressos: number;
}

export interface TriagemPldResponseDto {
  aprovadoSemAlerta: boolean;
  scoreRiscoCalculado: number;
  gerouAlerta: boolean;
  tipoInfracao?: TipoInfracaoPld;
  requerComunicacaoCoaf: boolean;
}
