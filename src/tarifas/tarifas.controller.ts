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
import { TarifasService } from './tarifas.service';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';

@Controller('tarifas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerTodas(@Query('routeId') routeId?: string) {
    const datos = await this.tarifasService.obtenerTodas(routeId);
    return { exito: true, datos, mensaje: 'Tarifas obtenidas correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.tarifasService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Tarifa obtenida correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearTarifaDto) {
    const datos = await this.tarifasService.crear(dto);
    return { exito: true, datos, mensaje: 'Tarifa creada correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarTarifaDto,
  ) {
    const datos = await this.tarifasService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Tarifa actualizada correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.tarifasService.eliminar(id);
    return { exito: true, datos, mensaje: 'Tarifa eliminada correctamente' };
  }
}
