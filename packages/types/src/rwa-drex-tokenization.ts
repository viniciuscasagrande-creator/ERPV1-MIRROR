/**
 * Tipos e Interfaces da Fase 27: Tokenização de Ativos de Bilheteria (RWA),
 * Recebíveis em DREX e Smart Contracts de Liquidação Condicional
 * Normas: Banco Central do Brasil (Piloto DREX), CVM Resolução 88/22 e CVM Resolução 175/22
 */

export enum TipoAtivoTokenizado {
  LOTE_INGRESSOS = 'LOTE_INGRESSOS',
  RECEBIVEL_FUTURO = 'RECEBIVEL_FUTURO',
  COTA_PATROCINIO = 'COTA_PATROCINIO',
}

export enum PadraoToken {
  DREX_PILOT = 'DREX_PILOT',
  ERC3643_PERMISSIONED = 'ERC3643_PERMISSIONED',
  ERC1155_HYBRID = 'ERC1155_HYBRID',
}

export enum NetworkChain {
  BACEN_DREX_HYPERLEDGER = 'BACEN_DREX_HYPERLEDGER',
  POLYGON_POS = 'POLYGON_POS',
  ARBITRUM_ONE = 'ARBITRUM_ONE',
}

export enum StatusPoolRwa {
  EM_CAPTACAO = 'EM_CAPTACAO',
  ATIVO_LANCADO = 'ATIVO_LANCADO',
  LIQUIDADO_TOTAL = 'LIQUIDADO_TOTAL',
  CANCELADO = 'CANCELADO',
}

export enum FaseEventoEscrow {
  SOUNDCHECK_HOMOLOGADO = 'SOUNDCHECK_HOMOLOGADO',
  ABERTURA_PORTOES = 'ABERTURA_PORTOES',
  INICIO_SHOW = 'INICIO_SHOW',
  ENCERRAMENTO_VALIDADO = 'ENCERRAMENTO_VALIDADO',
}

export enum StatusOracleEscrow {
  PENDENTE = 'PENDENTE',
  VERIFICADO_ORACULO = 'VERIFICADO_ORACULO',
  LIQUIDADO_DREX = 'LIQUIDADO_DREX',
}

export enum StatusTradeSecundario {
  CONFIRMADO = 'CONFIRMADO',
  LIQUIDADO = 'LIQUIDADO',
  FALHA_TRAVA_CAMBISMO = 'FALHA_TRAVA_CAMBISMO',
}

export interface RwaTicketTokenPoolDto {
  id: string;
  codigoTokenPool: string;
  nomePool: string;
  eventoId: string;
  eventoNome?: string;
  produtorId: string;
  produtorNome?: string;
  tipoAtivoTokenizado: TipoAtivoTokenizado;
  padraoToken: PadraoToken;
  contractAddress: string;
  networkChain: NetworkChain;
  totalTokensEmitidos: number;
  tokensDisponiveis: number;
  tokensLiquidados: number;
  valorFaceUnitarioBrl: number;
  valorCaptadoBrl: number;
  taxaRetornoAnualPercent: number;
  statusPool: StatusPoolRwa;
  dataEmissao: string;
  dataMaturidade: string;
}

export interface SmartContractEscrowTriggerDto {
  id: string;
  tokenPoolId: string;
  eventoId: string;
  faseEvento: FaseEventoEscrow;
  percentualLiberacao: number;
  valorLiberadoBrl: number;
  oracleStatus: StatusOracleEscrow;
  txHashBlockchain?: string;
  dataLiberacao?: string;
  criadoEm: string;
}

export interface SecondaryMarketTradeDto {
  id: string;
  codigoOperacao: string;
  tokenPoolId: string;
  ticketId: string;
  compradorWallet: string;
  vendedorWallet: string;
  precoFaceOriginalBrl: number;
  precoRevendaBrl: number;
  agioPercentual: number;
  taxaRoyaltyProdutorBrl: number; // 5%
  taxaPlataformaDiskBrl: number; // 2.5%
  txHashDrex: string;
  statusTrade: StatusTradeSecundario;
  executadoEm: string;
}

export interface RwaAccountingRegisterDto {
  id: string;
  codigoLancamento: string;
  tokenPoolId: string;
  tipoLancamento: 'CAPTACAO_INICIAL' | 'LIBERACAO_ESCROW' | 'LIQUIDACAO_INVESTIDOR' | 'ROYALTY_SECUNDARIO';
  valorBrl: number;
  contaDebito: string;
  contaCredito: string;
  historicoOcpc10: string;
  dataRegistro: string;
}

export interface SimularRevendaSecundariaRequestDto {
  tokenPoolId: string;
  precoFaceOriginalBrl: number;
  precoRevendaPretendidoBrl: number;
}

export interface SimularRevendaSecundariaResponseDto {
  permitido: boolean;
  agioPercentual: number;
  agioMaximoPermitidoPercentual: number;
  motivoBloqueio?: string;
  taxaRoyaltyProdutorBrl: number;
  taxaPlataformaDiskBrl: number;
  valorLiquidoVendedorBrl: number;
  regrasAntiCambismoCvm88: string;
}

export interface RwaDrexDashboardKpisDto {
  totalValueLockedDrexBrl: number;
  tokensRwaCirculacaoCount: number;
  volumeMercadoSecundarioBrl: number;
  royaltiesAntiCambismoBrl: number;
  poolsAtivasCount: number;
  liquidacaoSmartContractsPercent: number;
}
