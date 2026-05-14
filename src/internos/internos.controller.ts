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
import { InternosService } from './internos.service';
import { CrearInternoDto } from './dto/crear-interno.dto';
import { ActualizarInternoDto } from './dto/actualizar-interno.dto';

/**
 * InternosController expone los endpoints REST para gestionar internos (vehículos).
 * Soporta filtrado por línea a través de query parameters.
 */
@Controller('internos')
export class InternosController {
  constructor(private readonly internosService: InternosService) {}

  /** Retorna todos los internos, opcionalmente filtrados por línea (?busLineId=...) */
  @Get()
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.internosService.obtenerTodos(busLineId);
    return { exito: true, datos, mensaje: 'Internos obtenidos correctamente' };
  }

  /** Retorna un interno específico por su ID */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.internosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Interno obtenido correctamente' };
  }

  /** Registra un nuevo vehículo en el sistema */
  @Post()
  async crear(@Body() dto: CrearInternoDto) {
    const datos = await this.internosService.crear(dto);
    return { exito: true, datos, mensaje: 'Interno creado correctamente' };
  }

  /** Actualiza parcialmente los datos de un vehículo */
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarInternoDto,
  ) {
    const datos = await this.internosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Interno actualizado correctamente' };
  }

  /** Elimina (soft delete) un vehículo del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.internosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Interno eliminado correctamente' };
  }
}
