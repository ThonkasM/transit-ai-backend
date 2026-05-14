import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { IniciarViajeDto } from './dto/iniciar-viaje.dto';

/**
 * ViajesController expone los endpoints REST para gestionar viajes.
 * Los eventos en tiempo real (ubicación GPS) se manejan vía WebSocket en ViajesGateway.
 * Este controlador maneja las operaciones de gestión: iniciar, finalizar y consultar.
 */
@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  /** Retorna todos los viajes actualmente activos con información del conductor y ruta */
  @Get('activos')
  async obtenerActivos() {
    const datos = await this.viajesService.obtenerActivos();
    return {
      exito: true,
      datos,
      mensaje: 'Viajes activos obtenidos correctamente',
    };
  }

  /** Retorna un viaje específico con sus últimas 10 ubicaciones registradas */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.viajesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Viaje obtenido correctamente' };
  }

  /** Inicia un nuevo viaje asignando conductor, vehículo y ruta */
  @Post('iniciar')
  async iniciar(@Body() dto: IniciarViajeDto) {
    const datos = await this.viajesService.iniciar(dto);
    return { exito: true, datos, mensaje: 'Viaje iniciado correctamente' };
  }

  /** Finaliza un viaje activo marcándolo como completado */
  @Patch(':id/finalizar')
  async finalizar(@Param('id') id: string) {
    const datos = await this.viajesService.finalizar(id);
    return { exito: true, datos, mensaje: 'Viaje finalizado correctamente' };
  }

  /** Cancela un viaje activo marcándolo como cancelado */
  @Patch(':id/cancelar')
  async cancelar(@Param('id') id: string) {
    const datos = await this.viajesService.cancelar(id);
    return { exito: true, datos, mensaje: 'Viaje cancelado correctamente' };
  }
}
