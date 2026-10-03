/**
 * Tipos e Interfaces da Fase 34: Conciliação Bancária Autônoma Contínua via IA
 * Reconhecimento Automático de Tarifas & Liquidação de Repasses D+0 com Trava de Saldo Mínimo
 */

export enum StatusConciliacaoIa {
  CONCILIADO_AUTOMATICO = 'CONCILIADO_AUTOMATICO',
  DIVERGENCIA_PENDENTE = 'DIVERGENCIA_PENDENTE',
  RECONCILIADO_MANUAL = 'RECONCILIADO_MANUAL',
}

export enum CategoriaTarifaBancariaIa {
  TARIFA_PIX = 'TARIFA_PIX',
  TARIFA_TED = 'TARIFA_TED',
  FLOAT_ADQUIRENTE = 'FLOAT_ADQUIRENTE',
  CUSTODIA_RECEBIVEIS = 'CUSTODIA_RECEBIVEIS',
  MANUTENCAO_CONTA = 'MANUTENCAO_CONTA',
}

export enum StatusTravaEscrowD0 {
  LIBERADO_SEGURO = 'LIBERADO_SEGURO',
  BLOQUEADO_CONTINGENCIA = 'BLOQUEADO_CONTINGENCIA',
  EM_AUDITORIA_SALDO = 'EM_AUDITORIA_SALDO',
}

export interface AiBankReconciliationRunDto {
  id: string;
  codigoCiclo: string;
  bancoIspb: string;
  bancoNome: string;
  contaBancariaId: string;
  totalTransacoesProcessadas: number;
  transacoesConciliadasAutomaticas: number;
  taxaAcuraciaPercent: number;
  volumeTotalConciliadoBrl: number;
  divergenciasDetectadas: number;
  statusExecucao: string;
  tempoProcessamentoMs: number;
  hashIntegridadeAuditoria: string;
  executadoEm: string;
}

export interface BankFeeClassificationDto {
  id: string;
  codigoTarifa: string;
  bancoIspb: string;
  descricaoExtratoOriginal: string;
  categoriaIdentificadaIa: CategoriaTarifaBancariaIa;
  valorTarifaBrl: number;
  confiancaClassificacaoPercent: number;
  contaContabilDebito: string;
  contaContabilCredito: string;
  statusEscrituracao: string;
  dataLancamento: string;
}

export interface EscrowSafetyThresholdDto {
  id: string;
  eventoId: string;
  produtorId: string;
  percentualRetencaoEscrow: number;
  saldoEscrowBloqueadoBrl: number;
  saldoDisponivelLiquidacaoD0Brl: number;
  statusLiquidacaoD0: StatusTravaEscrowD0;
  ultimaAtualizacao: string;
}

export interface ExecutarCicloConciliacaoIaRequestDto {
  contaBancariaId: string;
  bancoIspb: string;
  toleranciaCentavosBrl?: number;
}

export interface ExecutarCicloConciliacaoIaResponseDto {
  codigoCiclo: string;
  totalProcessado: number;
  totalConciliado: number;
  taxaSucessoPercent: number;
  volumeConciliadoBrl: number;
  tarifasDetectadasQuantidade: number;
  valorTotalTarifasBrl: number;
  tempoMs: number;
  hashAuditoria: string;
}

export interface ReconciliationDashboardKpisDto {
  taxaConciliacaoAutomaticaPercent: number;
  volumeTotalConciliadoMesBrl: number;
  tarifasBancariasEconomizadasBrl: number;
  saldoTotalEscrowProtegidoBrl: number;
  totalRepassesD0LiquidadosBrl: number;
  tempoMedioProcessamentoCicloMs: number;
}
