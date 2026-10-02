export enum TipoDocumentoFiscal {
  NFSE = 'NFSE',
  NFE = 'NFE',
}

export enum StatusDocumentoFiscal {
  AUTORIZADO = 'AUTORIZADO',
  EMITIDO = 'EMITIDO',
  PROCESSANDO = 'PROCESSANDO',
  CANCELADO = 'CANCELADO',
  REJEITADO = 'REJEITADO',
}

export enum RegimeTributario {
  LUCRO_PRESUMIDO = 'LUCRO_PRESUMIDO',
  LUCRO_REAL = 'LUCRO_REAL',
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
}

export enum TipoTributo {
  ISS = 'ISS',
  IRRF = 'IRRF',
  PIS = 'PIS',
  COFINS = 'COFINS',
  CSLL = 'CSLL',
  INSS = 'INSS',
}

export enum StatusGuiaRecolhimento {
  A_RECOLHER = 'A_RECOLHER',
  PAGA = 'PAGA',
  VENCIDA = 'VENCIDA',
}

export enum TipoSped {
  EFD_REINF = 'EFD_REINF',
  SPED_FISCAL = 'SPED_FISCAL',
  SPED_CONTRIBUICOES = 'SPED_CONTRIBUICOES',
  DCTF_WEB = 'DCTF_WEB',
}

export interface FiscalInvoiceItem {
  id: string;
  numeroNota: string;
  serie: string;
  tipo: TipoDocumentoFiscal;
  status: StatusDocumentoFiscal;
  dataEmissao: string | Date;
  competencia: string;
  codigoVerificacao?: string | null;
  chaveAcesso?: string | null;

  tomadorTipo: string;
  tomadorNome: string;
  tomadorDoc: string;
  tomadorEmail?: string | null;
  tomadorCidade?: string | null;
  tomadorUf?: string | null;

  prestadorCnpj: string;
  prestadorIm: string;

  codigoServico: string;
  discriminacao: string;

  valorServicos: number;
  valorDeducoes: number;
  baseCalculo: number;
  aliquotaIss: number;
  valorIss: number;
  issRetido: boolean;

  aliquotaPis: number;
  valorPis: number;
  aliquotaCofins: number;
  valorCofins: number;
  valorInss: number;
  valorIr: number;
  valorCsll: number;
  valorLiquido: number;

  eventId?: string | null;
  eventNome?: string | null;

  xmlContent?: string | null;
  motivoCancelamento?: string | null;
  canceladoEm?: string | Date | null;

  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface EmitirNfseDto {
  tomadorTipo: 'PRODUTOR' | 'CLIENTE';
  tomadorNome: string;
  tomadorDoc: string;
  tomadorEmail?: string;
  tomadorCidade?: string;
  tomadorUf?: string;
  discriminacao: string;
  valorServicos: number;
  aliquotaIss?: number;
  issRetido?: boolean;
  eventId?: string;
  competencia?: string;
}

export interface EmitirLoteEventoDto {
  eventId: string;
  emitirPara: 'PRODUTOR_COMISSAO' | 'CLIENTES_CONVENIENCIA' | 'TODOS';
}

export interface CancelarNfDto {
  motivo: string;
}

export interface TaxRetentionItem {
  id: string;
  origemTipo: string;
  origemId: string;
  favorecidoNome: string;
  favorecidoDoc: string;
  tributo: TipoTributo;
  baseCalculo: number;
  aliquota: number;
  valorRetido: number;
  dataFatoGerador: string | Date;
  dataVencimentoGuia: string | Date;
  competencia: string;
  status: string;
  createdAt: string | Date;
}

export interface TaxSummaryItem {
  id: string;
  competencia: string;
  regime: RegimeTributario;
  receitaBrutaIngressos: number;
  receitaPropriaTaxasComissoes: number;
  baseCalculoISS: number;
  valorIssTotal: number;
  baseCalculoFederal: number;
  valorPisTotal: number;
  valorCofinsTotal: number;
  valorIrpjTotal: number;
  valorCsllTotal: number;
  totalImpostos: number;
  fechado: boolean;
  dataFechamento?: string | Date | null;
  createdAt: string | Date;
}

export interface TaxGuideItem {
  id: string;
  codigoReceita: string;
  descricao: string;
  tipoTributo: TipoTributo;
  competencia: string;
  vencimento: string | Date;
  valorPrincipal: number;
  jurosMulta: number;
  valorTotal: number;
  codigoBarras?: string | null;
  linhaDigitavel?: string | null;
  status: StatusGuiaRecolhimento;
  pagaEm?: string | Date | null;
  comprovanteUrl?: string | null;
  createdAt: string | Date;
}

export interface SpedExportItem {
  id: string;
  tipo: TipoSped;
  competencia: string;
  versaoLeiaute: string;
  nomeArquivo: string;
  hashArquivo: string;
  conteudo: string;
  totalLinhas: number;
  geradoPor?: string | null;
  createdAt: string | Date;
}

export interface FiscalDashboardSummary {
  totalEmitidoMes: number;
  totalIssMes: number;
  totalPisCofinsMes: number;
  totalRetencoesMes: number;
  totalNotasAutorizadas: number;
  totalNotasCanceladas: number;
  eventosPendentesEmissao: number;
  guiasPendentesRecolhimento: number;
}
