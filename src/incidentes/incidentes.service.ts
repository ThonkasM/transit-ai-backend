import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearIncidenteDto } from './dto/crear-incidente.dto';
import { RevisarIncidenteDto } from './dto/revisar-incidente.dto';

@Injectable()
export class IncidentesService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(driverId?: string, status?: string) {
    return this.prisma.incident.findMany({
      where: {
        ...(driverId ? { driverId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        driver: { include: { user: { select: { id: true, name: true } } } },
        trip: { select: { id: true, status: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      orderBy: { reportedAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const incidente = await this.prisma.incident.findFirst({
      where: { id },
      include: {
        driver: { include: { user: { select: { id: true, name: true, email: true } } } },
        trip: { select: { id: true, status: true, startedAt: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
    });
    if (!incidente) throw new NotFoundException(`Incidente con ID ${id} no encontrado`);
    return incidente;
  }

  async crear(dto: CrearIncidenteDto) {
    return this.prisma.incident.create({
      data: {
        driverId: dto.driverId,
        tripId: dto.tripId,
        type: dto.type,
        description: dto.description,
        latitude: dto.latitude,
        longitude: dto.longitude,
        requestStopTracking: dto.requestStopTracking ?? false,
      },
    });
  }

  async revisar(id: string, dto: RevisarIncidenteDto) {
    await this.obtenerPorId(id);
    return this.prisma.incident.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedById: dto.reviewedById,
        reviewedAt: new Date(),
        reviewNotes: dto.reviewNotes,
        ...(dto.status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
      },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.incident.delete({ where: { id } });
  }
}
