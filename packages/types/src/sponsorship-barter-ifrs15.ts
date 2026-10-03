/**
 * Tipos e Interfaces da Fase 48: Patrocínios Corporativos, Naming Rights & Barter (IFRS 15)
 */

export enum TipoContratoPatrocinio {
  NAMING_RIGHTS = 'NAMING_RIGHTS',
  COTA_MASTER = 'COTA_MASTER',
  COTA_APRESENTA = 'COTA_APRESENTA',
  PERMUTA_BARTER = 'PERMUTA_BARTER',
}

export interface SponsorshipNamingAgreementDto {
  id: string;
  empresaPatrocinadoraNome: string;
  cnpjPatrocinador: string;
  eventoOuEspacoNome: string;
  tipoContrato: TipoContratoPatrocinio;
  valorTotalContratoBrl: number;
  prazoVigenciaMeses: number;
  statusContrato: string;
  dataInicioVigencia: string;
}

export interface BarterTradeExchangeRecordDto {
  id: string;
  acordoPatrocinioId: string;
  descricaoItemPermuta: string;
  valorEconomicoAvaliadoBrl: number;
  numeroNotaFiscalEntrada: string;
  numeroNotaFiscalSaida: string;
  comprovanteEntregaServicoUrl?: string;
  dataEfetivacao: string;
}

export interface SponsorshipRevenueAmortizationDto {
  id: string;
  acordoPatrocinioId: string;
  mesCompetencia: string;
  receitaDiferidaInicialBrl: number;
  amortizacaoCompetenciaBrl: number;
  saldoReceitaDiferidaFinalBrl: number;
  contaContabilCredito: string;
  apuradoEm: string;
}

export interface SponsorshipDashboardKpisDto {
  receitaTotalContratadaBrl: number;
  receitaDiferidaPassivoBrl: number;
  receitaAmortizadaAnoBrl: number;
  volumePermutasBarterBrl: number;
  marcasPatrocinadorasAtivas: number;
}

export interface RegistrarBarterRequestDto {
  acordoPatrocinioId: string;
  descricaoItemPermuta: string;
  valorEconomicoAvaliadoBrl: number;
  numeroNotaFiscalEntrada: string;
  numeroNotaFiscalSaida: string;
}

export interface RegistrarBarterResponseDto {
  sucesso: boolean;
  barterId: string;
  valorLancamentoContabilBrl: number;
  protocoloCompensacaoFiscal: string;
}
