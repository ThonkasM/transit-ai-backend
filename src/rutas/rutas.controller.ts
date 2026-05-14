import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';

/**
 * RutasController expone los endpoints REST para gestionar rutas de transporte.
 * Permite filtrar por línea para facilitar la administración por operador.
 */
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  /** Retorna todas las rutas, opcionalmente filtradas por línea (?busLineId=...) */
  @Get()
  async obtenerTodas(@Query('busLineId') busLineId?: string) {
    const datos = await this.rutasService.obtenerTodas(busLineId);
    return { exito: true, datos, mensaje: 'Rutas obtenidas correctamente' };
  }

  /** Retorna una ruta específica con todas sus paradas */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.rutasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Ruta obtenida correctamente' };
  }

  /** Crea una nueva ruta para una línea de transporte */
  @Post()
  async crear(@Body() dto: CrearRutaDto) {
    const datos = await this.rutasService.crear(dto);
    return { exito: true, datos, mensaje: 'Ruta creada correctamente' };
  }

  /** Actualiza parcialmente los datos de una ruta */
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarRutaDto) {
    const datos = await this.rutasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Ruta actualizada correctamente' };
  }

  /** Elimina (soft delete) una ruta del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.rutasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Ruta eliminada correctamente' };
  }
}
