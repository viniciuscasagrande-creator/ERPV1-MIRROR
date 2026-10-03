export enum DocumentCategory {
  CONTRATO_PRODUTOR = 'CONTRATO_PRODUTOR',
  ALVARA_EVENTO = 'ALVARA_EVENTO',
  COMPROVANTE_PAGAMENTO = 'COMPROVANTE_PAGAMENTO',
  DOCUMENTO_FISCAL = 'DOCUMENTO_FISCAL',
  LAUDO_TECNICO = 'LAUDO_TECNICO',
  OUTRO = 'OUTRO',
}

export interface DocumentItemDto {
  id: string;
  nomeArquivo: string;
  descricao: string;
  categoria: DocumentCategory | string;
  tamanhoBytes: number;
  formato: string;
  urlArquivo?: string | null;
  hashSha256: string;
  referenciaTipo?: string | null;
  referenciaId?: string | null;
  referenciaNome?: string | null;
  criadoPor?: string | null;
  criadoEm: string;
}

export interface CreateDocumentDto {
  nomeArquivo: string;
  descricao: string;
  categoria: string;
  tamanhoBytes: number;
  formato: string;
  referenciaTipo?: string;
  referenciaId?: string;
  conteudoBase64?: string;
}
