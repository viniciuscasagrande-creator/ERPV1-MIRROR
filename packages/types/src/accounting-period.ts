export enum StatusPeriodoContabil {
  ABERTO = 'ABERTO',
  EM_FECHAMENTO = 'EM_FECHAMENTO',
  ENCERRADO = 'ENCERRADO',
  REABERTO = 'REABERTO',
}

export interface AccountingPeriodChecklist {
  conciliacaoBancariaOk: boolean;
  detalheBancos?: string;
  conciliacaoMdrOk: boolean;
  detalheMdr?: string;
  partidasDobradasOk: boolean;
  detalhePartidasDobradas?: string;
  apuracaoFiscalOk: boolean;
  detalheFiscal?: string;
  fechamentoEventosOk: boolean;
  detalheEventos?: string;
  podeEncerrar: boolean;
}

export interface AccountingPeriodDto {
  id: string;
  competencia: string; // Ex: '2026-08', '2026-09'
  ano: number;
  mes: number;
  dataInicio: string;
  dataFim: string;
  status: StatusPeriodoContabil;
  
  // 5 Pilares do Fechamento
  conciliacaoBancariaOk: boolean;
  conciliacaoMdrOk: boolean;
  partidasDobradasOk: boolean;
  apuracaoFiscalOk: boolean;
  fechamentoEventosOk: boolean;

  fechadoPorId?: string | null;
  fechadoPorNome?: string | null;
  fechadoEm?: string | null;
  justificativaFechamento?: string | null;
  
  reabertoPorId?: string | null;
  reabertoPorNome?: string | null;
  reabertoEm?: string | null;
  motivoReabertura?: string | null;

  totalReceitas: number;
  totalDespesas: number;
  resultadoPeriodo: number;
  createdAt: string;
  updatedAt: string;
}

export interface FecharPeriodoDto {
  justificativa: string;
}

export interface ReabrirPeriodoDto {
  motivo: string;
}

export interface PeriodLockCheckResult {
  bloqueado: boolean;
  competencia: string;
  status: StatusPeriodoContabil;
  mensagem?: string;
}
