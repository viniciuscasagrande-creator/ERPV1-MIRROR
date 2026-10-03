/**
 * Tipos e Interfaces da Fase 28: FIDC de Bilheteria & Entretenimento
 * Resolução CVM 175 (Anexo Normativo II - Fundos de Investimento em Direitos Creditórios)
 */

export enum TipoCotaFidc {
  SENIOR = 'SENIOR',
  MEZANINO = 'MEZANINO',
  SUBORDINADA = 'SUBORDINADA',
}

export enum StatusFundoFidc {
  ATIVO_OPERACIONAL = 'ATIVO_OPERACIONAL',
  EM_CAPTACAO = 'EM_CAPTACAO',
  LIQUIDACAO_ENCERRADA = 'LIQUIDACAO_ENCERRADA',
}

export enum StatusCessaoFidc {
  HOMOLOGADA_CERC = 'HOMOLOGADA_CERC',
  LIQUIDADA_BORDERO = 'LIQUIDADA_BORDERO',
  INADIMPLENTE_SUBORDINADA = 'INADIMPLENTE_SUBORDINADA',
}

export enum RegistradoraAtivos {
  CERC_REGISTRADORA = 'CERC_REGISTRADORA',
  CIP_REGISTRADORA = 'CIP_REGISTRADORA',
  B3 = 'B3',
}

export interface FidcFundStructureDto {
  id: string;
  codigoFundo: string;
  razaoSocialFundo: string;
  cnpjFundo: string;
  administradorFiduciario: string;
  custodiante: string;
  gestorCarteira: string;
  patrimonioLiquidoTotalBrl: number;
  valorCotasSenioresBrl: number;
  valorCotasMezaninoBrl: number;
  valorCotasSubordinadasBrl: number;
  indiceSubordinacaoAtualPercent: number;
  indiceSubordinacaoMinimoPercent: number;
  metaRentabilidadeSenior: string;
  statusFundo: StatusFundoFidc;
  dataConstituicao: string;
}

export interface FidcReceivableAssignmentDto {
  id: string;
  codigoCessao: string;
  fundId: string;
  eventoId: string;
  eventoNome?: string;
  produtorId: string;
  produtorNome?: string;
  borderoFechamentoId: string;
  valorNominalRecebiveisBrl: number;
  taxaDescontoAnualPercent: number;
  valorPresenteAquisicaoBrl: number;
  prazoMedioDias: number;
  fundoReservaRetidoBrl: number;
  statusCessao: StatusCessaoFidc;
  registroRegistradora: RegistradoraAtivos;
  numeroContratoB3?: string;
  dataCessao: string;
  dataVencimento: string;
}

export interface FidcDailyQuotaValuationDto {
  id: string;
  fundId: string;
  dataCompetencia: string;
  valorPatrimonioLiquidoBrl: number;
  valorCotaSeniorBrl: number;
  valorCotaMezaninoBrl: number;
  valorCotaSubordinadaBrl: number;
  rentabilidadeAcumuladaSeniorPercent: number;
  indiceInadimplenciaPercent: number;
  indiceSubordinacaoRealPercent: number;
  enquadradoRegulatorio: boolean;
  criadoEm: string;
}

export interface FidcAccountingMovementDto {
  id: string;
  codigoLancamento: string;
  fundId: string;
  tipoMovimento: 'AQUISICAO_DIREITOS' | 'AMORTIZACAO_SENIOR' | 'RESGATE_SUBORDINADA' | 'TAXA_GESTAO_ADMIN';
  valorBrl: number;
  contaDebito: string;
  contaCredito: string;
  historicoCvm175: string;
  dataLancamento: string;
}

export interface SimularCessaoFidcRequestDto {
  eventoId: string;
  valorNominalRecebiveisBrl: number;
  prazoMedioDias: number;
  taxaDescontoAnualPercent: number; // Ex: 16.5% a.a.
  retencaoSubordinadaPercent: number; // Ex: 10%
}

export interface SimularCessaoFidcResponseDto {
  valorNominalRecebiveisBrl: number;
  taxaDescontoAnualPercent: number;
  prazoMedioDias: number;
  descontoFinanceiroBrl: number;
  valorPresenteAquisicaoBrl: number;
  retencaoSubordinadaGarantiaBrl: number;
  valorLiquidoLiberadoProdutorBrl: number;
  impactoIndiceSubordinacaoPercent: number;
  statusEnquadramentoCvm175: 'ENQUADRADO' | 'DESENQUADRADO';
}

export interface FidcDashboardKpisDto {
  patrimonioLiquidoTotalBrl: number;
  volumeDireitosCedidosBrl: number;
  indiceSubordinacaoAtualPercent: number;
  indiceSubordinacaoMinimoPercent: number;
  rentabilidadeSeniorAcumuladaPercent: number;
  taxaInadimplenciaPercent: number;
  eventosCedidosCount: number;
}
