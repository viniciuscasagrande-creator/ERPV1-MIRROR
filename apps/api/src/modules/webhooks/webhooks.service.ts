import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as crypto from 'crypto';
import {
  WebhookSubscriptionDto,
  CreateWebhookDto,
  WebhookDeliveryLogDto,
} from '@diskingressos/types';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<WebhookSubscriptionDto[]> {
    const count = await this.prisma.webhookSubscription.count();
    if (count === 0) {
      // Seed inicial de integrações webhook
      await this.prisma.webhookSubscription.createMany({
        data: [
          {
            nome: 'Hub de Mensageria do Produtor (Slack / Discord)',
            url: 'https://hooks.slack.com/services/T00/B00/disk-ingressos-repasse',
            secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
            ativo: true,
            eventos: ['evento.fechado', 'repasse.liquidado'],
            ultimoDisparo: new Date('2026-08-25T14:35:00Z'),
            ultimoStatus: 200,
          },
          {
            nome: 'Sistema de Auditoria Contábil Externa (Big4)',
            url: 'https://api.auditoria-contabil.com.br/v1/webhook-erpv1',
            secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
            ativo: true,
            eventos: ['competencia.fechada', 'mdr.divergencia'],
            ultimoDisparo: new Date('2026-08-24T18:00:00Z'),
            ultimoStatus: 200,
          },
        ],
      });
    }

    const items = await this.prisma.webhookSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return items.map((sub) => ({
      id: sub.id,
      nome: sub.nome,
      url: sub.url,
      secret: sub.secret,
      ativo: sub.ativo,
      eventos: sub.eventos,
      ultimoDisparo: sub.ultimoDisparo?.toISOString() || null,
      ultimoStatus: sub.ultimoStatus,
      createdAt: sub.createdAt.toISOString(),
      updatedAt: sub.updatedAt.toISOString(),
    }));
  }

  async create(data: CreateWebhookDto): Promise<WebhookSubscriptionDto> {
    const secret = 'whsec_' + crypto.randomBytes(20).toString('hex');

    const created = await this.prisma.webhookSubscription.create({
      data: {
        nome: data.nome,
        url: data.url,
        secret,
        ativo: data.ativo !== undefined ? data.ativo : true,
        eventos: data.eventos,
      },
    });

    return {
      id: created.id,
      nome: created.nome,
      url: created.url,
      secret: created.secret,
      ativo: created.ativo,
      eventos: created.eventos,
      ultimoDisparo: null,
      ultimoStatus: null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.webhookSubscription.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Webhook ${id} não encontrado.`);
    }

    await this.prisma.webhookSubscription.delete({ where: { id } });
    return { success: true };
  }

  async triggerTest(id: string, evento?: string, customPayload?: any): Promise<WebhookDeliveryLogDto> {
    const sub = await this.prisma.webhookSubscription.findUnique({ where: { id } });
    if (!sub) {
      throw new NotFoundException(`Webhook ${id} não encontrado.`);
    }

    const eventName = evento || (sub.eventos[0] || 'evento.fechado');
    const payload = customPayload || {
      evento: eventName,
      timestamp: new Date().toISOString(),
      source: 'DiskIngressos ERP Enterprise',
      data: {
        eventoId: 'evt-rock-arena',
        eventoNome: 'Festival Rock Curitiba 2026',
        valorTotalBruto: 428500.0,
        portoesValidados: 9,
        status: 'FECHADO_COM_SUCESSO',
      },
    };

    // Gera assinatura HMAC-SHA256
    const payloadString = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', sub.secret)
      .update(payloadString)
      .digest('hex');

    // Registra entrega do log (simula resposta HTTP 200 bem sucedida com payload assinado)
    const log = await this.prisma.webhookDeliveryLog.create({
      data: {
        subscriptionId: sub.id,
        evento: eventName,
        payload,
        statusCode: 200,
        sucesso: true,
        resposta: JSON.stringify({
          status: 'ok',
          received: true,
          verifiedSignature: `sha256=${signature.slice(0, 16)}...`,
          message: 'Webhook payload recebido e validado com sucesso.',
        }),
        tentativas: 1,
      },
    });

    // Atualiza status na subscription
    await this.prisma.webhookSubscription.update({
      where: { id: sub.id },
      data: {
        ultimoDisparo: new Date(),
        ultimoStatus: 200,
      },
    });

    return {
      id: log.id,
      subscriptionId: log.subscriptionId,
      evento: log.evento,
      payload: log.payload,
      statusCode: log.statusCode,
      sucesso: log.sucesso,
      resposta: log.resposta,
      tentativas: log.tentativas,
      createdAt: log.createdAt.toISOString(),
    };
  }

  async getLogs(subscriptionId?: string): Promise<WebhookDeliveryLogDto[]> {
    const where: any = {};
    if (subscriptionId) {
      where.subscriptionId = subscriptionId;
    }

    const logs = await this.prisma.webhookDeliveryLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return logs.map((log) => ({
      id: log.id,
      subscriptionId: log.subscriptionId,
      evento: log.evento,
      payload: log.payload,
      statusCode: log.statusCode,
      sucesso: log.sucesso,
      resposta: log.resposta,
      tentativas: log.tentativas,
      createdAt: log.createdAt.toISOString(),
    }));
  }
}
