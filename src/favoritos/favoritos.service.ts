import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearFavoritoDto } from './dto/crear-favorito.dto';
import { ActualizarFavoritoDto } from './dto/actualizar-favorito.dto';

@Injectable()
export class FavoritosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPorUsuario(userId: string) {
    return this.prisma.savedJourney.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const favorito = await this.prisma.savedJourney.findFirst({
      where: { id },
    });
    if (!favorito)
      throw new NotFoundException(`Favorito con ID ${id} no encontrado`);
    return favorito;
  }

  async crear(dto: CrearFavoritoDto) {
    return this.prisma.savedJourney.create({
      data: {
        userId: dto.userId,
        alias: dto.alias,
        fromLat: dto.fromLat,
        fromLng: dto.fromLng,
        fromLabel: dto.fromLabel,
        toLat: dto.toLat,
        toLng: dto.toLng,
        toLabel: dto.toLabel,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async actualizar(id: string, dto: ActualizarFavoritoDto) {
    await this.obtenerPorId(id);
    const { userId, ...rest } = dto;
    return this.prisma.savedJourney.update({ where: { id }, data: rest });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.savedJourney.delete({ where: { id } });
  }
}
