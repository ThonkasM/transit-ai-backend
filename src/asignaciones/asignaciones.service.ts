import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearAsignacionDto } from './dto/crear-asignacion.dto';
import { ActualizarAsignacionDto } from './dto/actualizar-asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(fecha?: string, routeId?: string) {
    return this.prisma.dailyAssignment.findMany({
      where: {
        ...(fecha ? { date: new Date(fecha) } : {}),
        ...(routeId ? { routeId } : {}),
      },
      include: {
        interno: { select: { id: true, number: true, plateNumber: true } },
        route: { select: { id: true, name: true } },
        assignedBy: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const asignacion = await this.prisma.dailyAssignment.findFirst({
      where: { id },
      include: {
        interno: { select: { id: true, number: true, plateNumber: true } },
        route: { select: { id: true, name: true } },
        assignedBy: { select: { id: true, name: true } },
        trips: { select: { id: true, status: true, startedAt: true } },
      },
    });
    if (!asignacion)
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    return asignacion;
  }

  async crear(dto: CrearAsignacionDto) {
    return this.prisma.dailyAssignment.create({
      data: {
        date: new Date(dto.date),
        internoId: dto.internoId,
        routeId: dto.routeId,
        assignedById: dto.assignedById,
        notes: dto.notes,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async actualizar(id: string, dto: ActualizarAsignacionDto) {
    await this.obtenerPorId(id);
    const { date, ...rest } = dto;
    return this.prisma.dailyAssignment.update({
      where: { id },
      data: { ...rest, ...(date ? { date: new Date(date) } : {}) },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.dailyAssignment.delete({ where: { id } });
  }
}
