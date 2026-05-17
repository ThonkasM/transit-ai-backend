import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CrearFavoritoDto } from './dto/crear-favorito.dto';
import { ActualizarFavoritoDto } from './dto/actualizar-favorito.dto';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get('usuario/:userId')
  async obtenerPorUsuario(@Param('userId') userId: string) {
    const datos = await this.favoritosService.obtenerPorUsuario(userId);
    return { exito: true, datos, mensaje: 'Favoritos obtenidos correctamente' };
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.favoritosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Favorito obtenido correctamente' };
  }

  @Post()
  async crear(@Body() dto: CrearFavoritoDto) {
    const datos = await this.favoritosService.crear(dto);
    return { exito: true, datos, mensaje: 'Favorito creado correctamente' };
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarFavoritoDto,
  ) {
    const datos = await this.favoritosService.actualizar(id, dto);
    return {
      exito: true,
      datos,
      mensaje: 'Favorito actualizado correctamente',
    };
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.favoritosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Favorito eliminado correctamente' };
  }
}
