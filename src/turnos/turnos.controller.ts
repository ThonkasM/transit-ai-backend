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
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get()
  @Roles('ADMIN')
  async obtenerTodos(
    @Query('driverId') driverId?: string,
    @Query('internoId') internoId?: string,
  ) {
    const datos = await this.turnosService.obtenerTodos(driverId, internoId);
    return { exito: true, datos, mensaje: 'Turnos obtenidos correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.turnosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Turno obtenido correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearTurnoDto) {
    const datos = await this.turnosService.crear(dto);
    return { exito: true, datos, mensaje: 'Turno creado correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarTurnoDto) {
    const datos = await this.turnosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Turno actualizado correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.turnosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Turno eliminado correctamente' };
  }
}
