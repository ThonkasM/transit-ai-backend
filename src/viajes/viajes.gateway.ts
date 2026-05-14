import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ViajesService } from './viajes.service';
import { UbicacionDto } from './dto/ubicacion.dto';

/**
 * ViajesGateway maneja las comunicaciones WebSocket para viajes en tiempo real.
 * Usa el namespace 'viajes' para separar estos eventos de otros namespaces WebSocket.
 * Permite a los pasajeros suscribirse a un viaje específico y recibir actualizaciones GPS.
 */
@WebSocketGateway({ namespace: 'viajes', cors: { origin: '*' } })
export class ViajesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly viajesService: ViajesService) {}

  /**
   * Se ejecuta cuando un cliente WebSocket se conecta al namespace viajes.
   * Registra la conexión para debugging y monitoreo.
   */
  handleConnection(client: Socket) {
    console.log(`[ViajesGateway] Cliente conectado: ${client.id}`);
  }

  /**
   * Se ejecuta cuando un cliente WebSocket se desconecta.
   * Limpia los recursos asociados a la conexión.
   */
  handleDisconnect(client: Socket) {
    console.log(`[ViajesGateway] Cliente desconectado: ${client.id}`);
  }

  /**
   * Permite a un cliente unirse a la sala de un viaje específico.
   * Cada viaje tiene su propia sala (room) para que las actualizaciones
   * solo lleguen a los clientes interesados en ese viaje particular.
   * Retorna confirmación de que el cliente se unió correctamente.
   */
  @SubscribeMessage('unirse-viaje')
  async handleUnirseViaje(
    @MessageBody() data: { tripId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomName = `viaje-${data.tripId}`;
      await client.join(roomName);
      console.log(`[ViajesGateway] Cliente ${client.id} se unió a ${roomName}`);
      return { exito: true, mensaje: `Conectado al viaje ${data.tripId}` };
    } catch (error) {
      console.error(`[ViajesGateway] Error al unirse al viaje:`, error);
      return { exito: false, mensaje: 'No se pudo conectar al viaje' };
    }
  }

  @SubscribeMessage('ubicacion-conductor')
  async handleUbicacionConductor(@MessageBody() dto: UbicacionDto) {
    try {
      const ubicacion = await this.viajesService.registrarUbicacion(dto);

      const roomName = `viaje-${dto.tripId}`;
      this.server.to(roomName).emit('ubicacion-actualizada', {
        tripId: dto.tripId,
        latitud: dto.latitud,
        longitud: dto.longitud,
        heading: dto.heading,
        speed: dto.speed,
        timestamp: ubicacion.recordedAt,
      });

      return { exito: true, mensaje: 'Ubicación registrada y transmitida' };
    } catch (error) {
      console.error(`[ViajesGateway] Error al registrar ubicación:`, error);
      return { exito: false, mensaje: (error as Error).message };
    }
  }

  @SubscribeMessage('finalizar-viaje')
  async handleFinalizarViaje(@MessageBody() data: { tripId: string }) {
    try {
      const viaje = await this.viajesService.finalizar(data.tripId);

      const roomName = `viaje-${data.tripId}`;
      this.server.to(roomName).emit('viaje-finalizado', {
        tripId: data.tripId,
        status: viaje.status,
        endedAt: viaje.endedAt,
      });

      return { exito: true, mensaje: 'Viaje finalizado correctamente' };
    } catch (error) {
      console.error(`[ViajesGateway] Error al finalizar viaje:`, error);
      return { exito: false, mensaje: (error as Error).message };
    }
  }
}
