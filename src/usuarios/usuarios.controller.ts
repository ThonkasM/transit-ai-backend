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
import { $Enums } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearUsuarioDto) {
    const datos = await this.usuariosService.crear(dto);
    return { exito: true, datos, mensaje: 'Usuario creado correctamente' };
  }

  @Get()
  @Roles('ADMIN')
  async obtenerTodos(@Query('role') role?: string) {
    const datos = await this.usuariosService.obtenerTodos(role as $Enums.Role);
    return {
      exito: true,
      datos,
      mensaje: 'Usuarios obtenidos correctamente',
    };
  }

  @Get(':id')
  @Roles('ADMIN')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.usuariosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Usuario obtenido correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    const datos = await this.usuariosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Usuario actualizado correctamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.usuariosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Usuario eliminado correctamente' };
  }
}
