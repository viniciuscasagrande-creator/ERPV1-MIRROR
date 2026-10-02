import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StatusConciliacao,
  TipoLancamentoExtrato,
  StatusRecebivel,
  StatusContaPagar,
  StatusRepasse,
} from '@prisma/client';
import { JwtPayload } from '@diskingressos/types';

interface ParsedTransaction {
  tipo: TipoLancamentoExtrato;
  data: Date;
  valor: number;
  fitId: string;
  documento?: string;
  descricao: string;
}

@Injectable()
export class ConciliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Parser OFX nativo compatível com SGML e XML dos bancos Itaú, Bradesco, Santander, BB
   */
  parseOfxContent(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const stmtTrnBlocks = content.split(/<STMTTRN>/i);

    for (let i = 1; i < stmtTrnBlocks.length; i++) {
      const block = stmtTrnBlocks[i].split(/<\/STMTTRN>/i)[0];

      const trnTypeMatch = block.match(/<TRNTYPE>([^\r\n<]+)/i);
      const dtPostedMatch = block.match(/<DTPOSTED>([0-9]{8})/i);
      const trnAmtMatch = block.match(/<TRNAMT>([^\r\n<]+)/i);
      const fitIdMatch = block.match(/<FITID>([^\r\n<]+)/i);
      const checkNumMatch = block.match(/<CHECKNUM>([^\r\n<]+)/i);
      const memoMatch = block.match(/<MEMO>([^\r\n<]+)/i);

      if (trnAmtMatch && fitIdMatch) {
        const rawAmt = parseFloat(trnAmtMatch[1].trim().replace(',', '.'));
        const valor = Math.abs(rawAmt);
        const tipo = rawAmt < 0 ? TipoLancamentoExtrato.DEBITO : TipoLancamentoExtrato.CREDITO;
        const fitId = fitIdMatch[1].trim();
        const descricao = memoMatch ? memoMatch[1].trim() : 'Lançamento bancário';
        const documento = checkNumMatch ? checkNumMatch[1].trim() : undefined;

        let data = new Date();
        if (dtPostedMatch) {
          const y = parseInt(dtPostedMatch[1].substring(0, 4), 10);
          const m = parseInt(dtPostedMatch[1].substring(4, 6), 10) - 1;
          const d = parseInt(dtPostedMatch[1].substring(6, 8), 10);
          data = new Date(y, m, d);
        }

        transactions.push({
          tipo,
          data,
          valor,
          fitId,
          documento,
          descricao,
        });
      }
    }

    return transactions;
  }

  async importOfx(
    bankAccountId: string,
    filename: string,
    rawContent: string,
    user?: JwtPayload,
  ) {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
    });

    if (!bankAccount) {
      throw new NotFoundException('Conta bancária não encontrada');
    }

    const parsed = this.parseOfxContent(rawContent);
    if (parsed.length === 0) {
      throw new BadRequestException('Nenhuma transação válida identificada no arquivo OFX');
    }

    const dataInicio = parsed.reduce((min, t) => (t.data < min ? t.data : min), parsed[0].data);
    const dataFim = parsed.reduce((max, t) => (t.data > max ? t.data : max), parsed[0].data);

    let totalCreditos = 0;
    let totalDebitos = 0;
    for (const t of parsed) {
      if (t.tipo === TipoLancamentoExtrato.CREDITO) totalCreditos += t.valor;
      else totalDebitos += t.valor;
    }

    const ofxImport = await this.prisma.ofxImport.create({
      data: {
        bankAccountId,
        nomeArquivo: filename,
        dataInicio,
        dataFim,
        totalTransacoes: parsed.length,
        totalCreditos,
        totalDebitos,
        status: 'PROCESSADO',
      },
    });

    // Insere itens que ainda não foram importados (fitId único)
    let inseridos = 0;
    for (const t of parsed) {
      const existe = await this.prisma.bankStatementItem.findFirst({
        where: { bankAccountId, fitId: t.fitId },
      });

      if (!existe) {
        await this.prisma.bankStatementItem.create({
          data: {
            bankAccountId,
            ofxImportId: ofxImport.id,
            fitId: t.fitId,
            dataLancamento: t.data,
            documento: t.documento,
            descricao: t.descricao,
            valor: t.valor,
            tipo: t.tipo,
            statusConciliacao: StatusConciliacao.PENDENTE,
          },
        });
        inseridos++;
      }
    }

    // Executa auto-conciliação heurística imediatamente
    const conciliadosAuto = await this.runAutoReconciliation(bankAccountId);

    return {
      importId: ofxImport.id,
      totalNoArquivo: parsed.length,
      novosInseridos: inseridos,
      conciliadosAutomaticamente: conciliadosAuto.totalConciliados,
    };
  }

  async runAutoReconciliation(bankAccountId: string) {
    const pendentes = await this.prisma.bankStatementItem.findMany({
      where: {
        bankAccountId,
        statusConciliacao: StatusConciliacao.PENDENTE,
      },
    });

    const recebiveis = await this.prisma.accountReceivable.findMany({
      where: {
        status: { in: [StatusRecebivel.A_VENCER, StatusRecebivel.ANTECIPADO, StatusRecebivel.RECEBIDO] },
      },
    });

    const repasses = await this.prisma.producerSettlement.findMany({
      where: {
        status: { in: [StatusRepasse.APROVADO, StatusRepasse.PAGO] },
      },
    });

    const contasPagar = await this.prisma.accountPayable.findMany({
      where: {
        status: { in: [StatusContaPagar.EM_ABERTO, StatusContaPagar.AGENDADO, StatusContaPagar.PAGO] },
      },
    });

    let totalConciliados = 0;

    for (const item of pendentes) {
      const itemValor = Number(item.valor);
      const itemData = new Date(item.dataLancamento).getTime();

      // Regra 1: CRÉDITOS -> Cruzamento com Recebíveis de Adquirentes
      if (item.tipo === TipoLancamentoExtrato.CREDITO) {
        const matchRecebivel = recebiveis.find((r) => {
          const rValor = Number(r.valorLiquido);
          const diffValor = Math.abs(itemValor - rValor);
          const rData = new Date(r.dataVencimento).getTime();
          const diffDias = Math.abs(itemData - rData) / 86400000;

          // Se a diferença de valor for zero ou menor que 0.5% (centavos de arredondamento) e data em até 4 dias
          return diffValor <= Math.max(1.0, rValor * 0.005) && diffDias <= 5;
        });

        if (matchRecebivel) {
          await this.prisma.bankStatementItem.update({
            where: { id: item.id },
            data: {
              statusConciliacao: StatusConciliacao.CONCILIADO,
              conciliadoComTipo: 'RECEBIVEL',
              conciliadoComId: matchRecebivel.id,
              conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
              dataConciliacao: new Date(),
              scoreConfianca: 99.0,
            },
          });

          // Baixa o recebível se ainda estiver a vencer
          if (matchRecebivel.status === StatusRecebivel.A_VENCER) {
            await this.prisma.accountReceivable.update({
              where: { id: matchRecebivel.id },
              data: {
                status: StatusRecebivel.RECEBIDO,
                dataRecebimento: item.dataLancamento,
              },
            });
          }

          totalConciliados++;
          continue;
        }
      }

      // Regra 2: DÉBITOS -> Cruzamento com Repasses a Produtores
      if (item.tipo === TipoLancamentoExtrato.DEBITO) {
        const matchRepasse = repasses.find((s) => {
          const sValor = Number(s.valorLiquido);
          const diffValor = Math.abs(itemValor - sValor);
          const sData = new Date(s.solicitadoEm).getTime();
          const diffDias = Math.abs(itemData - sData) / 86400000;

          // Bate se valor idêntico ou código REP/PIX mencionado na descrição
          const descMatch =
            item.descricao.toUpperCase().includes('PIX') ||
            (s.codigo && item.descricao.toUpperCase().includes(s.codigo));

          return diffValor === 0 && diffDias <= 7;
        });

        if (matchRepasse) {
          await this.prisma.bankStatementItem.update({
            where: { id: item.id },
            data: {
              statusConciliacao: StatusConciliacao.CONCILIADO,
              conciliadoComTipo: 'REPASSE',
              conciliadoComId: matchRepasse.id,
              conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
              dataConciliacao: new Date(),
              scoreConfianca: 100.0,
            },
          });

          if (matchRepasse.status !== StatusRepasse.PAGO) {
            await this.prisma.producerSettlement.update({
              where: { id: matchRepasse.id },
              data: { status: StatusRepasse.PAGO, pagoEm: item.dataLancamento },
            });
          }

          totalConciliados++;
          continue;
        }

        // Regra 3: DÉBITOS -> Cruzamento com Contas a Pagar
        const matchPagar = contasPagar.find((p) => {
          const pValor = Number(p.valor);
          const diffValor = Math.abs(itemValor - pValor);
          const pData = new Date(p.dataVencimento).getTime();
          const diffDias = Math.abs(itemData - pData) / 86400000;

          return diffValor === 0 && diffDias <= 5;
        });

        if (matchPagar) {
          await this.prisma.bankStatementItem.update({
            where: { id: item.id },
            data: {
              statusConciliacao: StatusConciliacao.CONCILIADO,
              conciliadoComTipo: 'CONTA_PAGAR',
              conciliadoComId: matchPagar.id,
              conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
              dataConciliacao: new Date(),
              scoreConfianca: 96.0,
            },
          });

          if (matchPagar.status !== StatusContaPagar.PAGO) {
            await this.prisma.accountPayable.update({
              where: { id: matchPagar.id },
              data: { status: StatusContaPagar.PAGO, dataPagamento: item.dataLancamento },
            });
          }

          totalConciliados++;
        }
      }
    }

    return { totalConciliados, pendentesRestantes: pendentes.length - totalConciliados };
  }

  async manualReconcile(
    statementItemId: string,
    target: { tipo: 'RECEBIVEL' | 'CONTA_PAGAR' | 'REPASSE'; id: string },
    user?: JwtPayload,
  ) {
    const item = await this.prisma.bankStatementItem.findUnique({
      where: { id: statementItemId },
    });

    if (!item) {
      throw new NotFoundException('Item de extrato não encontrado');
    }

    const updated = await this.prisma.bankStatementItem.update({
      where: { id: statementItemId },
      data: {
        statusConciliacao: StatusConciliacao.CONCILIADO,
        conciliadoComTipo: target.tipo,
        conciliadoComId: target.id,
        conciliadoPor: user?.email || 'operador_manual',
        dataConciliacao: new Date(),
        scoreConfianca: 100.0,
      },
    });

    // Atualiza status do alvo correspondente
    if (target.tipo === 'RECEBIVEL') {
      await this.prisma.accountReceivable.update({
        where: { id: target.id },
        data: { status: StatusRecebivel.RECEBIDO, dataRecebimento: item.dataLancamento },
      });
    } else if (target.tipo === 'CONTA_PAGAR') {
      await this.prisma.accountPayable.update({
        where: { id: target.id },
        data: { status: StatusContaPagar.PAGO, dataPagamento: item.dataLancamento },
      });
    } else if (target.tipo === 'REPASSE') {
      await this.prisma.producerSettlement.update({
        where: { id: target.id },
        data: { status: StatusRepasse.PAGO, pagoEm: item.dataLancamento },
      });
    }

    return updated;
  }

  async ignoreItem(statementItemId: string) {
    return this.prisma.bankStatementItem.update({
      where: { id: statementItemId },
      data: {
        statusConciliacao: StatusConciliacao.IGNORADO,
        observacoes: 'Item ignorado pelo operador contábil (transferência entre contas ou não tributável)',
      },
    });
  }

  async getStatement(bankAccountId: string, filters: { status?: StatusConciliacao; search?: string }) {
    const where: any = { bankAccountId };

    if (filters.status) {
      where.statusConciliacao = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { descricao: { contains: filters.search, mode: 'insensitive' } },
        { fitId: { contains: filters.search, mode: 'insensitive' } },
        { documento: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.bankStatementItem.findMany({
      where,
      include: {
        bankAccount: { select: { bancoNome: true } },
      },
      orderBy: { dataLancamento: 'desc' },
    });

    // Se houver itens pendentes, calcula candidatos de correspondência (match suggestions)
    const recebiveis = await this.prisma.accountReceivable.findMany();
    const contasPagar = await this.prisma.accountPayable.findMany();
    const repasses = await this.prisma.producerSettlement.findMany({
      include: { producer: { select: { nomeFantasia: true } } },
    });

    return items.map((item) => {
      const v = Number(item.valor);
      const candidates: any[] = [];

      if (item.statusConciliacao === StatusConciliacao.PENDENTE) {
        if (item.tipo === TipoLancamentoExtrato.CREDITO) {
          for (const r of recebiveis) {
            const diff = Math.abs(v - Number(r.valorLiquido));
            if (diff <= v * 0.05) {
              const score = diff === 0 ? 98 : Math.max(60, Math.round(100 - (diff / v) * 100));
              candidates.push({
                tipo: 'RECEBIVEL',
                id: r.id,
                descricao: `${r.adquirente} - Ref: ${r.transacaoRef}`,
                valor: Number(r.valorLiquido),
                data: r.dataVencimento.toISOString(),
                score,
                motivo: diff === 0 ? 'Valor exato de adquirente' : 'Valor aproximado com tolerância MDR',
              });
            }
          }
        } else {
          for (const s of repasses) {
            const diff = Math.abs(v - Number(s.valorLiquido));
            if (diff <= v * 0.05) {
              candidates.push({
                tipo: 'REPASSE',
                id: s.id,
                descricao: `Repasse ${s.codigo} (${s.producer.nomeFantasia})`,
                valor: Number(s.valorLiquido),
                data: s.solicitadoEm.toISOString(),
                score: diff === 0 ? 100 : 85,
                motivo: 'Valor compatível com borderô aprovado',
              });
            }
          }
          for (const p of contasPagar) {
            const diff = Math.abs(v - Number(p.valor));
            if (diff === 0) {
              candidates.push({
                tipo: 'CONTA_PAGAR',
                id: p.id,
                descricao: `${p.descricao} (${p.fornecedorNome})`,
                valor: Number(p.valor),
                data: p.dataVencimento.toISOString(),
                score: 95,
                motivo: 'Valor idêntico a título de fornecedor',
              });
            }
          }
        }
      }

      return {
        id: item.id,
        bankAccountId: item.bankAccountId,
        bankAccountNome: item.bankAccount?.bancoNome,
        fitId: item.fitId,
        dataLancamento: item.dataLancamento.toISOString(),
        documento: item.documento,
        descricao: item.descricao,
        valor: v,
        tipo: item.tipo,
        statusConciliacao: item.statusConciliacao,
        conciliadoComTipo: item.conciliadoComTipo,
        conciliadoComId: item.conciliadoComId,
        conciliadoPor: item.conciliadoPor,
        dataConciliacao: item.dataConciliacao ? item.dataConciliacao.toISOString() : null,
        scoreConfianca: item.scoreConfianca ? Number(item.scoreConfianca) : null,
        observacoes: item.observacoes,
        candidateMatches: candidates.sort((a, b) => b.score - a.score),
        createdAt: item.createdAt.toISOString(),
      };
    });
  }

  async getSummary(bankAccountId?: string) {
    const where: any = bankAccountId ? { bankAccountId } : {};
    const items = await this.prisma.bankStatementItem.findMany({ where });

    let totalConciliado = 0;
    let totalPendente = 0;
    let totalIgnorado = 0;
    let valorPendenteCreditos = 0;
    let valorPendenteDebitos = 0;

    for (const item of items) {
      const v = Number(item.valor);
      if (item.statusConciliacao === StatusConciliacao.CONCILIADO) {
        totalConciliado++;
      } else if (item.statusConciliacao === StatusConciliacao.IGNORADO) {
        totalIgnorado++;
      } else {
        totalPendente++;
        if (item.tipo === TipoLancamentoExtrato.CREDITO) valorPendenteCreditos += v;
        else valorPendenteDebitos += v;
      }
    }

    const totalItens = items.length;
    const percentualConciliado = totalItens > 0 ? Math.round((totalConciliado / totalItens) * 100) : 100;

    return {
      totalItens,
      totalConciliado,
      totalPendente,
      totalIgnorado,
      percentualConciliado,
      valorPendenteCreditos,
      valorPendenteDebitos,
    };
  }
}
