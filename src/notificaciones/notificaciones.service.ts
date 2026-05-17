import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearNotificacionDto } from './dto/crear-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(targetUserId?: string, type?: string) {
    return this.prisma.notification.findMany({
      where: {
        ...(targetUserId ? { targetUserId } : {}),
        ...(type ? { type: type as any } : {}),
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        targetUser: { select: { id: true, name: true } },
        receipts: {
          select: { id: true, userId: true, readAt: true, pushSent: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const notificacion = await this.prisma.notification.findFirst({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        targetUser: { select: { id: true, name: true } },
        receipts: { include: { user: { select: { id: true, name: true } } } },
      },
    });
    if (!notificacion)
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    return notificacion;
  }

  async crear(dto: CrearNotificacionDto) {
    return this.prisma.notification.create({
      data: {
        title: dto.title,
        body: dto.body,
        content: dto.content,
        type: dto.type,
        data: dto.data,
        targetRole: dto.targetRole,
        targetUserId: dto.targetUserId,
        createdById: dto.createdById,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async marcarLeida(notificationId: string, userId: string) {
    return this.prisma.notificationReceipt.upsert({
      where: { notificationId_userId: { notificationId, userId } },
      update: { readAt: new Date() },
      create: { notificationId, userId, readAt: new Date() },
    });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.notification.delete({ where: { id } });
  }
}
