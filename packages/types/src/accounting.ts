export enum NaturezaConta {
  DEVEDORA = 'DEVEDORA',
  CREDORA = 'CREDORA',
}

export enum GrupoContabil {
  ATIVO_CIRCULANTE = 'ATIVO_CIRCULANTE',
  ATIVO_NAO_CIRCULANTE = 'ATIVO_NAO_CIRCULANTE',
  PASSIVO_CIRCULANTE = 'PASSIVO_CIRCULANTE',
  PASSIVO_NAO_CIRCULANTE = 'PASSIVO_NAO_CIRCULANTE',
  PATRIMONIO_LIQUIDO = 'PATRIMONIO_LIQUIDO',
  RECEITAS = 'RECEITAS',
  DESPESAS = 'DESPESAS',
  CUSTOS = 'CUSTOS',
}

export enum TipoPartida {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO',
}

export enum StatusLancamento {
  RASCUNHO = 'RASCUNHO',
  CONFIRMADO = 'CONFIRMADO',
  ESTORNADO = 'ESTORNADO',
}

export interface ChartOfAccountsItem {
  id: string;
  codigo: string;
  nome: string;
  grupo: GrupoContabil;
  natureza: NaturezaConta;
  nivel: number;
  analitica: boolean;
  codigoPai?: string | null;
  saldoAtual: number;
  ativo: boolean;
  createdAt?: string;
}

export interface JournalEntryItem {
  id?: string;
  journalEntryId?: string;
  accountId: string;
  accountCodigo?: string;
  accountNome?: string;
  tipo: TipoPartida;
  valor: number;
  historicoComplementar?: string | null;
}

export interface JournalEntry {
  id: string;
  numeroLancamento: string;
  data: string;
  historico: string;
  origem: string;
  origemId?: string | null;
  totalDebito: number;
  totalCredito: number;
  equilibrado: boolean;
  status: StatusLancamento;
  criadoPor?: string | null;
  items: JournalEntryItem[];
  createdAt: string;
}

export interface CreateJournalEntryDto {
  data: string;
  historico: string;
  origem?: string;
  origemId?: string;
  items: Array<{
    accountId: string;
    tipo: TipoPartida;
    valor: number;
    historicoComplementar?: string;
  }>;
}

export interface TrialBalanceItem {
  codigo: string;
  nome: string;
  grupo: GrupoContabil;
  natureza: NaturezaConta;
  analitica: boolean;
  saldoAnterior: number;
  totalDebitos: number;
  totalCreditos: number;
  saldoAtual: number;
  situacao: 'D' | 'C';
}

export interface TrialBalanceSummary {
  periodoInicio: string;
  periodoFim: string;
  somaDebitos: number;
  somaCreditos: number;
  equilibrado: boolean;
  contas: TrialBalanceItem[];
}

export interface GeneralLedgerEntry {
  data: string;
  numeroLancamento: string;
  historico: string;
  debito: number;
  credito: number;
  saldoAcumulado: number;
}

export interface GeneralLedgerAccount {
  accountId: string;
  codigo: string;
  nome: string;
  natureza: NaturezaConta;
  saldoInicial: number;
  totalDebitos: number;
  totalCreditos: number;
  saldoFinal: number;
  lancamentos: GeneralLedgerEntry[];
}

export interface DreStatement {
  receitaBruta: number;
  deducoes: number;
  receitaLiquida: number;
  custosAdquirenciaMdr: number;
  lucroBruto: number;
  despesasOperacionais: number;
  despesasTributarias: number;
  resultadoFinanceiro: number;
  lucroLiquidoPeriodo: number;
  margemLiquidaPercent: number;
}
