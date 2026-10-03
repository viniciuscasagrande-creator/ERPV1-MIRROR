export interface CnabBatchItemDto {
  id: string;
  codigoLote: string; // Ex: 'CNAB-2026-000041'
  bancoCodigo: string; // 341 Itaú, 237 Bradesco
  bancoNome?: string;
  tipoOperacao: 'REMESSA_PAGAMENTO' | 'RETORNO_LIQUIDACAO' | string;
  totalRegistros: number;
  valorTotal: number;
  status: 'GERADO' | 'ENVIADO_BANCO' | 'PROCESSADO_RETORNO' | 'REJEITADO' | string;
  conteudoArquivo?: string;
  geradoPor?: string | null;
  processadoEm?: string | null;
  createdAt: string;
}

export interface GenerateCnabRemessaDto {
  bancoCodigo: string; // '341' ou '237'
  settlementIds?: string[];
  payableIds?: string[];
}

export interface ProcessCnabRetornoDto {
  bancoCodigo: string;
  conteudoArquivo: string;
}

export interface CnabRetornoProcessResult {
  codigoLote: string;
  bancoCodigo: string;
  totalProcessados: number;
  totalBaixados: number;
  totalRejeitados: number;
  valorLiquidado: number;
  detalhes: Array<{
    documentoOuCodigo: string;
    favorecido: string;
    valor: number;
    status: 'LIQUIDADO' | 'REJEITADO';
    mensagem: string;
  }>;
}
