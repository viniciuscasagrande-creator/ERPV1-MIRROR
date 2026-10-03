export enum SignatureProvider {
  AUTENTIQUE = 'AUTENTIQUE',
  CLICKSIGN = 'CLICKSIGN',
  DOCUSIGN = 'DOCUSIGN',
  INTERNAL_ICP_BRASIL = 'INTERNAL_ICP_BRASIL',
}

export enum SignatureDocumentType {
  BORDERO_FECHAMENTO = 'BORDERO_FECHAMENTO',
  TERMO_REPASSE = 'TERMO_REPASSE',
  CONTRATO_ANTECIPACAO = 'CONTRATO_ANTECIPACAO',
  CONTRATO_PRESTACAO_SERVICOS = 'CONTRATO_PRESTACAO_SERVICOS',
}

export enum SignatureDocumentStatus {
  RASCUNHO = 'RASCUNHO',
  ENVIADO = 'ENVIADO',
  AGUARDANDO_PRODUTOR = 'AGUARDANDO_PRODUTOR',
  AGUARDANDO_DISKINGRESSOS = 'AGUARDANDO_DISKINGRESSOS',
  CONCLUIDO_ASSINADO = 'CONCLUIDO_ASSINADO',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
}

export enum SignerRole {
  PRODUTOR_1_ORDEM = 'PRODUTOR_1_ORDEM',
  DISKINGRESSOS_2_ORDEM = 'DISKINGRESSOS_2_ORDEM',
  TESTEMUNHA = 'TESTEMUNHA',
}

export enum SignerStatus {
  PENDENTE = 'PENDENTE',
  ASSINADO = 'ASSINADO',
  REJEITADO = 'REJEITADO',
}

export enum ErpSyncStatus {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  SINCRONIZADO = 'SINCRONIZADO',
  DIVERGENTE = 'DIVERGENTE',
  ERRO = 'ERRO',
  AGUARDANDO_REPROCESSAMENTO = 'AGUARDANDO_REPROCESSAMENTO',
}

export interface DigitalSignatureSignerDto {
  id: string;
  documentId: string;
  nome: string;
  email: string;
  cpfCnpj?: string | null;
  tipoSignatario: SignerRole | string;
  ordemAssinatura: number; // 1: Produtor, 2: DiskIngressos
  status: SignerStatus | string;
  assinadoEm?: string | null;
  ipAssinatura?: string | null;
  metodoAutenticacao?: string | null;
  createdAt: string;
}

export interface ErpSyncQueueDto {
  id: string;
  documentId?: string | null;
  sistemaDestino: string; // CONTA_AZUL, OMIE, etc.
  entidade: string;
  referenciaExterna?: string | null;
  status: ErpSyncStatus | string;
  tentativas: number;
  ultimoErro?: string | null;
  payloadEnvio?: string | null;
  respostaPayload?: string | null;
  sincronizadoEm?: string | null;
  createdAt: string;
}

export interface DigitalSignatureDocumentDto {
  id: string;
  codigoDocumento: string;
  titulo: string;
  tipoDocumento: SignatureDocumentType | string;
  referenciaId?: string | null;
  producerId?: string | null;
  producerNome?: string | null;
  provedor: SignatureProvider | string;
  externalDocumentId?: string | null;
  status: SignatureDocumentStatus | string;
  urlDocumentoOriginal?: string | null;
  urlDocumentoAssinado?: string | null;
  checksumSha256: string;
  valorTotal: number;
  criadoPor: string;
  createdAt: string;
  updatedAt: string;
  signatarios: DigitalSignatureSignerDto[];
  syncIntegracoes?: ErpSyncQueueDto[];
}

export interface CreateSignatureDocumentDto {
  titulo: string;
  tipoDocumento: SignatureDocumentType | string;
  referenciaId?: string;
  producerId?: string;
  producerNome?: string;
  provedor?: SignatureProvider | string;
  valorTotal: number;
  emailProdutor: string;
  nomeProdutor: string;
  cpfCnpjProdutor?: string;
}

export interface SignDocumentActionDto {
  signerId: string;
  metodoAutenticacao?: string;
  motivoRejeicao?: string;
}

export interface SignatureKpisDto {
  totalDocumentos: number;
  aguardandoProdutor: number;
  aguardandoDisk: number;
  concluidosAssinados: number;
  tempoMedioConclusaoHoras: number;
  sincronizadosContaAzul: number;
  validadeJuridicaIcpBrasil: boolean;
}
