import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  // A simple in-memory store for soft-locked seats
  const seatLocks = new Map<string, Map<string, NodeJS.Timeout>>();
  
  @WebSocketGateway({ cors: true })
  export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      // Called when a client connects
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      // Called when a client disconnects - release any seats they locked
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('lock_seats')
    handleLockSeats(
      @MessageBody() data: { screeningId: string; seatNames: string[] },
      @ConnectedSocket() client: Socket,
    ) {
      const { screeningId, seatNames } = data;
      if (!seatLocks.has(screeningId)) {
        seatLocks.set(screeningId, new Map());
      }
      const screeningMap = seatLocks.get(screeningId);
      const alreadyLocked: string[] = [];
      const locked: string[] = [];
  
      for (const seat of seatNames) {
        if (screeningMap.has(seat)) {
          alreadyLocked.push(seat);
        } else {
          locked.push(seat);
          const timeout = setTimeout(() => {
            screeningMap.delete(seat);
            this.server.emit('seats_released', { screeningId, seat });
          }, 30000); // 30 sec soft lock
          screeningMap.set(seat, timeout);
        }
      }
  
      if (locked.length > 0) {
        this.server.emit('seats_locked', { screeningId, seats: locked });
      }
  
      return { locked, alreadyLocked };
    }
  
    @SubscribeMessage('release_seats')
    handleReleaseSeats(
      @MessageBody() data: { screeningId: string; seatNames: string[] },
    ) {
      const { screeningId, seatNames } = data;
      const screeningMap = seatLocks.get(screeningId);
      if (!screeningMap) return;
  
      for (const seat of seatNames) {
        const timeout = screeningMap.get(seat);
        if (timeout) clearTimeout(timeout);
        screeningMap.delete(seat);
      }
  
      this.server.emit('seats_released', { screeningId, seats: seatNames });
    }
  }
  