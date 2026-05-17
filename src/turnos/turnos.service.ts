import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

@Injectable()
export class TurnosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(driverId?: string, internoId?: string) {
    return this.prisma.shift.findMany({
      where: {
        deletedAt: null,
        ...(driverId ? { driverId } : {}),
        ...(internoId ? { internoId } : {}),
      },
      include: {
        driver: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        interno: { select: { id: true, number: true, plateNumber: true } },
        route: { select: { id: true, name: true } },
      },
    });
  }

  async obtenerPorId(id: string) {
    const turno = await this.prisma.shift.findFirst({
      where: { id, deletedAt: null },
      include: {
        driver: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        interno: { select: { id: true, number: true, plateNumber: true } },
        route: { select: { id: true, name: true } },
      },
    });
    if (!turno) throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    return turno;
  }

  async crear(dto: CrearTurnoDto) {
    return this.prisma.shift.create({
      data: {
        driverId: dto.driverId,
        internoId: dto.internoId,
        routeId: dto.routeId,
        daysOfWeek: dto.daysOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async actualizar(id: string, dto: ActualizarTurnoDto) {
    await this.obtenerPorId(id);
    return this.prisma.shift.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.shift.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
