import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth.store';
import { SocketEvent } from '@diskingressos/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001/realtime';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().tokens?.accessToken;

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Conectado ao Gateway em tempo real:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.IO] Desconectado do Gateway:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('⚠️ [Socket.IO] Erro de conexão:', error.message);
    });

    // Reanexa todos os listeners registrados
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        this.socket?.on(event, cb);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinEventRoom(eventId: string) {
    if (this.socket) {
      this.socket.emit('join:event', { eventId });
    }
  }

  leaveEventRoom(eventId: string) {
    if (this.socket) {
      this.socket.emit('leave:event', { eventId });
    }
  }

  on<T = any>(event: SocketEvent | string, callback: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    return () => this.off(event, callback);
  }

  off(event: SocketEvent | string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const wsService = new WebSocketService();
