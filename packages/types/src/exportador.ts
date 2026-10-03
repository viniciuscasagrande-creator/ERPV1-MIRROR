export enum SupportedAccountingSoftware {
  DOMINIO_SISTEMAS = 'DOMINIO_SISTEMAS',
  FORTES_CONTABIL = 'FORTES_CONTABIL',
  QUESTOR = 'QUESTOR',
  CSV_EXCEL = 'CSV_EXCEL',
}

export enum ExportDataType {
  LANCAMENTOS_DIARIO = 'LANCAMENTOS_DIARIO',
  PLANO_CONTAS = 'PLANO_CONTAS',
  BALANCETE = 'BALANCETE',
  REPASSES = 'REPASSES',
  RETENCOES = 'RETENCOES',
}

export interface AccountingExportBatchDto {
  id: string;
  codigoLote: string;
  sistemaDestino: SupportedAccountingSoftware | string;
  tipoDado: ExportDataType | string;
  periodoInicio: string;
  periodoFim: string;
  totalRegistros: number;
  valorTotal: number;
  conteudoArquivo: string;
  nomeArquivo: string;
  geradoPor?: string | null;
  createdAt: string;
}

export interface GenerateExportBatchDto {
  sistemaDestino: SupportedAccountingSoftware | string;
  tipoDado: ExportDataType | string;
  periodoInicio: string;
  periodoFim: string;
}
