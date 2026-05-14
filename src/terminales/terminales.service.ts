import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTerminalDto } from './dto/crear-terminal.dto';
import { ActualizarTerminalDto } from './dto/actualizar-terminal.dto';

@Injectable()
export class TerminalesService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(busLineId?: string) {
    return this.prisma.terminal.findMany({
      where: {
        deletedAt: null,
        ...(busLineId ? { busLineId } : {}),
      },
      include: { busLine: { select: { id: true, name: true, code: true } } },
    });
  }

  async obtenerPorId(id: string) {
    const terminal = await this.prisma.terminal.findFirst({
      where: { id, deletedAt: null },
      include: { busLine: { select: { id: true, name: true, code: true } } },
    });
    if (!terminal) throw new NotFoundException(`Terminal con ID ${id} no encontrada`);
    return terminal;
  }

  async crear(dto: CrearTerminalDto) {
    return this.prisma.terminal.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarTerminalDto) {
    await this.obtenerPorId(id);
    return this.prisma.terminal.update({ where: { id }, data: dto });
  }

  async eliminar(id: string) {
    await this.obtenerPorId(id);
    return this.prisma.terminal.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
