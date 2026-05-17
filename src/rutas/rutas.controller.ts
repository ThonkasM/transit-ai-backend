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
import { RutasService } from './rutas.service';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';

@Controller('rutas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  @Roles('ADMIN', 'DRIVER')
  async obtenerTodas(@Query('busLineId') busLineId?: string) {
    const datos = await this.rutasService.obtenerTodas(busLineId);
    return { exito: true, datos, mensaje: 'Rutas obtenidas correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.rutasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Ruta obtenida correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearRutaDto) {
    const datos = await this.rutasService.crear(dto);
    return { exito: true, datos, mensaje: 'Ruta creada correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarRutaDto) {
    const datos = await this.rutasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Ruta actualizada correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.rutasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Ruta eliminada correctamente' };
  }
}
