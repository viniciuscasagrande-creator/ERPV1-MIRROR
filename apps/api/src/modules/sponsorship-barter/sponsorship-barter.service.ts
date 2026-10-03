import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TipoContratoPatrocinio } from '@diskingressos/types';
import type {
  SponsorshipNamingAgreementDto,
  BarterTradeExchangeRecordDto,
  SponsorshipRevenueAmortizationDto,
  SponsorshipDashboardKpisDto,
  RegistrarBarterRequestDto,
  RegistrarBarterResponseDto,
} from '@diskingressos/types';

@Injectable()
export class SponsorshipBarterService {
  private readonly logger = new Logger(SponsorshipBarterService.name);

  private inMemoryAgreements: SponsorshipNamingAgreementDto[] = [
    {
      id: 'spn-001',
      empresaPatrocinadoraNome: 'Ambev S.A. (Budweiser)',
      cnpjPatrocinador: '07.526.557/0001-00',
      eventoOuEspacoNome: 'Arena Disk Festival - Palco Principal',
      tipoContrato: TipoContratoPatrocinio.NAMING_RIGHTS,
      valorTotalContratoBrl: 1200000.0,
      prazoVigenciaMeses: 12,
      statusContrato: 'ATIVO_HOMOLOGADO',
      dataInicioVigencia: '2026-01-01T00:00:00Z',
    },
    {
      id: 'spn-002',
      empresaPatrocinadoraNome: 'Red Bull do Brasil Ltda',
      cnpjPatrocinador: '04.811.233/0001-49',
      eventoOuEspacoNome: 'Camarote Eletrônico Disk Stage',
      tipoContrato: TipoContratoPatrocinio.COTA_MASTER,
      valorTotalContratoBrl: 450000.0,
      prazoVigenciaMeses: 6,
      statusContrato: 'ATIVO_HOMOLOGADO',
      dataInicioVigencia: '2026-02-01T00:00:00Z',
    },
  ];

  private inMemoryBarters: BarterTradeExchangeRecordDto[] = [
    {
      id: 'bar-001',
      acordoPatrocinioId: 'spn-001',
      descricaoItemPermuta: 'Fornecimento de infraestrutura de som line array em troca de ingressos VIP',
      valorEconomicoAvaliadoBrl: 85000.0,
      numeroNotaFiscalEntrada: 'NF-E-99412',
      numeroNotaFiscalSaida: 'NF-S-10492',
      dataEfetivacao: '2026-03-15T10:00:00Z',
    },
  ];

  private inMemoryAmortizations: SponsorshipRevenueAmortizationDto[] = [
    {
      id: 'amt-001',
      acordoPatrocinioId: 'spn-001',
      mesCompetencia: '2026-03',
      receitaDiferidaInicialBrl: 1000000.0,
      amortizacaoCompetenciaBrl: 100000.0,
      saldoReceitaDiferidaFinalBrl: 900000.0,
      contaContabilCredito: '3.1.1.10 - Receitas de Patrocínios e Naming Rights',
      apuradoEm: '2026-03-31T23:59:59Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getAgreements(): Promise<SponsorshipNamingAgreementDto[]> {
    try {
      const records = await this.prisma.sponsorshipNamingAgreement.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          empresaPatrocinadoraNome: r.empresaPatrocinadoraNome,
          cnpjPatrocinador: r.cnpjPatrocinador,
          eventoOuEspacoNome: r.eventoOuEspacoNome,
          tipoContrato: r.tipoContrato as TipoContratoPatrocinio,
          valorTotalContratoBrl: Number(r.valorTotalContratoBrl),
          prazoVigenciaMeses: r.prazoVigenciaMeses,
          statusContrato: r.statusContrato,
          dataInicioVigencia: r.dataInicioVigencia.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory agreements');
    }
    return this.inMemoryAgreements;
  }

  async getBarters(): Promise<BarterTradeExchangeRecordDto[]> {
    try {
      const records = await this.prisma.barterTradeExchangeRecord.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          acordoPatrocinioId: r.acordoPatrocinioId,
          descricaoItemPermuta: r.descricaoItemPermuta,
          valorEconomicoAvaliadoBrl: Number(r.valorEconomicoAvaliadoBrl),
          numeroNotaFiscalEntrada: r.numeroNotaFiscalEntrada,
          numeroNotaFiscalSaida: r.numeroNotaFiscalSaida,
          comprovanteEntregaServicoUrl: r.comprovanteEntregaServicoUrl ?? undefined,
          dataEfetivacao: r.dataEfetivacao.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory barters');
    }
    return this.inMemoryBarters;
  }

  async getAmortizations(): Promise<SponsorshipRevenueAmortizationDto[]> {
    try {
      const records = await this.prisma.sponsorshipRevenueAmortization.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          acordoPatrocinioId: r.acordoPatrocinioId,
          mesCompetencia: r.mesCompetencia,
          receitaDiferidaInicialBrl: Number(r.receitaDiferidaInicialBrl),
          amortizacaoCompetenciaBrl: Number(r.amortizacaoCompetenciaBrl),
          saldoReceitaDiferidaFinalBrl: Number(r.saldoReceitaDiferidaFinalBrl),
          contaContabilCredito: r.contaContabilCredito,
          apuradoEm: r.apuradoEm.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory amortizations');
    }
    return this.inMemoryAmortizations;
  }

  async registrarBarter(dto: RegistrarBarterRequestDto): Promise<RegistrarBarterResponseDto> {
    const novoBarter: BarterTradeExchangeRecordDto = {
      id: `bar-${Date.now()}`,
      acordoPatrocinioId: dto.acordoPatrocinioId,
      descricaoItemPermuta: dto.descricaoItemPermuta,
      valorEconomicoAvaliadoBrl: dto.valorEconomicoAvaliadoBrl,
      numeroNotaFiscalEntrada: dto.numeroNotaFiscalEntrada,
      numeroNotaFiscalSaida: dto.numeroNotaFiscalSaida,
      dataEfetivacao: new Date().toISOString(),
    };

    this.inMemoryBarters.push(novoBarter);

    return {
      sucesso: true,
      barterId: novoBarter.id,
      valorLancamentoContabilBrl: novoBarter.valorEconomicoAvaliadoBrl,
      protocoloCompensacaoFiscal: `COMP-BARTER-IFRS15-${Date.now()}`,
    };
  }

  async getKpis(): Promise<SponsorshipDashboardKpisDto> {
    return {
      receitaTotalContratadaBrl: 1650000.0,
      receitaDiferidaPassivoBrl: 1250000.0,
      receitaAmortizadaAnoBrl: 400000.0,
      volumePermutasBarterBrl: 85000.0,
      marcasPatrocinadorasAtivas: this.inMemoryAgreements.length,
    };
  }
}
