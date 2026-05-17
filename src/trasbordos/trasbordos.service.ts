import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTrasboardoDto } from './dto/crear-trasbordo.dto';
import { DecidirTrasboardoDto } from './dto/decidir-trasbordo.dto';

@Injectable()
export class TrasboardosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(status?: string) {
    return this.prisma.internoTransfer.findMany({
      where: { ...(status ? { status: status as any } : {}) },
      include: {
        fromTrip: { select: { id: true, status: true } },
        toTrip: { select: { id: true, status: true } },
        stop: { select: { id: true, name: true } },
        decidedBy: { select: { id: true, name: true } },
      },
      orderBy: { suggestedAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const trasbordo = await this.prisma.internoTransfer.findFirst({
      where: { id },
      include: {
        fromTrip: {
          include: {
            interno: true,
            route: { select: { id: true, name: true } },
          },
        },
        toTrip: {
          include: {
            interno: true,
            route: { select: { id: true, name: true } },
          },
        },
        stop: {
          select: { id: true, name: true, latitude: true, longitude: true },
        },
        decidedBy: { select: { id: true, name: true } },
      },
    });
    if (!trasbordo)
      throw new NotFoundException(`Trasbordo con ID ${id} no encontrado`);
    return trasbordo;
  }

  async crear(dto: CrearTrasboardoDto) {
    return this.prisma.internoTransfer.create({
      data: {
        fromTripId: dto.fromTripId,
        toTripId: dto.toTripId,
        stopId: dto.stopId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        reason: dto.reason,
      },
    });
  }

  async decidir(id: string, dto: DecidirTrasboardoDto) {
    await this.obtenerPorId(id);
    return this.prisma.internoTransfer.update({
      where: { id },
      data: {
        status: dto.status,
        decidedById: dto.decidedById,
        decidedAt: new Date(),
        toTripId: dto.toTripId,
        ...(dto.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.internoTransfer.delete({ where: { id } });
  }
}
