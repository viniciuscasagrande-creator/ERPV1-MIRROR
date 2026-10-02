import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StatusRecebivel, StatusContaPagar, StatusRepasse } from '@prisma/client';

@Injectable()
export class FluxoCaixaService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    // 1. Saldo atual apurado
    const lastTx = await this.prisma.financialTransaction.findFirst({
      orderBy: { dataLancamento: 'desc' },
    });
    const saldoAtual = lastTx ? Number(lastTx.saldoApos) : 254200.00;

    // 2. Entradas e saídas do mês corrente
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const txsMes = await this.prisma.financialTransaction.findMany({
      where: {
        dataLancamento: { gte: inicioMes },
      },
    });

    let entradasMes = 0;
    let saidasMes = 0;
    for (const tx of txsMes) {
      if (tx.tipo === 'ENTRADA') entradasMes += Number(tx.valor);
      else saidasMes += Number(tx.valor);
    }

    // 3. Contas a Receber próximas (próximos 30 dias)
    const em30Dias = new Date();
    em30Dias.setDate(em30Dias.getDate() + 30);

    const recebiveis = await this.prisma.accountReceivable.findMany({
      where: {
        status: StatusRecebivel.A_VENCER,
        dataVencimento: { lte: em30Dias },
      },
    });
    const contasReceberProximas = recebiveis.reduce((acc, r) => acc + Number(r.valorLiquido), 0);

    // 4. Contas a Pagar próximas
    const contasPagar = await this.prisma.accountPayable.findMany({
      where: {
        status: { in: [StatusContaPagar.EM_ABERTO, StatusContaPagar.AGENDADO] },
        dataVencimento: { lte: em30Dias },
      },
    });
    const contasPagarProximas = contasPagar.reduce((acc, p) => acc + Number(p.valor), 0);

    // 5. Repasses pendentes de liquidação
    const repassesPendentesList = await this.prisma.producerSettlement.findMany({
      where: {
        status: { in: [StatusRepasse.SOLICITADO, StatusRepasse.EM_ANALISE, StatusRepasse.APROVADO, StatusRepasse.AGENDADO] },
      },
    });
    const repassesPendentes = repassesPendentesList.reduce((acc, s) => acc + Number(s.valorLiquido), 0);

    const saldoProjetado30d = saldoAtual + contasReceberProximas - contasPagarProximas - repassesPendentes;

    // 6. Projeção Diária dos próximos 14 dias
    const projecaoProximosDias: Array<{
      data: string;
      entradas: number;
      saidas: number;
      saldoProjetado: number;
    }> = [];

    let saldoAcumulado = saldoAtual;
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dataStr = d.toISOString().split('T')[0];

      // Filtra recebíveis do dia
      const entDia = recebiveis
        .filter((r) => r.dataVencimento.toISOString().split('T')[0] === dataStr)
        .reduce((sum, r) => sum + Number(r.valorLiquido), 0);

      // Filtra contas a pagar do dia
      const saiDia = contasPagar
        .filter((p) => p.dataVencimento.toISOString().split('T')[0] === dataStr)
        .reduce((sum, p) => sum + Number(p.valor), 0);

      saldoAcumulado = saldoAcumulado + entDia - saiDia;

      projecaoProximosDias.push({
        data: dataStr,
        entradas: entDia,
        saidas: saiDia,
        saldoProjetado: saldoAcumulado,
      });
    }

    // 7. Últimas 20 transações
    const ultimasTransacoesRaw = await this.prisma.financialTransaction.findMany({
      orderBy: { dataLancamento: 'desc' },
      take: 20,
    });

    const ultimasTransacoes = ultimasTransacoesRaw.map((t) => ({
      id: t.id,
      tipo: t.tipo,
      descricao: t.descricao,
      valor: Number(t.valor),
      dataLancamento: t.dataLancamento.toISOString(),
      categoria: t.categoria,
      referenciaTipo: t.referenciaTipo,
      referenciaId: t.referenciaId,
      contaBancaria: t.contaBancaria,
      saldoApos: Number(t.saldoApos),
      createdAt: t.createdAt.toISOString(),
    }));

    return {
      saldoAtual,
      entradasMes,
      saidasMes,
      saldoProjetado30d,
      contasReceberProximas,
      contasPagarProximas,
      repassesPendentes,
      projecaoProximosDias,
      ultimasTransacoes,
    };
  }

  async getTransactions(filters: {
    tipo?: string;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters.categoria) {
      where.categoria = filters.categoria;
    }

    if (filters.dataInicio || filters.dataFim) {
      where.dataLancamento = {};
      if (filters.dataInicio) where.dataLancamento.gte = new Date(filters.dataInicio);
      if (filters.dataFim) where.dataLancamento.lte = new Date(filters.dataFim);
    }

    if (filters.search) {
      where.OR = [
        { descricao: { contains: filters.search, mode: 'insensitive' } },
        { categoria: { contains: filters.search, mode: 'insensitive' } },
        { contaBancaria: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.financialTransaction.findMany({
      where,
      orderBy: { dataLancamento: 'desc' },
    });

    return items.map((t) => ({
      id: t.id,
      tipo: t.tipo,
      descricao: t.descricao,
      valor: Number(t.valor),
      dataLancamento: t.dataLancamento.toISOString(),
      categoria: t.categoria,
      referenciaTipo: t.referenciaTipo,
      referenciaId: t.referenciaId,
      contaBancaria: t.contaBancaria,
      saldoApos: Number(t.saldoApos),
      createdAt: t.createdAt.toISOString(),
    }));
  }
}
