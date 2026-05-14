import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { IncidentesService } from './incidentes.service';
import { CrearIncidenteDto } from './dto/crear-incidente.dto';
import { RevisarIncidenteDto } from './dto/revisar-incidente.dto';

@Controller('incidentes')
export class IncidentesController {
  constructor(private readonly incidentesService: IncidentesService) {}

  @Get()
  async obtenerTodos(@Query('driverId') driverId?: string, @Query('status') status?: string) {
    const datos = await this.incidentesService.obtenerTodos(driverId, status);
    return { exito: true, datos, mensaje: 'Incidentes obtenidos correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.incidentesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Incidente obtenido correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearIncidenteDto) {
    const datos = await this.incidentesService.crear(dto);
    return { exito: true, datos, mensaje: 'Incidente reportado correctamente' };
  }

  @Patch(':id/revisar')
  async revisar(@Param('id') id: string, @Body() dto: RevisarIncidenteDto) {
    const datos = await this.incidentesService.revisar(id, dto);
    return { exito: true, datos, mensaje: 'Incidente revisado correctamente' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.incidentesService.eliminar(id);
    return { exito: true, datos, mensaje: 'Incidente eliminado correctamente' };
  }
}
