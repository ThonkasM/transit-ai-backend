import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LineasService } from './lineas.service';
import { CrearLineaDto } from './dto/crear-linea.dto';
import { ActualizarLineaDto } from './dto/actualizar-linea.dto';

@Controller('lineas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LineasController {
  constructor(private readonly lineasService: LineasService) {}

  @Get()
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerTodas() {
    const datos = await this.lineasService.obtenerTodas();
    return { exito: true, datos, mensaje: 'Líneas obtenidas correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.lineasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Línea obtenida correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearLineaDto) {
    const datos = await this.lineasService.crear(dto);
    return { exito: true, datos, mensaje: 'Línea creada correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarLineaDto) {
    const datos = await this.lineasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Línea actualizada correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.lineasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Línea eliminada correctamente' };
  }
}
