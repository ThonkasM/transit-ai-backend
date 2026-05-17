import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearParadaDto } from './dto/crear-parada.dto';
import { ActualizarParadaDto } from './dto/actualizar-parada.dto';

@Injectable()
export class ParadasService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodas(routeId?: string) {
    if (routeId) {
      // Cuando se filtra por ruta, devolvemos los RouteStops con la parada incluida
      // para preservar el orderIndex y la ruta asociada
      return this.prisma.routeStop.findMany({
        where: { routeId },
        orderBy: { orderIndex: 'asc' },
        include: {
          stop: true,
          route: { select: { id: true, name: true } },
        },
      });
    }

    return this.prisma.stop.findMany({
      where: { deletedAt: null },
      include: {
        routeStops: {
          select: {
            orderIndex: true,
            routeId: true,
            route: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async obtenerPorId(id: string) {
    const parada = await this.prisma.stop.findFirst({
      where: { id, deletedAt: null },
      include: {
        routeStops: {
          include: {
            route: { select: { id: true, name: true, busLineId: true } },
          },
        },
      },
    });

    if (!parada)
      throw new NotFoundException(`Parada con ID ${id} no encontrada`);
    return parada;
  }

  async crear(dto: CrearParadaDto) {
    // Crear la parada y su vínculo con la ruta en una transacción
    return this.prisma.$transaction(async (tx) => {
      const stop = await tx.stop.create({
        data: {
          name: dto.nombre,
          latitude: dto.latitud,
          longitude: dto.longitud,
        },
      });

      await tx.routeStop.create({
        data: {
          routeId: dto.routeId,
          stopId: stop.id,
          orderIndex: dto.orderIndex,
        },
      });

      return stop;
    });
  }

  async actualizar(id: string, dto: ActualizarParadaDto) {
    await this.obtenerPorId(id);

    return this.prisma.stop.update({
      where: { id },
      data: {
        ...(dto.nombre !== undefined && { name: dto.nombre }),
        ...(dto.latitud !== undefined && { latitude: dto.latitud }),
        ...(dto.longitud !== undefined && { longitude: dto.longitud }),
      },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.stop.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
