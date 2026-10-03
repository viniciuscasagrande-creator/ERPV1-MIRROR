import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StatusPulseiraCashless } from '@diskingressos/types';
import type {
  CashlessRfidWristbandDto,
  EventFoodBeverageSaleDto,
  SpedInventoryBlockKRecordDto,
  CashlessDashboardKpisDto,
  RecarregarPulseiraRequestDto,
  RecarregarPulseiraResponseDto,
} from '@diskingressos/types';

@Injectable()
export class CashlessInventoryService {
  private readonly logger = new Logger(CashlessInventoryService.name);

  private inMemoryWristbands: CashlessRfidWristbandDto[] = [
    {
      id: 'wrb-001',
      tagRfidUid: 'RFID-NFC-99410291',
      eventoId: 'evt-rock-fest-2026',
      saldoAtualBrl: 145.0,
      saldoNaoResgatadoBrl: 25.0,
      taxaAtivacaoPagaBrl: 5.0,
      statusPulseira: StatusPulseiraCashless.ATIVA,
      ultimaCargaEm: new Date().toISOString(),
    },
    {
      id: 'wrb-002',
      tagRfidUid: 'RFID-NFC-88192033',
      eventoId: 'evt-rock-fest-2026',
      saldoAtualBrl: 80.0,
      saldoNaoResgatadoBrl: 15.0,
      taxaAtivacaoPagaBrl: 5.0,
      statusPulseira: StatusPulseiraCashless.ATIVA,
      ultimaCargaEm: new Date().toISOString(),
    },
  ];

  private inMemorySales: EventFoodBeverageSaleDto[] = [
    {
      id: 'sale-001',
      pulseiraId: 'wrb-001',
      eventoId: 'evt-rock-fest-2026',
      pontoVendaBar: 'Bar Principal Pista 01',
      itemDescricao: 'Chopp Artesanal IPA 500ml',
      quantidade: 2,
      valorTotalBrl: 40.0,
      custoMercadoriaVendidaBrl: 14.0,
      timestampVenda: new Date().toISOString(),
    },
  ];

  private inMemorySpedBlockK: SpedInventoryBlockKRecordDto[] = [
    {
      id: 'blk-001',
      eventoId: 'evt-rock-fest-2026',
      mesCompetencia: '2026-04',
      codigoItemInsumo: 'INS-CHOPP-IPA-BARRIL-50L',
      quantidadeEstoqueInicial: 100.0,
      quantidadeConsumida: 45.0,
      quantidadeEstoqueFinal: 55.0,
      perdaApuradaQuebra: 0.5,
      dataFechamento: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getWristbands(): Promise<CashlessRfidWristbandDto[]> {
    try {
      const records = await this.prisma.cashlessRfidWristband.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          tagRfidUid: r.tagRfidUid,
          eventoId: r.eventoId,
          saldoAtualBrl: Number(r.saldoAtualBrl),
          saldoNaoResgatadoBrl: Number(r.saldoNaoResgatadoBrl),
          taxaAtivacaoPagaBrl: Number(r.taxaAtivacaoPagaBrl),
          statusPulseira: r.statusPulseira as StatusPulseiraCashless,
          ultimaCargaEm: r.ultimaCargaEm.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory wristbands');
    }
    return this.inMemoryWristbands;
  }

  async getSales(): Promise<EventFoodBeverageSaleDto[]> {
    try {
      const records = await this.prisma.eventFoodBeverageSale.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          pulseiraId: r.pulseiraId,
          eventoId: r.eventoId,
          pontoVendaBar: r.pontoVendaBar,
          itemDescricao: r.itemDescricao,
          quantidade: r.quantidade,
          valorTotalBrl: Number(r.valorTotalBrl),
          custoMercadoriaVendidaBrl: Number(r.custoMercadoriaVendidaBrl),
          timestampVenda: r.timestampVenda.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory sales');
    }
    return this.inMemorySales;
  }

  async getSpedBlockKRecords(): Promise<SpedInventoryBlockKRecordDto[]> {
    try {
      const records = await this.prisma.spedInventoryBlockKRecord.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          eventoId: r.eventoId,
          mesCompetencia: r.mesCompetencia,
          codigoItemInsumo: r.codigoItemInsumo,
          quantidadeEstoqueInicial: Number(r.quantidadeEstoqueInicial),
          quantidadeConsumida: Number(r.quantidadeConsumida),
          quantidadeEstoqueFinal: Number(r.quantidadeEstoqueFinal),
          perdaApuradaQuebra: Number(r.perdaApuradaQuebra),
          dataFechamento: r.dataFechamento.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory SPED records');
    }
    return this.inMemorySpedBlockK;
  }

  async recarregarPulseira(dto: RecarregarPulseiraRequestDto): Promise<RecarregarPulseiraResponseDto> {
    const wristband = this.inMemoryWristbands.find((w) => w.tagRfidUid === dto.tagRfidUid);
    if (!wristband) {
      throw new Error(`Pulseira com tag ${dto.tagRfidUid} não encontrada`);
    }

    wristband.saldoAtualBrl += dto.valorRecargaBrl;
    wristband.ultimaCargaEm = new Date().toISOString();

    return {
      tagRfidUid: wristband.tagRfidUid,
      novoSaldoBrl: wristband.saldoAtualBrl,
      comprovanteRecargaId: `REC-CASHLESS-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  async getKpis(): Promise<CashlessDashboardKpisDto> {
    return {
      totalPulseirasAtivas: this.inMemoryWristbands.length,
      volumeTotalRecargasBrl: 485000.0,
      consumoTotalBaresBrl: 412000.0,
      saldoSobraNaoResgatadoBrl: 73000.0,
      margemBrutaAlimentosBebidasPercent: 65.5,
    };
  }
}
