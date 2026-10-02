import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EventosService } from '../eventos/eventos.service';
import { EventsGateway } from '../events-gateway/events.gateway';
import * as crypto from 'crypto';

@Injectable()
export class VendasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventosService: EventosService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateSaleDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { producer: true },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    let totalBruto = 0;
    let totalTaxas = 0;

    const itemsToCreate: any[] = [];

    // Validação de estoque e cálculo de valores por item
    for (const itemDto of dto.items) {
      const ticketType = await this.prisma.ticketType.findUnique({
        where: { id: itemDto.ticketTypeId },
      });

      if (!ticketType) {
        throw new NotFoundException(`Tipo de ingresso ID ${itemDto.ticketTypeId} não encontrado`);
      }

      const available = ticketType.quantidadeTotal - ticketType.quantidadeVendida;
      if (available < itemDto.quantidade) {
        throw new BadRequestException(
          `Ingresso '${ticketType.nome}' sem estoque suficiente. Disponíveis: ${available}`,
        );
      }

      const precoUnit = Number(ticketType.precoUnitario);
      const taxaServicoPercent = Number(ticketType.taxaServico) / 100;

      const subtotalItem = precoUnit * itemDto.quantidade;
      const taxaItem = subtotalItem * taxaServicoPercent;

      totalBruto += subtotalItem;
      totalTaxas += taxaItem;

      itemsToCreate.push({
        ticketTypeId: ticketType.id,
        quantidade: itemDto.quantidade,
        precoUnitario: precoUnit,
        subtotal: subtotalItem,
        taxaCalculada: taxaItem,
      });

      // Atualiza quantidade vendida do ingresso
      await this.prisma.ticketType.update({
        where: { id: ticketType.id },
        data: {
          quantidadeVendida: ticketType.quantidadeVendida + itemDto.quantidade,
        },
      });
    }

    const totalLiquido = totalBruto + totalTaxas;
    const codigoPedido = `PED-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Cálculo do MDR do Gateway
    const gateway = dto.gateway || 'Cielo';
    const mdrRate = dto.metodoPagamento === 'PIX' ? 0.99 : 2.89; // 0.99% PIX, 2.89% Cartão
    const mdrValor = (totalLiquido * mdrRate) / 100;
    const valorLiquidoGateway = totalLiquido - mdrValor;

    // Transação atômica de criação de Venda e Pagamento
    const sale = await this.prisma.sale.create({
      data: {
        codigoPedido,
        eventId: dto.eventId,
        canal: dto.canal,
        compradorNome: dto.compradorNome,
        compradorCpf: dto.compradorCpf.replace(/\D/g, ''),
        compradorEmail: dto.compradorEmail,
        totalBruto,
        totalTaxas,
        totalDescontos: 0,
        totalLiquido,
        status: 'APROVADO',
        items: {
          create: itemsToCreate,
        },
        payments: {
          create: {
            metodo: dto.metodoPagamento,
            parcelas: dto.parcelas || 1,
            gateway,
            transacaoId: `TX-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
            codigoAutorizacao: `${Math.floor(100000 + Math.random() * 900000)}`,
            valorPago: totalLiquido,
            taxaMdrPercent: mdrRate,
            taxaMdrValor: mdrValor,
            valorLiquidoGateway,
            status: 'APROVADO',
          },
        },
      },
      include: {
        items: { include: { ticketType: true } },
        payments: true,
      },
    });

    // Recalcula apuração financeira em tempo real do evento
    await this.eventosService.recalculateFinancialSummary(dto.eventId);

    // Disparo em Tempo Real via Socket.IO
    this.eventsGateway.emitSaleCreated({
      saleId: sale.id,
      codigoPedido: sale.codigoPedido,
      eventId: event.id,
      eventoNome: event.nome,
      producerId: event.producerId,
      canal: sale.canal,
      totalBruto: Number(sale.totalBruto),
      totalLiquido: Number(sale.totalLiquido),
      metodoPagamento: dto.metodoPagamento,
      ingressosQtd: itemsToCreate.reduce((acc, it) => acc + it.quantidade, 0),
      createdAt: sale.createdAt.toISOString(),
    });

    return sale;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    eventId?: string;
    canal?: string;
    status?: string;
    search?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.eventId) where.eventId = params.eventId;
    if (params.canal) where.canal = params.canal as any;
    if (params.status) where.status = params.status as any;
    if (params.search) {
      where.OR = [
        { codigoPedido: { contains: params.search, mode: 'insensitive' } },
        { compradorNome: { contains: params.search, mode: 'insensitive' } },
        { compradorCpf: { contains: params.search } },
      ];
    }

    const [total, sales] = await Promise.all([
      this.prisma.sale.count({ where }),
      this.prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: { select: { id: true, nome: true } },
          payments: { select: { metodo: true, gateway: true, valorPago: true } },
          items: {
            include: { ticketType: { select: { nome: true } } },
          },
        },
      }),
    ]);

    const items = sales.map((s) => ({
      id: s.id,
      codigoPedido: s.codigoPedido,
      eventId: s.eventId,
      eventoNome: s.event?.nome,
      canal: s.canal,
      compradorNome: s.compradorNome,
      compradorCpf: s.compradorCpf,
      compradorEmail: s.compradorEmail,
      totalBruto: Number(s.totalBruto),
      totalTaxas: Number(s.totalTaxas),
      totalDescontos: Number(s.totalDescontos),
      totalLiquido: Number(s.totalLiquido),
      status: s.status,
      metodoPagamento: s.payments[0]?.metodo || 'PIX',
      gateway: s.payments[0]?.gateway || 'Cielo',
      createdAt: s.createdAt.toISOString(),
      items: s.items.map((it) => ({
        id: it.id,
        ticketTypeId: it.ticketTypeId,
        ticketNome: it.ticketType.nome,
        quantidade: it.quantidade,
        precoUnitario: Number(it.precoUnitario),
        subtotal: Number(it.subtotal),
        taxaCalculada: Number(it.taxaCalculada),
      })),
    }));

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async refund(saleId: string, motivo: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
      include: { payments: true, items: true, event: true },
    });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    if (sale.status === 'ESTORNADO' || sale.status === 'CANCELADO') {
      throw new BadRequestException('Esta venda já se encontra cancelada ou estornada');
    }

    // Registra estorno
    const refund = await this.prisma.refund.create({
      data: {
        saleId: sale.id,
        paymentId: sale.payments[0]?.id || null,
        valorEstorno: sale.totalLiquido,
        taxaRetida: 0,
        motivo,
        status: 'PROCESSADO_GATEWAY',
        processadoEm: new Date(),
      },
    });

    // Atualiza status da venda
    await this.prisma.sale.update({
      where: { id: saleId },
      data: { status: 'ESTORNADO' },
    });

    // Devolve ingressos para o estoque
    for (const item of sale.items) {
      await this.prisma.ticketType.update({
        where: { id: item.ticketTypeId },
        data: {
          quantidadeVendida: { decrement: item.quantidade },
        },
      });
    }

    // Recalcula apuração do evento
    await this.eventosService.recalculateFinancialSummary(sale.eventId);

    // Disparo em Tempo Real via Socket.IO
    this.eventsGateway.emitRefundCreated({
      saleId: sale.id,
      eventId: sale.eventId,
      producerId: sale.event.producerId,
      valor: Number(sale.totalLiquido),
      motivo,
    });

    return refund;
  }
}
