import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { StatusFinanceiroEvento, StatusEvento } from '@prisma/client';
import { EventsGateway } from '../events-gateway/events.gateway';

@Injectable()
export class EventosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateEventDto) {
    const producer = await this.prisma.producer.findUnique({
      where: { id: dto.producerId },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    const event = await this.prisma.event.create({
      data: {
        nome: dto.nome,
        categoria: dto.categoria,
        dataEvento: new Date(dto.dataEvento),
        local: dto.local,
        cidade: dto.cidade || 'Curitiba',
        estado: dto.estado || 'PR',
        capacidadeTotal: dto.capacidadeTotal,
        producerId: dto.producerId,
        financialSummary: {
          create: {},
        },
        closingChecklist: {
          create: {},
        },
      },
    });

    // Se lotes foram informados, cria-os
    if (dto.batches && dto.batches.length > 0) {
      for (const b of dto.batches) {
        await this.prisma.ticketBatch.create({
          data: {
            eventId: event.id,
            nome: b.nome,
            ticketTypes: {
              create: b.ticketTypes.map((t) => ({
                nome: t.nome,
                precoUnitario: t.precoUnitario,
                taxaServico: t.taxaServico || 10.0,
                quantidadeTotal: t.quantidadeTotal,
                quantidadeVendida: 0,
              })),
            },
          },
        });
      }
    }

    return this.findOne(event.id);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    producerId?: string;
    statusFinanceiro?: string;
    search?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.producerId) where.producerId = params.producerId;
    if (params.statusFinanceiro) where.statusFinanceiro = params.statusFinanceiro as any;
    if (params.search) {
      where.OR = [
        { nome: { contains: params.search, mode: 'insensitive' } },
        { local: { contains: params.search, mode: 'insensitive' } },
        { producer: { nomeFantasia: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [total, events] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataEvento: 'desc' },
        include: {
          producer: {
            select: { id: true, nomeFantasia: true, razaoSocial: true },
          },
          financialSummary: true,
          closingChecklist: true,
          batches: {
            include: {
              ticketTypes: true,
            },
          },
        },
      }),
    ]);

    const items = events.map((e) => {
      let totalTicketsSold = 0;
      let totalAvailable = 0;

      e.batches.forEach((b) => {
        b.ticketTypes.forEach((t) => {
          totalTicketsSold += t.quantidadeVendida;
          totalAvailable += t.quantidadeTotal;
        });
      });

      return {
        id: e.id,
        nome: e.nome,
        categoria: e.categoria,
        dataEvento: e.dataEvento.toISOString(),
        local: e.local,
        cidade: e.cidade,
        estado: e.estado,
        capacidadeTotal: e.capacidadeTotal,
        status: e.status,
        statusFinanceiro: e.statusFinanceiro,
        producerId: e.producerId,
        producerName: e.producer.nomeFantasia,
        totalTicketsSold,
        totalAvailable,
        financialSummary: e.financialSummary
          ? {
              vendasBrutas: Number(e.financialSummary.vendasBrutas),
              cancelamentos: Number(e.financialSummary.cancelamentos),
              estornos: Number(e.financialSummary.estornos),
              taxasMdrGateway: Number(e.financialSummary.taxasMdrGateway),
              comissaoDisk: Number(e.financialSummary.comissaoDisk),
              taxasServicoDisk: Number(e.financialSummary.taxasServicoDisk),
              retencoesTributarias: Number(e.financialSummary.retencoesTributarias),
              valorLiquidoProdutor: Number(e.financialSummary.valorLiquidoProdutor),
              ingressosVendidos: e.financialSummary.ingressosVendidos,
              ingressosCancelados: e.financialSummary.ingressosCancelados,
            }
          : null,
        closingChecklist: e.closingChecklist,
        createdAt: e.createdAt.toISOString(),
      };
    });

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

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        producer: true,
        financialSummary: true,
        closingChecklist: true,
        batches: {
          include: {
            ticketTypes: true,
          },
          orderBy: { inicioVendas: 'asc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  async updateChecklist(eventId: string, dto: UpdateChecklistDto, userId?: string) {
    const event = await this.findOne(eventId);

    // Validação de Integridade: Se tentar fechar o evento, valida se os gates obrigatórios estão cumpridos
    if (dto.eventoFechado) {
      const current = event.closingChecklist;
      const willBeVendasConferidas = dto.vendasConferidas ?? current?.vendasConferidas;
      const willBeCancelamentos = dto.cancelamentosConferidos ?? current?.cancelamentosConferidos;
      const willBeEstornos = dto.estornosConferidos ?? current?.estornosConferidos;
      const willBeGateway = dto.gatewayConciliado ?? current?.gatewayConciliado;
      const willBeBanco = dto.bancoConciliado ?? current?.bancoConciliado;
      const willBeFinanceiro = dto.financeiroApurado ?? current?.financeiroApurado;
      const willBeRepasse = dto.repasseAprovado ?? current?.repasseAprovado;

      if (
        !willBeVendasConferidas ||
        !willBeCancelamentos ||
        !willBeEstornos ||
        !willBeGateway ||
        !willBeBanco ||
        !willBeFinanceiro ||
        !willBeRepasse
      ) {
        throw new BadRequestException(
          'Não é permitido concluir o Fechamento do Evento: existem etapas pendentes no checklist.',
        );
      }
    }

    const updatedChecklist = await this.prisma.eventClosingChecklist.upsert({
      where: { eventId },
      update: {
        ...dto,
        ...(dto.eventoFechado
          ? { fechadoEm: new Date(), fechadoPor: userId || 'Sistema' }
          : {}),
      },
      create: {
        eventId,
        ...dto,
      },
    });

    // Se o evento foi fechado, atualiza o status financeiro do Evento para FECHADO
    if (dto.eventoFechado) {
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          statusFinanceiro: StatusFinanceiroEvento.FECHADO,
          status: StatusEvento.ENCERRADO,
        },
      });
      this.eventsGateway.emitEventClosed(eventId, event.nome);
    }

    // Disparo em tempo real dos portões atualizados
    Object.keys(dto).forEach((k) => {
      if (k !== 'observacoes') {
        this.eventsGateway.emitGateUpdated({
          eventId,
          gateKey: k,
          value: (dto as any)[k],
          updatedBy: userId,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return updatedChecklist;
  }

  async recalculateFinancialSummary(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        producer: true,
        sales: {
          include: {
            payments: true,
            refunds: true,
          },
        },
      },
    });

    if (!event) return null;

    let vendasBrutas = 0;
    let cancelamentos = 0;
    let estornos = 0;
    let taxasMdrGateway = 0;
    let ingressosVendidos = 0;
    let ingressosCancelados = 0;

    for (const sale of event.sales) {
      if (sale.status === 'APROVADO') {
        vendasBrutas += Number(sale.totalBruto);
        // Soma ingressos
        const items = await this.prisma.saleItem.findMany({ where: { saleId: sale.id } });
        items.forEach((it) => (ingressosVendidos += it.quantidade));

        sale.payments.forEach((p) => {
          if (p.status === 'APROVADO') {
            taxasMdrGateway += Number(p.taxaMdrValor);
          }
        });
      } else if (sale.status === 'CANCELADO') {
        cancelamentos += Number(sale.totalBruto);
        const items = await this.prisma.saleItem.findMany({ where: { saleId: sale.id } });
        items.forEach((it) => (ingressosCancelados += it.quantidade));
      } else if (sale.status === 'ESTORNADO') {
        sale.refunds.forEach((r) => (estornos += Number(r.valorEstorno)));
      }
    }

    const taxaComissaoPercent = Number(event.producer.taxaComissao) / 100;
    const comissaoDisk = vendasBrutas * taxaComissaoPercent;
    const taxasServicoDisk = vendasBrutas * 0.1; // 10% de serviço
    const valorLiquidoProdutor =
      vendasBrutas - cancelamentos - estornos - taxasMdrGateway - comissaoDisk;

    return this.prisma.eventFinancialSummary.upsert({
      where: { eventId },
      update: {
        vendasBrutas,
        cancelamentos,
        estornos,
        taxasMdrGateway,
        comissaoDisk,
        taxasServicoDisk,
        valorLiquidoProdutor,
        ingressosVendidos,
        ingressosCancelados,
      },
      create: {
        eventId,
        vendasBrutas,
        cancelamentos,
        estornos,
        taxasMdrGateway,
        comissaoDisk,
        taxasServicoDisk,
        valorLiquidoProdutor,
        ingressosVendidos,
        ingressosCancelados,
      },
    });
  }
}
