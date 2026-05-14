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
import { $Enums } from '@prisma/client';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crear(@Body() dto: CrearUsuarioDto) {
    const datos = await this.usuariosService.crear(dto);
    return { exito: true, datos, mensaje: 'Usuario creado correctamente' };
  }

  @Get()
  async obtenerTodos(@Query('role') role?: string) {
    const datos = await this.usuariosService.obtenerTodos(role as $Enums.Role);
    return {
      exito: true,
      datos,
      mensaje: 'Usuarios obtenidos correctamente',
    };
  }

  /** Retorna un usuario específico con sus cuentas OAuth e info de conductor */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.usuariosService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Usuario obtenido correctamente' };
  }

  /** Actualiza el perfil de un usuario (nombre, teléfono, avatar, rol) */
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    const datos = await this.usuariosService.actualizar(id, dto);
    return { exito: true, datos, mensaje: 'Usuario actualizado correctamente' };
  }

  /** Elimina (soft delete) un usuario del sistema */
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const datos = await this.usuariosService.eliminar(id);
    return { exito: true, datos, mensaje: 'Usuario eliminado correctamente' };
  }
}
