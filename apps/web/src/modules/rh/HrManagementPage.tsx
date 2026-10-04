import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Users,
  Clock,
  FileText,
  Bell,
  Calendar,
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Check,
  Building2,
  Briefcase,
  MapPin,
  Download,
  Eye,
  Award,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Filter,
  Layers,
  HeartPulse,
  UserMinus,
  Sparkles,
  Ticket,
  SlidersHorizontal,
  ChevronDown,
  ShieldAlert,
  GraduationCap,
  FolderOpen,
  PieChart,
  UserPlus,
  AlertCircle,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { formatCurrencyBRL, formatCpfCnpj } from '@diskingressos/utils';
import {
  DepartmentType,
  EmploymentRegime,
  EmployeeStatus,
  EmployeeHrDto,
  TimeClockRecordDto,
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
  HrViewProfile,
} from '@diskingressos/types';
import { useNavigate } from 'react-router-dom';

export const HrManagementPage: React.FC = () => {
  const navigate = useNavigate();

  // Active View Profile
  const [profile, setProfile] = useState<HrViewProfile>('RH_ADMIN');

  // Main Tabs
  type TabType =
    | 'visao-geral'
    | 'colaboradores'
    | 'estrutura'
    | 'admissoes'
    | 'documentos'
    | 'ponto'
    | 'ferias'
    | 'folha'
    | 'beneficios'
    | 'recrutamento'
    | 'desempenho'
    | 'treinamentos'
    | 'saude-seguranca'
    | 'desligamentos'
    | 'equipes-eventos'
    | 'custos-eventos'
    | 'portal-colaborador'
    | 'relatorios'
    | 'auditoria-lgpd';

  const [activeTab, setActiveTab] = useState<TabType>('visao-geral');

  // Core Data States
  const [overview, setOverview] = useState<HrOverviewKpisDto | null>(null);
  const [headerKpis, setHeaderKpis] = useState<HrDashboardHeaderDto | null>(null);
  const [alerts, setAlerts] = useState<HrImmediateAlertDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeHrDto[]>([]);
  const [payslips, setPayslips] = useState<PayrollPayslipDto[]>([]);
  const [clockRecords, setClockRecords] = useState<TimeClockRecordDto[]>([]);
  const [notices, setNotices] = useState<HrNoticeDto[]>([]);
  const [timeOff, setTimeOff] = useState<TimeOffRequestDto[]>([]);

  // Enterprise Modules Data States
  const [departments, setDepartments] = useState<DepartmentOrgDto[]>([]);
  const [positions, setPositions] = useState<JobPositionDto[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionProcessDto[]>([]);
  const [benefits, setBenefits] = useState<BenefitPlanDto[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPostingDto[]>([]);
  const [candidates, setCandidates] = useState<JobCandidateDto[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReviewDto[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgramDto[]>([]);
  const [occupationalExams, setOccupationalExams] = useState<OccupationalExamDto[]>([]);
  const [terminations, setTerminations] = useState<TerminationProcessDto[]>([]);
  const [eventStaff, setEventStaff] = useState<EventStaffAllocationDto[]>([]);
  const [eventCosts, setEventCosts] = useState<EventStaffCostSummaryDto[]>([]);
  const [analytics, setAnalytics] = useState<HrAnalyticsReportDto | null>(null);
  const [auditLogs, setAuditLogs] = useState<HrAuditLgpdLogDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Selected Payslip Modal
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollPayslipDto | null>(null);

  // New Employee Modal State
  const [showNewEmpModal, setShowNewEmpModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newCargo, setNewCargo] = useState('');
  const [newDepto, setNewDepto] = useState<DepartmentType>(DepartmentType.BILHETERIA_PDV);
  const [newRegime, setNewRegime] = useState<EmploymentRegime>(EmploymentRegime.CLT);
  const [newSalario, setNewSalario] = useState(3800);
  const [newEmail, setNewEmail] = useState('');
  const [newTelefone, setNewTelefone] = useState('');

  // New Event Staff Allocation Modal State
  const [showNewStaffModal, setShowNewStaffModal] = useState(false);
  const [staffEventoId, setStaffEventoId] = useState('evt-poprock-01');
  const [staffNome, setStaffNome] = useState('');
  const [staffFuncao, setStaffFuncao] = useState<'SUPERVISOR_BILHETERIA' | 'OPERADOR_CAIXA' | 'VALIDADOR_ACESSO' | 'SUPORTE_TI'>('OPERADOR_CAIXA');
  const [staffTipoContratacao, setStaffTipoContratacao] = useState<'INTERNO_DISK' | 'FREELANCER_EVENTO' | 'TEMPORARIO'>('FREELANCER_EVENTO');
  const [staffCache, setStaffCache] = useState(250);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        resOverview,
        resHeaderKpis,
        resAlerts,
        resEmployees,
        resPayslips,
        resNotices,
        resTimeOff,
        resOrg,
        resAdmissions,
        resBenefits,
        resRecruitment,
        resPerformance,
        resTrainings,
        resExams,
        resTerminations,
        resEventStaff,
        resEventCosts,
        resAnalytics,
        resAuditLogs,
      ] = await Promise.all([
        api.get('/hr/overview').catch(() => ({ data: null })),
        api.get('/hr/header-kpis').catch(() => ({ data: null })),
        api.get('/hr/alerts').catch(() => ({ data: [] })),
        api.get('/hr/employees').catch(() => ({ data: [] })),
        api.get('/hr/payslips').catch(() => ({ data: [] })),
        api.get('/hr/notices').catch(() => ({ data: [] })),
        api.get('/hr/time-off').catch(() => ({ data: [] })),
        api.get('/hr/organization').catch(() => ({ data: { departments: [], positions: [] } })),
        api.get('/hr/admissions').catch(() => ({ data: [] })),
        api.get('/hr/benefits').catch(() => ({ data: { plans: [] } })),
        api.get('/hr/recruitment').catch(() => ({ data: { jobs: [], candidates: [] } })),
        api.get('/hr/performance').catch(() => ({ data: [] })),
        api.get('/hr/trainings').catch(() => ({ data: [] })),
        api.get('/hr/occupational-exams').catch(() => ({ data: [] })),
        api.get('/hr/terminations').catch(() => ({ data: [] })),
        api.get('/hr/event-staff').catch(() => ({ data: [] })),
        api.get('/hr/event-staff-costs').catch(() => ({ data: [] })),
        api.get('/hr/analytics').catch(() => ({ data: null })),
        api.get('/hr/audit-logs').catch(() => ({ data: [] })),
      ]);

      setOverview(resOverview?.data || null);
      setHeaderKpis(resHeaderKpis?.data || null);
      setAlerts(resAlerts?.data || []);
      setEmployees(resEmployees?.data || []);
      setPayslips(resPayslips?.data || []);
      setNotices(resNotices?.data || []);
      setTimeOff(resTimeOff?.data || []);

      setDepartments(resOrg?.data?.departments || []);
      setPositions(resOrg?.data?.positions || []);
      setAdmissions(resAdmissions?.data || []);
      setBenefits(resBenefits?.data?.plans || []);
      setJobPostings(resRecruitment?.data?.jobs || []);
      setCandidates(resRecruitment?.data?.candidates || []);
      setPerformanceReviews(resPerformance?.data || []);
      setTrainings(resTrainings?.data || []);
      setOccupationalExams(resExams?.data || []);
      setTerminations(resTerminations?.data || []);
      setEventStaff(resEventStaff?.data || []);
      setEventCosts(resEventCosts?.data || []);
      setAnalytics(resAnalytics?.data || null);
      setAuditLogs(resAuditLogs?.data || []);

      if (resEmployees?.data?.length > 0) {
        api.get(`/hr/time-clock/timecard/${resEmployees.data[0].id}`)
          .then((res) => setClockRecords(res.data?.batidasMes || []))
          .catch(() => {});
      }
    } catch (err) {
      console.error('Erro ao carregar dados do RH:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/employees', {
        nomeCompleto: newNome,
        cpf: newCpf,
        cargo: newCargo,
        departamento: newDepto,
        regimeContratacao: newRegime,
        salarioBase: newSalario,
        emailCorporativo: newEmail,
        telefone: newTelefone,
      });
      setShowNewEmpModal(false);
      setFeedbackMsg('Colaborador cadastrado com sucesso!');
      setTimeout(() => setFeedbackMsg(null), 3000);
      fetchAllData();
    } catch (err: any) {
      alert('Erro ao cadastrar colaborador: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleAllocateEventStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/event-staff', {
        eventoId: staffEventoId,
        eventoNome: staffEventoId === 'evt-poprock-01' ? 'Festival Curitiba Pop Rock 2026' : 'Show Internacional Turnê 2026',
        employeeNome: staffNome,
        funcaoOperacional: staffFuncao,
        tipoContratacao: staffTipoContratacao,
        valorDiariaCache: staffCache,
        horasPrevistas: 10,
        horasRealizadas: 10,
      });
      setShowNewStaffModal(false);
      setFeedbackMsg('Membro da equipe alocado com sucesso no evento!');
      setTimeout(() => setFeedbackMsg(null), 3000);
      fetchAllData();
    } catch (err: any) {
      alert('Erro ao alocar membro: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleApproveTimeOff = async (id: string, status: 'HOMOLOGADO_RH' | 'REPROVADO') => {
    try {
      await api.patch(`/hr/time-off/${id}/approve`, { status });
      setFeedbackMsg(`Férias ${status === 'HOMOLOGADO_RH' ? 'homologadas' : 'reprovadas'} com sucesso.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
      fetchAllData();
    } catch (err: any) {
      alert('Erro ao atualizar férias: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleSignPayslip = async (payslipId: string) => {
    try {
      await api.post(`/hr/payslips/${payslipId}/sign`);
      setFeedbackMsg('Holerite assinado digitalmente com sucesso!');
      setTimeout(() => setFeedbackMsg(null), 3000);
      fetchAllData();
      if (selectedPayslip && selectedPayslip.id === payslipId) {
        setSelectedPayslip({ ...selectedPayslip, status: 'ASSINADO_PELO_COLABORADOR' });
      }
    } catch (err: any) {
      alert('Erro ao assinar holerite: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400">
              <UserCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Recursos Humanos (RH) Corporativo
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
                  Disk Interno
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  Portaria MTP 671 / REP-P
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Gestão integrada 360° da jornada do colaborador: Admissão → Vida Funcional → Ponto/Férias → Folha/DRE → Eventos.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE SWITCHER & APP PONTO LINK */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Alçadas & Perfil */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Perfil:</span>
            {[
              { id: 'RH_ADMIN', label: 'RH / Admin' },
              { id: 'GESTOR', label: 'Gestor' },
              { id: 'COLABORADOR', label: 'Colaborador' },
              { id: 'FINANCEIRO_DISK', label: 'Financeiro Disk' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfile(p.id as HrViewProfile)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  profile === p.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/rh/ponto-eletronico-app')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-950/20"
          >
            <Smartphone size={15} />
            <span>App Registro de Ponto</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* WORKFLOW PIPELINE BANNER */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Layers size={14} className="text-rose-500" />
          <span>Fluxo Corporativo de Aprovações:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            1. Colaborador solicita
          </span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            2. Gestor aprova
          </span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            3. RH valida & homologa
          </span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-rose-500 font-semibold">
            4. Financeiro Disk (Pagamento)
          </span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-emerald-500 font-semibold">
            5. Contabilidade (DRE Evento / SPED)
          </span>
        </div>
      </div>

      {/* 8 MINI-CARDS DASHBOARD SUPERIOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {[
          { label: 'Colab. Ativos', val: headerKpis?.colaboradoresAtivos ?? 42, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Em Férias', val: headerKpis?.colaboradoresEmFerias ?? 3, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Admissões Mês', val: headerKpis?.admissoesDoMes ?? 2, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Desligamentos', val: headerKpis?.desligamentosDoMes ?? 1, icon: UserMinus, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Horas Extras', val: `${headerKpis?.horasExtrasHoras ?? 148}h`, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Ausências / Atest.', val: headerKpis?.ausenciasAtestados ?? 2, icon: HeartPulse, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Férias Próximas', val: headerKpis?.feriasProximasVencer ?? 4, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Custo Folha/Mês', val: formatCurrencyBRL(headerKpis?.custoMensalPessoalBRL ?? 168450), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((card, i) => (
          <div
            key={i}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">
                {card.label}
              </span>
              <div className={`p-1 rounded-md ${card.bg} ${card.color}`}>
                <card.icon size={13} />
              </div>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
              {card.val}
            </div>
          </div>
        ))}
      </div>

      {/* ALERTAS IMEDIATOS DO RH */}
      {alerts && alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-500" />
              <span>Avisos e Prazos Críticos Imediatos ({alerts.length})</span>
            </div>
            <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
              Conformidade Trabalhista e Prevenção de Passivos CLT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/30 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                      {alt.titulo}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {alt.criticidade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {alt.descricao}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Limite: {alt.dataLimite}</span>
                  <span className="text-rose-500 font-semibold">{alt.colaboradorNome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HORIZONTAL SCROLLABLE TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 min-w-max pb-1" aria-label="Tabs">
          {[
            { id: 'visao-geral', label: 'Visão Geral RH', icon: PieChart },
            { id: 'equipes-eventos', label: 'Equipes por Evento', icon: Ticket, badge: 'Operação' },
            { id: 'custos-eventos', label: 'Custos de Pessoal por Evento', icon: TrendingUp, badge: 'DRE Evento' },
            { id: 'colaboradores', label: 'Colaboradores', icon: Users },
            { id: 'estrutura', label: 'Estrutura & Cargos', icon: Building2 },
            { id: 'admissoes', label: 'Admissões & Onboarding', icon: UserPlus },
            { id: 'documentos', label: 'Documentos & Assinaturas', icon: FolderOpen },
            { id: 'ponto', label: 'Ponto e Jornada', icon: Clock },
            { id: 'ferias', label: 'Férias & Ausências', icon: Calendar },
            { id: 'folha', label: 'Folha & Holerites', icon: DollarSign },
            { id: 'beneficios', label: 'Benefícios', icon: Award },
            { id: 'recrutamento', label: 'Recrutamento & R&S', icon: Briefcase },
            { id: 'desempenho', label: 'Desempenho & PDI', icon: Sparkles },
            { id: 'treinamentos', label: 'Treinamentos & NR', icon: GraduationCap },
            { id: 'saude-seguranca', label: 'Saúde & SST (ASO)', icon: HeartPulse },
            { id: 'desligamentos', label: 'Desligamentos', icon: UserMinus },
            { id: 'portal-colaborador', label: 'Portal do Colaborador', icon: Smartphone },
            { id: 'relatorios', label: 'Relatórios & People', icon: FileText },
            { id: 'auditoria-lgpd', label: 'Auditoria & LGPD', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-bold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-950/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* CONTEÚDO DAS ABAS */}
      {/* ========================================================================= */}

      {/* 1. VISÃO GERAL */}
      {activeTab === 'visao-geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Folha e Encargos */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign size={16} className="text-rose-500" />
                Impacto Financeiro & Encargos (Mês Atual)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">Folha Salarial Bruta:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {formatCurrencyBRL(overview?.totalFolhaMensalBRL || 28850)}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">Depósito FGTS Estimado (8%):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(overview?.totalFgtsMesBRL || 2308)}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">INSS Patronal Estimado (20%):</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {formatCurrencyBRL(overview?.totalInssPatronalBRL || 5770)}
                  </span>
                </div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400">Custo Total Empregador:</span>
                  <span className="font-black text-sm text-rose-700 dark:text-rose-300">
                    {formatCurrencyBRL((overview?.totalFolhaMensalBRL || 28850) * 1.32)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mural de Avisos Resumo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell size={16} className="text-rose-500" />
                  Comunicados Oficiais Recentes
                </h3>
                <span className="text-xs text-slate-400">{notices.length} avisos</span>
              </div>
              <div className="space-y-2.5">
                {notices.slice(0, 2).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {n.titulo}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-semibold">
                        {n.prioridade}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {n.conteudo}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aniversariantes & Vida Funcional */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-rose-500" />
                Aniversários & Tempo de Casa (Mês Atual)
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                      AC
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Ana Carolina Meirelles</div>
                      <div className="text-[10px] text-slate-400">Supervisora Bilheteria</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-500 font-bold">14/10 (Aniversário)</div>
                    <div className="text-[10px] text-slate-400">3 anos de casa</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                      LP
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Lucas Gabriel Pinheiro</div>
                      <div className="text-[10px] text-slate-400">Dev Full Stack Sênior</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-500 font-bold">29/10 (Aniversário)</div>
                    <div className="text-[10px] text-slate-400">4 anos de casa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOS DE PESSOAL POR EVENTO (DISKINGRESSOS EXCLUSIVE & DRE INTEGRATION) */}
      {activeTab === 'custos-eventos' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-rose-500" size={22} />
                  <h2 className="text-lg font-black text-white">
                    Rateio de Mão de Obra & Custos de Pessoal por Evento
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30">
                    Alimenta DRE por Evento
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Apuração detalhada de quanto cada evento consumiu da equipe DiskIngressos (operacional, horas extras, alimentação, transporte e freelancers) para integração contábil e apuração de margem real do borderô.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewStaffModal(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus size={14} />
                  <span>Nova Alocação em Evento</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Eventos Consolidando os Custos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventCosts.map((evt) => (
              <div
                key={evt.eventoId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                      {evt.centroCustoEvento}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {evt.eventoNome}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-slate-500" />
                      <span>{evt.localEvento}</span>
                      <span>•</span>
                      <span>{evt.dataEvento}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                    {evt.totalPessoasAlocadas} pessoas
                  </span>
                </div>

                {/* Discriminação de Custos Conforme Solicitado pelo Usuário */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Equipe Operacional:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(evt.equipeOperacionalBRL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horas Extras:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {formatCurrencyBRL(evt.horasExtrasBRL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alimentação:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(evt.alimentacaoBRL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transporte:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(evt.transporteBRL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Freelancers:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {formatCurrencyBRL(evt.freelancersBRL)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-extrabold text-sm">
                    <span className="text-rose-600 dark:text-rose-400">Custo Total de Pessoal:</span>
                    <span className="text-slate-900 dark:text-white">
                      {formatCurrencyBRL(evt.custoTotalPessoalBRL)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <CheckCircle2 size={13} />
                    Integrado ao DRE do Evento
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/dre-evento')}
                    className="text-xs text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1"
                  >
                    <span>Ver no DRE</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EQUIPES POR EVENTO (DISKINGRESSOS OPERACIONAL) */}
      {activeTab === 'equipes-eventos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="text-rose-500" size={20} />
                Quadro de Equipes Alocadas por Evento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestão integrada de operadores internos, temporários e freelancers com controle de check-in e diárias.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewStaffModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>Alocar Colaborador ou Freelancer</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Colaborador / Profissional</th>
                    <th className="p-3.5">Evento Alocado</th>
                    <th className="p-3.5">Tipo de Vínculo</th>
                    <th className="p-3.5">Função Operacional</th>
                    <th className="p-3.5">Horas (Prev / Real)</th>
                    <th className="p-3.5">Diária / Cachê</th>
                    <th className="p-3.5">Horas Extras</th>
                    <th className="p-3.5">Status Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {eventStaff.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-bold">{st.employeeNome}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        <div className="font-semibold">{st.eventoNome}</div>
                        <div className="text-[10px] text-slate-400">{st.localEvento}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.tipoContratacao === 'INTERNO_DISK'
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          }`}
                        >
                          {st.tipoContratacao}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {st.funcaoOperacional}
                      </td>
                      <td className="p-3.5 font-mono">
                        {st.horasPrevistas}h / {st.horasRealizadas}h
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(st.valorDiariaCache)}
                      </td>
                      <td className="p-3.5 font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrencyBRL(st.valorHorasExtras)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-max">
                          <Check size={11} />
                          {st.statusCheckin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. COLABORADORES */}
      {activeTab === 'colaboradores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por nome, CPF, cargo ou departamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNewEmpModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>Cadastrar Colaborador</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees
              .filter(
                (e) =>
                  e.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
                  e.cpf.includes(search) ||
                  e.cargo.toLowerCase().includes(search.toLowerCase())
              )
              .map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={emp.fotoPerfilUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                      alt={emp.nomeCompleto}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">{emp.matricula}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {emp.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {emp.nomeCompleto}
                      </h4>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold truncate">
                        {emp.cargo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Departamento:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{emp.departamento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Centro de Custo:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{emp.centroCusto || 'CC-Geral'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Salário Base CLT:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrencyBRL(emp.salarioBase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gestor Responsável:</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400 truncate">{emp.gestorResponsavel || 'Diretoria'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Admissão: {new Date(emp.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('folha');
                      }}
                      className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1"
                    >
                      <span>Holerites</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. ESTRUTURA ORGANIZACIONAL */}
      {activeTab === 'estrutura' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Departamentos */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-rose-500" />
                Departamentos & Centros de Custo
              </h3>
              <div className="space-y-3">
                {departments.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{d.nome}</div>
                      <div className="text-[11px] text-slate-400">
                        Gestor Líder: <span className="text-rose-500 font-semibold">{d.gestorLider}</span> • Centro: {d.centroCustoCodigo}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-800 dark:text-slate-200">{d.totalColaboradores} colaboradores</div>
                      <div className="text-[10px] text-slate-400">Orçamento: {formatCurrencyBRL(d.orcamentoMensalBRL)}/mês</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cargos e Níveis */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={16} className="text-rose-500" />
                Matriz de Cargos & Faixas Salariais
              </h3>
              <div className="space-y-3">
                {positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{pos.titulo}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
                        {pos.nivel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{pos.descricaoSumaria}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <span>Faixa Salarial:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyBRL(pos.faixaSalarialMin)} - {formatCurrencyBRL(pos.faixaSalarialMax)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADMISSÕES & ONBOARDING */}
      {activeTab === 'admissoes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="text-rose-500" size={20} />
              Processos Admissionais em Andamento
            </h2>
            <span className="text-xs text-slate-400">{admissions.length} novos talentos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admissions.map((adm) => (
              <div
                key={adm.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {adm.candidatoNome}
                    </h3>
                    <p className="text-xs text-rose-500 font-semibold">{adm.cargoPretendido} ({adm.departamento})</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Previsão Início: {adm.dataPrevisaoInicio}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {adm.etapaAtual}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Progresso do Checklist Onboarding:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{adm.progressoChecklistPorcentagem}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full transition-all"
                      style={{ width: `${adm.progressoChecklistPorcentagem}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex justify-between">
                  <span>Documentos Entregues:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {adm.documentosEnviados} de {adm.documentosTotaisExigidos} itens
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. FOLHA DE PAGAMENTO & HOLERITES */}
      {activeTab === 'folha' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="text-rose-500" size={20} />
                Folha de Pagamento & Holerites Digitais
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cálculos de proventos, descontos progressivos (INSS / IRRF), FGTS e recibos digitais eSocial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payslips.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{p.matricula}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{p.employeeNome}</h3>
                    <p className="text-xs text-rose-500 font-semibold">{p.cargo}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        p.status === 'ASSINADO_PELO_COLABORADOR'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Ref: {p.competenciaMesAno}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Proventos</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrencyBRL(p.totalProventos)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Descontos</div>
                    <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {formatCurrencyBRL(p.totalDescontos)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <div className="text-[10px] text-rose-500 font-bold">Líquido a Pagar</div>
                    <div className="font-black text-rose-600 dark:text-rose-400 mt-0.5">
                      {formatCurrencyBRL(p.valorLiquidoReceber)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedPayslip(p)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye size={13} />
                    <span>Visualizar Holerite Oficial</span>
                  </button>

                  {p.status !== 'ASSINADO_PELO_COLABORADOR' ? (
                    <button
                      type="button"
                      onClick={() => handleSignPayslip(p.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Check size={13} />
                      <span>Assinar Recibo</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Assinado eletronicamente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. PONTO E JORNADA */}
      {activeTab === 'ponto' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="text-rose-500" size={20} />
                Espelho de Ponto Eletrônico & Banco de Horas (REP-P)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registros auditáveis em conformidade com o Art. 79 da Portaria MTP nº 671/2021.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/rh/ponto-eletronico-app')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Smartphone size={16} />
              <span>Abrir App Terminal de Ponto REP-P</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Últimas Batidas Registradas no Módulo REP-P
              </span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} />
                Assinatura Digital SHA-256 Homologada
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">NSR</th>
                    <th className="p-3.5">Colaborador</th>
                    <th className="p-3.5">Tipo de Batida</th>
                    <th className="p-3.5">Data / Hora Oficial</th>
                    <th className="p-3.5">Geolocalização / Endereço</th>
                    <th className="p-3.5">Dispositivo Origem</th>
                    <th className="p-3.5">Status Portaria 671</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {clockRecords.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono font-bold text-rose-500">#{c.comprovanteNsrNumero}</td>
                      <td className="p-3.5 font-semibold">{c.employeeNome}</td>
                      <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {c.tipoRegistro}
                      </td>
                      <td className="p-3.5 font-mono">
                        {new Date(c.dataHoraRegistro).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">
                        {c.localizacaoDescricao || 'Curitiba/PR'}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">{c.dispositivoOrigem}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {c.statusPortariaMtp671}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. FÉRIAS E AUSÊNCIAS */}
      {activeTab === 'ferias' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-rose-500" size={20} />
                Férias, Licenças & Banco de Horas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Programação de férias com 1/3 constitucional, abono pecuniário (venda de 10 dias) e adiantamento de 13º.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeOff.map((to) => (
              <div
                key={to.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {to.employeeNome}
                    </h3>
                    <p className="text-xs text-rose-500 font-semibold">{to.tipo}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      to.status === 'HOMOLOGADO_RH'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {to.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Período Programado:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(to.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(to.dataFim).toLocaleDateString('pt-BR')} ({to.diasTotais} dias)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vender 10 dias de Abono:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {to.venderDiasAbono ? 'Sim (10 dias)' : 'Não'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Adiantamento 13º Salário:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {to.adiantarDecimoTerceiro ? 'Sim (50% da parcela)' : 'Não'}
                    </span>
                  </div>
                </div>

                {to.status === 'PENDENTE' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleApproveTimeOff(to.id, 'HOMOLOGADO_RH')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Homologar Férias no RH
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveTimeOff(to.id, 'REPROVADO')}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reprovar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. BENEFÍCIOS */}
      {activeTab === 'beneficios' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-rose-500" size={20} />
              Planos & Pacote de Benefícios DiskIngressos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{b.nome}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                    {b.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Fornecedor: {b.fornecedorParceiro}</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Custo Empresa/Colab:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrencyBRL(b.custoEmpresaPorColaboradorBRL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coparticipação Colab:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {b.coparticipacaoPercentual}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Colaboradores Aderentes:</span>
                    <span className="font-bold text-rose-500">{b.totalAderentes} vidas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. RECRUTAMENTO E SELEÇÃO */}
      {activeTab === 'recrutamento' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={16} className="text-rose-500" />
                Vagas Abertas & Captação
              </h3>
              <div className="space-y-3">
                {jobPostings.map((j) => (
                  <div
                    key={j.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{j.tituloVaga}</div>
                      <div className="text-[11px] text-slate-400">
                        {j.departamento} • {j.localTrabalho}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500">
                        {j.totalCandidatos} inscritos
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{j.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-rose-500" />
                Candidatos com Triagem IA & Entrevistas
              </h3>
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{c.nomeCompleto}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        Score IA: {c.scoreAfinidadeIA}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Vaga: {c.vagaTitulo} • Etapa: <span className="text-rose-500 font-semibold">{c.etapaAtual}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      "{c.feedbackResumido}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. DESEMPENHO E PDI */}
      {activeTab === 'desempenho' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500">{rev.cicloNome}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{rev.employeeNome}</h3>
                    <p className="text-xs text-slate-400">Avaliador: {rev.gestorAvaliador}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-500">
                    {rev.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Competências</div>
                    <div className="text-base font-black text-rose-500 mt-0.5">{rev.notaGeralCompetencias}/10</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Atingimento Metas</div>
                    <div className="text-base font-black text-emerald-500 mt-0.5">{rev.notaAtingimentoMetas}/10</div>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div><strong className="text-slate-700 dark:text-slate-300">Pontos Fortes:</strong> {rev.pontosFortes}</div>
                  <div><strong className="text-slate-700 dark:text-slate-300">PDI:</strong> {rev.pontosDesenvolvimento}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. SAÚDE OCUPACIONAL E SST (ASO) */}
      {activeTab === 'saude-seguranca' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Atestados de Saúde Ocupacional (ASO / PCMSO NR-7)
              </span>
              <span className="text-xs text-rose-500 font-semibold">
                Controle Periódico Obrigatório eSocial S-2220
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Colaborador</th>
                    <th className="p-3.5">Tipo de Exame</th>
                    <th className="p-3.5">Clínica Credenciada</th>
                    <th className="p-3.5">Médico / CRM</th>
                    <th className="p-3.5">Data Realização</th>
                    <th className="p-3.5">Próximo Vencimento</th>
                    <th className="p-3.5">Resultado Aptidão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {occupationalExams.map((ex) => (
                    <tr key={ex.id}>
                      <td className="p-3.5 font-bold">{ex.employeeNome}</td>
                      <td className="p-3.5 font-semibold text-rose-500">{ex.tipoExame}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{ex.clinicaResponsavel}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{ex.medicoCrm}</td>
                      <td className="p-3.5 font-mono">{ex.dataRealizacao}</td>
                      <td className="p-3.5 font-mono text-amber-500 font-bold">{ex.dataValidadeProxima}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {ex.resultadoAptidao}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 14. DESLIGAMENTOS E OFFBOARDING */}
      {activeTab === 'desligamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {terminations.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{term.employeeNome}</h3>
                    <p className="text-xs text-rose-500 font-semibold">{term.cargo} ({term.departamento})</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Último Dia Trabalhado: {term.dataUltimoDia}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-500">
                    {term.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Rescisão Líquida TRCT:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrencyBRL(term.valorRescisaoLiquidaBRL)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipamentos Devolvidos:</span>
                    <span className="font-semibold text-emerald-500">{term.equipamentosDevolvidos ? 'Sim' : 'Pendente'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acessos aos Sistemas Revogados:</span>
                    <span className="font-semibold text-emerald-500">{term.acessosSistemasRevogados ? 'Sim' : 'Pendente'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exame Demissional ASO:</span>
                    <span className="font-semibold text-emerald-500">{term.exameDemissionalConcluido ? 'Concluído' : 'Pendente'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. AUDITORIA E LGPD */}
      {activeTab === 'auditoria-lgpd' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-rose-500" />
                Rastreabilidade de Acesso a Dados Pessoais & Folha de Pagamento (LGPD)
              </span>
              <span className="text-xs text-slate-400">Art. 7º e 11 da Lei 13.709/2018</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Data/Hora</th>
                    <th className="p-3.5">Operador / Perfil</th>
                    <th className="p-3.5">Ação Realizada</th>
                    <th className="p-3.5">Colaborador Afetado</th>
                    <th className="p-3.5">Dados Manipulados</th>
                    <th className="p-3.5">Justificativa Legal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3.5 font-mono text-[11px]">{new Date(log.dataHora).toLocaleString('pt-BR')}</td>
                      <td className="p-3.5">
                        <div className="font-bold">{log.usuarioOperador}</div>
                        <div className="text-[10px] text-slate-400">{log.perfilOperador}</div>
                      </td>
                      <td className="p-3.5 font-mono text-rose-500 font-semibold">{log.acaoRealizada}</td>
                      <td className="p-3.5 font-medium">{log.colaboradorAfetado}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px]">{log.dadosAcessadosOuAlterados}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px]">{log.justificativaLgpd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HOLERITE OFICIAL DETALHADO */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Demonstrativo de Pagamento de Salário
                </h3>
                <p className="text-xs text-slate-400">
                  DISK INGRESSOS SERVIÇOS DE INTERMEDIAÇÃO LTDA • CNPJ 07.245.986/0001-38
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Colaborador:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{selectedPayslip.employeeNome}</strong>
              </div>
              <div>
                <span className="text-slate-400">Matrícula:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{selectedPayslip.matricula}</strong>
              </div>
              <div>
                <span className="text-slate-400">Cargo:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{selectedPayslip.cargo}</strong>
              </div>
              <div>
                <span className="text-slate-400">Competência:</span>{' '}
                <strong className="text-rose-500 font-bold">{selectedPayslip.competenciaMesAno}</strong>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Cód</th>
                    <th className="p-2.5">Descrição da Verba</th>
                    <th className="p-2.5">Ref</th>
                    <th className="p-2.5 text-right">Vencimentos</th>
                    <th className="p-2.5 text-right">Descontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedPayslip.itensDetalhados.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono text-slate-400">{it.codigoVerba}</td>
                      <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{it.descricao}</td>
                      <td className="p-2.5 text-slate-500">{it.referencia}</td>
                      <td className="p-2.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {it.tipo === 'PROVENTO' ? formatCurrencyBRL(it.valor) : '-'}
                      </td>
                      <td className="p-2.5 text-right font-medium text-rose-600 dark:text-rose-400">
                        {it.tipo === 'DESCONTO' ? formatCurrencyBRL(it.valor) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-slate-400 text-[10px]">Total Vencimentos:</span>
                <div className="font-bold text-emerald-500">{formatCurrencyBRL(selectedPayslip.totalProventos)}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-slate-400 text-[10px]">Total Descontos:</span>
                <div className="font-bold text-rose-500">{formatCurrencyBRL(selectedPayslip.totalDescontos)}</div>
              </div>
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <span className="text-rose-500 text-[10px] font-bold">Valor Líquido:</span>
                <div className="font-black text-rose-500">{formatCurrencyBRL(selectedPayslip.valorLiquidoReceber)}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Base Cálculo INSS: {formatCurrencyBRL(selectedPayslip.baseCalculoInss)}</span>
                <span>Base Cálculo FGTS: {formatCurrencyBRL(selectedPayslip.salarioBase)}</span>
                <span>FGTS do Mês (8%): {formatCurrencyBRL(selectedPayslip.depositoFgtsMes)}</span>
              </div>
              <div className="break-all font-mono text-[9px] text-slate-500 pt-1">
                Hash Recibo eSocial: {selectedPayslip.hashReciboEntrega}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Imprimir Holerite
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR NOVO COLABORADOR */}
      {showNewEmpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Cadastrar Novo Colaborador (RH Disk)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewEmpModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">CPF:</label>
                  <input
                    type="text"
                    required
                    value={newCpf}
                    onChange={(e) => setNewCpf(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Salário Base (R$):</label>
                  <input
                    type="number"
                    required
                    value={newSalario}
                    onChange={(e) => setNewSalario(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cargo:</label>
                  <input
                    type="text"
                    required
                    value={newCargo}
                    onChange={(e) => setNewCargo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Departamento:</label>
                  <select
                    value={newDepto}
                    onChange={(e) => setNewDepto(e.target.value as DepartmentType)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  >
                    <option value={DepartmentType.BILHETERIA_PDV}>Bilheteria / Eventos</option>
                    <option value={DepartmentType.TECNOLOGIA}>Tecnologia</option>
                    <option value={DepartmentType.SUPORTE_CLIENTE}>Suporte / Atendimento</option>
                    <option value={DepartmentType.FINANCEIRO}>Financeiro</option>
                    <option value={DepartmentType.RH}>Recursos Humanos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Corporativo:</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Telefone:</label>
                  <input
                    type="text"
                    required
                    value={newTelefone}
                    onChange={(e) => setNewTelefone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewEmpModal(false)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ALOCAR COLABORADOR OU FREELANCER EM EVENTO */}
      {showNewStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Alocar Equipe em Evento (Rateio DRE)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewStaffModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAllocateEventStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Selecione o Evento:</label>
                <select
                  value={staffEventoId}
                  onChange={(e) => setStaffEventoId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="evt-poprock-01">Festival Curitiba Pop Rock 2026 (Pedreira Paulo Leminski)</option>
                  <option value="evt-turne-arena">Show Internacional Turnê 2026 (Ligga Arena)</option>
                  <option value="evt-teatro-standup">Teatro Positivo Stand-up Comedy Especial</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nome do Profissional / Colaborador:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Menezes ou Colaborador Interno"
                  value={staffNome}
                  onChange={(e) => setStaffNome(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Vínculo:</label>
                  <select
                    value={staffTipoContratacao}
                    onChange={(e) => setStaffTipoContratacao(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  >
                    <option value="INTERNO_DISK">Colaborador Interno Disk</option>
                    <option value="FREELANCER_EVENTO">Freelancer Evento</option>
                    <option value="TEMPORARIO">Temporário Credenciado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Função no Evento:</label>
                  <select
                    value={staffFuncao}
                    onChange={(e) => setStaffFuncao(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                  >
                    <option value="SUPERVISOR_BILHETERIA">Supervisor de Bilheteria</option>
                    <option value="OPERADOR_CAIXA">Operador de Caixa</option>
                    <option value="VALIDADOR_ACESSO">Validador de Acesso / Portaria</option>
                    <option value="SUPORTE_TI">Suporte de TI & Rede</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Valor Diária / Cachê (R$):</label>
                <input
                  type="number"
                  required
                  value={staffCache}
                  onChange={(e) => setStaffCache(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewStaffModal(false)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Confirmar Alocação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
