import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CrearAsignacionDto } from './dto/crear-asignacion.dto';
import { ActualizarAsignacionDto } from './dto/actualizar-asignacion.dto';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Get()
  async obtenerTodos(@Query('fecha') fecha?: string, @Query('routeId') routeId?: string) {
    const datos = await this.asignacionesService.obtenerTodos(fecha, routeId);
    return { exito: true, datos, mensaje: 'Asignaciones obtenidas correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.asignacionesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Asignación obtenida correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearAsignacionDto) {
    const datos = await this.asignacionesService.crear(dto);
    return { exito: true, datos, mensaje: 'Asignación creada correctamente' };
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarAsignacionDto) {
    const datos = await this.asignacionesService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Asignación actualizada correctamente' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.asignacionesService.eliminar(id);
    return { exito: true, datos, mensaje: 'Asignación eliminada correctamente' };
  }
}
