import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InternosService } from './internos.service';
import { CrearInternoDto } from './dto/crear-interno.dto';
import { ActualizarInternoDto } from './dto/actualizar-interno.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('internos')
export class InternosController {
  constructor(private readonly internosService: InternosService) {}

  @Get()
  async obtenerTodos(
    @CurrentUser() usuario: any,
    @Query('lineaId') lineaId?: string,
  ) {
    const sindicatoId = usuario.syndicateId ?? undefined;
    return await this.internosService.obtenerTodos(sindicatoId, lineaId);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.internosService.obtenerPorId(id);
  }

  @Post()
  async crear(@Body() dto: CrearInternoDto, @CurrentUser() usuario: any) {
    if (usuario.syndicateId) dto.sindicatoId = usuario.syndicateId;
    return await this.internosService.crear(dto);
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarInternoDto) {
    return await this.internosService.actualizar(id, dto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.internosService.eliminar(id);
  }
}
