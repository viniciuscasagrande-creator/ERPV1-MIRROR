/**
 * Tipos e Interfaces da Fase 19: Sociedades em Conta de Participação (SCP) & Investidores
 * Aportes de Risco, Hurdle Waterfall & Distribuição de Dividendos por Evento
 * Embasamento Legal: Código Civil (Lei 10.406/02 arts. 991 a 996), IN RFB 2.119/22 e Lei 9.249/95 art. 10
 */

export enum ScpModalidadePartilha {
  LUCRO_LIQUIDO = 'LUCRO_LIQUIDO',
  HURDLE_WATERFALL = 'HURDLE_WATERFALL',
  RECEITA_BRUTA = 'RECEITA_BRUTA',
}

export enum TipoInvestidorScp {
  ANJO = 'ANJO',
  CO_PRODUTOR = 'CO_PRODUTOR',
  FUNDO_INVESTIMENTO = 'FUNDO_INVESTIMENTO',
  FAMILY_OFFICE = 'FAMILY_OFFICE',
}

export enum StatusContratoScp {
  EM_CAPTACAO = 'EM_CAPTACAO',
  ATIVO = 'ATIVO',
  EM_APURACAO = 'EM_APURACAO',
  LIQUIDADO = 'LIQUIDADO',
  ENCERRADO = 'ENCERRADO',
}

export enum StatusAporteScp {
  INTEGRALIZADO = 'INTEGRALIZADO',
  PENDENTE_COMPROVANTE = 'PENDENTE_COMPROVANTE',
  RESCINDIDO = 'RESCINDIDO',
}

export enum StatusDistribuicaoDividendo {
  CALCULADO = 'CALCULADO',
  APROVADO_CFO = 'APROVADO_CFO',
  LIQUIDADO = 'LIQUIDADO',
  PENDENTE_AUDITORIA = 'PENDENTE_AUDITORIA',
}

export enum RegimeTributarioScp {
  LUCRO_PRESUMIDO_ISENTO = 'LUCRO_PRESUMIDO_ISENTO',
  MUTUO_IRRF_REGRESSIVO = 'MUTUO_IRRF_REGRESSIVO',
}

export interface ScpInvestorDto {
  id: string;
  nomeOuRazaoSocial: string;
  tipoPessoa: 'PF' | 'PJ';
  documentoFiscal: string; // CPF ou CNPJ
  email: string;
  telefone?: string | null;
  tipoInvestidor: TipoInvestidorScp;
  banco: string;
  agencia: string;
  conta: string;
  tipoChavePix?: string | null;
  chavePix?: string | null;
  statusKyc: 'APROVADO' | 'EM_ANALISE' | 'PENDENTE' | 'REJEITADO';
  limiteAporte: number;
  totalAportado?: number;
  totalDividendosRecebidos?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScpQuotaShareDto {
  id: string;
  codigoAporte: string; // Ex: APT-2026-0041
  contractId: string;
  investorId: string;
  investorNome?: string;
  investorDocumento?: string;
  investor?: ScpInvestorDto;
  valorAportado: number;
  percentualParticipacao: number; // Ex: 25.00%
  dataAporte: string;
  status: StatusAporteScp;
  comprovanteUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScpContractDto {
  id: string;
  codigoScp: string; // Ex: SCP-2026-001
  nomeProjeto: string;
  eventId: string;
  eventNome: string;
  producerId: string;
  socioOstensivo: string;
  cnpjScp?: string | null;
  metaCaptacao: number;
  valorCaptado: number;
  percentualCaptado?: number;
  modalidadePartilha: ScpModalidadePartilha;
  hurdleRatePercent: number; // Ex: 12.00%
  upsideSharePercent: number; // Ex: 25.00%
  regimeTributario: RegimeTributarioScp;
  status: StatusContratoScp;
  dataInicio: string;
  dataEncerramento?: string | null;
  quotas?: ScpQuotaShareDto[];
  distribuicoes?: ScpDividendDistributionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ScpDividendDistributionDto {
  id: string;
  codigoDistribuicao: string; // Ex: DIV-2026-0012
  contractId: string;
  contractNome?: string;
  investorId: string;
  investorNome?: string;
  investorDocumento?: string;
  investorPix?: string | null;
  eventId: string;
  eventNome: string;
  dreReceitaBruta: number;
  dreCustosOperacionais: number;
  dreLucroLiquido: number;
  valorAporteDevolvido: number; // Payback do capital inicial
  valorLucroDistribuido: number; // Lucro / Dividendo
  aliquotaIrrf: number; // 0% se Lei 9.249/95 ou 15% se Mútuo
  valorIrrfRetido: number;
  valorLiquidoPago: number;
  roiEfetivoPercent: number;
  status: StatusDistribuicaoDividendo;
  dataAprovacao?: string | null;
  dataLiquidacao?: string | null;
  metodoLiquidacao?: string | null;
  comprovantePagamento?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScpDashboardKpisDto {
  capitalTotalInvestido: number;
  dividendosTotalDistribuidos: number;
  roiMedioPercent: number;
  contratosAtivosCount: number;
  investidoresHomologadosCount: number;
  valorEmApuracao: number;
}

export interface CriarContratoScpDto {
  nomeProjeto: string;
  eventId: string;
  eventNome: string;
  producerId: string;
  socioOstensivo: string;
  cnpjScp?: string;
  metaCaptacao: number;
  modalidadePartilha: ScpModalidadePartilha;
  hurdleRatePercent?: number;
  upsideSharePercent?: number;
  regimeTributario?: RegimeTributarioScp;
}

export interface CriarInvestidorDto {
  nomeOuRazaoSocial: string;
  tipoPessoa: 'PF' | 'PJ';
  documentoFiscal: string;
  email: string;
  telefone?: string;
  tipoInvestidor: TipoInvestidorScp;
  banco: string;
  agencia: string;
  conta: string;
  tipoChavePix?: string;
  chavePix?: string;
  limiteAporte?: number;
}

export interface RegistrarAporteDto {
  contractId: string;
  investorId: string;
  valorAportado: number;
  comprovanteUrl?: string;
}

export interface SimularDistribuicaoScpRequestDto {
  contractId: string;
  dreReceitaBruta: number;
  dreCustosOperacionais: number;
}

export interface SimularDistribuicaoItemDto {
  investorId: string;
  investorNome: string;
  valorAportado: number;
  percentualCota: number;
  devolucaoCapital: number;
  lucroDistribuido: number;
  irrfRetido: number;
  valorLiquidoTotal: number;
  roiPercent: number;
}

export interface SimularDistribuicaoScpResponseDto {
  contractId: string;
  nomeProjeto: string;
  modalidadePartilha: ScpModalidadePartilha;
  dreReceitaBruta: number;
  dreCustosOperacionais: number;
  dreLucroLiquido: number;
  totalAportadoNaScp: number;
  capitalDevolvidoTotal: number;
  lucroResidualTotal: number;
  lucroDistribuidoInvestidores: number;
  lucroRetidoProdutora: number;
  distribuicoes: SimularDistribuicaoItemDto[];
}

export interface AprovarDistribuicaoDto {
  aprovadoPor: string;
  observacoes?: string;
}

export interface LiquidarDividendoPixDto {
  metodoLiquidacao: 'PIX' | 'TED';
  contaOrigemId?: string;
}
