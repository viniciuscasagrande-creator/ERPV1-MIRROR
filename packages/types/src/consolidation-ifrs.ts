/**
 * Tipos e Interfaces da Fase 25: Consolidação IFRS / CPC 36, Equivalência Patrimonial (MEP) e Conversão de Demonstrações
 * Normas: CPC 36 / IFRS 10 (Consolidação), CPC 18 / IAS 28 (Equivalência Patrimonial) e CPC 02 / IAS 21 (Conversão de Moeda)
 */

export enum MetodoConsolidacao {
  CONSOLIDACAO_INTEGRAL = 'CONSOLIDACAO_INTEGRAL',
  EQUIVALENCIA_PATRIMONIAL_MEP = 'EQUIVALENCIA_PATRIMONIAL_MEP',
  CUSTO = 'CUSTO',
}

export enum TipoEntidadeGrupo {
  MATRIZ = 'MATRIZ',
  FILIAL = 'FILIAL',
  SPE_EVENTO = 'SPE_EVENTO',
  SCP_INVESTIDA = 'SCP_INVESTIDA',
  CONTROLADA = 'CONTROLADA',
}

export enum TipoOperacaoIntercompany {
  REPASSE_TAXA_SERVICO = 'REPASSE_TAXA_SERVICO',
  MUTUO_FINANCEIRO_INTERNO = 'MUTUO_FINANCEIRO_INTERNO',
  DIVIDENDO_SCP_DISTRIBUIDO = 'DIVIDENDO_SCP_DISTRIBUIDO',
  COMPRA_VENDA_INGRESSOS = 'COMPRA_VENDA_INGRESSOS',
}

export enum StatusConsolidacao {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FECHADO_AUDITADO = 'FECHADO_AUDITADO',
  RETIFICADO = 'RETIFICADO',
}

export interface ConsolidatedEntityDto {
  id: string;
  codigoEntidade: string;
  razaoSocial: string;
  cnpj: string;
  tipoEntidade: TipoEntidadeGrupo;
  percentualParticipacao: number;
  metodoConsolidacao: MetodoConsolidacao;
  moedaFuncional: string;
  ativa: boolean;
  createdAt: string;
}

export interface IntercompanyEliminationDto {
  id: string;
  codigoEliminacao: string;
  periodoAnoMes: string;
  tipoOperacao: TipoOperacaoIntercompany;
  entidadeOrigemId: string;
  entidadeOrigemNome?: string;
  entidadeDestinoId: string;
  entidadeDestinoNome?: string;
  valorEliminadoBrl: number;
  contaContabilDebito: string;
  contaContabilCredito: string;
  justificativaIfrs: string;
  eliminadoEm: string;
}

export interface EquityAccountingMepDto {
  id: string;
  codigoApuracaoMep: string;
  investidaId: string;
  investidaNome: string;
  periodoApuracao: string;
  percentualDetido: number;
  patrimonioLiquidoAjustado: number;
  lucroLiquidoPeriodo: number;
  resultadoEquivalenciaBrl: number;
  valorInvestimentoContabil: number;
  dataApuracao: string;
}

export interface ConsolidatedBalanceSheetDto {
  id: string;
  codigoDemonstracao: string;
  periodo: string;
  moedaApresentacao: 'BRL' | 'USD' | 'EUR';
  taxaConversaoFechamento: number;
  ativoCirculanteTotal: number;
  ativoNaoCirculanteTotal: number;
  ativoTotal: number;
  passivoCirculanteTotal: number;
  passivoNaoCirculanteTotal: number;
  patrimonioLiquidoTotal: number;
  ajusteAvaliacaoPatrimonial: number;
  receitaLiquidaConsolidada: number;
  lucroLiquidoConsolidado: number;
  status: StatusConsolidacao;
  geradoEm: string;
}

export interface SimularConversaoIfrsRequestDto {
  periodo: string;
  moedaDestino: 'USD' | 'EUR';
  taxaFechamentoSpot: number;
  taxaMediaPeriodo: number;
}

export interface SimularConversaoIfrsResponseDto {
  periodo: string;
  moedaDestino: 'USD' | 'EUR';
  ativoTotalConvertido: number;
  passivoTotalConvertido: number;
  patrimonioLiquidoConvertido: number;
  ajusteAvaliacaoPatrimonialAap: number;
  receitaLiquidaConvertida: number;
  lucroLiquidoConvertido: number;
  balancoEquilibrado: boolean;
}

export interface ConsolidationIfrsKpisDto {
  ativoTotalConsolidadoBrl: number;
  ativoTotalConsolidadoUsd: number;
  totalEliminacoesIntercompanyBrl: number;
  resultadoMepAcumuladoBrl: number;
  entidadesConsolidadasCount: number;
  aderenciaNormasIfrsPercent: number;
}
