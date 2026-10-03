/**
 * Tipos e Interfaces da Fase 36: Auditoria de Borderô Físico-Digital com Assinatura ICP-Brasil & ITI
 */

export enum StatusAssinaturaBordero {
  ASSINADO_ICP_BRASIL = 'ASSINADO_ICP_BRASIL',
  PENDENTE_ASSINATURAS = 'PENDENTE_ASSINATURAS',
  RECUSADO_ASSINANTE = 'RECUSADO_ASSINANTE',
}

export enum PadraoCriptograficoAssinatura {
  PADES_LTV = 'PADES_LTV',
  CADES_BES = 'CADES_BES',
  XADES = 'XADES',
}

export interface DigitalBorderoSealDto {
  id: string;
  codigoBordero: string;
  eventoId: string;
  produtorId: string;
  hashDocSha256: string;
  statusAssinatura: StatusAssinaturaBordero;
  certificadoEmissor: string;
  padraoAssinatura: PadraoCriptograficoAssinatura;
  urlDocumentoPdf: string;
  criadoEm: string;
}

export interface IcpSignatureAuditTrailDto {
  id: string;
  borderoSealId: string;
  signatarioNome: string;
  signatarioCpfCnpj: string;
  protocoloValidadorIti: string;
  carimboDoTempo: string;
  ipOrigem: string;
  statusValidacao: string;
}

export interface BorderoTimeStampingRecordDto {
  id: string;
  codigoCarimbo: string;
  autoridadeTempo: string;
  hashVinculado: string;
  dataHoraOficial: string;
}

export interface BorderoSignatureDashboardKpisDto {
  totalBorderosAssinadosIcp: number;
  totalBorderosPendentes: number;
  conformidadeItiPercent: number;
  carimbosTempoAtivos: number;
  volumeFinanceiroHomologadoBrl: number;
}

export interface AssinarBorderoRequestDto {
  borderoId: string;
  certificadoThumbprint: string;
  signatarioNome: string;
  signatarioCpf: string;
  ipCliente: string;
}

export interface AssinarBorderoResponseDto {
  sucesso: boolean;
  codigoBordero: string;
  protocoloIti: string;
  hashDocSha256: string;
  dataHoraCarimbo: string;
  padraoAssinado: string;
}
