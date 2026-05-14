import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { PreferenciasService } from './preferencias.service';
import { ActualizarPreferenciaDto } from './dto/actualizar-preferencia.dto';

@Controller('preferencias')
export class PreferenciasController {
  constructor(private readonly preferenciasService: PreferenciasService) {}

  @Get(':userId')
  async obtenerPorUsuario(@Param('userId') userId: string) {
    const datos = await this.preferenciasService.obtenerPorUsuario(userId);
    return { exito: true, datos, mensaje: 'Preferencias obtenidas correctamente' };
  }

  @Put(':userId')
  async upsert(@Param('userId') userId: string, @Body() dto: ActualizarPreferenciaDto) {
    const datos = await this.preferenciasService.upsert(userId, dto);
    return { exito: true, datos, mensaje: 'Preferencias actualizadas correctamente' };
  }

  @Delete(':userId')
  async eliminar(@Param('userId') userId: string) {
    const datos = await this.preferenciasService.eliminar(userId);
    return { exito: true, datos, mensaje: 'Preferencias eliminadas correctamente' };
  }
}
