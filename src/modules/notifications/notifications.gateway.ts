import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Simple Socket.IO gateway.
 * Clients should connect and then "identify" with userId so the server can emit targeted events.
 */
@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true },
})
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> socketIds

  handleConnection(client: Socket) {
    this.logger.log(`WS connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(userId);
      }
    }
    this.logger.log(`WS disconnected: ${client.id}`);
  }

  @SubscribeMessage('identify')
  identify(@ConnectedSocket() client: Socket, @MessageBody() body: { userId: string }) {
    if (!body?.userId) return { ok: false };
    const set = this.userSockets.get(body.userId) ?? new Set<string>();
    set.add(client.id);
    this.userSockets.set(body.userId, set);
    return { ok: true };
  }

  emitToUser(userId: string, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
