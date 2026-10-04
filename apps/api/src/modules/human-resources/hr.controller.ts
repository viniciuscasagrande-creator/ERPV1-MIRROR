import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  CreateEmployeeHrDto,
  PunchClockRequestDto,
} from '@diskingressos/types';

@ApiTags('Recursos Humanos (RH), Holerite & Ponto Digital (DiskIngressos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('overview')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'KPIs consolidados do departamento de RH e folha de pagamento' })
  async getOverview() {
    return this.hrService.getOverview();
  }

  @Get('header-kpis')
  @ApiOperation({ summary: 'Header Mini-Cards com KPIs essenciais em tempo real' })
  async getDashboardHeader() {
    return this.hrService.getDashboardHeader();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Alertas imediatos: contratos, férias em dobro, ASO, documentos' })
  async getImmediateAlerts() {
    return this.hrService.getImmediateAlerts();
  }

  @Get('employees')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Listar quadro de colaboradores ativos e afastados' })
  async getEmployees() {
    return this.hrService.getEmployees();
  }

  @Post('employees')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Cadastrar novo colaborador na base de RH DiskIngressos' })
  async createEmployee(@Body() body: CreateEmployeeHrDto) {
    return this.hrService.createEmployee(body);
  }

  @Post('time-clock/punch')
  @ApiOperation({ summary: 'Bater ponto eletrônico digital (Portaria MTP 671 / REP-P)' })
  async punchClock(@Body() body: PunchClockRequestDto) {
    return this.hrService.punchClock(body);
  }

  @Get('time-clock/timecard/:employeeId')
  @ApiOperation({ summary: 'Consultar espelho de ponto mensal consolidado e banco de horas' })
  async getTimecard(
    @Param('employeeId') employeeId: string,
    @Query('competencia') competencia?: string,
  ) {
    return this.hrService.getTimecard(employeeId, competencia);
  }

  @Get('payslips')
  @ApiOperation({ summary: 'Listar holerites e contracheques mensais' })
  async getPayslips(@Query('employeeId') employeeId?: string) {
    return this.hrService.getPayslips(employeeId);
  }

  @Post('payslips/:id/sign')
  @ApiOperation({ summary: 'Assinatura digital do colaborador no holerite com recibo de entrega' })
  async signPayslip(@Param('id') id: string) {
    return this.hrService.signPayslip(id);
  }

  @Get('notices')
  @ApiOperation({ summary: 'Mural de comunicados e avisos oficiais do RH' })
  async getNotices() {
    return this.hrService.getNotices();
  }

  @Post('notices')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Publicar novo comunicado no mural digital do RH' })
  async createNotice(@Body() body: any) {
    return this.hrService.createNotice(body);
  }

  @Post('notices/:id/confirm-read')
  @ApiOperation({ summary: 'Confirmar leitura de aviso obrigatório do RH' })
  async confirmNoticeRead(
    @Param('id') id: string,
    @Body('employeeId') employeeId: string,
  ) {
    return this.hrService.confirmNoticeRead(id, employeeId);
  }

  @Get('time-off')
  @ApiOperation({ summary: 'Listar solicitações de férias e afastamentos' })
  async getTimeOffRequests() {
    return this.hrService.getTimeOffRequests();
  }

  @Post('time-off')
  @ApiOperation({ summary: 'Solicitar período de férias com 1/3 e abono pecuniário' })
  async requestTimeOff(@Body() body: any) {
    return this.hrService.requestTimeOff(body);
  }

  @Patch('time-off/:id/approve')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Homologar ou reprovar solicitação de férias/afastamento' })
  async approveTimeOff(
    @Param('id') id: string,
    @Body('status') status: 'HOMOLOGADO_RH' | 'REPROVADO',
  ) {
    return this.hrService.approveTimeOff(id, status);
  }

  // -------------------------------------------------------------------------
  // ENTERPRISE ENDPOINTS
  // -------------------------------------------------------------------------

  @Get('organization')
  @ApiOperation({ summary: 'Estrutura organizacional, departamentos e cargos' })
  async getOrganization() {
    return this.hrService.getOrganizationStructure();
  }

  @Get('admissions')
  @ApiOperation({ summary: 'Processos admissionais e onboarding' })
  async getAdmissions() {
    return this.hrService.getAdmissions();
  }

  @Get('benefits')
  @ApiOperation({ summary: 'Planos de benefícios e adesões dos colaboradores' })
  async getBenefits() {
    return this.hrService.getBenefits();
  }

  @Get('recruitment')
  @ApiOperation({ summary: 'Vagas abertas e candidatos em seleção' })
  async getRecruitment() {
    return this.hrService.getRecruitment();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Ciclos de avaliação de desempenho e PDI' })
  async getPerformance() {
    return this.hrService.getPerformanceReviews();
  }

  @Get('trainings')
  @ApiOperation({ summary: 'Programas de treinamento e certificações' })
  async getTrainings() {
    return this.hrService.getTrainings();
  }

  @Get('occupational-exams')
  @ApiOperation({ summary: 'Saúde ocupacional, ASO e PCMSO' })
  async getOccupationalExams() {
    return this.hrService.getOccupationalExams();
  }

  @Get('terminations')
  @ApiOperation({ summary: 'Processos de desligamento e rescisões' })
  async getTerminations() {
    return this.hrService.getTerminations();
  }

  @Get('event-staff')
  @ApiOperation({ summary: 'Alocação de equipes operacionais e freelancers por evento' })
  async getEventStaff(@Query('eventoId') eventoId?: string) {
    return this.hrService.getEventStaffAllocations(eventoId);
  }

  @Post('event-staff')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Alocar colaborador ou freelancer em um evento' })
  async allocateStaffToEvent(@Body() body: any) {
    return this.hrService.allocateStaffToEvent(body);
  }

  @Get('event-staff-costs')
  @ApiOperation({ summary: 'Consolidação de custos de pessoal por evento para rateio com o DRE' })
  async getEventStaffCosts() {
    return this.hrService.getEventStaffCosts();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Relatórios analíticos: headcount, turnover, absenteísmo' })
  async getAnalytics() {
    return this.hrService.getHrAnalyticsReport();
  }

  @Get('audit-logs')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA)
  @ApiOperation({ summary: 'Auditoria de acesso e conformidade LGPD de dados funcionais' })
  async getAuditLogs() {
    return this.hrService.getHrAuditLogs();
  }
}
