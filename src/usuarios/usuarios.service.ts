import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

/**
 * UsuariosService maneja la lógica de negocio para los usuarios del sistema.
 * Los usuarios son creados principalmente a través de OAuth (Google, Facebook),
 * por lo que este servicio se enfoca en consultas y actualizaciones de perfil.
 */
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los usuarios activos del sistema.
   * Si se proporciona un role, filtra solo usuarios con ese rol específico.
   * Útil para que los administradores vean solo conductores o solo pasajeros.
   */
  async crear(dto: CrearUsuarioDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: dto.passwordHash,
        phone: dto.phone,
        avatarUrl: dto.avatarUrl,
        role: dto.role ?? 'CITIZEN',
        createdById: dto.createdById,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async obtenerTodos(role?: $Enums.Role) {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(role ? { role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  /**
   * Obtiene un usuario específico con información completa.
   * Incluye cuentas OAuth (sin tokens por seguridad) e información de conductor si aplica.
   * Los tokens OAuth nunca se exponen en la API por razones de seguridad.
   */
  async obtenerPorId(id: string) {
    const usuario = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        oauthAccounts: {
          select: {
            id: true,
            provider: true,
            providerAccountId: true,
            createdAt: true,
            // accessToken y refreshToken excluidos por seguridad
          },
        },
        driver: {
          include: {
            busLine: {
              select: { id: true, name: true, code: true },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  /**
   * Actualiza el perfil de un usuario existente.
   * Solo permite actualizar campos de perfil, no credenciales de autenticación.
   */
  async actualizar(id: string, dto: ActualizarUsuarioDto) {
    await this.obtenerPorId(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.role !== undefined && { role: dto.role as $Enums.Role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phone: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Realiza soft delete del usuario estableciendo deletedAt.
   * Preserva el historial de viajes y datos asociados al usuario.
   * La cuenta sigue en la base de datos pero no aparece en consultas normales.
   */
  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
      },
    });
  }
}
