import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarPreferenciaDto } from './dto/actualizar-preferencia.dto';

@Injectable()
export class PreferenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPorUsuario(userId: string) {
    const preferencia = await this.prisma.userPreference.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!preferencia)
      throw new NotFoundException(
        `Preferencias del usuario ${userId} no encontradas`,
      );
    return preferencia;
  }

  async upsert(userId: string, dto: ActualizarPreferenciaDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  async eliminar(userId: string) {
    await this.obtenerPorUsuario(userId);
    return this.prisma.userPreference.delete({ where: { userId } });
  }
}
