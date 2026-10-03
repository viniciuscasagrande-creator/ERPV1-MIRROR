/**
 * Tipos e Interfaces da Fase 20: Hub de Inteligência Tributária & Reforma Tributária 2026
 * IVA Dual (CBS Federal / IBS Subnacional), Split Tributário no Checkout e Créditos Fiscais
 * Embasamento Legal: Emenda Constitucional 132/2023 & Projeto de Lei Complementar 68/2024
 */

export enum RegimeTributarioEventos {
  LUCRO_PRESUMIDO_ATUAL = 'LUCRO_PRESUMIDO_ATUAL', // PIS 0.65% + COFINS 3.00% + ISS Curitiba 5.00% = 8.65%
  IVA_DUAL_REFORMA = 'IVA_DUAL_REFORMA',           // CBS 3.52% + IBS 7.08% = 10.60% (Redução de 60% art. 138 PLP 68/24)
  TRANSICAO_2026 = 'TRANSICAO_2026',               // Teste 2026: CBS 0.90% + IBS 0.10% = 1.00% compensável
}

export enum TipoAliquotaReforma {
  PADRAO = 'PADRAO',                             // CBS 8.80% + IBS 17.70% = 26.50%
  REDUZIDA_EVENTOS_60 = 'REDUZIDA_EVENTOS_60',   // Redução de 60%: CBS 3.52% + IBS 7.08% = 10.60%
  TESTE_2026 = 'TESTE_2026',                     // CBS 0.90% + IBS 0.10% = 1.00%
}

export enum StatusSplitTributario {
  RETIDO_NO_GATEWAY = 'RETIDO_NO_GATEWAY',
  RECOLHIDO_COMITE_GESTOR = 'RECOLHIDO_COMITE_GESTOR',
  ESTORNADO = 'ESTORNADO',
}

export enum CategoriaCreditoTributario {
  SOM_ILUMINACAO = 'SOM_ILUMINACAO',
  ESTRUTURA_PALCO = 'ESTRUTURA_PALCO',
  SEGURANCA = 'SEGURANCA',
  PUBLICIDADE = 'PUBLICIDADE',
  LOCACAO_ESPACO = 'LOCACAO_ESPACO',
  OUTROS = 'OUTROS',
}

export interface TaxReformConfigDto {
  id: string;
  vigenciaAno: number;
  cbsAliquotaPadraoPercent: number; // 8.80%
  ibsAliquotaPadraoPercent: number; // 17.70%
  reducaoEventosPercent: number;    // 60.00%
  cbsAliquotaEventosPercent: number;// 3.52%
  ibsAliquotaEventosPercent: number;// 7.08%
  aliquotaTeste2026Ativa: boolean;  // true
  splitTributarioAtivo: boolean;    // true
  ambienteHomologacao: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaxSplitCheckoutDto {
  id: string;
  codigoTransacao: string; // Ex: SPL-TAX-2026-0001
  paymentId?: string | null;
  eventId: string;
  eventNome: string;
  valorBrutoTransacao: number;
  baseCalculoTributavel: number;
  aliquotaCbsEfetivaPercent: number;
  valorCbsRetido: number;
  aliquotaIbsEfetivaPercent: number;
  valorIbsRetido: number;
  totalSplitTributario: number;
  valorLiquidoRecebedor: number;
  status: StatusSplitTributario;
  idComiteGestor?: string | null;
  createdAt: string;
}

export interface TaxCreditApropriacaoDto {
  id: string;
  codigoCredito: string; // Ex: CRD-2026-0042
  eventId: string;
  eventNome: string;
  numeroNfOrigem: string;
  chaveNfe?: string | null;
  fornecedorCnpj: string;
  fornecedorNome: string;
  categoriaDespesa: CategoriaCreditoTributario;
  valorTotalNf: number;
  baseCalculoCredito: number;
  cbsCreditoApurado: number;
  ibsCreditoApurado: number;
  totalCreditoApurado: number;
  status: 'HOMOLOGADO' | 'PENDENTE_VALIDACAO' | 'REJEITADO';
  homologadoEm: string;
  createdAt: string;
}

export interface TaxApuracaoMensalDto {
  id: string;
  competencia: string; // Ex: "2026-03"
  receitaBrutaIngressos: number;
  receitaPropriaTaxas: number;
  totalDebitoCbs: number;
  totalDebitoIbs: number;
  totalCreditoCbs: number;
  totalCreditoIbs: number;
  saldoPagarCbs: number;
  saldoPagarIbs: number;
  totalIvaDualPagar: number;
  impostoRegimeAntigo: number;
  diferencaEconomia: number;
  splitTributarioJaPago: number;
  saldoResidualGuia: number;
  statusApuracao: 'ABERTA' | 'FECHADA' | 'TRANSMITIDA_COMITE';
  dfeUnificadoChave?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaxReformKpisDto {
  totalSplitRetidoCheckout: number;
  creditosIvaApropriados: number;
  economiaTributariaAcumulada: number;
  aliquotaEfetivaEventosPercent: number;
  transacoesSplitContabilizadasCount: number;
  nfsComCreditoHomologadasCount: number;
}

export interface SimularTransicaoTributariaRequestDto {
  receitaBrutaIngressos: number;
  receitaPropriaTaxas: number; // Comissões e taxa de conveniência
  custosComprovadosComNf: number; // Despesas de som, palco, segurança que geram crédito
}

export interface SimularTransicaoTributariaResponseDto {
  receitaTotal: number;
  custosComNf: number;
  // Regime Atual (Lucro Presumido)
  regimeAtual: {
    nome: string;
    pisPercent: number;
    pisValor: number;
    cofinsPercent: number;
    cofinsValor: number;
    issCuritibaPercent: number;
    issCuritibaValor: number;
    totalImpostos: number;
    aliquotaEfetivaPercent: number;
    creditosAproveitados: number;
  };
  // Novo Regime Reforma Tributária (IVA Dual CBS/IBS com 60% de redução para eventos)
  novoRegimeIvaDual: {
    nome: string;
    cbsAliquota: number;
    cbsDebitoBruto: number;
    cbsCreditoSobreCustos: number;
    cbsLiquidoPagar: number;
    ibsAliquota: number;
    ibsDebitoBruto: number;
    ibsCreditoSobreCustos: number;
    ibsLiquidoPagar: number;
    totalIvaDualPagar: number;
    aliquotaEfetivaPercent: number;
    totalCreditosNaoCumulativos: number;
  };
  // Regime Teste 2026 (CBS 0.9% + IBS 0.1%)
  regimeTeste2026: {
    nome: string;
    cbsTestePercent: number;
    cbsTesteValor: number;
    ibsTestePercent: number;
    ibsTesteValor: number;
    totalTesteValor: number;
  };
  diferencaValor: number; // Economia ou variação
  saldoFavoravelNovoRegime: boolean;
  observacaoLegal: string;
}

export interface SimularSplitCheckoutRequestDto {
  valorIngresso: number;
  taxaConveniencia: number;
  eventId: string;
  eventNome: string;
}

export interface RegistrarCreditoTributarioDto {
  eventId: string;
  eventNome: string;
  numeroNfOrigem: string;
  fornecedorCnpj: string;
  fornecedorNome: string;
  categoriaDespesa: CategoriaCreditoTributario;
  valorTotalNf: number;
}
