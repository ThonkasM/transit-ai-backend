import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TrasboardosService } from './trasbordos.service';
import { CrearTrasborodoDto } from './dto/crear-trasbordo.dto';
import { DecidirTrasborodoDto } from './dto/decidir-trasbordo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('trasbordos')
export class TrasboardosController {
  constructor(private readonly trasboardosService: TrasboardosService) {}

  @Get()
  async obtenerTodos(@CurrentUser() usuario: any, @Query('estado') estado?: string) {
    const sindicatoId = usuario.syndicateId ?? undefined;
    return await this.trasboardosService.obtenerTodos(estado, sindicatoId);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.trasboardosService.obtenerPorId(id);
  }

  @Post()
  async crear(@Body() dto: CrearTrasborodoDto) {
    return await this.trasboardosService.crear(dto);
  }

  @Patch(':id/decidir')
  async decidir(@Param('id') id: string, @Body() dto: DecidirTrasborodoDto) {
    return await this.trasboardosService.decidir(id, dto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.trasboardosService.eliminar(id);
  }
}
