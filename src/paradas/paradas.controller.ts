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
import { ParadasService } from './paradas.service';
import { CrearParadaDto } from './dto/crear-parada.dto';
import { ActualizarParadaDto } from './dto/actualizar-parada.dto';

/**
 * ParadasController expone los endpoints REST para gestionar paradas de rutas.
 * Permite filtrar por ruta para obtener las paradas de una ruta específica.
 */
@Controller('paradas')
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  /** Retorna todas las paradas, opcionalmente filtradas por ruta (?routeId=...) */
  @Get()
  async obtenerTodas(@Query('routeId') routeId?: string) {
    const datos = await this.paradasService.obtenerTodas(routeId);
    return { exito: true, datos, mensaje: 'Paradas obtenidas correctamente' };
  }

  /** Retorna una parada específica por su ID */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.paradasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Parada obtenida correctamente' };
  }

  /** Crea una nueva parada dentro de una ruta */
  @Post()
  async crear(@Body() dto: CrearParadaDto) {
    const datos = await this.paradasService.crear(dto);
    return { exito: true, datos, mensaje: 'Parada creada correctamente' };
  }

  /** Actualiza parcialmente los datos de una parada */
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarParadaDto) {
    const datos = await this.paradasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Parada actualizada correctamente' };
  }

  /** Elimina (soft delete) una parada del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.paradasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Parada eliminada correctamente' };
  }
}
