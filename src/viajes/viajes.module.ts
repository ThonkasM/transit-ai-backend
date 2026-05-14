import { Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { ViajesGateway } from './viajes.gateway';

/**
 * ViajesModule agrupa los componentes para gestionar viajes en tiempo real.
 * Incluye tanto el controlador REST como el Gateway WebSocket,
 * ambos comparten el mismo ViajesService para acceder a la base de datos.
 */
@Module({
  controllers: [ViajesController],
  providers: [ViajesService, ViajesGateway],
  exports: [ViajesService],
})
export class ViajesModule {}
