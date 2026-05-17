import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTarifaDto } from './dto/crear-tarifa.dto';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';

@Injectable()
export class TarifasService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodas(routeId?: string) {
    return this.prisma.fare.findMany({
      where: {
        ...(routeId ? { routeId } : {}),
      },
      include: {
        route: {
          select: { id: true, name: true, busLineId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const tarifa = await this.prisma.fare.findUnique({
      where: { id },
      include: {
        route: {
          select: { id: true, name: true, busLineId: true },
        },
      },
    });

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    return tarifa;
  }

  async crear(dto: CrearTarifaDto) {
    return this.prisma.fare.create({
      data: {
        routeId: dto.routeId,
        amount: dto.amount,
        currency: dto.currency ?? 'BOB',
        passengerType: dto.passengerType ?? 'ADULT',
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async actualizar(id: string, dto: ActualizarTarifaDto) {
    await this.obtenerPorId(id);

    return this.prisma.fare.update({
      where: { id },
      data: {
        ...(dto.routeId !== undefined && { routeId: dto.routeId }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.passengerType !== undefined && { passengerType: dto.passengerType }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.fare.delete({
      where: { id },
    });
  }
}
