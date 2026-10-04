export enum DepartmentType {
  BILHETERIA_PDV = 'BILHETERIA_PDV',
  SUPORTE_CLIENTE = 'SUPORTE_CLIENTE',
  TECNOLOGIA = 'TECNOLOGIA',
  FINANCEIRO = 'FINANCEIRO',
  OPERACOES_EVENTOS = 'OPERACOES_EVENTOS',
  RH = 'RH',
  DIRETORIA = 'DIRETORIA',
}

export enum EmploymentRegime {
  CLT = 'CLT',
  PJ = 'PJ',
  ESTAGIO = 'ESTAGIO',
  JOVEM_APRENDIZ = 'JOVEM_APRENDIZ',
}

export enum EmployeeStatus {
  ATIVO = 'ATIVO',
  FERIAS = 'FERIAS',
  AFASTADO_INSS = 'AFASTADO_INSS',
  DESLIGADO = 'DESLIGADO',
}

export enum TimeClockType {
  ENTRADA_1 = 'ENTRADA_1',
  SAIDA_ALMOCO = 'SAIDA_ALMOCO',
  RETORNO_ALMOCO = 'RETORNO_ALMOCO',
  SAIDA_2 = 'SAIDA_2',
  HORAS_EXTRAS_INICIO = 'HORAS_EXTRAS_INICIO',
  HORAS_EXTRAS_FIM = 'HORAS_EXTRAS_FIM',
}

export type HrViewProfile = 'RH_ADMIN' | 'GESTOR' | 'COLABORADOR' | 'FINANCEIRO_DISK';

export interface EmployeeHrDto {
  id: string;
  matricula: string;
  nomeCompleto: string;
  cpf: string;
  rg?: string;
  pisPasep?: string;
  ctpsNumero?: string;
  emailCorporativo: string;
  emailPessoal?: string;
  telefone: string;
  cargo: string;
  departamento: DepartmentType;
  regimeContratacao: EmploymentRegime;
  salarioBase: number;
  dataAdmissao: string;
  status: EmployeeStatus;
  bancoNome?: string;
  agenciaBancaria?: string;
  contaCorrente?: string;
  chavePix?: string;
  jornadaSemanalHoras: number;
  saldoBancoHorasMinutos: number;
  fotoPerfilUrl?: string;
  gestorResponsavel?: string;
  centroCusto?: string;
  enderecoCompleto?: string;
}

export interface CreateEmployeeHrDto {
  nomeCompleto: string;
  cpf: string;
  rg?: string;
  pisPasep?: string;
  ctpsNumero?: string;
  emailCorporativo: string;
  emailPessoal?: string;
  telefone: string;
  cargo: string;
  departamento: DepartmentType;
  regimeContratacao: EmploymentRegime;
  salarioBase: number;
  dataAdmissao: string;
  bancoNome?: string;
  agenciaBancaria?: string;
  contaCorrente?: string;
  chavePix?: string;
  jornadaSemanalHoras?: number;
  gestorResponsavel?: string;
  centroCusto?: string;
}

export interface TimeClockRecordDto {
  id: string;
  employeeId: string;
  employeeNome?: string;
  dataHoraRegistro: string;
  tipoRegistro: TimeClockType;
  latitude?: number;
  longitude?: number;
  localizacaoDescricao?: string;
  ipOrigem?: string;
  dispositivoOrigem?: string;
  hashBiometriaSelfie?: string;
  statusPortariaMtp671: string;
  comprovanteNsrNumero: number;
  observacao?: string;
}

export interface PunchClockRequestDto {
  employeeId: string;
  tipoRegistro: TimeClockType;
  latitude?: number;
  longitude?: number;
  localizacaoDescricao?: string;
  fotoBiometriaBase64?: string;
  dispositivoOrigem?: string;
  observacao?: string;
}

export interface PunchClockResponseDto {
  success: boolean;
  comprovanteNsrNumero: number;
  dataHoraRegistro: string;
  employeeNome: string;
  tipoRegistro: TimeClockType;
  hashAutenticacaoMtp671: string;
  localizacao: string;
  mensagem: string;
}

export interface EmployeeTimecardSummaryDto {
  employeeId: string;
  employeeNome: string;
  matricula: string;
  competenciaMesAno: string;
  totalHorasPrevistas: number;
  totalHorasTrabalhadas: number;
  totalHorasExtras50: number;
  totalHorasExtras100: number;
  totalHorasNoturnas: number;
  totalAtrasosMinutos: number;
  saldoBancoHorasMinutos: number;
  batidasMes: TimeClockRecordDto[];
  espelhoAssinadoPeloColaborador: boolean;
}

export interface PayslipItemDto {
  codigoVerba: string;
  descricao: string;
  tipo: 'PROVENTO' | 'DESCONTO';
  referencia: string;
  valor: number;
}

export interface PayrollPayslipDto {
  id: string;
  employeeId: string;
  employeeNome?: string;
  matricula?: string;
  cargo?: string;
  departamento?: string;
  competenciaMesAno: string;
  tipoFolha: string;
  salarioBase: number;
  totalProventos: number;
  totalDescontos: number;
  valorLiquidoReceber: number;
  baseCalculoInss: number;
  descontoInss: number;
  baseCalculoIrrf: number;
  descontoIrrf: number;
  depositoFgtsMes: number;
  itensDetalhados: PayslipItemDto[];
  status: 'DISPONIVEL' | 'ASSINADO_PELO_COLABORADOR' | 'PAGO';
  dataAssinatura?: string;
  hashReciboEntrega: string;
  dataPagamento?: string;
}

export interface HrNoticeDto {
  id: string;
  titulo: string;
  conteudo: string;
  departamentoAlvo: string;
  prioridade: 'NORMAL' | 'ALTA' | 'URGENTE';
  requerConfirmacaoLeitura: boolean;
  totalLeiturasConfirmadas: number;
  ativo: boolean;
  publicadoPor: string;
  dataPublicacao: string;
}

export interface TimeOffRequestDto {
  id: string;
  employeeId: string;
  employeeNome?: string;
  tipo: 'FERIAS' | 'ATESTADO_MEDICO' | 'LICENCA_MATERNIDADE' | 'LICENCA_PATERNIDADE' | 'FOLGA_BANCO_HORAS';
  dataInicio: string;
  dataFim: string;
  diasTotais: number;
  venderDiasAbono: boolean;
  adiantarDecimoTerceiro: boolean;
  status: 'PENDENTE' | 'APROVADO_GESTOR' | 'HOMOLOGADO_RH' | 'REPROVADO';
  motivoAprovacaoReprovacao?: string;
  documentoAnexoUrl?: string;
  createdAt: string;
}

export interface HrOverviewKpisDto {
  totalColaboradores: number;
  colaboradoresAtivos: number;
  colaboradoresFerias: number;
  totalFolhaMensalBRL: number;
  totalFgtsMesBRL: number;
  totalInssPatronalBRL: number;
  saldoBancoHorasEquipeHoras: number;
  batidasPontoHoje: number;
  avisosAtivosMural: number;
  solicitacoesPendentesAprovacao: number;
}

// -------------------------------------------------------------------------
// EXTENSÃO ENTERPRISE CORPORATIVA DISKINGRESSOS
// -------------------------------------------------------------------------

export interface HrDashboardHeaderDto {
  colaboradoresAtivos: number;
  colaboradoresEmFerias: number;
  admissoesDoMes: number;
  desligamentosDoMes: number;
  horasExtrasHoras: number;
  ausenciasAtestados: number;
  feriasProximasVencer: number;
  custoMensalPessoalBRL: number;
}

export interface HrImmediateAlertDto {
  id: string;
  tipo: 'CONTRATO_VENCENDO' | 'FERIAS_DOBRO' | 'DOC_PENDENTE' | 'ASO_VENCENDO' | 'APROVACAO_PENDENTE';
  titulo: string;
  descricao: string;
  criticidade: 'ALTA' | 'MEDIA' | 'CRITICA';
  dataLimite: string;
  colaboradorId?: string;
  colaboradorNome?: string;
  linkAcao?: string;
}

export interface DepartmentOrgDto {
  id: string;
  nome: string;
  gestorLider: string;
  totalColaboradores: number;
  orcamentoMensalBRL: number;
  centroCustoCodigo: string;
}

export interface JobPositionDto {
  id: string;
  titulo: string;
  departamento: string;
  faixaSalarialMin: number;
  faixaSalarialMax: number;
  nivel: 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA' | 'LIDERANCA';
  descricaoSumaria: string;
}

export interface AdmissionProcessDto {
  id: string;
  candidatoNome: string;
  cpf: string;
  cargoPretendido: string;
  departamento: string;
  dataPrevisaoInicio: string;
  salarioProposto: number;
  etapaAtual: 'DOCUMENTACAO' | 'EXAME_ASO' | 'CONTRATO_ASSINATURA' | 'INTEGRACAO_ONBOARDING' | 'CONCLUIDO';
  progressoChecklistPorcentagem: number;
  documentosEnviados: number;
  documentosTotaisExigidos: number;
}

export interface OnboardingItemDto {
  id: string;
  categoria: 'EQUIPAMENTOS' | 'ACESSOS_SISTEMAS' | 'TREINAMENTO' | 'DOCUMENTOS';
  descricao: string;
  responsavel: string;
  concluido: boolean;
  dataConclusao?: string;
}

export interface HrDocumentDto {
  id: string;
  employeeId: string;
  employeeNome: string;
  titulo: string;
  tipoDocumento: 'CONTRATO_TRABALHO' | 'TERMO_CONFIDENCIALIDADE' | 'TERMO_EQUIPAMENTOS' | 'ASO' | 'CERTIFICADO' | 'COMPROVANTE';
  dataEmissao: string;
  dataVencimento?: string;
  statusAssinatura: 'ASSINADO_DIGITALMENTE' | 'PENDENTE_ASSINATURA' | 'DISPENSADO';
  hashIcpBrasil?: string;
  arquivoUrl: string;
}

export interface BenefitPlanDto {
  id: string;
  nome: string;
  tipo: 'VALE_TRANSPORTE' | 'VALE_REFEICAO_ALIMENTACAO' | 'PLANO_SAUDE_UNIMED' | 'PLANO_ODONTOLOGICO' | 'SEGURO_VIDA' | 'AUXILIO_HOME_OFFICE' | 'INGRESSOS_CORTESIA';
  fornecedorParceiro: string;
  custoEmpresaPorColaboradorBRL: number;
  coparticipacaoPercentual: number;
  totalAderentes: number;
  ativo: boolean;
}

export interface EmployeeBenefitAssignmentDto {
  id: string;
  employeeId: string;
  employeeNome: string;
  beneficioId: string;
  beneficioNome: string;
  valorMensalBRL: number;
  descontoEmFolhaBRL: number;
  dataAdesao: string;
}

export interface JobPostingDto {
  id: string;
  tituloVaga: string;
  departamento: string;
  quantidadeVagas: number;
  tipoContrato: 'CLT' | 'PJ' | 'TEMPORARIO_EVENTOS';
  localTrabalho: string;
  status: 'ABERTA' | 'EM_SELECAO' | 'ENCERRADA';
  totalCandidatos: number;
  dataPublicacao: string;
}

export interface JobCandidateDto {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  etapaAtual: 'TRIAGEM' | 'ENTREVISTA_RH' | 'ENTREVISTA_GESTOR' | 'PROPOSTA' | 'CONTRATADO' | 'DESCLASSIFICADO';
  pretensaoSalarial: number;
  scoreAfinidadeIA: number;
  feedbackResumido?: string;
}

export interface PerformanceReviewDto {
  id: string;
  cicloNome: string;
  employeeId: string;
  employeeNome: string;
  gestorAvaliador: string;
  notaGeralCompetencias: number; // 0 a 10
  notaAtingimentoMetas: number; // 0 a 10
  status: 'AUTOAVALIACAO' | 'AVALIACAO_GESTOR' | 'CALIBRACAO' | 'CONCLUIDO';
  pontosFortes: string;
  pontosDesenvolvimento: string;
  pdiStatus: 'EM_ANDAMENTO' | 'CONCLUIDO';
}

export interface PdiActionItemDto {
  id: string;
  tituloAcao: string;
  prazoConclusao: string;
  status: 'NAO_INICIADO' | 'EM_PROGRESSO' | 'CONCLUIDO';
}

export interface TrainingProgramDto {
  id: string;
  tituloCurso: string;
  categoria: 'OBRIGATORIO_NR' | 'SISTEMAS_DISK' | 'ATENDIMENTO_CLIENTE' | 'LIDERANCA' | 'SEGURANCA_EVENTOS';
  cargaHorariaHoras: number;
  validadeMeses?: number;
  instrutorResponsavel: string;
  totalConcluintes: number;
  totalInscritos: number;
}

export interface OccupationalExamDto {
  id: string;
  employeeId: string;
  employeeNome: string;
  tipoExame: 'ADMISSIONAL' | 'PERIODICO' | 'RETORNO_TRABALHO' | 'MUDANCA_FUNCAO' | 'DEMISSIONAL';
  clinicaResponsavel: string;
  medicoCrm: string;
  dataRealizacao: string;
  dataValidadeProxima: string;
  resultadoAptidao: 'APTO' | 'APTO_COM_RESTRICOES' | 'INAPTO';
  observacoes?: string;
}

export interface TerminationProcessDto {
  id: string;
  employeeId: string;
  employeeNome: string;
  departamento: string;
  cargo: string;
  tipoDesligamento: 'DEMISSAO_SEM_JUSTA_CAUSA' | 'DEMISSAO_COM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'ACORDO_MUTUO_ART_484A';
  dataUltimoDia: string;
  status: 'SOLICITADO' | 'APROVADO_DIRETORIA' | 'CHECKLIST_DEVOLUCOES' | 'TRCT_HOMOLOGADO' | 'PAGO_FINALIZADO';
  valorRescisaoLiquidaBRL: number;
  equipamentosDevolvidos: boolean;
  acessosSistemasRevogados: boolean;
  exameDemissionalConcluido: boolean;
}

// -------------------------------------------------------------------------
// DIFERENCIAL EXCLUSIVO DISKINGRESSOS: EQUIPES & CUSTOS POR EVENTO
// -------------------------------------------------------------------------

export interface EventStaffAllocationDto {
  id: string;
  eventoId: string;
  eventoNome: string;
  localEvento: string;
  dataEvento: string;
  employeeId?: string;
  employeeNome: string;
  tipoContratacao: 'INTERNO_DISK' | 'FREELANCER_EVENTO' | 'TEMPORARIO';
  funcaoOperacional: 'SUPERVISOR_BILHETERIA' | 'OPERADOR_CAIXA' | 'VALIDADOR_ACESSO' | 'SUPORTE_TI' | 'COORDENADOR_PRODUCAO';
  horasPrevistas: number;
  horasRealizadas: number;
  valorDiariaCache: number;
  valorHorasExtras: number;
  statusCheckin: 'CONFIRMADO' | 'PRESENTE' | 'FINALIZADO' | 'FALTA';
}

export interface EventStaffCostSummaryDto {
  eventoId: string;
  eventoNome: string;
  dataEvento: string;
  localEvento: string;
  equipeOperacionalBRL: number;
  horasExtrasBRL: number;
  alimentacaoBRL: number;
  transporteBRL: number;
  freelancersBRL: number;
  custoTotalPessoalBRL: number;
  centroCustoEvento: string;
  integradoAoDreEvento: boolean;
  totalPessoasAlocadas: number;
}

export interface HrAnalyticsReportDto {
  headcountTotal: number;
  taxaTurnoverMensal: number;
  taxaAbsenteismoPercentual: number;
  horasExtrasTotalHoras: number;
  custoTotalPessoalBRL: number;
  custoMedioPorColaboradorBRL: number;
  distribuicaoPorDepartamento: { departamento: string; quantidade: number; custoBRL: number }[];
  distribuicaoRegime: { regime: string; quantidade: number }[];
}

export interface HrAuditLgpdLogDto {
  id: string;
  dataHora: string;
  usuarioOperador: string;
  perfilOperador: string;
  acaoRealizada: string;
  colaboradorAfetado: string;
  dadosAcessadosOuAlterados: string;
  justificativaLgpd: string;
  ipOrigem: string;
}
