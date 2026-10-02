import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StatusPeriodoContabil } from '@prisma/client';
import {
  AccountingPeriodDto,
  AccountingPeriodChecklist,
  JwtPayload,
  PerfilUsuario,
} from '@diskingressos/types';

@Injectable()
export class AccountingPeriodService {
  private readonly logger = new Logger(AccountingPeriodService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Valida se a competência correspondente a uma data está ABERTA para movimentações.
   * Lança exceção de trava contábil caso o período esteja ENCERRADO.
   */
  async checkCompetenciaAberta(dataOuCompetencia: Date | string): Promise<void> {
    let competencia: string;

    if (dataOuCompetencia instanceof Date) {
      const y = dataOuCompetencia.getUTCFullYear();
      const m = String(dataOuCompetencia.getUTCMonth() + 1).padStart(2, '0');
      competencia = `${y}-${m}`;
    } else if (typeof dataOuCompetencia === 'string' && dataOuCompetencia.includes('-')) {
      const parts = dataOuCompetencia.split('-');
      if (parts.length >= 2) {
        competencia = `${parts[0]}-${parts[1].padStart(2, '0')}`;
      } else {
        competencia = dataOuCompetencia;
      }
    } else {
      return;
    }

    const periodo = await this.prisma.accountingPeriod.findUnique({
      where: { competencia },
    });

    if (periodo && periodo.status === StatusPeriodoContabil.ENCERRADO) {
      throw new BadRequestException(
        `TRAVA DE PERÍODO ATIVA: A competência contábil ${competencia} está ENCERRADA e bloqueada para novas movimentações ou alterações. Para ajustes excepcionais, solicite a reabertura formal à Diretoria / Controladoria.`
      );
    }
  }

  /**
   * Listar períodos contábeis de um determinado ano (padrão ano corrente)
   */
  async getPeriods(anoFiltro?: number): Promise<AccountingPeriodDto[]> {
    const ano = anoFiltro || new Date().getFullYear();

    // Busca registros persistidos no banco
    const persistidos = await this.prisma.accountingPeriod.findMany({
      where: { ano },
      orderBy: { mes: 'asc' },
    });

    const persistidosMap = new Map(persistidos.map((p) => [p.mes, p]));
    const result: AccountingPeriodDto[] = [];

    // Garante retorno dos 12 meses do ano
    for (let mes = 1; mes <= 12; mes++) {
      const competencia = `${ano}-${String(mes).padStart(2, '0')}`;
      const dataInicio = new Date(Date.UTC(ano, mes - 1, 1));
      const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));

      const existente = persistidosMap.get(mes);

      if (existente) {
        result.push({
          id: existente.id,
          competencia: existente.competencia,
          ano: existente.ano,
          mes: existente.mes,
          dataInicio: existente.dataInicio.toISOString(),
          dataFim: existente.dataFim.toISOString(),
          status: existente.status as any,
          conciliacaoBancariaOk: existente.conciliacaoBancariaOk,
          conciliacaoMdrOk: existente.conciliacaoMdrOk,
          partidasDobradasOk: existente.partidasDobradasOk,
          apuracaoFiscalOk: existente.apuracaoFiscalOk,
          fechamentoEventosOk: existente.fechamentoEventosOk,
          fechadoPorId: existente.fechadoPorId,
          fechadoPorNome: existente.fechadoPorNome,
          fechadoEm: existente.fechadoEm ? existente.fechadoEm.toISOString() : null,
          justificativaFechamento: existente.justificativaFechamento,
          reabertoPorId: existente.reabertoPorId,
          reabertoPorNome: existente.reabertoPorNome,
          reabertoEm: existente.reabertoEm ? existente.reabertoEm.toISOString() : null,
          motivoReabertura: existente.motivoReabertura,
          totalReceitas: Number(existente.totalReceitas),
          totalDespesas: Number(existente.totalDespesas),
          resultadoPeriodo: Number(existente.resultadoPeriodo),
          createdAt: existente.createdAt.toISOString(),
          updatedAt: existente.updatedAt.toISOString(),
        });
      } else {
        // Gera registro padrão em aberto
        result.push({
          id: `virtual-${competencia}`,
          competencia,
          ano,
          mes,
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
          status: StatusPeriodoContabil.ABERTO as any,
          conciliacaoBancariaOk: false,
          conciliacaoMdrOk: false,
          partidasDobradasOk: false,
          apuracaoFiscalOk: false,
          fechamentoEventosOk: false,
          totalReceitas: 0,
          totalDespesas: 0,
          resultadoPeriodo: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return result;
  }

  /**
   * Obter ou inicializar um período contábil específico
   */
  async getPeriodByCompetencia(competencia: string): Promise<AccountingPeriodDto> {
    const parts = competencia.split('-');
    const ano = parseInt(parts[0], 10);
    const mes = parseInt(parts[1], 10);

    let periodo = await this.prisma.accountingPeriod.findUnique({
      where: { competencia },
    });

    if (!periodo) {
      const dataInicio = new Date(Date.UTC(ano, mes - 1, 1));
      const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));

      periodo = await this.prisma.accountingPeriod.create({
        data: {
          competencia,
          ano,
          mes,
          dataInicio,
          dataFim,
          status: StatusPeriodoContabil.ABERTO,
        },
      });
    }

    return {
      id: periodo.id,
      competencia: periodo.competencia,
      ano: periodo.ano,
      mes: periodo.mes,
      dataInicio: periodo.dataInicio.toISOString(),
      dataFim: periodo.dataFim.toISOString(),
      status: periodo.status as any,
      conciliacaoBancariaOk: periodo.conciliacaoBancariaOk,
      conciliacaoMdrOk: periodo.conciliacaoMdrOk,
      partidasDobradasOk: periodo.partidasDobradasOk,
      apuracaoFiscalOk: periodo.apuracaoFiscalOk,
      fechamentoEventosOk: periodo.fechamentoEventosOk,
      fechadoPorId: periodo.fechadoPorId,
      fechadoPorNome: periodo.fechadoPorNome,
      fechadoEm: periodo.fechadoEm ? periodo.fechadoEm.toISOString() : null,
      justificativaFechamento: periodo.justificativaFechamento,
      reabertoPorId: periodo.reabertoPorId,
      reabertoPorNome: periodo.reabertoPorNome,
      reabertoEm: periodo.reabertoEm ? periodo.reabertoEm.toISOString() : null,
      motivoReabertura: periodo.motivoReabertura,
      totalReceitas: Number(periodo.totalReceitas),
      totalDespesas: Number(periodo.totalDespesas),
      resultadoPeriodo: Number(periodo.resultadoPeriodo),
      createdAt: periodo.createdAt.toISOString(),
      updatedAt: periodo.updatedAt.toISOString(),
    };
  }

  /**
   * Executa a auditoria em tempo real dos 5 pilares contábeis para fechamento
   */
  async runChecklist(competencia: string): Promise<AccountingPeriodChecklist> {
    const parts = competencia.split('-');
    const ano = parseInt(parts[0], 10);
    const mes = parseInt(parts[1], 10);

    const dataInicio = new Date(Date.UTC(ano, mes - 1, 1));
    const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));

    // 1. Conciliação Bancária
    const pendenciasBancarias = await this.prisma.bankStatementItem.count({
      where: {
        dataLancamento: { gte: dataInicio, lte: dataFim },
        statusConciliacao: { not: 'CONCILIADO' },
      },
    });
    const conciliacaoBancariaOk = pendenciasBancarias === 0;

    // 2. Conciliação MDR Gateways
    const gatewaysAtivos = await this.prisma.gatewayIntegration.findMany();
    const divergenciasMdr = gatewaysAtivos.filter((g) => Math.abs(Number(g.desvioMdr)) > 0.5);
    const conciliacaoMdrOk = divergenciasMdr.length === 0;

    // 3. Partidas Dobradas & Livro Diário
    const lancamentosMes = await this.prisma.journalEntry.findMany({
      where: { data: { gte: dataInicio, lte: dataFim } },
    });
    const desbalanceados = lancamentosMes.filter(
      (e) => !e.equilibrado || Math.abs(Number(e.totalDebito) - Number(e.totalCredito)) > 0.009
    );
    const partidasDobradasOk = desbalanceados.length === 0 && lancamentosMes.length > 0;

    // 4. Fechamento de Eventos da Competência
    const eventosMes = await this.prisma.event.findMany({
      where: { dataEvento: { gte: dataInicio, lte: dataFim } },
      include: { closingChecklist: true },
    });
    const eventosNaoFechados = eventosMes.filter((e) => !e.closingChecklist?.eventoFechado);
    const fechamentoEventosOk = eventosNaoFechados.length === 0;

    // 5. Apuração Fiscal e Guias
    const taxSummary = await this.prisma.taxSummary.findUnique({
      where: { competencia },
    });
    const apuracaoFiscalOk = !!taxSummary && taxSummary.fechado;

    const podeEncerrar =
      conciliacaoBancariaOk &&
      conciliacaoMdrOk &&
      partidasDobradasOk &&
      fechamentoEventosOk &&
      apuracaoFiscalOk;

    // Atualiza status do checklist no banco caso o registro exista
    await this.prisma.accountingPeriod.upsert({
      where: { competencia },
      update: {
        conciliacaoBancariaOk,
        conciliacaoMdrOk,
        partidasDobradasOk,
        fechamentoEventosOk,
        apuracaoFiscalOk,
      },
      create: {
        competencia,
        ano,
        mes,
        dataInicio,
        dataFim,
        status: StatusPeriodoContabil.ABERTO,
        conciliacaoBancariaOk,
        conciliacaoMdrOk,
        partidasDobradasOk,
        fechamentoEventosOk,
        apuracaoFiscalOk,
      },
    });

    return {
      conciliacaoBancariaOk,
      detalheBancos: conciliacaoBancariaOk
        ? 'Todos os extratos OFX Itaú e Bradesco 100% conciliados.'
        : `${pendenciasBancarias} lançamento(s) de extrato ainda pendente(s) de conciliação.`,
      conciliacaoMdrOk,
      detalheMdr: conciliacaoMdrOk
        ? 'Taxas MDR praticadas em Cielo, Stone e Rede dentro dos parâmetros acordados.'
        : `${divergenciasMdr.length} adquirente(s) com desvio de taxa MDR superior a 0,50%.`,
      partidasDobradasOk,
      detalhePartidasDobradas: partidasDobradasOk
        ? `Livro Diário com ${lancamentosMes.length} lançamentos perfeitamente balanceados (Σ Débito = Σ Crédito).`
        : desbalanceados.length > 0
        ? `${desbalanceados.length} lançamento(s) com divergência entre débito e crédito.`
        : 'Nenhum lançamento contábil processado na competência.',
      fechamentoEventosOk,
      detalheEventos: fechamentoEventosOk
        ? `Todos os ${eventosMes.length} eventos realizados no período estão com fechamento final homologado.`
        : `${eventosNaoFechados.length} evento(s) pendente(s) de fechamento na Central de Eventos.`,
      apuracaoFiscalOk,
      detalheFiscal: apuracaoFiscalOk
        ? 'Apuração do Lucro Presumido, ISS Curitiba e Guias DARF/DAM homologadas.'
        : 'Apuração fiscal do período ainda não foi fechada no módulo Fiscal.',
      podeEncerrar,
    };
  }

  /**
   * Encerra a Competência Contábil, ativando a Trava de Período
   */
  async fecharPeriodo(competencia: string, justificativa: string, user: JwtPayload) {
    const parts = competencia.split('-');
    const ano = parseInt(parts[0], 10);
    const mes = parseInt(parts[1], 10);

    const dataInicio = new Date(Date.UTC(ano, mes - 1, 1));
    const dataFim = new Date(Date.UTC(ano, mes, 0, 23, 59, 59));

    // Calcula receitas e despesas da competência
    const [receitasAgg, despesasAgg] = await Promise.all([
      this.prisma.financialTransaction.aggregate({
        where: {
          dataLancamento: { gte: dataInicio, lte: dataFim },
          tipo: 'ENTRADA',
        },
        _sum: { valor: true },
      }),
      this.prisma.financialTransaction.aggregate({
        where: {
          dataLancamento: { gte: dataInicio, lte: dataFim },
          tipo: 'SAIDA',
        },
        _sum: { valor: true },
      }),
    ]);

    const totalReceitas = Number(receitasAgg._sum.valor || 0);
    const totalDespesas = Number(despesasAgg._sum.valor || 0);
    const resultadoPeriodo = totalReceitas - totalDespesas;

    const checklist = await this.runChecklist(competencia);

    const periodo = await this.prisma.accountingPeriod.upsert({
      where: { competencia },
      update: {
        status: StatusPeriodoContabil.ENCERRADO,
        conciliacaoBancariaOk: checklist.conciliacaoBancariaOk,
        conciliacaoMdrOk: checklist.conciliacaoMdrOk,
        partidasDobradasOk: checklist.partidasDobradasOk,
        fechamentoEventosOk: checklist.fechamentoEventosOk,
        apuracaoFiscalOk: checklist.apuracaoFiscalOk,
        fechadoPorId: user.sub,
        fechadoPorNome: user.nome,
        fechadoEm: new Date(),
        justificativaFechamento: justificativa,
        totalReceitas,
        totalDespesas,
        resultadoPeriodo,
      },
      create: {
        competencia,
        ano,
        mes,
        dataInicio,
        dataFim,
        status: StatusPeriodoContabil.ENCERRADO,
        conciliacaoBancariaOk: checklist.conciliacaoBancariaOk,
        conciliacaoMdrOk: checklist.conciliacaoMdrOk,
        partidasDobradasOk: checklist.partidasDobradasOk,
        fechamentoEventosOk: checklist.fechamentoEventosOk,
        apuracaoFiscalOk: checklist.apuracaoFiscalOk,
        fechadoPorId: user.sub,
        fechadoPorNome: user.nome,
        fechadoEm: new Date(),
        justificativaFechamento: justificativa,
        totalReceitas,
        totalDespesas,
        resultadoPeriodo,
      },
    });

    // Registra auditoria forense
    await this.auditService.log({
      usuarioId: user.sub,
      acao: 'ENCERRAMENTO_PERIODO_CONTABIL',
      entidade: 'AccountingPeriod',
      entidadeId: competencia,
      motivo: justificativa,
      valorNovo: {
        status: 'ENCERRADO',
        fechadoPor: user.nome,
        fechadoEm: new Date(),
        totalReceitas,
        totalDespesas,
        resultadoPeriodo,
      },
    });

    return periodo;
  }

  /**
   * Reabertura Emergencial de Competência Contábil (Restrito a ADMIN e DIRETORIA)
   */
  async reabrirPeriodo(competencia: string, motivo: string, user: JwtPayload) {
    const isAuthorized =
      user.roles.includes(PerfilUsuario.ADMIN) || user.roles.includes(PerfilUsuario.DIRETORIA);

    if (!isAuthorized) {
      throw new ForbiddenException(
        'A reabertura emergencial de períodos contábeis encerrados é de alçada restrita à Diretoria e Administradores.'
      );
    }

    if (!motivo || motivo.trim().length < 10) {
      throw new BadRequestException(
        'É obrigatório fornecer uma justificativa detalhada (mínimo 10 caracteres) para a reabertura contábil do período.'
      );
    }

    const periodo = await this.prisma.accountingPeriod.findUnique({
      where: { competencia },
    });

    if (!periodo) {
      throw new NotFoundException(`Competência ${competencia} não localizada.`);
    }

    const atualizado = await this.prisma.accountingPeriod.update({
      where: { competencia },
      data: {
        status: StatusPeriodoContabil.REABERTO,
        reabertoPorId: user.sub,
        reabertoPorNome: user.nome,
        reabertoEm: new Date(),
        motivoReabertura: motivo,
      },
    });

    // Registra alerta forense de segurança de alta prioridade
    await this.auditService.log({
      usuarioId: user.sub,
      acao: 'REABERTURA_EMERGENCIAL_PERIODO_CONTABIL',
      entidade: 'AccountingPeriod',
      entidadeId: competencia,
      motivo: `ALERTA DE CONFORMIDADE: Período reaberto por ${user.nome}. Justificativa: ${motivo}`,
      valorAnterior: { status: periodo.status },
      valorNovo: { status: 'REABERTO', reabertoPor: user.nome, data: new Date() },
    });

    return atualizado;
  }
}
