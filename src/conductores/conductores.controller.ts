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
import { ConductoresService } from './conductores.service';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
import { ActualizarCredencialDto } from './dto/actualizar-credencial.dto';

/**
 * ConductoresController expone los endpoints REST para gestionar conductores.
 * Incluye un endpoint especial para actualizar el estado de credenciales.
 */
@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  /** Retorna todos los conductores, opcionalmente filtrados por línea (?busLineId=...) */
  @Get()
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.conductoresService.obtenerTodos(busLineId);
    return {
      exito: true,
      datos,
      mensaje: 'Conductores obtenidos correctamente',
    };
  }

  /** Retorna un conductor específico con sus datos completos */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.conductoresService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Conductor obtenido correctamente' };
  }

  /** Registra un nuevo conductor en el sistema */
  @Post()
  async crear(@Body() dto: CrearConductorDto) {
    const datos = await this.conductoresService.crear(dto);
    return { exito: true, datos, mensaje: 'Conductor creado correctamente' };
  }

  /** Actualiza parcialmente los datos de un conductor */
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarConductorDto,
  ) {
    const datos = await this.conductoresService.actualizar(id, dto);
    return {
      exito: true,
      datos,
      mensaje: 'Conductor actualizado correctamente',
    };
  }

  /** Elimina (soft delete) un conductor del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.conductoresService.eliminar(id);
    return {
      exito: true,
      datos,
      mensaje: 'Conductor eliminado correctamente',
    };
  }

  /** Actualiza el estado de credencial de un conductor (PENDING, ACTIVE, REVOKED) */
  @Patch(':id/credencial')
  async actualizarCredencial(
    @Param('id') id: string,
    @Body() dto: ActualizarCredencialDto,
  ) {
    const datos = await this.conductoresService.actualizarCredencial(id, dto.status);
    return {
      exito: true,
      datos,
      mensaje: 'Credencial actualizada correctamente',
    };
  }
}
