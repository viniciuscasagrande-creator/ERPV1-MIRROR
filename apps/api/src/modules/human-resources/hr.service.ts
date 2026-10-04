import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  DepartmentType,
  EmploymentRegime,
  EmployeeStatus,
  TimeClockType,
  EmployeeHrDto,
  CreateEmployeeHrDto,
  TimeClockRecordDto,
  PunchClockRequestDto,
  PunchClockResponseDto,
  EmployeeTimecardSummaryDto,
  PayrollPayslipDto,
  HrNoticeDto,
  TimeOffRequestDto,
  HrOverviewKpisDto,
  HrDashboardHeaderDto,
  HrImmediateAlertDto,
  DepartmentOrgDto,
  JobPositionDto,
  AdmissionProcessDto,
  BenefitPlanDto,
  EmployeeBenefitAssignmentDto,
  JobPostingDto,
  JobCandidateDto,
  PerformanceReviewDto,
  TrainingProgramDto,
  OccupationalExamDto,
  TerminationProcessDto,
  EventStaffAllocationDto,
  EventStaffCostSummaryDto,
  HrAnalyticsReportDto,
  HrAuditLgpdLogDto,
} from '@diskingressos/types';

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

  private inMemoryEmployees: EmployeeHrDto[] = [
    {
      id: 'emp-001',
      matricula: 'DSK-00101',
      nomeCompleto: 'Ana Carolina Meirelles',
      cpf: '123.456.789-01',
      rg: '9.876.543-2 SSP/PR',
      pisPasep: '120.45892.11-9',
      ctpsNumero: '4829102/0010-PR',
      emailCorporativo: 'ana.meirelles@diskingressos.com.br',
      emailPessoal: 'aninha.meirelles@gmail.com',
      telefone: '(41) 99876-5432',
      cargo: 'Supervisora de Bilheteria & Operações de Campo',
      departamento: DepartmentType.BILHETERIA_PDV,
      regimeContratacao: EmploymentRegime.CLT,
      salarioBase: 4850.0,
      dataAdmissao: '2023-03-15T00:00:00Z',
      status: EmployeeStatus.ATIVO,
      bancoNome: 'Banco Itaú S.A.',
      agenciaBancaria: '3829',
      contaCorrente: '29102-4',
      chavePix: '12345678901',
      jornadaSemanalHoras: 44,
      saldoBancoHorasMinutos: 360,
      fotoPerfilUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      gestorResponsavel: 'Mariana Duarte (Diretora Operacional)',
      centroCusto: 'CC-201 (Operações de Campo)',
      enderecoCompleto: 'Rua Fernando Moreira, 420 - Centro, Curitiba/PR',
    },
    {
      id: 'emp-002',
      matricula: 'DSK-00102',
      nomeCompleto: 'Lucas Gabriel Pinheiro',
      cpf: '234.567.890-12',
      rg: '10.234.567-8 SSP/PR',
      pisPasep: '131.98234.22-4',
      ctpsNumero: '5910293/0020-PR',
      emailCorporativo: 'lucas.pinheiro@diskingressos.com.br',
      telefone: '(41) 99123-4567',
      cargo: 'Desenvolvedor Full Stack Sênior',
      departamento: DepartmentType.TECNOLOGIA,
      regimeContratacao: EmploymentRegime.CLT,
      salarioBase: 9200.0,
      dataAdmissao: '2022-08-01T00:00:00Z',
      status: EmployeeStatus.ATIVO,
      bancoNome: 'Banco Santander (Brasil) S.A.',
      agenciaBancaria: '0912',
      contaCorrente: '130982-1',
      chavePix: 'lucas.pinheiro@diskingressos.com.br',
      jornadaSemanalHoras: 40,
      saldoBancoHorasMinutos: 180,
      fotoPerfilUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      gestorResponsavel: 'Vinicius Nader (CTO)',
      centroCusto: 'CC-101 (Tecnologia & Inovação)',
      enderecoCompleto: 'Av. Cândido de Abreu, 820 - Centro Cívico, Curitiba/PR',
    },
    {
      id: 'emp-003',
      matricula: 'DSK-00103',
      nomeCompleto: 'Beatriz Cristina Fontana',
      cpf: '345.678.901-23',
      rg: '8.192.834-1 SSP/PR',
      pisPasep: '142.10923.33-1',
      ctpsNumero: '6102938/0030-PR',
      emailCorporativo: 'beatriz.fontana@diskingressos.com.br',
      telefone: '(41) 98877-6655',
      cargo: 'Analista de Suporte ao Cliente & SAC',
      departamento: DepartmentType.SUPORTE_CLIENTE,
      regimeContratacao: EmploymentRegime.CLT,
      salarioBase: 3100.0,
      dataAdmissao: '2024-01-10T00:00:00Z',
      status: EmployeeStatus.ATIVO,
      bancoNome: 'Nubank (Nu Pagamentos S.A.)',
      agenciaBancaria: '0001',
      contaCorrente: '9823412-8',
      chavePix: 'beatriz.fontana@diskingressos.com.br',
      jornadaSemanalHoras: 44,
      saldoBancoHorasMinutos: -120,
      fotoPerfilUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      gestorResponsavel: 'Ana Carolina Meirelles',
      centroCusto: 'CC-301 (Atendimento & SAC)',
      enderecoCompleto: 'Rua Brigadeiro Franco, 1500 - Batel, Curitiba/PR',
    },
    {
      id: 'emp-004',
      matricula: 'DSK-00104',
      nomeCompleto: 'Matheus Henrique Silveira',
      cpf: '456.789.012-34',
      rg: '11.092.847-5 SSP/PR',
      pisPasep: '153.21098.44-8',
      ctpsNumero: '7291048/0040-PR',
      emailCorporativo: 'matheus.silveira@diskingressos.com.br',
      telefone: '(41) 99988-1122',
      cargo: 'Coordenador Financeiro & Conciliação',
      departamento: DepartmentType.FINANCEIRO,
      regimeContratacao: EmploymentRegime.CLT,
      salarioBase: 6500.0,
      dataAdmissao: '2021-11-03T00:00:00Z',
      status: EmployeeStatus.ATIVO,
      bancoNome: 'Banco Bradesco S.A.',
      agenciaBancaria: '1240',
      contaCorrente: '48192-0',
      chavePix: 'matheus.silveira@diskingressos.com.br',
      jornadaSemanalHoras: 40,
      saldoBancoHorasMinutos: 480,
      fotoPerfilUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      gestorResponsavel: 'Diretoria Financeira',
      centroCusto: 'CC-401 (Controladoria & Financeiro)',
      enderecoCompleto: 'Rua Visconde de Nácar, 1205 - Mercês, Curitiba/PR',
    },
    {
      id: 'emp-005',
      matricula: 'DSK-00105',
      nomeCompleto: 'Juliana Paes Rodrigues',
      cpf: '567.890.123-45',
      rg: '7.891.234-9 SSP/PR',
      pisPasep: '164.32109.55-5',
      ctpsNumero: '8392019/0050-PR',
      emailCorporativo: 'juliana.rodrigues@diskingressos.com.br',
      telefone: '(41) 98765-4321',
      cargo: 'Especialista em RH & DP',
      departamento: DepartmentType.RH,
      regimeContratacao: EmploymentRegime.CLT,
      salarioBase: 5200.0,
      dataAdmissao: '2023-05-20T00:00:00Z',
      status: EmployeeStatus.ATIVO,
      bancoNome: 'Banco do Brasil S.A.',
      agenciaBancaria: '0018',
      contaCorrente: '19283-9',
      chavePix: 'juliana.rodrigues@diskingressos.com.br',
      jornadaSemanalHoras: 40,
      saldoBancoHorasMinutos: 60,
      fotoPerfilUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      gestorResponsavel: 'Diretoria Executiva',
      centroCusto: 'CC-501 (Gente & Gestão)',
      enderecoCompleto: 'Rua Desembargador Motta, 2100 - Água Verde, Curitiba/PR',
    },
  ];

  private inMemoryTimePunches: TimeClockRecordDto[] = [
    {
      id: 'clk-001',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      dataHoraRegistro: new Date(new Date().setHours(8, 2, 14)).toISOString(),
      tipoRegistro: TimeClockType.ENTRADA_1,
      latitude: -25.4284,
      longitude: -49.2733,
      localizacaoDescricao: 'Sede DiskIngressos Curitiba - PR',
      ipOrigem: '189.102.45.12',
      dispositivoOrigem: 'REP-P Disk Web / Chrome Windows',
      hashBiometriaSelfie: 'a8f5f167f44f4964e6c998dee827110c',
      statusPortariaMtp671: 'VALIDADO_REP_P',
      comprovanteNsrNumero: 18490,
    },
    {
      id: 'clk-002',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      dataHoraRegistro: new Date(new Date().setHours(12, 1, 5)).toISOString(),
      tipoRegistro: TimeClockType.SAIDA_ALMOCO,
      latitude: -25.4284,
      longitude: -49.2733,
      localizacaoDescricao: 'Sede DiskIngressos Curitiba - PR',
      ipOrigem: '189.102.45.12',
      dispositivoOrigem: 'REP-P Disk Web / Chrome Windows',
      statusPortariaMtp671: 'VALIDADO_REP_P',
      comprovanteNsrNumero: 18491,
    },
    {
      id: 'clk-003',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      dataHoraRegistro: new Date(new Date().setHours(13, 2, 45)).toISOString(),
      tipoRegistro: TimeClockType.RETORNO_ALMOCO,
      latitude: -25.4284,
      longitude: -49.2733,
      localizacaoDescricao: 'Sede DiskIngressos Curitiba - PR',
      ipOrigem: '189.102.45.12',
      dispositivoOrigem: 'REP-P Disk Web / Chrome Windows',
      statusPortariaMtp671: 'VALIDADO_REP_P',
      comprovanteNsrNumero: 18492,
    },
    {
      id: 'clk-004',
      employeeId: 'emp-002',
      employeeNome: 'Lucas Gabriel Pinheiro',
      dataHoraRegistro: new Date(new Date().setHours(8, 58, 22)).toISOString(),
      tipoRegistro: TimeClockType.ENTRADA_1,
      latitude: -25.4284,
      longitude: -49.2733,
      localizacaoDescricao: 'Trabalho Remoto Autorizado / Sede Híbrida',
      ipOrigem: '177.18.99.31',
      dispositivoOrigem: 'REP-P Disk Web / Mac OS',
      statusPortariaMtp671: 'VALIDADO_REP_P',
      comprovanteNsrNumero: 18493,
    },
  ];

  private inMemoryPayslips: PayrollPayslipDto[] = [
    {
      id: 'hol-001',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      matricula: 'DSK-00101',
      cargo: 'Supervisora de Bilheteria & Operações de Campo',
      departamento: 'BILHETERIA_PDV',
      competenciaMesAno: '09/2026',
      tipoFolha: 'MENSAL_NORMAL',
      salarioBase: 4850.0,
      totalProventos: 5556.25,
      totalDescontos: 1142.18,
      valorLiquidoReceber: 4414.07,
      baseCalculoInss: 5556.25,
      descontoInss: 614.78,
      baseCalculoIrrf: 4941.47,
      descontoIrrf: 236.4,
      depositoFgtsMes: 444.5,
      itensDetalhados: [
        { codigoVerba: '001', descricao: 'Salário Base Mensal', tipo: 'PROVENTO', referencia: '30d', valor: 4850.0 },
        { codigoVerba: '015', descricao: 'Horas Extras 50% (Eventos)', tipo: 'PROVENTO', referencia: '12h', valor: 551.14 },
        { codigoVerba: '020', descricao: 'Reflexo DSR s/ Horas Extras', tipo: 'PROVENTO', referencia: '4d', valor: 155.11 },
        { codigoVerba: '101', descricao: 'INSS Folha (Tabela Progressiva)', tipo: 'DESCONTO', referencia: '14%', valor: 614.78 },
        { codigoVerba: '102', descricao: 'IRRF Fonte Mensal', tipo: 'DESCONTO', referencia: '22.5%', valor: 236.4 },
        { codigoVerba: '105', descricao: 'Vale Transporte (Lei 7.418/85)', tipo: 'DESCONTO', referencia: '6%', valor: 291.0 },
      ],
      status: 'ASSINADO_PELO_COLABORADOR',
      dataAssinatura: '2026-10-01T14:32:00Z',
      hashReciboEntrega: 'e57c6b90f4884c79802871b9c9f7a46f9050d2bb071e46b9a8968f9a2e6f4671',
      dataPagamento: '2026-10-05',
    },
    {
      id: 'hol-002',
      employeeId: 'emp-002',
      employeeNome: 'Lucas Gabriel Pinheiro',
      matricula: 'DSK-00102',
      cargo: 'Desenvolvedor Full Stack Sênior',
      departamento: 'TECNOLOGIA',
      competenciaMesAno: '09/2026',
      tipoFolha: 'MENSAL_NORMAL',
      salarioBase: 9200.0,
      totalProventos: 9200.0,
      totalDescontos: 2471.93,
      valorLiquidoReceber: 6728.07,
      baseCalculoInss: 7786.02,
      descontoInss: 908.86,
      baseCalculoIrrf: 8291.14,
      descontoIrrf: 1563.07,
      depositoFgtsMes: 736.0,
      itensDetalhados: [
        { codigoVerba: '001', descricao: 'Salário Base Mensal', tipo: 'PROVENTO', referencia: '30d', valor: 9200.0 },
        { codigoVerba: '101', descricao: 'INSS Folha (Teto INSS)', tipo: 'DESCONTO', referencia: '14%', valor: 908.86 },
        { codigoVerba: '102', descricao: 'IRRF Fonte Mensal (Teto 27.5%)', tipo: 'DESCONTO', referencia: '27.5%', valor: 1563.07 },
      ],
      status: 'DISPONIVEL',
      hashReciboEntrega: 'a91c7849e7284b8cb678912c983a54b98042c12a781b490ca9128f72a4564671',
    },
  ];

  private inMemoryNotices: HrNoticeDto[] = [
    {
      id: 'not-001',
      titulo: 'Novo Protocolo de Escala de Bilheteria - Festival Pedreira Curitiba',
      conteudo: 'Informamos a toda equipe de operações que as escalas para o festival de sábado foram consolidadas. O ponto eletrônico REP-P estará operando via geocerca nos portões principais.',
      departamentoAlvo: 'OPERACOES_EVENTOS',
      prioridade: 'ALTA',
      requerConfirmacaoLeitura: true,
      totalLeiturasConfirmadas: 18,
      ativo: true,
      publicadoPor: 'Recursos Humanos DiskIngressos',
      dataPublicacao: '2026-10-02T10:00:00Z',
    },
    {
      id: 'not-002',
      titulo: 'Campanha de Vacinação e Exames Periódicos de Saúde Ocupacional (PCMSO)',
      conteudo: 'A clínica credenciada estará disponível nesta quinta-feira na sede para renovação do ASO de todos os colaboradores do atendimento e financeiro.',
      departamentoAlvo: 'TODOS',
      prioridade: 'NORMAL',
      requerConfirmacaoLeitura: false,
      totalLeiturasConfirmadas: 34,
      ativo: true,
      publicadoPor: 'Juliana Paes Rodrigues (RH)',
      dataPublicacao: '2026-09-28T14:30:00Z',
    },
  ];

  private inMemoryTimeOff: TimeOffRequestDto[] = [
    {
      id: 'to-001',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      tipo: 'FERIAS',
      dataInicio: '2026-11-10T00:00:00Z',
      dataFim: '2026-11-29T00:00:00Z',
      diasTotais: 20,
      venderDiasAbono: true,
      adiantarDecimoTerceiro: true,
      status: 'HOMOLOGADO_RH',
      createdAt: '2026-09-15T11:00:00Z',
    },
    {
      id: 'to-002',
      employeeId: 'emp-003',
      employeeNome: 'Beatriz Cristina Fontana',
      tipo: 'FERIAS',
      dataInicio: '2026-12-01T00:00:00Z',
      dataFim: '2026-12-15T00:00:00Z',
      diasTotais: 15,
      venderDiasAbono: false,
      adiantarDecimoTerceiro: false,
      status: 'PENDENTE',
      createdAt: '2026-10-01T09:20:00Z',
    },
  ];

  // -------------------------------------------------------------------------
  // DIFERENCIAL EXCLUSIVO: ALOCAÇÕES E CUSTOS DE PESSOAL POR EVENTO (DISKINGRESSOS)
  // -------------------------------------------------------------------------
  private inMemoryEventStaffAllocations: EventStaffAllocationDto[] = [
    {
      id: 'esa-001',
      eventoId: 'evt-poprock-01',
      eventoNome: 'Festival Curitiba Pop Rock 2026',
      localEvento: 'Pedreira Paulo Leminski - Curitiba/PR',
      dataEvento: '2026-10-18',
      employeeId: 'emp-001',
      employeeNome: 'Ana Carolina Meirelles',
      tipoContratacao: 'INTERNO_DISK',
      funcaoOperacional: 'SUPERVISOR_BILHETERIA',
      horasPrevistas: 12,
      horasRealizadas: 14,
      valorDiariaCache: 350.0,
      valorHorasExtras: 180.0,
      statusCheckin: 'CONFIRMADO',
    },
    {
      id: 'esa-002',
      eventoId: 'evt-poprock-01',
      eventoNome: 'Festival Curitiba Pop Rock 2026',
      localEvento: 'Pedreira Paulo Leminski - Curitiba/PR',
      dataEvento: '2026-10-18',
      employeeNome: 'Rodrigo Alcantara dos Santos',
      tipoContratacao: 'FREELANCER_EVENTO',
      funcaoOperacional: 'OPERADOR_CAIXA',
      horasPrevistas: 10,
      horasRealizadas: 10,
      valorDiariaCache: 220.0,
      valorHorasExtras: 0.0,
      statusCheckin: 'CONFIRMADO',
    },
    {
      id: 'esa-003',
      eventoId: 'evt-poprock-01',
      eventoNome: 'Festival Curitiba Pop Rock 2026',
      localEvento: 'Pedreira Paulo Leminski - Curitiba/PR',
      dataEvento: '2026-10-18',
      employeeNome: 'Camila Fernandes Viana',
      tipoContratacao: 'FREELANCER_EVENTO',
      funcaoOperacional: 'VALIDADOR_ACESSO',
      horasPrevistas: 10,
      horasRealizadas: 10,
      valorDiariaCache: 190.0,
      valorHorasExtras: 0.0,
      statusCheckin: 'CONFIRMADO',
    },
    {
      id: 'esa-004',
      eventoId: 'evt-turne-arena',
      eventoNome: 'Show Internacional Turnê 2026',
      localEvento: 'Ligga Arena - Curitiba/PR',
      dataEvento: '2026-11-07',
      employeeId: 'emp-002',
      employeeNome: 'Lucas Gabriel Pinheiro',
      tipoContratacao: 'INTERNO_DISK',
      funcaoOperacional: 'SUPORTE_TI',
      horasPrevistas: 8,
      horasRealizadas: 8,
      valorDiariaCache: 450.0,
      valorHorasExtras: 0.0,
      statusCheckin: 'CONFIRMADO',
    },
  ];

  private inMemoryEventStaffCosts: EventStaffCostSummaryDto[] = [
    {
      eventoId: 'evt-poprock-01',
      eventoNome: 'Festival Curitiba Pop Rock 2026',
      dataEvento: '2026-10-18',
      localEvento: 'Pedreira Paulo Leminski',
      equipeOperacionalBRL: 8400.0,
      horasExtrasBRL: 2150.0,
      alimentacaoBRL: 1300.0,
      transporteBRL: 900.0,
      freelancersBRL: 4500.0,
      custoTotalPessoalBRL: 17250.0,
      centroCustoEvento: 'CC-EVT-POPROCK-2026',
      integradoAoDreEvento: true,
      totalPessoasAlocadas: 28,
    },
    {
      eventoId: 'evt-turne-arena',
      eventoNome: 'Show Internacional Turnê 2026',
      dataEvento: '2026-11-07',
      localEvento: 'Ligga Arena',
      equipeOperacionalBRL: 12800.0,
      horasExtrasBRL: 3400.0,
      alimentacaoBRL: 2200.0,
      transporteBRL: 1500.0,
      freelancersBRL: 6800.0,
      custoTotalPessoalBRL: 26700.0,
      centroCustoEvento: 'CC-EVT-ARENA-LIGGA',
      integradoAoDreEvento: true,
      totalPessoasAlocadas: 42,
    },
    {
      eventoId: 'evt-teatro-standup',
      eventoNome: 'Teatro Positivo Stand-up Comedy Especial',
      dataEvento: '2026-10-25',
      localEvento: 'Teatro Positivo - Grande Auditório',
      equipeOperacionalBRL: 3200.0,
      horasExtrasBRL: 650.0,
      alimentacaoBRL: 450.0,
      transporteBRL: 300.0,
      freelancersBRL: 1200.0,
      custoTotalPessoalBRL: 5800.0,
      centroCustoEvento: 'CC-EVT-POSITIVO-01',
      integradoAoDreEvento: true,
      totalPessoasAlocadas: 10,
    },
  ];

  // Immediate alerts
  private inMemoryAlerts: HrImmediateAlertDto[] = [
    {
      id: 'alt-001',
      tipo: 'FERIAS_DOBRO',
      titulo: 'Período Concessivo de Férias a Vencer',
      descricao: 'O colaborador Lucas Gabriel Pinheiro atinge o fim do período concessivo em 45 dias. Risco de pagamento em dobro (Art. 137 CLT).',
      criticidade: 'ALTA',
      dataLimite: '2026-11-15',
      colaboradorId: 'emp-002',
      colaboradorNome: 'Lucas Gabriel Pinheiro',
    },
    {
      id: 'alt-002',
      tipo: 'ASO_VENCENDO',
      titulo: 'Exame Ocupacional ASO Periódico Vencendo',
      descricao: 'Exame periódico PCMSO da colaboradora Beatriz Cristina Fontana vence em 14 dias.',
      criticidade: 'MEDIA',
      dataLimite: '2026-10-18',
      colaboradorId: 'emp-003',
      colaboradorNome: 'Beatriz Cristina Fontana',
    },
    {
      id: 'alt-003',
      tipo: 'DOC_PENDENTE',
      titulo: 'Comprovante de Vacinação / Dependentes IR Pendente',
      descricao: 'Documentação comprobatória de dedução do IRRF pendente de upload pelo colaborador.',
      criticidade: 'MEDIA',
      dataLimite: '2026-10-25',
      colaboradorId: 'emp-004',
      colaboradorNome: 'Matheus Henrique Silveira',
    },
    {
      id: 'alt-004',
      tipo: 'APROVACAO_PENDENTE',
      titulo: 'Aprovação de Férias Aguardando Homologação RH',
      descricao: 'Beatriz Cristina Fontana solicitou 15 dias de férias para Dezembro/2026.',
      criticidade: 'MEDIA',
      dataLimite: '2026-10-10',
      colaboradorId: 'emp-003',
      colaboradorNome: 'Beatriz Cristina Fontana',
    },
  ];

  // Structure
  private inMemoryDepartments: DepartmentOrgDto[] = [
    { id: 'dep-1', nome: 'Bilheteria & Operações de Campo', gestorLider: 'Ana Carolina Meirelles', totalColaboradores: 14, orcamentoMensalBRL: 54000, centroCustoCodigo: 'CC-201' },
    { id: 'dep-2', nome: 'Tecnologia & Inovação', gestorLider: 'Vinicius Nader (CTO)', totalColaboradores: 11, orcamentoMensalBRL: 98000, centroCustoCodigo: 'CC-101' },
    { id: 'dep-3', nome: 'Suporte ao Cliente & SAC', gestorLider: 'Mariana Duarte', totalColaboradores: 8, orcamentoMensalBRL: 28000, centroCustoCodigo: 'CC-301' },
    { id: 'dep-4', nome: 'Controladoria & Financeiro', gestorLider: 'Matheus Henrique Silveira', totalColaboradores: 5, orcamentoMensalBRL: 36000, centroCustoCodigo: 'CC-401' },
    { id: 'dep-5', nome: 'Gente, Gestão & DP', gestorLider: 'Juliana Paes Rodrigues', totalColaboradores: 4, orcamentoMensalBRL: 22000, centroCustoCodigo: 'CC-501' },
  ];

  private inMemoryJobPositions: JobPositionDto[] = [
    { id: 'pos-1', titulo: 'Supervisora de Bilheteria & Eventos', departamento: 'Bilheteria & Operações', faixaSalarialMin: 4000, faixaSalarialMax: 6500, nivel: 'LIDERANCA', descricaoSumaria: 'Coordena operação de bilheteria física, PDVs e credenciamento.' },
    { id: 'pos-2', titulo: 'Desenvolvedor Full Stack', departamento: 'Tecnologia', faixaSalarialMin: 6000, faixaSalarialMax: 12000, nivel: 'SENIOR', descricaoSumaria: 'Desenvolve e mantém o ecossistema ERP, ticketing e microsserviços.' },
    { id: 'pos-3', titulo: 'Operador de Atendimento & SAC', departamento: 'Suporte', faixaSalarialMin: 2200, faixaSalarialMax: 3500, nivel: 'PLENO', descricaoSumaria: 'Atendimento omnichannel a compradores de ingressos e produtores.' },
    { id: 'pos-4', titulo: 'Analista de Tesouraria & Conciliação', departamento: 'Financeiro', faixaSalarialMin: 4500, faixaSalarialMax: 7000, nivel: 'PLENO', descricaoSumaria: 'Fechamento de caixas, repasses aos produtores e conciliação bancária.' },
  ];

  // Admissions
  private inMemoryAdmissions: AdmissionProcessDto[] = [
    {
      id: 'adm-001',
      candidatoNome: 'Gabriel Santana Oliveira',
      cpf: '678.901.234-56',
      cargoPretendido: 'Operador de Suporte N2',
      departamento: 'SUPORTE_CLIENTE',
      dataPrevisaoInicio: '2026-11-03',
      salarioProposto: 3400.0,
      etapaAtual: 'EXAME_ASO',
      progressoChecklistPorcentagem: 65,
      documentosEnviados: 7,
      documentosTotaisExigidos: 10,
    },
    {
      id: 'adm-002',
      candidatoNome: 'Fernanda Albuquerque Lima',
      cpf: '789.012.345-67',
      cargoPretendido: 'Analista de Marketing Digital & Ads',
      departamento: 'MARKETING',
      dataPrevisaoInicio: '2026-11-15',
      salarioProposto: 5600.0,
      etapaAtual: 'DOCUMENTACAO',
      progressoChecklistPorcentagem: 40,
      documentosEnviados: 4,
      documentosTotaisExigidos: 10,
    },
  ];

  // Benefits
  private inMemoryBenefits: BenefitPlanDto[] = [
    { id: 'ben-01', nome: 'Vale Refeição / Alimentação (Flash Sodexo)', tipo: 'VALE_REFEICAO_ALIMENTACAO', fornecedorParceiro: 'Flash Benefícios Flexíveis', custoEmpresaPorColaboradorBRL: 950.0, coparticipacaoPercentual: 0, totalAderentes: 42, ativo: true },
    { id: 'ben-02', nome: 'Vale Transporte (Urbs Curitiba / Metropolitano)', tipo: 'VALE_TRANSPORTE', fornecedorParceiro: 'Urbs Urbanização de Curitiba S.A.', custoEmpresaPorColaboradorBRL: 420.0, coparticipacaoPercentual: 6, totalAderentes: 29, ativo: true },
    { id: 'ben-03', nome: 'Plano de Saúde Unimed Curitiba Master', tipo: 'PLANO_SAUDE_UNIMED', fornecedorParceiro: 'Unimed Curitiba Cooperativa', custoEmpresaPorColaboradorBRL: 680.0, coparticipacaoPercentual: 15, totalAderentes: 38, ativo: true },
    { id: 'ben-04', nome: 'Seguro de Vida em Grupo Porto Seguro', tipo: 'SEGURO_VIDA', fornecedorParceiro: 'Porto Seguro Cia de Seguros', custoEmpresaPorColaboradorBRL: 48.0, coparticipacaoPercentual: 0, totalAderentes: 42, ativo: true },
    { id: 'ben-05', nome: 'Cortesias Exclusivas DiskIngressos', tipo: 'INGRESSOS_CORTESIA', fornecedorParceiro: 'Parcerias Produtores Culturais', custoEmpresaPorColaboradorBRL: 0.0, coparticipacaoPercentual: 0, totalAderentes: 42, ativo: true },
  ];

  // Recruitment
  private inMemoryJobPostings: JobPostingDto[] = [
    { id: 'job-1', tituloVaga: 'Supervisor de Operações de Arena', departamento: 'OPERACOES_EVENTOS', quantidadeVagas: 2, tipoContrato: 'CLT', localTrabalho: 'Curitiba/PR (Presencial Eventos)', status: 'ABERTA', totalCandidatos: 24, dataPublicacao: '2026-09-20' },
    { id: 'job-2', tituloVaga: 'Desenvolvedor Frontend React / Vite', departamento: 'TECNOLOGIA', quantidadeVagas: 1, tipoContrato: 'CLT', localTrabalho: 'Híbrido Sede Disk', status: 'EM_SELECAO', totalCandidatos: 38, dataPublicacao: '2026-09-10' },
    { id: 'job-3', tituloVaga: 'Operadores de Caixa para Mega-Shows', departamento: 'BILHETERIA_PDV', quantidadeVagas: 15, tipoContrato: 'TEMPORARIO_EVENTOS', localTrabalho: 'Pedreira Paulo Leminski', status: 'ABERTA', totalCandidatos: 56, dataPublicacao: '2026-10-01' },
  ];

  private inMemoryCandidates: JobCandidateDto[] = [
    { id: 'cand-1', vagaId: 'job-1', vagaTitulo: 'Supervisor de Operações de Arena', nomeCompleto: 'Felipe Ramos Cavalcanti', email: 'felipe.cavalcanti@hotmail.com', telefone: '(41) 98455-1234', etapaAtual: 'ENTREVISTA_GESTOR', pretensaoSalarial: 4800, scoreAfinidadeIA: 94, feedbackResumido: 'Forte experiência em coordenação de festivais e controle de multidão.' },
    { id: 'cand-2', vagaId: 'job-2', vagaTitulo: 'Desenvolvedor Frontend React / Vite', nomeCompleto: 'Julio Cesar Macedo', email: 'julio.macedo.dev@gmail.com', telefone: '(41) 99233-8877', etapaAtual: 'PROPOSTA', pretensaoSalarial: 8500, scoreAfinidadeIA: 96, feedbackResumido: 'Excelente teste prático em TypeScript, Tailwind e Vite.' },
  ];

  // Performance
  private inMemoryReviews: PerformanceReviewDto[] = [
    { id: 'rev-1', cicloNome: 'Ciclo Semestral 2026.1', employeeId: 'emp-001', employeeNome: 'Ana Carolina Meirelles', gestorAvaliador: 'Mariana Duarte', notaGeralCompetencias: 9.4, notaAtingimentoMetas: 9.8, status: 'CONCLUIDO', pontosFortes: 'Liderança inspiradora em eventos com público acima de 20 mil pessoas. Resiliência.', pontosDesenvolvimento: 'Delegação de processos administrativos secundários.', pdiStatus: 'CONCLUIDO' },
    { id: 'rev-2', cicloNome: 'Ciclo Semestral 2026.1', employeeId: 'emp-002', employeeNome: 'Lucas Gabriel Pinheiro', gestorAvaliador: 'Vinicius Nader', notaGeralCompetencias: 9.7, notaAtingimentoMetas: 9.5, status: 'CONCLUIDO', pontosFortes: 'Alto rendimento técnico, arquitetura limpa e entrega pontual dos módulos contábeis.', pontosDesenvolvimento: 'Comunicação executiva para stakeholders não-técnicos.', pdiStatus: 'EM_ANDAMENTO' },
  ];

  // Trainings
  private inMemoryTrainings: TrainingProgramDto[] = [
    { id: 'tr-1', tituloCurso: 'Treinamento de Atendimento em Situações Críticas em Bilheteria', categoria: 'ATENDIMENTO_CLIENTE', cargaHorariaHoras: 8, instrutorResponsavel: 'Juliana Paes Rodrigues', totalConcluintes: 28, totalInscritos: 30 },
    { id: 'tr-2', tituloCurso: 'Segurança Ocupacional e Primeiros Socorros em Mega-Eventos (NR-23/Brigada)', categoria: 'OBRIGATORIO_NR', cargaHorariaHoras: 16, validadeMeses: 12, instrutorResponsavel: 'Corpo de Bombeiros / Consultoria SST', totalConcluintes: 35, totalInscritos: 42 },
    { id: 'tr-3', tituloCurso: 'Operação Avançada do Sistema de Emissão e Validação DiskIngressos', categoria: 'SISTEMAS_DISK', cargaHorariaHoras: 12, instrutorResponsavel: 'Lucas Gabriel Pinheiro', totalConcluintes: 40, totalInscritos: 42 },
  ];

  // Health and safety (ASO)
  private inMemoryExams: OccupationalExamDto[] = [
    { id: 'aso-1', employeeId: 'emp-001', employeeNome: 'Ana Carolina Meirelles', tipoExame: 'PERIODICO', clinicaResponsavel: 'MedTrabalho Curitiba', medicoCrm: 'CRM/PR 24890', dataRealizacao: '2026-03-12', dataValidadeProxima: '2027-03-12', resultadoAptidao: 'APTO', observacoes: 'Apta para trabalho em eventos externos e ruído controlado.' },
    { id: 'aso-2', employeeId: 'emp-003', employeeNome: 'Beatriz Cristina Fontana', tipoExame: 'PERIODICO', clinicaResponsavel: 'MedTrabalho Curitiba', medicoCrm: 'CRM/PR 31204', dataRealizacao: '2025-10-18', dataValidadeProxima: '2026-10-18', resultadoAptidao: 'APTO', observacoes: 'Exame audiométrico em conformidade com Anexo 1 da NR-7.' },
  ];

  // Terminations
  private inMemoryTerminations: TerminationProcessDto[] = [
    {
      id: 'term-001',
      employeeId: 'emp-999',
      employeeNome: 'Marcos Vinicius Rezende',
      departamento: 'BILHETERIA_PDV',
      cargo: 'Operador de Caixa Temporário',
      tipoDesligamento: 'DEMISSAO_SEM_JUSTA_CAUSA',
      dataUltimoDia: '2026-09-30',
      status: 'PAGO_FINALIZADO',
      valorRescisaoLiquidaBRL: 3418.50,
      equipamentosDevolvidos: true,
      acessosSistemasRevogados: true,
      exameDemissionalConcluido: true,
    },
  ];

  // Audit and LGPD
  private inMemoryAuditLogs: HrAuditLgpdLogDto[] = [
    {
      id: 'lgpd-1',
      dataHora: '2026-10-03T16:22:10Z',
      usuarioOperador: 'Juliana Paes Rodrigues',
      perfilOperador: 'RH_ADMIN',
      acaoRealizada: 'CONSULTA_HOLERITE',
      colaboradorAfetado: 'Lucas Gabriel Pinheiro',
      dadosAcessadosOuAlterados: 'Dados salariais, descontos INSS/IRRF, conta bancária',
      justificativaLgpd: 'Conferência prévia da folha mensal para fechamento contábil',
      ipOrigem: '192.168.10.45',
    },
    {
      id: 'lgpd-2',
      dataHora: '2026-10-03T14:10:05Z',
      usuarioOperador: 'Matheus Henrique Silveira',
      perfilOperador: 'FINANCEIRO_DISK',
      acaoRealizada: 'EXPORTACAO_RATEIO_EVENTO',
      colaboradorAfetado: 'Equipe Festival Pop Rock (28 colaboradores)',
      dadosAcessadosOuAlterados: 'Custos de mão de obra e horas extras para DRE do evento',
      justificativaLgpd: 'Apuração e rateio de custos de evento para bordero do produtor',
      ipOrigem: '192.168.10.12',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------------------
  // CORE METHODS
  // -------------------------------------------------------------------------

  async getOverview(): Promise<HrOverviewKpisDto> {
    const totalColaboradores = this.inMemoryEmployees.length;
    const colaboradoresAtivos = this.inMemoryEmployees.filter(
      (e) => e.status === EmployeeStatus.ATIVO
    ).length;
    const colaboradoresFerias = this.inMemoryEmployees.filter(
      (e) => e.status === EmployeeStatus.FERIAS
    ).length;
    const totalFolhaMensalBRL = this.inMemoryEmployees.reduce(
      (sum, e) => sum + e.salarioBase,
      0
    );
    const totalFgtsMesBRL = Math.round(totalFolhaMensalBRL * 0.08 * 100) / 100;
    const totalInssPatronalBRL = Math.round(totalFolhaMensalBRL * 0.2 * 100) / 100;

    return {
      totalColaboradores,
      colaboradoresAtivos,
      colaboradoresFerias,
      totalFolhaMensalBRL,
      totalFgtsMesBRL,
      totalInssPatronalBRL,
      saldoBancoHorasEquipeHoras: 16.5,
      batidasPontoHoje: this.inMemoryTimePunches.length,
      avisosAtivosMural: this.inMemoryNotices.filter((n) => n.ativo).length,
      solicitacoesPendentesAprovacao: this.inMemoryTimeOff.filter(
        (t) => t.status === 'PENDENTE'
      ).length,
    };
  }

  async getDashboardHeader(): Promise<HrDashboardHeaderDto> {
    return {
      colaboradoresAtivos: 42,
      colaboradoresEmFerias: 3,
      admissoesDoMes: 2,
      desligamentosDoMes: 1,
      horasExtrasHoras: 148,
      ausenciasAtestados: 2,
      feriasProximasVencer: 4,
      custoMensalPessoalBRL: 168450.0,
    };
  }

  async getImmediateAlerts(): Promise<HrImmediateAlertDto[]> {
    return this.inMemoryAlerts;
  }

  async getEmployees(): Promise<EmployeeHrDto[]> {
    return this.inMemoryEmployees;
  }

  async createEmployee(dto: CreateEmployeeHrDto): Promise<EmployeeHrDto> {
    const newEmployee: EmployeeHrDto = {
      id: `emp-${Date.now()}`,
      matricula: `DSK-${Math.floor(10000 + Math.random() * 90000)}`,
      nomeCompleto: dto.nomeCompleto,
      cpf: dto.cpf,
      rg: dto.rg,
      pisPasep: dto.pisPasep,
      ctpsNumero: dto.ctpsNumero,
      emailCorporativo: dto.emailCorporativo,
      emailPessoal: dto.emailPessoal,
      telefone: dto.telefone,
      cargo: dto.cargo,
      departamento: dto.departamento,
      regimeContratacao: dto.regimeContratacao,
      salarioBase: Number(dto.salarioBase),
      dataAdmissao: dto.dataAdmissao || new Date().toISOString(),
      status: EmployeeStatus.ATIVO,
      bancoNome: dto.bancoNome,
      agenciaBancaria: dto.agenciaBancaria,
      contaCorrente: dto.contaCorrente,
      chavePix: dto.chavePix,
      jornadaSemanalHoras: dto.jornadaSemanalHoras || 44,
      saldoBancoHorasMinutos: 0,
      gestorResponsavel: dto.gestorResponsavel,
      centroCusto: dto.centroCusto,
    };

    this.inMemoryEmployees.push(newEmployee);
    return newEmployee;
  }

  async punchClock(dto: PunchClockRequestDto): Promise<PunchClockResponseDto> {
    const employee =
      this.inMemoryEmployees.find((e) => e.id === dto.employeeId) || this.inMemoryEmployees[0];

    const nsr = 18490 + this.inMemoryTimePunches.length + 1;
    const nowIso = new Date().toISOString();
    const hash = `sha256-mtp671-${Math.random().toString(36).substring(2)}-${Date.now()}`;

    const record: TimeClockRecordDto = {
      id: `clk-${Date.now()}`,
      employeeId: employee.id,
      employeeNome: employee.nomeCompleto,
      dataHoraRegistro: nowIso,
      tipoRegistro: dto.tipoRegistro,
      latitude: dto.latitude || -25.4284,
      longitude: dto.longitude || -49.2733,
      localizacaoDescricao: dto.localizacaoDescricao || 'Sede DiskIngressos Curitiba/PR',
      ipOrigem: '189.102.45.12',
      dispositivoOrigem: dto.dispositivoOrigem || 'REP-P Web DiskIngressos',
      hashBiometriaSelfie: dto.fotoBiometriaBase64 ? 'mock-face-hash-liveness-ok' : undefined,
      statusPortariaMtp671: 'VALIDADO_REP_P',
      comprovanteNsrNumero: nsr,
      observacao: dto.observacao,
    };

    this.inMemoryTimePunches.unshift(record);

    return {
      success: true,
      comprovanteNsrNumero: nsr,
      dataHoraRegistro: nowIso,
      employeeNome: employee.nomeCompleto,
      tipoRegistro: dto.tipoRegistro,
      hashAutenticacaoMtp671: hash,
      localizacao: record.localizacaoDescricao || 'Curitiba/PR',
      mensagem: `Ponto registrado com sucesso! Comprovante NSR nº ${nsr} emitido conforme Portaria MTP 671/2021.`,
    };
  }

  async getTimecard(employeeId: string, competencia?: string): Promise<EmployeeTimecardSummaryDto> {
    const employee =
      this.inMemoryEmployees.find((e) => e.id === employeeId) || this.inMemoryEmployees[0];

    const empPunches = this.inMemoryTimePunches.filter((p) => p.employeeId === employee.id);

    return {
      employeeId: employee.id,
      employeeNome: employee.nomeCompleto,
      matricula: employee.matricula,
      competenciaMesAno: competencia || '10/2026',
      totalHorasPrevistas: 176,
      totalHorasTrabalhadas: 182.5,
      totalHorasExtras50: 6.5,
      totalHorasExtras100: 0,
      totalHorasNoturnas: 2.0,
      totalAtrasosMinutos: 0,
      saldoBancoHorasMinutos: employee.saldoBancoHorasMinutos,
      batidasMes: empPunches,
      espelhoAssinadoPeloColaborador: true,
    };
  }

  async getPayslips(employeeId?: string): Promise<PayrollPayslipDto[]> {
    if (employeeId) {
      return this.inMemoryPayslips.filter((p) => p.employeeId === employeeId);
    }
    return this.inMemoryPayslips;
  }

  async signPayslip(payslipId: string) {
    const payslip = this.inMemoryPayslips.find((p) => p.id === payslipId);
    if (!payslip) {
      return { success: false, message: 'Holerite não encontrado' };
    }
    payslip.status = 'ASSINADO_PELO_COLABORADOR';
    payslip.dataAssinatura = new Date().toISOString();
    return {
      success: true,
      payslipId,
      status: payslip.status,
      dataAssinatura: payslip.dataAssinatura,
      hashRecibo: payslip.hashReciboEntrega,
      mensagem: 'Holerite assinado digitalmente com sucesso pelo colaborador.',
    };
  }

  async getNotices(): Promise<HrNoticeDto[]> {
    return this.inMemoryNotices;
  }

  async createNotice(dto: Partial<HrNoticeDto>): Promise<HrNoticeDto> {
    const newNotice: HrNoticeDto = {
      id: `not-${Date.now()}`,
      titulo: dto.titulo || 'Comunicado Interno DiskIngressos',
      conteudo: dto.conteudo || 'Informações gerais para a equipe.',
      departamentoAlvo: dto.departamentoAlvo || 'TODOS',
      prioridade: dto.prioridade || 'NORMAL',
      requerConfirmacaoLeitura: Boolean(dto.requerConfirmacaoLeitura),
      totalLeiturasConfirmadas: 0,
      ativo: true,
      publicadoPor: 'Recursos Humanos DiskIngressos',
      dataPublicacao: new Date().toISOString(),
    };
    this.inMemoryNotices.unshift(newNotice);
    return newNotice;
  }

  async confirmNoticeRead(noticeId: string, employeeId: string) {
    const notice = this.inMemoryNotices.find((n) => n.id === noticeId);
    if (notice) {
      notice.totalLeiturasConfirmadas++;
    }
    return { success: true, noticeId, employeeId, confirmadaEm: new Date().toISOString() };
  }

  async getTimeOffRequests(): Promise<TimeOffRequestDto[]> {
    return this.inMemoryTimeOff;
  }

  async requestTimeOff(dto: Partial<TimeOffRequestDto>): Promise<TimeOffRequestDto> {
    const employee =
      this.inMemoryEmployees.find((e) => e.id === dto.employeeId) || this.inMemoryEmployees[0];
    const newReq: TimeOffRequestDto = {
      id: `to-${Date.now()}`,
      employeeId: employee.id,
      employeeNome: employee.nomeCompleto,
      tipo: dto.tipo || 'FERIAS',
      dataInicio: dto.dataInicio || new Date(Date.now() + 30 * 86400000).toISOString(),
      dataFim: dto.dataFim || new Date(Date.now() + 50 * 86400000).toISOString(),
      diasTotais: dto.diasTotais || 20,
      venderDiasAbono: Boolean(dto.venderDiasAbono),
      adiantarDecimoTerceiro: Boolean(dto.adiantarDecimoTerceiro),
      status: 'PENDENTE',
      createdAt: new Date().toISOString(),
    };
    this.inMemoryTimeOff.unshift(newReq);
    return newReq;
  }

  async approveTimeOff(id: string, status: 'HOMOLOGADO_RH' | 'REPROVADO') {
    const req = this.inMemoryTimeOff.find((t) => t.id === id);
    if (!req) {
      return { success: false, message: 'Solicitação não encontrada' };
    }
    req.status = status;
    return { success: true, id, status, mensagem: `Solicitação atualizada para ${status}.` };
  }

  // -------------------------------------------------------------------------
  // NEW ENTERPRISE EXTENSIONS
  // -------------------------------------------------------------------------

  async getOrganizationStructure() {
    return {
      departments: this.inMemoryDepartments,
      positions: this.inMemoryJobPositions,
    };
  }

  async getAdmissions(): Promise<AdmissionProcessDto[]> {
    return this.inMemoryAdmissions;
  }

  async getBenefits() {
    return {
      plans: this.inMemoryBenefits,
      assignments: [
        { id: 'asg-1', employeeId: 'emp-001', employeeNome: 'Ana Carolina Meirelles', beneficioId: 'ben-01', beneficioNome: 'Vale Refeição Flash', valorMensalBRL: 950.0, descontoEmFolhaBRL: 0.0, dataAdesao: '2023-03-15' },
        { id: 'asg-2', employeeId: 'emp-001', employeeNome: 'Ana Carolina Meirelles', beneficioId: 'ben-03', beneficioNome: 'Unimed Curitiba Master', valorMensalBRL: 680.0, descontoEmFolhaBRL: 102.0, dataAdesao: '2023-03-15' },
      ],
    };
  }

  async getRecruitment() {
    return {
      jobs: this.inMemoryJobPostings,
      candidates: this.inMemoryCandidates,
    };
  }

  async getPerformanceReviews(): Promise<PerformanceReviewDto[]> {
    return this.inMemoryReviews;
  }

  async getTrainings(): Promise<TrainingProgramDto[]> {
    return this.inMemoryTrainings;
  }

  async getOccupationalExams(): Promise<OccupationalExamDto[]> {
    return this.inMemoryExams;
  }

  async getTerminations(): Promise<TerminationProcessDto[]> {
    return this.inMemoryTerminations;
  }

  // Event staff & cost rateio
  async getEventStaffAllocations(eventoId?: string): Promise<EventStaffAllocationDto[]> {
    if (eventoId) {
      return this.inMemoryEventStaffAllocations.filter((a) => a.eventoId === eventoId);
    }
    return this.inMemoryEventStaffAllocations;
  }

  async allocateStaffToEvent(dto: Partial<EventStaffAllocationDto>): Promise<EventStaffAllocationDto> {
    const newAllocation: EventStaffAllocationDto = {
      id: `esa-${Date.now()}`,
      eventoId: dto.eventoId || 'evt-poprock-01',
      eventoNome: dto.eventoNome || 'Evento Geral DiskIngressos',
      localEvento: dto.localEvento || 'Curitiba/PR',
      dataEvento: dto.dataEvento || new Date().toISOString().slice(0, 10),
      employeeId: dto.employeeId,
      employeeNome: dto.employeeNome || 'Colaborador Operacional',
      tipoContratacao: dto.tipoContratacao || 'FREELANCER_EVENTO',
      funcaoOperacional: dto.funcaoOperacional || 'OPERADOR_CAIXA',
      horasPrevistas: dto.horasPrevistas || 8,
      horasRealizadas: dto.horasRealizadas || 8,
      valorDiariaCache: dto.valorDiariaCache || 200,
      valorHorasExtras: dto.valorHorasExtras || 0,
      statusCheckin: 'CONFIRMADO',
    };
    this.inMemoryEventStaffAllocations.push(newAllocation);
    return newAllocation;
  }

  async getEventStaffCosts(): Promise<EventStaffCostSummaryDto[]> {
    return this.inMemoryEventStaffCosts;
  }

  async getHrAnalyticsReport(): Promise<HrAnalyticsReportDto> {
    return {
      headcountTotal: 42,
      taxaTurnoverMensal: 1.8,
      taxaAbsenteismoPercentual: 0.9,
      horasExtrasTotalHoras: 148,
      custoTotalPessoalBRL: 168450.0,
      custoMedioPorColaboradorBRL: 4010.71,
      distribuicaoPorDepartamento: [
        { departamento: 'Bilheteria & Eventos', quantidade: 14, custoBRL: 54000 },
        { departamento: 'Tecnologia', quantidade: 11, custoBRL: 98000 },
        { departamento: 'Suporte & Atendimento', quantidade: 8, custoBRL: 28000 },
        { departamento: 'Financeiro', quantidade: 5, custoBRL: 36000 },
        { departamento: 'RH & Gente', quantidade: 4, custoBRL: 22000 },
      ],
      distribuicaoRegime: [
        { regime: 'CLT Integral', quantidade: 36 },
        { regime: 'Estágio', quantidade: 4 },
        { regime: 'Jovem Aprendiz', quantidade: 2 },
      ],
    };
  }

  async getHrAuditLogs(): Promise<HrAuditLgpdLogDto[]> {
    return this.inMemoryAuditLogs;
  }
}
