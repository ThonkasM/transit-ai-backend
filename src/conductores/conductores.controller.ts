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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConductoresService } from './conductores.service';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';
import { ActualizarCredencialDto } from './dto/actualizar-credencial.dto';

@Controller('conductores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get()
  @Roles('ADMIN')
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.conductoresService.obtenerTodos(busLineId);
    return {
      exito: true,
      datos,
      mensaje: 'Conductores obtenidos correctamente',
    };
  }

  @Get('mi-ruta')
  @Roles('DRIVER')
  async obtenerMiRuta(@CurrentUser() user: { id: string }) {
    const datos = await this.conductoresService.obtenerRutaAsignada(user.id);
    return { exito: true, datos, mensaje: 'Ruta asignada obtenida correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.conductoresService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Conductor obtenido correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearConductorDto) {
    const datos = await this.conductoresService.crear(dto);
    return { exito: true, datos, mensaje: 'Conductor creado correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
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

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.conductoresService.eliminar(id);
    return {
      exito: true,
      datos,
      mensaje: 'Conductor eliminado correctamente',
    };
  }

  @Patch(':id/credencial')
  @Roles('ADMIN')
  async actualizarCredencial(
    @Param('id') id: string,
    @Body() dto: ActualizarCredencialDto,
  ) {
    const datos = await this.conductoresService.actualizarCredencial(
      id,
      dto.status,
    );
    return {
      exito: true,
      datos,
      mensaje: 'Credencial actualizada correctamente',
    };
  }
}
