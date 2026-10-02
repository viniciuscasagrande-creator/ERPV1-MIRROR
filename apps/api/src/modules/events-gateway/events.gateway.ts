import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SocketEvent,
  SocketRooms,
  WsSalePayload,
  WsGateUpdatedPayload,
  PerfilUsuario,
  JwtPayload,
} from '@diskingressos/types';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        client.handshake.query?.token;

      if (!token) {
        this.logger.debug(`Conexão anônima aceita no socket: ${client.id}`);
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret:
          process.env.JWT_ACCESS_SECRET ||
          'disk_ingressos_jwt_access_secret_super_seguro_2026_enterprise_key',
      });

      client.data.user = payload;

      // Ingressa automaticamente nas salas pertinentes de acordo com o perfil
      if (payload.roles.includes(PerfilUsuario.ADMIN)) {
        client.join(SocketRooms.admin());
        client.join(SocketRooms.financeiro());
        client.join(SocketRooms.contabilidade());
        client.join(SocketRooms.operacional());
      } else {
        if (payload.roles.includes(PerfilUsuario.FINANCEIRO)) {
          client.join(SocketRooms.financeiro());
        }
        if (payload.roles.includes(PerfilUsuario.CONTABILIDADE)) {
          client.join(SocketRooms.contabilidade());
        }
        if (payload.roles.includes(PerfilUsuario.OPERACIONAL)) {
          client.join(SocketRooms.operacional());
        }
        if (payload.roles.includes(PerfilUsuario.PRODUTOR) && payload.producerId) {
          client.join(SocketRooms.producer(payload.producerId));
        }
      }

      this.logger.log(
        `⚡ Cliente autenticado conectado: ${payload.email} (${client.id})`,
      );
    } catch (err) {
      this.logger.warn(`Conexão WebSocket com token inválido: ${err.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Cliente desconectado do socket: ${client.id}`);
  }

  @SubscribeMessage('join:event')
  handleJoinEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string },
  ) {
    if (data?.eventId) {
      const room = SocketRooms.event(data.eventId);
      client.join(room);
      this.logger.debug(`Socket ${client.id} entrou na sala ${room}`);
      return { success: true, room };
    }
    return { success: false };
  }

  @SubscribeMessage('leave:event')
  handleLeaveEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string },
  ) {
    if (data?.eventId) {
      const room = SocketRooms.event(data.eventId);
      client.leave(room);
      this.logger.debug(`Socket ${client.id} saiu da sala ${room}`);
      return { success: true, room };
    }
    return { success: false };
  }

  // ============================================================================
  // DISPATCHERS DE EVENTOS EM TEMPO REAL COM ROTEAMENTO EM SALAS (ROOMS)
  // ============================================================================

  emitSaleCreated(payload: WsSalePayload) {
    this.logger.log(
      `📢 [Socket.IO] Disparando ${SocketEvent.SALE_CREATED} para evento ${payload.eventId} e produtor ${payload.producerId}`,
    );

    // 1. Emite para a sala do Evento específico
    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.SALE_CREATED, payload);

    // 2. Emite para a sala isolada do Produtor (Portal do Produtor)
    this.server.to(SocketRooms.producer(payload.producerId)).emit(SocketEvent.SALE_CREATED, payload);

    // 3. Emite para a equipe interna da Disk (ERP Financeiro e Admin)
    this.server.to(SocketRooms.financeiro()).emit(SocketEvent.SALE_CREATED, payload);
    this.server.to(SocketRooms.admin()).emit(SocketEvent.SALE_CREATED, payload);

    // 4. Emite confirmação de pagamento e emissão de ingresso
    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.PAYMENT_RECEIVED, {
      saleId: payload.saleId,
      eventId: payload.eventId,
      valor: payload.totalLiquido,
      metodo: payload.metodoPagamento,
      pagoEm: payload.createdAt,
    });

    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.TICKET_ISSUED, {
      saleId: payload.saleId,
      eventId: payload.eventId,
      quantidade: payload.ingressosQtd,
    });
  }

  emitRefundCreated(payload: {
    saleId: string;
    eventId: string;
    producerId: string;
    valor: number;
    motivo: string;
  }) {
    this.logger.log(`📢 [Socket.IO] Disparando ${SocketEvent.REFUND_CREATED} para venda ${payload.saleId}`);

    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.REFUND_CREATED, payload);
    this.server.to(SocketRooms.producer(payload.producerId)).emit(SocketEvent.REFUND_CREATED, payload);
    this.server.to(SocketRooms.financeiro()).emit(SocketEvent.REFUND_CREATED, payload);
  }

  emitGateUpdated(payload: WsGateUpdatedPayload) {
    this.logger.log(
      `📢 [Socket.IO] Disparando ${SocketEvent.CHECKLIST_GATE_UPDATED} (${payload.gateKey}=${payload.value}) para evento ${payload.eventId}`,
    );

    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.CHECKLIST_GATE_UPDATED, payload);
    this.server.to(SocketRooms.financeiro()).emit(SocketEvent.CHECKLIST_GATE_UPDATED, payload);
    this.server.to(SocketRooms.admin()).emit(SocketEvent.CHECKLIST_GATE_UPDATED, payload);
  }

  emitEventClosed(eventId: string, eventName: string) {
    this.logger.log(`📢 [Socket.IO] Disparando ${SocketEvent.EVENT_CLOSED} para evento ${eventId}`);

    const payload = { eventId, eventName, closedAt: new Date().toISOString() };
    this.server.to(SocketRooms.event(eventId)).emit(SocketEvent.EVENT_CLOSED, payload);
    this.server.to(SocketRooms.financeiro()).emit(SocketEvent.EVENT_CLOSED, payload);
    this.server.to(SocketRooms.admin()).emit(SocketEvent.EVENT_CLOSED, payload);
  }

  emitSettlementUpdated(payload: {
    settlementId: string;
    codigo: string;
    producerId: string;
    eventId: string;
    status: string;
    valorLiquido: number;
    updatedAt: string;
  }) {
    this.logger.log(`📢 [Socket.IO] Disparando ${SocketEvent.SETTLEMENT_UPDATED} (${payload.codigo}: ${payload.status})`);
    this.server.to(SocketRooms.financeiro()).emit(SocketEvent.SETTLEMENT_UPDATED, payload);
    this.server.to(SocketRooms.admin()).emit(SocketEvent.SETTLEMENT_UPDATED, payload);
    this.server.to(SocketRooms.producer(payload.producerId)).emit(SocketEvent.PRODUCER_SETTLEMENT_UPDATED, payload);
    this.server.to(SocketRooms.event(payload.eventId)).emit(SocketEvent.SETTLEMENT_UPDATED, payload);
  }
}
