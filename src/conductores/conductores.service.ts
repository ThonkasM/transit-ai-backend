import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearConductorDto } from './dto/crear-conductor.dto';
import { ActualizarConductorDto } from './dto/actualizar-conductor.dto';

/**
 * ConductoresService maneja la lógica de negocio para los conductores del sistema.
 * Incluye gestión de credenciales y asignación a líneas e internos.
 */
@Injectable()
export class ConductoresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los conductores activos del sistema.
   * Si se proporciona busLineId, filtra solo los conductores de esa línea.
   * Incluye datos básicos del usuario asociado para mostrar en listados.
   */
  async obtenerTodos(busLineId?: string) {
    return this.prisma.driver.findMany({
      where: {
        deletedAt: null,
        ...(busLineId ? { busLineId } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        busLine: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  /**
   * Obtiene un conductor específico con información completa del usuario.
   * Incluye avatarUrl para mostrar foto de perfil en la interfaz.
   * Lanza NotFoundException si el conductor no existe o fue eliminado.
   */
  async obtenerPorId(id: string) {
    const conductor = await this.prisma.driver.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        busLine: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    return conductor;
  }

  /**
   * Registra un nuevo conductor en el sistema.
   * Vincula un usuario existente con una línea de transporte.
   */
  async crear(dto: CrearConductorDto) {
    return this.prisma.driver.create({
      data: {
        userId: dto.userId,
        busLineId: dto.busLineId,
        ...(dto.internoId ? { internoId: dto.internoId } : {}),
        ...(dto.licenseNumber ? { licenseNumber: dto.licenseNumber } : {}),
      },
    });
  }

  /**
   * Actualiza los datos de un conductor existente.
   * Verifica que exista antes de actualizar.
   */
  async actualizar(id: string, dto: ActualizarConductorDto) {
    await this.obtenerPorId(id);

    return this.prisma.driver.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Realiza soft delete del conductor.
   * Mantiene el historial de viajes realizados por este conductor.
   */
  async eliminar(id: string) {
    await this.obtenerPorId(id);

    return this.prisma.driver.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Actualiza el estado de la credencial del conductor.
   * Permite aprobar, rechazar o suspender las credenciales de un conductor.
   * Útil para el flujo de verificación de conductores nuevos.
   */
  async actualizarCredencial(id: string, status: $Enums.CredentialStatus) {
    await this.obtenerPorId(id);

    return this.prisma.driver.update({
      where: { id },
      data: { credentialStatus: status },
    });
  }
}
