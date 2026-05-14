import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IniciarViajeDto } from './dto/iniciar-viaje.dto';
import { UbicacionDto } from './dto/ubicacion.dto';

/**
 * ViajesService maneja la lógica de negocio para los viajes del sistema de transporte.
 * Gestiona el ciclo de vida completo de un viaje: inicio, ubicaciones en tiempo real y finalización.
 */
@Injectable()
export class ViajesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los viajes actualmente activos.
   * Incluye información del conductor, usuario, vehículo y ruta para mostrar en el mapa.
   * Solo retorna viajes con status ACTIVE para el monitoreo en tiempo real.
   */
  async obtenerActivos() {
    return this.prisma.trip.findMany({
      where: { status: 'ACTIVE' },
      include: {
        driver: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        interno: {
          select: { id: true, number: true, plateNumber: true, model: true },
        },
        route: {
          select: { id: true, name: true },
        },
      },
    });
  }

  /**
   * Obtiene un viaje específico con las últimas 10 ubicaciones registradas.
   * Limitar a 10 ubicaciones evita cargar demasiados datos mientras se muestra el historial reciente.
   * Lanza NotFoundException si el viaje no existe.
   */
  async obtenerPorId(id: string) {
    const viaje = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        interno: true,
        route: {
          include: {
            routeStops: {
              orderBy: { orderIndex: 'asc' },
              include: { stop: true },
            },
          },
        },
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }

    return viaje;
  }

  /**
   * Inicia un nuevo viaje creando el registro en la base de datos con status ACTIVE.
   * Registra el tiempo de inicio para calcular duración al finalizar.
   */
  async iniciar(dto: IniciarViajeDto) {
    return this.prisma.trip.create({
      data: {
        driverId: dto.driverId,
        internoId: dto.internoId,
        routeId: dto.routeId,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
    });
  }

  async finalizar(id: string) {
    const viaje = await this.obtenerPorId(id);

    if (viaje.status !== 'ACTIVE') {
      throw new BadRequestException(`El viaje ya está en estado ${viaje.status}`);
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status: 'COMPLETED', endedAt: new Date() },
    });
  }

  async cancelar(id: string) {
    const viaje = await this.obtenerPorId(id);

    if (viaje.status !== 'ACTIVE') {
      throw new BadRequestException(`El viaje ya está en estado ${viaje.status}`);
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status: 'CANCELLED', endedAt: new Date() },
    });
  }

  async registrarUbicacion(dto: UbicacionDto) {
    const viaje = await this.prisma.trip.findUnique({
      where: { id: dto.tripId },
      select: { status: true },
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${dto.tripId} no encontrado`);
    }

    if (viaje.status !== 'ACTIVE') {
      throw new BadRequestException('Solo se pueden registrar ubicaciones en viajes activos');
    }

    return this.prisma.driverLocation.create({
      data: {
        tripId: dto.tripId,
        latitude: dto.latitud,
        longitude: dto.longitud,
        heading: dto.heading,
        speed: dto.speed,
      },
    });
  }
}
