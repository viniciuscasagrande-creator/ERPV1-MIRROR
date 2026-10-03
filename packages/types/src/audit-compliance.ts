/**
 * Tipos e Interfaces da Fase 23: Auditoria Contínua com IA, Detecção de Fraudes e Compliance LGPD/CVM
 * Legislação: Lei 13.709/18 (LGPD Art. 16/18), Resoluções CVM e NBC TA de Auditoria Contábil
 */

export enum NivelRiscoFraude {
  BAIXO = 'BAIXO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO',
}

export enum StatusFraudeTransacao {
  APROVADO = 'APROVADO',
  QUARENTENA = 'QUARENTENA',
  BLOQUEADO = 'BLOQUEADO',
  ANALISE_MANUAL = 'ANALISE_MANUAL',
}

export enum TipoAnomaliaAuditoria {
  DIVERGENCIA_GATEWAY_BORDERO = 'DIVERGENCIA_GATEWAY_BORDERO',
  PARTILHA_TAXA_IRREGULAR = 'PARTILHA_TAXA_IRREGULAR',
  TENTATIVA_LANCAMENTO_PERIODO_FECHADO = 'TENTATIVA_LANCAMENTO_PERIODO_FECHADO',
  DESVIO_SALDO_CONCILIACAO = 'DESVIO_SALDO_CONCILIACAO',
}

export enum StatusAnomaliaAuditoria {
  PENDENTE = 'PENDENTE',
  RECONHECIDO = 'RECONHECIDO',
  CORRIGIDO = 'CORRIGIDO',
  FALSO_POSITIVO = 'FALSO_POSITIVO',
}

export enum TipoSolicitacaoLgpd {
  ACESSO = 'ACESSO',
  ANONIMIZACAO = 'ANONIMIZACAO',
  PORTABILIDADE = 'PORTABILIDADE',
  REVOGACAO_CONSENTIMENTO = 'REVOGACAO_CONSENTIMENTO',
}

export enum StatusSolicitacaoLgpd {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  CONCLUIDA = 'CONCLUIDA',
  REJEITADA_PRAZO_LEGAL = 'REJEITADA_PRAZO_LEGAL',
}

export interface AiFraudDetectionDto {
  id: string;
  codigoTransacao: string;
  vendaId?: string | null;
  eventoId: string;
  eventoNome?: string;
  compradorDocumento: string;
  ipOrigem: string;
  geolocalizacaoIp: string;
  deviceFingerprint: string;
  valorTransacao: number;
  tempoPreenchimentoSeg: number;
  scoreProbabilidadeBot: number; // 0 a 100%
  scoreRiscoFraude: number; // 0 a 100%
  fatoresAlerta: string[];
  statusFraude: StatusFraudeTransacao;
  decisaoIa: string;
  analisadoPor?: string | null;
  resolvidoEm?: string | null;
  createdAt: string;
}

export interface ContinuousAuditAnomalyDto {
  id: string;
  codigoAnomalia: string;
  tipoAnomalia: TipoAnomaliaAuditoria;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  eventoId?: string | null;
  eventoNome?: string | null;
  valorDivergencia: number;
  descricaoDiagnostico: string;
  acaoCorretivaSugerida: string;
  status: StatusAnomaliaAuditoria;
  detectadoEm: string;
  reconhecidoPor?: string | null;
  reconhecidoEm?: string | null;
}

export interface LgpdComplianceRequestDto {
  id: string;
  protocoloAtendimento: string;
  titularNome: string;
  titularEmail: string;
  titularCpf: string;
  tipoSolicitacao: TipoSolicitacaoLgpd;
  prazoLimiteResposta: string;
  status: StatusSolicitacaoLgpd;
  justificativaLegal?: string | null;
  atendidoPor?: string | null;
  dataSolicitacao: string;
  dataConclusao?: string | null;
}

export interface LgpdDataAnonymizationLogDto {
  id: string;
  titularCpfHashSha256: string;
  camposAnonimizados: string[];
  camposRetidosDeverLegal: string[];
  fundamentoLegalRetencao: string;
  executadoPorDpo: string;
  dataAnonimizacao: string;
}

export interface AuditComplianceKpisDto {
  transacoesQuarentenaCount: number;
  valorFraudesPrevenidasTotal: number;
  taxaEficaciaBotSentinelPercent: number;
  anomaliasContabeisAbertasCount: number;
  solicitacoesLgpdPendentesCount: number;
  conformidadePrazosLgpdPercent: number;
}
