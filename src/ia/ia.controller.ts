import {
  Controller, Get, Patch, Post, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { IaService } from './ia.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  // ── HU-20: ETA ────────────────────────────────────────────────────────────────

  /** ETA de un viaje específico hacia un punto de embarque */
  @Get('eta/viaje/:viajeId')
  async etaViaje(
    @Param('viajeId') viajeId: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.iaService.predecirETA(viajeId, parseFloat(lat), parseFloat(lng));
  }

  /** ETA del bus más cercano en una línea hacia un punto de embarque */
  @Get('eta/linea/:lineaId')
  async etaLinea(
    @Param('lineaId') lineaId: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.iaService.predecirETALinea(lineaId, parseFloat(lat), parseFloat(lng));
  }

  // ── HU-21: Congestión ─────────────────────────────────────────────────────────

  /** Nivel de congestión en un punto dado */
  @Get('congestion')
  async congestion(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radio') radio?: string,
  ) {
    return this.iaService.detectarCongestion(
      parseFloat(lat),
      parseFloat(lng),
      radio ? parseInt(radio) : 600,
    );
  }

  /** Zonas de congestión detectadas en toda la flota */
  @Get('congestion/zonas')
  async zonasCongestion() {
    return this.iaService.obtenerZonasCongestion();
  }

  // ── HU-22: Preferencias ───────────────────────────────────────────────────────

  @Get('preferencias/:usuarioId')
  async obtenerPreferencias(@Param('usuarioId') usuarioId: string) {
    return this.iaService.obtenerPreferencias(usuarioId);
  }

  @Patch('preferencias/:usuarioId')
  async actualizarPreferencias(
    @Param('usuarioId') usuarioId: string,
    @Body() body: {
      criterioPrincipal?: string;
      maxCaminataMetros?: number;
      maxTransbordos?: number;
    },
  ) {
    return this.iaService.actualizarPreferencias(usuarioId, body);
  }

  /** Registra automáticamente qué criterio usó el pasajero al calcular una ruta */
  @Post('preferencias/:usuarioId/uso')
  async registrarUso(
    @Param('usuarioId') usuarioId: string,
    @Body('criterio') criterio: string,
  ) {
    return this.iaService.registrarUsoRuta(usuarioId, criterio);
  }
}
