export enum TipoContaBancaria {
  CORRENTE = 'CORRENTE',
  POUPANCA = 'POUPANCA',
  APLICACAO = 'APLICACAO',
}

export enum TipoLancamentoExtrato {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
}

export enum StatusConciliacao {
  CONCILIADO = 'CONCILIADO',
  PENDENTE = 'PENDENTE',
  DIVERGENTE = 'DIVERGENTE',
  IGNORADO = 'IGNORADO',
}

export enum StatusGateway {
  ATIVO = 'ATIVO',
  HOMOLOGACAO = 'HOMOLOGACAO',
  MANUTENCAO = 'MANUTENCAO',
}

export interface BankAccount {
  id: string;
  bancoNome: string;
  bancoCodigo: string;
  agencia: string;
  conta: string;
  digito: string;
  tipo: TipoContaBancaria;
  saldoAtual: number;
  saldoDisponivel: number;
  saldoBloqueado: number;
  limiteCredito: number;
  chavePix?: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationMatchCandidate {
  tipo: 'RECEBIVEL' | 'CONTA_PAGAR' | 'REPASSE';
  id: string;
  descricao: string;
  valor: number;
  data: string;
  score: number; // 0-100%
  motivo: string;
}

export interface BankStatementItem {
  id: string;
  bankAccountId: string;
  bankAccountNome?: string;
  ofxImportId?: string | null;
  fitId: string;
  dataLancamento: string;
  documento?: string | null;
  descricao: string;
  valor: number;
  tipo: TipoLancamentoExtrato;
  statusConciliacao: StatusConciliacao;
  conciliadoComTipo?: string | null;
  conciliadoComId?: string | null;
  conciliadoPor?: string | null;
  dataConciliacao?: string | null;
  scoreConfianca?: number | null;
  observacoes?: string | null;
  candidateMatches?: ReconciliationMatchCandidate[];
  createdAt: string;
}

export interface OfxImport {
  id: string;
  bankAccountId: string;
  nomeArquivo: string;
  dataInicio: string;
  dataFim: string;
  totalTransacoes: number;
  totalCreditos: number;
  totalDebitos: number;
  status: string;
  criadoEm: string;
}

export interface ReconciliationSummary {
  totalItens: number;
  totalConciliado: number;
  totalPendente: number;
  totalIgnorado: number;
  percentualConciliado: number;
  valorPendenteCreditos: number;
  valorPendenteDebitos: number;
}

export interface GatewayIntegration {
  id: string;
  nome: string;
  codigo: string;
  status: StatusGateway;
  taxaMdrPadrao: number;
  webhookUrl?: string | null;
  totalTransacoesHoje: number;
  volumeHoje: number;
  taxaPraticadaMedia: number;
  desvioMdr: number;
  ultimaSincronizacao?: string | null;
  createdAt: string;
  updatedAt: string;
}
