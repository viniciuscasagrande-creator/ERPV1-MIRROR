/**
 * Tipos e Interfaces da Fase 35: Gestão Orçamentária Corporativa, Budget vs Actual & Rolling Forecast
 */

export enum CategoriaOrcamentaria {
  CAPEX_INFRAESTRUTURA = 'CAPEX_INFRAESTRUTURA',
  OPEX_MARKETING_DIGITAL = 'OPEX_MARKETING_DIGITAL',
  OPEX_PESSOAL_OPERACAO = 'OPEX_PESSOAL_OPERACAO',
  CUSTO_TRANSACIONAL_GATEWAYS = 'CUSTO_TRANSACIONAL_GATEWAYS',
  SEGURANCA_COMPLIANCE = 'SEGURANCA_COMPLIANCE',
}

export enum StatusVarianciaOrcamentaria {
  DENTRO_DA_META = 'DENTRO_DA_META',
  ALERTA_ESTOURO = 'ALERTA_ESTOURO',
  SOBRECAPACIDADE_ECONOMIA = 'SOBRECAPACIDADE_ECONOMIA',
}

export interface BudgetLineItemDto {
  id: string;
  orcamentoId: string;
  categoria: CategoriaOrcamentaria;
  centroCustoCodigo: string;
  mesCompetencia: string;
  valorOrcadoBrl: number;
  valorRealizadoBrl: number;
  varianciaPercentual: number;
  statusVariancia: StatusVarianciaOrcamentaria;
}

export interface CorporateBudgetDto {
  id: string;
  codigoOrcamento: string;
  anoExercicio: number;
  descricao: string;
  valorTotalPrevistoBrl: number;
  valorTotalExecutadoBrl: number;
  statusAprovacao: string;
  criadoEm: string;
  atualizadoEm: string;
  itens: BudgetLineItemDto[];
}

export interface ForecastVarianceRecordDto {
  id: string;
  codigoForecast: string;
  mesReferencia: string;
  projecaoProximosMeses: Array<{
    mes: string;
    projecaoReceitaBrl: number;
    projecaoDespesaBrl: number;
    ebitdaProjetadoBrl: number;
  }>;
  confiancaIaPercent: number;
  fatorSazonalidade: number;
  criadoEm: string;
}

export interface BudgetDashboardKpisDto {
  orcamentoTotalAnoBrl: number;
  executadoAcumuladoBrl: number;
  varianciaConsolidadaPercent: number;
  totalLinhasOrcamentarias: number;
  linhasEmAlertaEstouro: number;
  economiaProjetadaRollingBrl: number;
}

export interface SimularCenarioOrcamentarioRequestDto {
  ajustePercentualReceita: number;
  ajustePercentualCapex: number;
  ajustePercentualOpex: number;
  mesInicio: string;
}

export interface SimularCenarioOrcamentarioResponseDto {
  cenarioId: string;
  novoEbitdaProjetadoBrl: number;
  impactoMargemPercentual: number;
  riscoEstouroClassificacao: string;
}
