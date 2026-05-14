import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TerminalesService } from './terminales.service';
import { CrearTerminalDto } from './dto/crear-terminal.dto';
import { ActualizarTerminalDto } from './dto/actualizar-terminal.dto';

@Controller('terminales')
export class TerminalesController {
  constructor(private readonly terminalesService: TerminalesService) {}

  @Get()
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.terminalesService.obtenerTodos(busLineId);
    return { exito: true, datos, mensaje: 'Terminales obtenidas correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.terminalesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Terminal obtenida correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearTerminalDto) {
    const datos = await this.terminalesService.crear(dto);
    return { exito: true, datos, mensaje: 'Terminal creada correctamente' };
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarTerminalDto) {
    const datos = await this.terminalesService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Terminal actualizada correctamente' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.terminalesService.eliminar(id);
    return { exito: true, datos, mensaje: 'Terminal eliminada correctamente' };
  }
}
