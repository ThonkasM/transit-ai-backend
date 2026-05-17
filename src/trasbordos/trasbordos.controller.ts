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
import { TrasboardosService } from './trasbordos.service';
import { CrearTrasboardoDto } from './dto/crear-trasbordo.dto';
import { DecidirTrasboardoDto } from './dto/decidir-trasbordo.dto';

@Controller('trasbordos')
export class TrasboardosController {
  constructor(private readonly trasboardosService: TrasboardosService) {}

  @Get()
  async obtenerTodos(@Query('status') status?: string) {
    const datos = await this.trasboardosService.obtenerTodos(status);
    return {
      exito: true,
      datos,
      mensaje: 'Trasbordos obtenidos correctamente',
    };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.trasboardosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Trasbordo obtenido correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearTrasboardoDto) {
    const datos = await this.trasboardosService.crear(dto);
    return { exito: true, datos, mensaje: 'Trasbordo sugerido correctamente' };
  }

  @Patch(':id/decidir')
  async decidir(@Param('id') id: string, @Body() dto: DecidirTrasboardoDto) {
    const datos = await this.trasboardosService.decidir(id, dto);
    return { exito: true, datos, mensaje: 'Trasbordo procesado correctamente' };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.trasboardosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Trasbordo eliminado correctamente' };
  }
}
