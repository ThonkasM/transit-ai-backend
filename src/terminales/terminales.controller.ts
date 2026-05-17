import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TerminalesService } from './terminales.service';
import { CrearTerminalDto } from './dto/crear-terminal.dto';
import { ActualizarTerminalDto } from './dto/actualizar-terminal.dto';

@Controller('terminales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TerminalesController {
  constructor(private readonly terminalesService: TerminalesService) {}

  @Get()
  @Roles('ADMIN', 'DRIVER')
  async obtenerTodos(@Query('busLineId') busLineId?: string) {
    const datos = await this.terminalesService.obtenerTodos(busLineId);
    return {
      exito: true,
      datos,
      mensaje: 'Terminales obtenidas correctamente',
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'DRIVER')
  async obtenerPorId(@Param('id') id: string) {
    const datos = await this.terminalesService.obtenerPorId(id);
    return { exito: true, datos, mensaje: 'Terminal obtenida correctamente' };
  }

  @Post()
  @Roles('ADMIN')
  async crear(@Body() dto: CrearTerminalDto) {
    const datos = await this.terminalesService.crear(dto);
    return { exito: true, datos, mensaje: 'Terminal creada correctamente' };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarTerminalDto,
  ) {
    const datos = await this.terminalesService.actualizar(id, dto);
    return {
      exito: true,
      datos,
      mensaje: 'Terminal actualizada correctamente',
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string) {
    const datos = await this.terminalesService.eliminar(id);
    return { exito: true, datos, mensaje: 'Terminal eliminada correctamente' };
  }
}
