import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ViajesService } from './viajes.service';
import { IniciarViajeDto } from './dto/iniciar-viaje.dto';

@Controller('viajes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get('activos')
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerActivos() {
    const datos = await this.viajesService.obtenerActivos();
    return {
      exito: true,
      datos,
      mensaje: 'Viajes activos obtenidos correctamente',
    };
  }

  @Post('iniciar')
  @Roles('ADMIN', 'DRIVER')
  async iniciar(@Body() dto: IniciarViajeDto) {
    const datos = await this.viajesService.iniciar(dto);
    return { exito: true, datos, mensaje: 'Viaje iniciado correctamente' };
  }

  @Patch('ubicacion/iniciar')
  @Roles('DRIVER')
  async iniciarTracking(@CurrentUser() user: { id: string }) {
    const datos = await this.viajesService.toggleTracking(user.id, true);
    return { exito: true, datos, mensaje: 'Envío de ubicación activado' };
  }

  @Patch('ubicacion/detener')
  @Roles('DRIVER')
  async detenerTracking(@CurrentUser() user: { id: string }) {
    const datos = await this.viajesService.toggleTracking(user.id, false);
    return { exito: true, datos, mensaje: 'Envío de ubicación desactivado' };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER', 'CITIZEN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.viajesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Viaje obtenido correctamente' };
  }

  @Patch(':id/finalizar')
  @Roles('ADMIN', 'DRIVER')
  async finalizar(@Param('id') id: string) {
    const datos = await this.viajesService.finalizar(id);
    return { exito: true, datos, mensaje: 'Viaje finalizado correctamente' };
  }

  @Patch(':id/cancelar')
  @Roles('ADMIN', 'DRIVER')
  async cancelar(@Param('id') id: string) {
    const datos = await this.viajesService.cancelar(id);
    return { exito: true, datos, mensaje: 'Viaje cancelado correctamente' };
  }
}
