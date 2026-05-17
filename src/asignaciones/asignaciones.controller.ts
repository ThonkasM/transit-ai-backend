import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AsignacionesService } from './asignaciones.service';
import { CrearAsignacionDto } from './dto/crear-asignacion.dto';
import { ActualizarAsignacionDto } from './dto/actualizar-asignacion.dto';

@Controller('asignaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Get()
  @Roles('ADMIN')
  async obtenerTodos(
    @Query('fecha') fecha?: string,
    @Query('routeId') routeId?: string,
  ) {
    const datos = await this.asignacionesService.obtenerTodos(fecha, routeId);
    return {
      exito: true,
      datos,
      mensaje: 'Asignaciones obtenidas correctamente',
    };
  }

  @Get(':id')
  @Roles('ADMIN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.asignacionesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Asignación obtenida correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearAsignacionDto) {
    const datos = await this.asignacionesService.crear(dto);
    return { exito: true, datos, mensaje: 'Asignación creada correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAsignacionDto,
  ) {
    const datos = await this.asignacionesService.actualizar(id, dto);
    return {
      exito: true,
      datos,
      mensaje: 'Asignación actualizada correctamente',
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.asignacionesService.eliminar(id);
    return {
      exito: true,
      datos,
      mensaje: 'Asignación eliminada correctamente',
    };
  }
}
