/**
 * Tipos e Interfaces da Fase 33: DRE & Balancete por Centro de Custo de Evento
 * Rateio Matricial Automatizado e Custeio ABC (Activity-Based Costing)
 * Art. 187 Lei 6.404/76 e NBC TG 26 / CPC 26
 */

export enum CategoriaEspetaculoCostCenter {
  FESTIVAL = 'FESTIVAL',
  SHOW_INTERNACIONAL = 'SHOW_INTERNACIONAL',
  TEATRO_MUSICAL = 'TEATRO_MUSICAL',
  CORPORATIVO = 'CORPORATIVO',
  STANDUP_COMEDY = 'STANDUP_COMEDY',
}

export enum TipoAtividadeAbc {
  PROCESSAMENTO_NUVEM_TRANSACIONAL = 'PROCESSAMENTO_NUVEM_TRANSACIONAL',
  SUPORTE_ATENDIMENTO_SAC = 'SUPORTE_ATENDIMENTO_SAC',
  SEGURANCA_ANTIFRAUDE = 'SEGURANCA_ANTIFRAUDE',
  GATEWAY_RISCO_ADQUIRENCIA = 'GATEWAY_RISCO_ADQUIRENCIA',
  INFRAESTRUTURA_PLATAFORMA = 'INFRAESTRUTURA_PLATAFORMA',
}

export enum StatusCentroCusto {
  ATIVO = 'ATIVO',
  EM_ENCERRAMENTO = 'EM_ENCERRAMENTO',
  ENCERRADO_CONCILIADO = 'ENCERRADO_CONCILIADO',
}

export interface EventCostCenterDto {
  id: string;
  codigoCentroCusto: string;
  nomeCentroCusto: string;
  eventoId: string;
  produtorId: string;
  categoriaEspetaculo: CategoriaEspetaculoCostCenter;
  statusCentroCusto: StatusCentroCusto;
  saldoAtualContabilBrl: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CostDriverAllocationDto {
  id: string;
  centroCustoId: string;
  codigoRateio: string;
  nomeAtividade: TipoAtividadeAbc;
  direcionadorCustoNome: string;
  quantidadeConsumida: number;
  custoUnitarioBrl: number;
  custoTotalAlocadoBrl: number;
  mesCompetencia: string;
  criadoEm: string;
}

export interface EventDreStatementDto {
  id: string;
  centroCustoId: string;
  codigoDre: string;
  periodoCompetencia: string;
  receitaBrutaBilheteriaBrl: number;
  impostosDeducoesBrl: number;
  receitaLiquidaBilheteriaBrl: number;
  custosDiretosEspetaculoBrl: number;
  margemContribuicaoBrl: number;
  custosIndiretosAbcBrl: number;
  resultadoOperacionalEbitdaBrl: number;
  repasseLiquidoProdutorBrl: number;
  lucroLiquidoPlataformaBrl: number;
  margemLiquidaPercent: number;
  auditHashSha256: string;
  geradoEm: string;
}

export interface SimularRateioAbcRequestDto {
  centroCustoId: string;
  horasSuporteSac: number;
  transacoesProcessadas: number;
  consumoCloudCpuHoras: number;
  mesCompetencia: string;
}

export interface SimularRateioAbcResponseDto {
  centroCustoId: string;
  codigoRateio: string;
  custoTotalRateadoBrl: number;
  detalhesAtividades: Array<{
    atividade: TipoAtividadeAbc;
    direcionador: string;
    quantidade: number;
    custoUnitarioBrl: number;
    totalAlocadoBrl: number;
  }>;
  dreImpactada: {
    receitaLiquidaBrl: number;
    novaMargemContribuicaoBrl: number;
    novoLucroLiquidoBrl: number;
    novaMargemLiquidaPercent: number;
  };
}

export interface CostCenterDashboardKpisDto {
  totalCentrosCustoAtivos: number;
  volumeReceitaTotalCentrosBrl: number;
  custosDiretosTotaisBrl: number;
  custosIndiretosRateadosAbcBrl: number;
  margemContribuicaoMediaPercent: number;
  lucroLiquidoConsolidadoCentrosBrl: number;
}
