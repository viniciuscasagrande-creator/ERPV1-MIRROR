import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EstagioCobrancaDivida } from '@diskingressos/types';
import type {
  ProducerDebtCollectionDto,
  CreditBureauProtestRecordDto,
  Ifrs9ExpectedCreditLossDto,
  DebtRecoveryDashboardKpisDto,
  NegociarDividaRequestDto,
  NegociarDividaResponseDto,
} from '@diskingressos/types';

@Injectable()
export class DebtRecoveryService {
  private readonly logger = new Logger(DebtRecoveryService.name);

  private inMemoryDebts: ProducerDebtCollectionDto[] = [
    {
      id: 'dbt-001',
      produtorId: 'prod-show-sul-ltda',
      codigoDivida: 'DIV-2026-00441',
      valorOriginalDividaBrl: 120000.0,
      saldoDevedorAtualBrl: 128400.0,
      diasEmAtrasoAging: 68,
      estagioCobranca: EstagioCobrancaDivida.NOTIFICACAO_EXTRAJUDICIAL,
      taxaJurosMoraMensalPercent: 1.0,
      criadoEm: '2026-01-20T10:00:00Z',
    },
    {
      id: 'dbt-002',
      produtorId: 'prod-festas-brasil-me',
      codigoDivida: 'DIV-2025-00982',
      valorOriginalDividaBrl: 45000.0,
      saldoDevedorAtualBrl: 51200.0,
      diasEmAtrasoAging: 140,
      estagioCobranca: EstagioCobrancaDivida.PROTESTO_CARTORIO,
      taxaJurosMoraMensalPercent: 1.0,
      criadoEm: '2025-11-10T14:30:00Z',
    },
  ];

  private inMemoryProtests: CreditBureauProtestRecordDto[] = [
    {
      id: 'prt-001',
      dividaId: 'dbt-002',
      cartorioProtestoComarca: '1º Tabelionato de Protestos de Títulos - Curitiba/PR',
      protocoloCertidaoProtesto: 'PROT-PR-2026-00941',
      statusSerasaBoaVista: 'NEGATIVADO_SERASA_EXPERIAN',
      dataNegativacao: '2026-02-15T09:00:00Z',
    },
  ];

  private inMemoryPecld: Ifrs9ExpectedCreditLossDto[] = [
    {
      id: 'ecl-001',
      competenciaMesAno: '2026-03',
      categoriaAgingCarteira: 'AGING_61_90_DIAS',
      exposicaoAoRiscoBrl: 128400.0,
      probabilidadeInadimplenciaPd: 25.0,
      perdaDadoIncumprimentoLgd: 45.0,
      provisaoPecldCalculadaBrl: 14445.0,
      dataApuracao: '2026-03-31T23:59:59Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getDebts(): Promise<ProducerDebtCollectionDto[]> {
    try {
      const records = await this.prisma.producerDebtCollection.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          produtorId: r.produtorId,
          codigoDivida: r.codigoDivida,
          valorOriginalDividaBrl: Number(r.valorOriginalDividaBrl),
          saldoDevedorAtualBrl: Number(r.saldoDevedorAtualBrl),
          diasEmAtrasoAging: r.diasEmAtrasoAging,
          estagioCobranca: r.estagioCobranca as EstagioCobrancaDivida,
          taxaJurosMoraMensalPercent: Number(r.taxaJurosMoraMensalPercent),
          criadoEm: r.criadoEm.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory debts');
    }
    return this.inMemoryDebts;
  }

  async getProtests(): Promise<CreditBureauProtestRecordDto[]> {
    try {
      const records = await this.prisma.creditBureauProtestRecord.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          dividaId: r.dividaId,
          cartorioProtestoComarca: r.cartorioProtestoComarca,
          protocoloCertidaoProtesto: r.protocoloCertidaoProtesto,
          statusSerasaBoaVista: r.statusSerasaBoaVista,
          dataNegativacao: r.dataNegativacao.toISOString(),
          dataBaixaProtesto: r.dataBaixaProtesto ? r.dataBaixaProtesto.toISOString() : undefined,
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory protests');
    }
    return this.inMemoryProtests;
  }

  async getIfrs9Losses(): Promise<Ifrs9ExpectedCreditLossDto[]> {
    try {
      const records = await this.prisma.ifrs9ExpectedCreditLoss.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          competenciaMesAno: r.competenciaMesAno,
          categoriaAgingCarteira: r.categoriaAgingCarteira,
          exposicaoAoRiscoBrl: Number(r.exposicaoAoRiscoBrl),
          probabilidadeInadimplenciaPd: Number(r.probabilidadeInadimplenciaPd),
          perdaDadoIncumprimentoLgd: Number(r.perdaDadoIncumprimentoLgd),
          provisaoPecldCalculadaBrl: Number(r.provisaoPecldCalculadaBrl),
          dataApuracao: r.dataApuracao.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory IFRS 9 losses');
    }
    return this.inMemoryPecld;
  }

  async negociarDivida(dto: NegociarDividaRequestDto): Promise<NegociarDividaResponseDto> {
    const debt = this.inMemoryDebts.find((d) => d.id === dto.dividaId);
    if (!debt) {
      throw new Error(`Dívida ${dto.dividaId} não encontrada`);
    }

    const desconto = (debt.saldoDevedorAtualBrl - debt.valorOriginalDividaBrl) * (dto.descontoJurosPercent / 100);
    const novoSaldo = debt.saldoDevedorAtualBrl - desconto;
    const valorParcela = novoSaldo / dto.numeroParcelas;

    return {
      dividaId: debt.id,
      novoSaldoAcordadoBrl: Number(novoSaldo.toFixed(2)),
      valorParcelaBrl: Number(valorParcela.toFixed(2)),
      termoConfissaoDividaHash: `sha256:dbt-agreement-${Date.now()}`,
      statusNegociacao: 'ACORDO_PARCELAMENTO_FIRMADO',
    };
  }

  async getKpis(): Promise<DebtRecoveryDashboardKpisDto> {
    return {
      carteiraTotalInadimplenteBrl: 179600.0,
      provisaoPecldAcumuladaBrl: 38400.0,
      taxaRecuperacaoCreditoPercent: 62.4,
      titulosEmProtestoCartorio: this.inMemoryProtests.length,
      acoesJudiciaisAtivas: 2,
    };
  }
}
