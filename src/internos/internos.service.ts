import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearInternoDto } from './dto/crear-interno.dto';
import { ActualizarInternoDto } from './dto/actualizar-interno.dto';

/**
 * InternosService maneja la lógica de negocio para los internos (vehículos) del sistema.
 * Permite filtrar por línea para que cada administrador vea solo sus vehículos.
 */
@Injectable()
export class InternosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los internos activos.
   * Si se proporciona busLineId, filtra solo los internos de esa línea.
   * Útil para que cada administrador vea solo sus vehículos.
   */
  async obtenerTodos(busLineId?: string) {
    return this.prisma.interno.findMany({
      where: {
        deletedAt: null,
        ...(busLineId ? { busLineId } : {}),
      },
      include: {
        busLine: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  /**
   * Obtiene un interno específico por su ID.
   * Lanza NotFoundException si no existe para retornar 404 automáticamente.
   */
  async obtenerPorId(id: string) {
    const interno = await this.prisma.interno.findFirst({
      where: { id, deletedAt: null },
      include: {
        busLine: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    if (!interno) {
      throw new NotFoundException(`Interno con ID ${id} no encontrado`);
    }

    return interno;
  }

  /**
   * Crea un nuevo interno (vehículo) en el sistema.
   * Asocia el vehículo a una línea de transporte específica.
   */
  async crear(dto: CrearInternoDto) {
    return this.prisma.interno.create({
      data: {
        busLineId: dto.busLineId,
        number: dto.number,
        plateNumber: dto.plateNumber,
        model: dto.model,
        capacity: dto.capacity,
      },
    });
  }

  /**
   * Actualiza los datos de un interno existente.
   * Verifica que exista antes de actualizar para evitar errores de Prisma.
   */
  async actualizar(id: string, dto: ActualizarInternoDto) {
    await this.obtenerPorId(id);

    return this.prisma.interno.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Realiza soft delete del interno estableciendo deletedAt.
   * Preserva el historial de viajes asociados a este vehículo.
   */
  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.interno.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
