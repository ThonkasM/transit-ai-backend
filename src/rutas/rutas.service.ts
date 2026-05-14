import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearRutaDto } from './dto/crear-ruta.dto';
import { ActualizarRutaDto } from './dto/actualizar-ruta.dto';

/**
 * RutasService maneja la lógica de negocio para las rutas de transporte.
 * Cada ruta pertenece a una línea y contiene paradas y waypoints geográficos.
 */
@Injectable()
export class RutasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las rutas activas del sistema.
   * Si se proporciona busLineId, filtra solo las rutas de esa línea.
   * Incluye el conteo de paradas para mostrar en listados sin cargar todas las paradas.
   */
  async obtenerTodas(busLineId?: string) {
    return this.prisma.route.findMany({
      where: {
        deletedAt: null,
        ...(busLineId ? { busLineId } : {}),
      },
      include: {
        busLine: {
          select: { id: true, name: true, code: true },
        },
        _count: {
          select: { routeStops: true },
        },
      },
    });
  }

  /**
   * Obtiene una ruta específica con todas sus paradas.
   * Las paradas se cargan completas porque son necesarias para visualizar la ruta.
   * Lanza NotFoundException si la ruta no existe.
   */
  async obtenerPorId(id: string) {
    const ruta = await this.prisma.route.findFirst({
      where: { id, deletedAt: null },
      include: {
        busLine: {
          select: { id: true, name: true, code: true },
        },
        routeStops: {
          orderBy: { orderIndex: 'asc' },
          include: { stop: true },
        },
      },
    });

    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }

    return ruta;
  }

  /**
   * Crea una nueva ruta para una línea de transporte.
   * Los waypoints se almacenan como JSON para flexibilidad en el formato geográfico.
   */
  async crear(dto: CrearRutaDto) {
    return this.prisma.route.create({
      data: {
        busLineId: dto.busLineId,
        name: dto.nombre,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        waypoints: JSON.parse(JSON.stringify(dto.waypoints ?? [])),
      },
    });
  }

  /**
   * Actualiza los datos de una ruta existente.
   * Verifica que exista antes de actualizar para evitar errores silenciosos.
   */
  async actualizar(id: string, dto: ActualizarRutaDto) {
    await this.obtenerPorId(id);

    return this.prisma.route.update({
      where: { id },
      data: {
        ...(dto.nombre !== undefined && { name: dto.nombre }),
        ...(dto.waypoints !== undefined && {
          waypoints: dto.waypoints as unknown as Prisma.InputJsonValue,
        }),
        ...(dto.busLineId !== undefined && { busLineId: dto.busLineId }),
      },
    });
  }

  /**
   * Realiza soft delete de la ruta.
   * Las paradas asociadas permanecen en la base de datos para historial.
   */
  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.route.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
