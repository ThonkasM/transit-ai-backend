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
import { InternosService } from './internos.service';
import { CrearInternoDto } from './dto/crear-interno.dto';
import { ActualizarInternoDto } from './dto/actualizar-interno.dto';

@Controller('internos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InternosController {
  constructor(private readonly internosService: InternosService) {}

  @Get()
  @Roles('ADMIN', 'DRIVER')
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.internosService.obtenerTodos(busLineId);
    return { exito: true, datos, mensaje: 'Internos obtenidos correctamente' };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.internosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Interno obtenido correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearInternoDto) {
    const datos = await this.internosService.crear(dto);
    return { exito: true, datos, mensaje: 'Interno creado correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarInternoDto) {
    const datos = await this.internosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Interno actualizado correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.internosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Interno eliminado correctamente' };
  }
}
