import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearLineaDto } from './dto/crear-linea.dto';
import { ActualizarLineaDto } from './dto/actualizar-linea.dto';

/**
 * LineasService maneja toda la lógica de negocio relacionada con las líneas de transporte.
 * Se comunica con la base de datos a través de PrismaService.
 */
@Injectable()
export class LineasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las líneas activas (no eliminadas).
   * Incluye información del administrador para mostrar quién gestiona cada línea.
   * Filtra por deletedAt null para implementar soft delete.
   */
  async obtenerTodas() {
    return this.prisma.busLine.findMany({
      where: { deletedAt: null },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene una línea específica por su ID.
   * Lanza NotFoundException si la línea no existe o fue eliminada,
   * para que NestJS retorne automáticamente un 404.
   */
  async obtenerPorId(id: string) {
    const linea = await this.prisma.busLine.findFirst({
      where: { id, deletedAt: null },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!linea) {
      throw new NotFoundException(`Línea con ID ${id} no encontrada`);
    }

    return linea;
  }

  /**
   * Crea una nueva línea de transporte con los datos del DTO.
   * Prisma valida las restricciones de la base de datos (unique, etc.).
   */
  async crear(dto: CrearLineaDto) {
    return this.prisma.busLine.create({
      data: {
        name: dto.nombre,
        code: dto.codigo,
        description: dto.descripcion,
        color: dto.color ?? '#00d992',
        adminId: dto.adminId,
      },
    });
  }

  /**
   * Actualiza los datos de una línea existente.
   * Primero verifica que exista (via obtenerPorId), luego aplica los cambios.
   */
  async actualizar(id: string, dto: ActualizarLineaDto) {
    await this.obtenerPorId(id);

    return this.prisma.busLine.update({
      where: { id },
      data: {
        ...(dto.nombre !== undefined && { name: dto.nombre }),
        ...(dto.codigo !== undefined && { code: dto.codigo }),
        ...(dto.descripcion !== undefined && { description: dto.descripcion }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.adminId !== undefined && { adminId: dto.adminId }),
      },
    });
  }

  /**
   * Realiza un soft delete de la línea estableciendo deletedAt al momento actual.
   * Esto preserva el historial en la base de datos sin eliminar el registro físicamente.
   */
  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.busLine.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
