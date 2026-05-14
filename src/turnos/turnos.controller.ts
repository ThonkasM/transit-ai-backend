import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get()
  async obtenerTodos(@Query('driverId') driverId?: string, @Query('internoId') internoId?: string) {
    const datos = await this.turnosService.obtenerTodos(driverId, internoId);
    return { exito: true, datos, mensaje: 'Turnos obtenidos correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.turnosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Turno obtenido correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearTurnoDto) {
    const datos = await this.turnosService.crear(dto);
    return { exito: true, datos, mensaje: 'Turno creado correctamente' };
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarTurnoDto) {
    const datos = await this.turnosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Turno actualizado correctamente' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.turnosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Turno eliminado correctamente' };
  }
}
