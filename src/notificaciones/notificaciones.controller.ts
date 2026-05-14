import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CrearNotificacionDto } from './dto/crear-notificacion.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  async obtenerTodos(@Query('targetUserId') targetUserId?: string, @Query('type') type?: string) {
    const datos = await this.notificacionesService.obtenerTodos(targetUserId, type);
    return { exito: true, datos, mensaje: 'Notificaciones obtenidas correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.notificacionesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Notificación obtenida correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearNotificacionDto) {
    const datos = await this.notificacionesService.crear(dto);
    return { exito: true, datos, mensaje: 'Notificación creada correctamente' };
  }

  @Patch(':id/leer/:userId')
  async marcarLeida(@Param('id') id: string, @Param('userId') userId: string) {
    const datos = await this.notificacionesService.marcarLeida(id, userId);
    return { exito: true, datos, mensaje: 'Notificación marcada como leída' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.notificacionesService.eliminar(id);
    return { exito: true, datos, mensaje: 'Notificación eliminada correctamente' };
  }
}
