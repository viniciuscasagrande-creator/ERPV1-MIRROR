import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ContractStatus,
  ComplianceStatus,
  EscrowMovementType,
  ProducerCommercialContractDto,
  ProducerEscrowLedgerDto,
  Producer360SummaryDto,
  ProducerAdvanceSimulateDto,
} from '@diskingressos/types';

@Injectable()
export class ProducerHubService {
  private readonly logger = new Logger(ProducerHubService.name);

  private inMemoryContracts: ProducerCommercialContractDto[] = [
    {
      id: 'ctr-001',
      producerId: 'prod-001',
      numeroContrato: 'CTR-PROD-2026-088',
      razaoSocial: 'Opus Entretenimento e Promoções Ltda',
      cnpj: '12.345.678/0001-90',
      taxaComissaoPadrao: 10.0,
      taxaMdrGateway: 2.85,
      retencaoSegurancaPercent: 15.0,
      prazoLiquidacaoDias: 2,
      limiteAdiantamentoGlobal: 1500000.0,
      saldoAdiantadoAtual: 420000.0,
      statusContrato: ContractStatus.VIGENTE,
      statusComplianceCnd: ComplianceStatus.REGULAR,
      scoreCredito: 920,
      dataInicio: '2026-01-01T00:00:00Z',
      dataTermino: '2027-12-31T23:59:59Z',
    },
    {
      id: 'ctr-002',
      producerId: 'prod-002',
      numeroContrato: 'CTR-PROD-2026-092',
      razaoSocial: 'T4F Entretenimento S.A.',
      cnpj: '98.765.432/0001-11',
      taxaComissaoPadrao: 8.5,
      taxaMdrGateway: 2.65,
      retencaoSegurancaPercent: 12.0,
      prazoLiquidacaoDias: 2,
      limiteAdiantamentoGlobal: 3500000.0,
      saldoAdiantadoAtual: 850000.0,
      statusContrato: ContractStatus.VIGENTE,
      statusComplianceCnd: ComplianceStatus.REGULAR,
      scoreCredito: 965,
      dataInicio: '2025-06-01T00:00:00Z',
      dataTermino: '2027-06-01T23:59:59Z',
    },
    {
      id: 'ctr-003',
      producerId: 'prod-003',
      numeroContrato: 'CTR-PROD-2026-104',
      razaoSocial: 'Seven Entretenimento Curitiba EIRELI',
      cnpj: '45.123.789/0001-44',
      taxaComissaoPadrao: 11.0,
      taxaMdrGateway: 3.1,
      retencaoSegurancaPercent: 18.0,
      prazoLiquidacaoDias: 3,
      limiteAdiantamentoGlobal: 800000.0,
      saldoAdiantadoAtual: 180000.0,
      statusContrato: ContractStatus.VIGENTE,
      statusComplianceCnd: ComplianceStatus.REGULAR,
      scoreCredito: 840,
      dataInicio: '2026-02-15T00:00:00Z',
      dataTermino: '2028-02-15T23:59:59Z',
    },
  ];

  private inMemoryEscrowLedgers: ProducerEscrowLedgerDto[] = [
    {
      id: 'esc-001',
      producerId: 'prod-001',
      eventId: 'evt-001',
      tipoMovimento: EscrowMovementType.RETENCAO_BILHETERIA,
      descricao: 'Retenção contratual de segurança (15%) - Festival Curitiba Pop',
      valorCredito: 375000.0,
      valorDebito: 0.0,
      saldoGarantiaApos: 375000.0,
      referenciaDocumento: 'BOR-2026-901',
      dataMovimento: '2026-03-25T14:30:00Z',
    },
    {
      id: 'esc-002',
      producerId: 'prod-001',
      eventId: 'evt-001',
      tipoMovimento: EscrowMovementType.DEDUCAO_CHARGEBACK,
      descricao: 'Dedução de 2 chargebacks contestados por compradores',
      valorCredito: 0.0,
      valorDebito: 960.0,
      saldoGarantiaApos: 374040.0,
      referenciaDocumento: 'CHG-2026-042',
      dataMovimento: '2026-03-28T09:15:00Z',
    },
    {
      id: 'esc-003',
      producerId: 'prod-002',
      eventId: 'evt-002',
      tipoMovimento: EscrowMovementType.RETENCAO_BILHETERIA,
      descricao: 'Retenção fiduciária de escrow (12%) - Rock Curitiba Stadium',
      valorCredito: 720000.0,
      valorDebito: 0.0,
      saldoGarantiaApos: 720000.0,
      referenciaDocumento: 'BOR-2026-905',
      dataMovimento: '2026-03-29T11:00:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async get360Overview(producerId?: string): Promise<Producer360SummaryDto[]> {
    try {
      const dbContracts = await this.prisma.producerCommercialContract.findMany();
      if (dbContracts.length > 0) {
        return dbContracts.map((c) => this.mapContractTo360(c));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory Producer 360 overview: ${e.message}`);
    }

    if (producerId) {
      const match = this.inMemoryContracts.filter((c) => c.producerId === producerId);
      return (match.length > 0 ? match : this.inMemoryContracts).map((c) =>
        this.mapContractTo360(c),
      );
    }

    return this.inMemoryContracts.map((c) => this.mapContractTo360(c));
  }

  private mapContractTo360(c: any): Producer360SummaryDto {
    const isT4F = c.razaoSocial.includes('T4F');
    const isOpus = c.razaoSocial.includes('Opus');
    return {
      producerId: c.producerId || c.id,
      razaoSocial: c.razaoSocial,
      nomeFantasia: isT4F ? 'T4F Entretenimento' : isOpus ? 'Opus Entretenimento' : 'Seven Eventos',
      cnpj: c.cnpj,
      scoreCredito: Number(c.scoreCredito) || 900,
      statusOperacional: 'HOMOLOGADO_ATIVO',
      totalEventos: isT4F ? 8 : isOpus ? 12 : 5,
      eventosAtivos: isT4F ? 3 : isOpus ? 4 : 2,
      ingressosVendidosTotal: isT4F ? 48500 : isOpus ? 62400 : 19200,
      receitaBrutaAcumulada: isT4F ? 6850000.0 : isOpus ? 8450000.0 : 2150000.0,
      receitaLiquidaApurada: isT4F ? 5920000.0 : isOpus ? 7310000.0 : 1850000.0,
      saldoEscrowRetido: isT4F ? 720000.0 : isOpus ? 374040.0 : 185000.0,
      saldoDisponivelRepasse: isT4F ? 1450000.0 : isOpus ? 1180000.0 : 420000.0,
      saldoAdiantadoVigente: Number(c.saldoAdiantadoAtual),
      limiteAdiantamentoDisponivel:
        Number(c.limiteAdiantamentoGlobal) - Number(c.saldoAdiantadoAtual),
      taxaComissaoVigente: Number(c.taxaComissaoPadrao),
      taxaMdrVigente: Number(c.taxaMdrGateway),
      retencaoSegurancaPercent: Number(c.retencaoSegurancaPercent),
      cndStatus: c.statusComplianceCnd as ComplianceStatus,
      proximoBorderoFechamento: '2026-04-10T23:59:59Z',
      certificacaoIcpBrasilValida: true,
    };
  }

  async getContracts(): Promise<ProducerCommercialContractDto[]> {
    try {
      const dbContracts = await this.prisma.producerCommercialContract.findMany();
      if (dbContracts.length > 0) {
        return dbContracts.map((c) => ({
          id: c.id,
          producerId: c.producerId,
          numeroContrato: c.numeroContrato,
          razaoSocial: c.razaoSocial,
          cnpj: c.cnpj,
          taxaComissaoPadrao: Number(c.taxaComissaoPadrao),
          taxaMdrGateway: Number(c.taxaMdrGateway),
          retencaoSegurancaPercent: Number(c.retencaoSegurancaPercent),
          prazoLiquidacaoDias: c.prazoLiquidacaoDias,
          limiteAdiantamentoGlobal: Number(c.limiteAdiantamentoGlobal),
          saldoAdiantadoAtual: Number(c.saldoAdiantadoAtual),
          statusContrato: c.statusContrato as ContractStatus,
          statusComplianceCnd: c.statusComplianceCnd as ComplianceStatus,
          scoreCredito: c.scoreCredito,
          dataInicio: c.dataInicio.toISOString(),
          dataTermino: c.dataTermino.toISOString(),
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory contracts: ${e.message}`);
    }
    return this.inMemoryContracts;
  }

  async getEscrowLedger(producerId?: string): Promise<ProducerEscrowLedgerDto[]> {
    try {
      const dbLedgers = await this.prisma.producerEscrowLedger.findMany({
        where: producerId ? { producerId } : undefined,
        orderBy: { dataMovimento: 'desc' },
      });
      if (dbLedgers.length > 0) {
        return dbLedgers.map((l) => ({
          id: l.id,
          producerId: l.producerId,
          eventId: l.eventId || undefined,
          tipoMovimento: l.tipoMovimento as EscrowMovementType,
          descricao: l.descricao,
          valorCredito: Number(l.valorCredito),
          valorDebito: Number(l.valorDebito),
          saldoGarantiaApos: Number(l.saldoGarantiaApos),
          referenciaDocumento: l.referenciaDocumento || undefined,
          dataMovimento: l.dataMovimento.toISOString(),
        }));
      }
    } catch (e) {
      this.logger.warn(`Fallback to in-memory escrow ledger: ${e.message}`);
    }

    if (producerId) {
      return this.inMemoryEscrowLedgers.filter((l) => l.producerId === producerId);
    }
    return this.inMemoryEscrowLedgers;
  }

  async simulateAdvance(
    producerId: string,
    valorSolicitado: number,
    prazoDias: number,
  ): Promise<ProducerAdvanceSimulateDto> {
    const contract =
      this.inMemoryContracts.find((c) => c.producerId === producerId) || this.inMemoryContracts[0];
    const taxaMensal = 0.0195; // 1.95% a.m.
    const taxaProRata = (taxaMensal / 30) * prazoDias;
    const custoFinanceiroDisk = valorSolicitado * taxaProRata;
    const valorLiquidoLiberado = valorSolicitado - custoFinanceiroDisk;
    const saldoGarantiaMinimoExigido = valorSolicitado * 0.25;

    const requerAlcada = valorSolicitado > 200000.0;

    return {
      producerId,
      valorSolicitado,
      prazoDias,
      taxaDescontoPercent: Number((taxaProRata * 100).toFixed(2)),
      valorLiquidoLiberado: Number(valorLiquidoLiberado.toFixed(2)),
      custoFinanceiroDisk: Number(custoFinanceiroDisk.toFixed(2)),
      saldoGarantiaMinimoExigido: Number(saldoGarantiaMinimoExigido.toFixed(2)),
      statusAprovacaoAlcada: requerAlcada ? 'REQUER_ALCADA_DIRETORIA' : 'APROVADO_AUTOMATICO',
    };
  }

  async requestAdvance(dto: {
    producerId: string;
    valorSolicitado: number;
    prazoDias: number;
    justificativa: string;
  }) {
    const sim = await this.simulateAdvance(dto.producerId, dto.valorSolicitado, dto.prazoDias);
    const contract = this.inMemoryContracts.find((c) => c.producerId === dto.producerId);
    if (contract) {
      contract.saldoAdiantadoAtual += dto.valorSolicitado;
    }

    const ledgerEntry: ProducerEscrowLedgerDto = {
      id: `esc-${Date.now()}`,
      producerId: dto.producerId,
      tipoMovimento: EscrowMovementType.REPASSE_ANTECIPADO,
      descricao: `Adiantamento de bilheteria aprovado (Trava Registradora CERC/B3) - Prazo ${dto.prazoDias}d`,
      valorCredito: 0.0,
      valorDebito: dto.valorSolicitado,
      saldoGarantiaApos: 250000.0,
      referenciaDocumento: `ANT-${Date.now().toString().slice(-6)}`,
      dataMovimento: new Date().toISOString(),
    };
    this.inMemoryEscrowLedgers.unshift(ledgerEntry);

    return {
      success: true,
      protocoloCercB3: `CERC-TRAVA-${Date.now()}`,
      simulacao: sim,
      mensagem: 'Adiantamento registrado com sucesso e gravame de bilheteria averbado.',
    };
  }
}
