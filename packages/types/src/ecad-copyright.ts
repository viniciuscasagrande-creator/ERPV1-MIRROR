/**
 * Tipos e Interfaces da Fase 37: Central de Gestão & Apuração ECAD / Direitos Autorais Automatizada
 */

export enum StatusGuiaEcad {
  RETIDO_FIDUCIARIO = 'RETIDO_FIDUCIARIO',
  GUIA_GERADA_EMITIDA = 'GUIA_GERADA_EMITIDA',
  LIQUIDADO_CONFIRMADO = 'LIQUIDADO_CONFIRMADO',
  ISENTO_COM_LAUDO = 'ISENTO_COM_LAUDO',
}

export interface EcadMusicalCueSheetDto {
  id: string;
  eventoId: string;
  tituloObra: string;
  autorCompositor: string;
  isrcCode: string;
  duracaoSegundos: number;
}

export interface EcadTaxCalculationDto {
  id: string;
  codigoApuracao: string;
  eventoId: string;
  produtorId: string;
  receitaBrutaBaseBrl: number;
  aliquotaEcadPercent: number; // 7.5% a 10.0%
  valorEcadDevidoBrl: number;
  guiaEcadNumero: string;
  statusGuia: StatusGuiaEcad;
  contaPassivoEcad: string;
  calculadoEm: string;
}

export interface EcadSettlementVoucherDto {
  id: string;
  codigoComprovante: string;
  apuracaoId: string;
  valorLiquidadoBrl: number;
  autenticacaoBancaria: string;
  dataLiquidacao: string;
}

export interface EcadDashboardKpisDto {
  totalRetidoEcadMesBrl: number;
  guiasEcadLiquidadas: number;
  guiasPendentesPagamento: number;
  totalObrasCatalogadasCueSheet: number;
  passivoTotalAbertoEcadBrl: number;
}

export interface CalcularEcadRequestDto {
  eventoId: string;
  produtorId: string;
  receitaBrutaBaseBrl: number;
  tipoEspetaculoMusical: 'SHOW_AO_VIVO' | 'TEATRO_DANCA' | 'FESTIVAL_MULTIPALCO';
}
