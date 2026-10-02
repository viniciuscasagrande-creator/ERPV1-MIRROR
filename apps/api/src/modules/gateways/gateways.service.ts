import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GatewaysService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const gateways = await this.prisma.gatewayIntegration.findMany({
      orderBy: { nome: 'asc' },
    });

    return gateways.map((g) => ({
      id: g.id,
      nome: g.nome,
      codigo: g.codigo,
      status: g.status,
      taxaMdrPadrao: Number(g.taxaMdrPadrao),
      webhookUrl: g.webhookUrl,
      totalTransacoesHoje: g.totalTransacoesHoje,
      volumeHoje: Number(g.volumeHoje),
      taxaPraticadaMedia: Number(g.taxaPraticadaMedia),
      desvioMdr: Number(g.desvioMdr),
      ultimaSincronizacao: g.ultimaSincronizacao ? g.ultimaSincronizacao.toISOString() : null,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    }));
  }

  async getMdrAudit() {
    // Busca pagamentos para auditar taxas praticadas
    const payments = await this.prisma.payment.findMany({
      include: {
        sale: {
          select: {
            codigoPedido: true,
            canal: true,
            event: { select: { nome: true } },
          },
        },
      },
      take: 50,
      orderBy: { pagoEm: 'desc' },
    });

    let totalVolumeAuditado = 0;
    let totalMdrCobrado = 0;
    let totalDivergencias = 0;
    let valorSobreprecoTotal = 0;

    const itensAuditados = payments.map((p) => {
      const valor = Number(p.valorPago);
      const mdrCobradoPercent = Number(p.taxaMdrPercent);
      const mdrCobradoValor = Number(p.taxaMdrValor);

      // Taxa esperada padrão: PIX = 0.99%, Cartão = 2.89%
      const mdrEsperadoPercent = p.metodo === 'PIX' ? 0.99 : 2.89;
      const mdrEsperadoValor = (valor * mdrEsperadoPercent) / 100;
      const diferenca = mdrCobradoValor - mdrEsperadoValor;

      const divergente = diferenca > 0.05; // Margem de centavos

      totalVolumeAuditado += valor;
      totalMdrCobrado += mdrCobradoValor;
      if (divergente) {
        totalDivergencias++;
        valorSobreprecoTotal += diferenca;
      }

      return {
        id: p.id,
        codigoPedido: p.sale.codigoPedido,
        eventoNome: p.sale.event.nome,
        gateway: p.gateway,
        metodo: p.metodo,
        transacaoId: p.transacaoId,
        valorPago: valor,
        mdrCobradoPercent,
        mdrCobradoValor,
        mdrEsperadoPercent,
        mdrEsperadoValor,
        diferenca,
        divergente,
        data: p.pagoEm.toISOString(),
      };
    });

    return {
      totalVolumeAuditado,
      totalMdrCobrado,
      taxaMediaReal: totalVolumeAuditado > 0 ? (totalMdrCobrado / totalVolumeAuditado) * 100 : 0,
      totalDivergencias,
      valorSobreprecoTotal,
      transacoes: itensAuditados,
    };
  }
}
