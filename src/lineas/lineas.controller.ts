import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LineasService } from './lineas.service';
import { CrearLineaDto } from './dto/crear-linea.dto';
import { ActualizarLineaDto } from './dto/actualizar-linea.dto';

/**
 * LineasController expone los endpoints REST para gestionar líneas de transporte.
 * Todas las rutas están en español bajo el prefijo /lineas.
 */
@Controller('lineas')
export class LineasController {
  constructor(private readonly lineasService: LineasService) {}

  /** Retorna todas las líneas activas del sistema */
  @Get()
  async obtenerTodas() {
    const datos = await this.lineasService.obtenerTodas();
    return { exito: true, datos, mensaje: 'Líneas obtenidas correctamente' };
  }

  /** Retorna una línea específica por su ID */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.lineasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Línea obtenida correctamente' };
  }

  /** Crea una nueva línea de transporte */
  @Post()
  async crear(@Body() dto: CrearLineaDto) {
    const datos = await this.lineasService.crear(dto);
    return { exito: true, datos, mensaje: 'Línea creada correctamente' };
  }

  /** Actualiza parcialmente los datos de una línea existente */
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarLineaDto) {
    const datos = await this.lineasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Línea actualizada correctamente' };
  }

  /** Elimina (soft delete) una línea del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.lineasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Línea eliminada correctamente' };
  }
}
