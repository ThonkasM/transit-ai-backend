import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type NivelCongestion = 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';

// ─── Tipos de respuesta ───────────────────────────────────────────────────────
export interface ResultadoETA {
  etaMin: number;
  fuente: 'google' | 'propio';
  factorTraficoPct: number;
  distanciaM?: number;
  velocidadKmh?: number;
}

export interface ResultadoCongestion {
  nivel: NivelCongestion;
  velocidadPromedioKmh: number;
  busesEnZona: number;
  fuente: 'google' | 'flota';
  descripcion: string;
  factorDemora?: number;
}

export interface ZonaCongestion {
  lat: number;
  lng: number;
  nivel: NivelCongestion;
  velocidadKmh: number;
  buses: number;
}

export interface ResultadoPreferencias {
  criterioPrincipal: string;
  maxCaminataMetros: number;
  maxTransbordos: number;
  patronesAprendidos: {
    criterioUsos: Record<string, number>;
    totalCalculos: number;
  } | null;
}

@Injectable()
export class IaService {
  constructor(private readonly prisma: PrismaService) {}

  // ══════════════════════════════════════════════════════════════════════════════
  // HU-20 — PREDICCIÓN DE ETA
  // ══════════════════════════════════════════════════════════════════════════════

  async predecirETA(
    viajeId: string,
    embarqueLat: number,
    embarqueLng: number,
  ): Promise<ResultadoETA> {
    const ubicacion = await this.prisma.driverLocation.findFirst({
      where: { tripId: BigInt(viajeId) },
      orderBy: { recordedAt: 'desc' },
    });

    if (!ubicacion) {
      return { etaMin: 10, fuente: 'propio', factorTraficoPct: 0 };
    }

    const busLat = Number(ubicacion.latitude);
    const busLng = Number(ubicacion.longitude);
    const busSpeedKmh = Number(ubicacion.speed ?? 0);

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (apiKey) {
      const googleResult = await this.googleDistanceMatrix(
        busLat, busLng, embarqueLat, embarqueLng, apiKey,
      );
      if (googleResult) return googleResult;
    }

    // Fallback propio: haversine + velocidad actual del bus
    const distanciaM = haversine(busLat, busLng, embarqueLat, embarqueLng);
    const velocidadEfectiva = busSpeedKmh > 5 ? busSpeedKmh : 25; // km/h
    const velocidadMpm = (velocidadEfectiva * 1000) / 60; // metros por minuto
    const etaMin = Math.max(1, Math.ceil(distanciaM / velocidadMpm));

    return {
      etaMin,
      fuente: 'propio',
      factorTraficoPct: 0,
      distanciaM: Math.round(distanciaM),
      velocidadKmh: Math.round(velocidadEfectiva),
    };
  }

  // Estima ETA del bus más cercano a un punto de embarque para una línea dada
  async predecirETALinea(
    lineaId: string,
    embarqueLat: number,
    embarqueLng: number,
  ): Promise<ResultadoETA> {
    const viajesActivos = await this.prisma.trip.findMany({
      where: {
        status: 'IN_PROGRESS',
        assignment: { internal: { lineId: BigInt(lineaId) } },
      },
      include: { locations: { orderBy: { recordedAt: 'desc' }, take: 1 } },
    });

    if (viajesActivos.length === 0) {
      // Sin buses activos: estimar por horario
      const hora = new Date().getHours();
      const etaMin = (hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19) ? 5
        : hora >= 6 && hora <= 22 ? 10 : 20;
      return { etaMin, fuente: 'propio', factorTraficoPct: 0 };
    }

    let mejorEta: ResultadoETA | null = null;

    for (const viaje of viajesActivos) {
      const loc = viaje.locations[0];
      if (!loc) continue;
      const eta = await this.predecirETA(String(viaje.id), embarqueLat, embarqueLng);
      if (!mejorEta || eta.etaMin < mejorEta.etaMin) mejorEta = eta;
    }

    return mejorEta ?? { etaMin: 10, fuente: 'propio', factorTraficoPct: 0 };
  }

  private async googleDistanceMatrix(
    origenLat: number, origenLng: number,
    destinoLat: number, destinoLng: number,
    apiKey: string,
  ): Promise<ResultadoETA | null> {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/distancematrix/json` +
        `?origins=${origenLat},${origenLng}` +
        `&destinations=${destinoLat},${destinoLng}` +
        `&departure_time=now&traffic_model=best_guess` +
        `&key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data = (await res.json()) as any;

      const element = data?.rows?.[0]?.elements?.[0];
      if (element?.status !== 'OK') return null;

      const duracionNormalSeg: number = element.duration.value;
      const duracionTraficoSeg: number =
        element.duration_in_traffic?.value ?? duracionNormalSeg;
      const distanciaM: number = element.distance?.value ?? 0;

      const factorTraficoPct = Math.max(
        0,
        Math.round(
          ((duracionTraficoSeg - duracionNormalSeg) / duracionNormalSeg) * 100,
        ),
      );

      return {
        etaMin: Math.max(1, Math.ceil(duracionTraficoSeg / 60)),
        fuente: 'google',
        factorTraficoPct,
        distanciaM,
      };
    } catch {
      return null;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HU-21 — DETECCIÓN DE CONGESTIÓN
  // ══════════════════════════════════════════════════════════════════════════════

  async detectarCongestion(
    centerLat: number,
    centerLng: number,
    radioM = 600,
  ): Promise<ResultadoCongestion> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Intentar con Google si está disponible
    if (apiKey) {
      const googleResult = await this.googleTrafficCheck(
        centerLat, centerLng, apiKey,
      );
      if (googleResult) {
        return { ...googleResult, fuente: 'google' };
      }
    }

    // Fallback: análisis de velocidad de la propia flota
    return this.congestionPorFlota(centerLat, centerLng, radioM);
  }

  async obtenerZonasCongestion(): Promise<ZonaCongestion[]> {
    const hace10min = new Date(Date.now() - 10 * 60 * 1000);

    const ubicaciones = await this.prisma.driverLocation.findMany({
      where: { recordedAt: { gte: hace10min } },
      orderBy: { recordedAt: 'desc' },
      take: 500,
    });

    // Clustering por cuadrícula de ~200m (~0.002 grados)
    const grid = new Map<string, { lat: number; lng: number; speeds: number[] }>();

    for (const u of ubicaciones) {
      const lat = Number(u.latitude);
      const lng = Number(u.longitude);
      const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
      if (!grid.has(key)) grid.set(key, { lat, lng, speeds: [] });
      grid.get(key)!.speeds.push(Number(u.speed ?? 25));
    }

    const zonas: ZonaCongestion[] = [];
    for (const [, zona] of grid) {
      const promedio =
        zona.speeds.reduce((a, b) => a + b, 0) / zona.speeds.length;
      if (promedio < 20 && zona.speeds.length >= 2) {
        zonas.push({
          lat: zona.lat,
          lng: zona.lng,
          nivel: promedio < 10 ? 'CRITICO' : 'ALTO',
          velocidadKmh: Math.round(promedio),
          buses: zona.speeds.length,
        });
      }
    }

    return zonas;
  }

  private async congestionPorFlota(
    lat: number, lng: number, radioM: number,
  ): Promise<ResultadoCongestion> {
    const hace10min = new Date(Date.now() - 10 * 60 * 1000);
    const ubicaciones = await this.prisma.driverLocation.findMany({
      where: { recordedAt: { gte: hace10min } },
      orderBy: { recordedAt: 'desc' },
      take: 200,
    });

    const enZona = ubicaciones.filter(
      (u) =>
        haversine(
          Number(u.latitude), Number(u.longitude), lat, lng,
        ) <= radioM,
    );

    if (enZona.length === 0) {
      return {
        nivel: 'BAJO', velocidadPromedioKmh: 0, busesEnZona: 0,
        fuente: 'flota', descripcion: 'Sin datos de flota en esta zona',
      };
    }

    const velocidades = enZona.map((u) => Number(u.speed ?? 25));
    const promedio = velocidades.reduce((a, b) => a + b, 0) / velocidades.length;

    let nivel: NivelCongestion;
    let descripcion: string;
    if (promedio >= 30)      { nivel = 'BAJO';     descripcion = 'Tráfico fluido'; }
    else if (promedio >= 20) { nivel = 'MODERADO'; descripcion = 'Tráfico moderado'; }
    else if (promedio >= 10) { nivel = 'ALTO';     descripcion = 'Tráfico denso'; }
    else                     { nivel = 'CRITICO';  descripcion = 'Posible bloqueo o congestión severa'; }

    return {
      nivel, velocidadPromedioKmh: Math.round(promedio),
      busesEnZona: enZona.length, fuente: 'flota', descripcion,
    };
  }

  private async googleTrafficCheck(
    lat: number, lng: number, apiKey: string,
  ): Promise<Omit<ResultadoCongestion, 'fuente'> | null> {
    try {
      // Comparar duración normal vs con tráfico en un segmento cercano
      const offset = 0.004; // ~400m
      const url =
        `https://maps.googleapis.com/maps/api/distancematrix/json` +
        `?origins=${lat},${lng}` +
        `&destinations=${lat + offset},${lng + offset}` +
        `&departure_time=now&traffic_model=best_guess` +
        `&key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data = (await res.json()) as any;
      const element = data?.rows?.[0]?.elements?.[0];
      if (element?.status !== 'OK') return null;

      const normal: number = element.duration.value;
      const conTrafico: number = element.duration_in_traffic?.value ?? normal;
      const factor = conTrafico / normal;

      const velocidadBase = 30;
      const velocidadEstimada = Math.round(velocidadBase / factor);

      let nivel: NivelCongestion;
      let descripcion: string;
      if (factor < 1.2)      { nivel = 'BAJO';     descripcion = 'Tráfico fluido (Google Maps)'; }
      else if (factor < 1.5) { nivel = 'MODERADO'; descripcion = 'Tráfico moderado (Google Maps)'; }
      else if (factor < 2.0) { nivel = 'ALTO';     descripcion = 'Tráfico denso (Google Maps)'; }
      else                   { nivel = 'CRITICO';  descripcion = 'Congestión severa (Google Maps)'; }

      return {
        nivel,
        velocidadPromedioKmh: velocidadEstimada,
        busesEnZona: 0,
        descripcion,
        factorDemora: Math.round((factor - 1) * 100),
      };
    } catch {
      return null;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HU-22 — PREFERENCIAS Y APRENDIZAJE
  // ══════════════════════════════════════════════════════════════════════════════

  async obtenerPreferencias(usuarioId: string): Promise<ResultadoPreferencias> {
    const pref = await this.prisma.userPreference.findUnique({
      where: { userId: BigInt(usuarioId) },
    });

    const patrones = pref?.learnedPatterns as any;

    return {
      criterioPrincipal: pref?.preferredCriteria ?? 'FASTEST',
      maxCaminataMetros: pref?.maxWalkingMeters ?? 500,
      maxTransbordos: pref?.maxTransfers ?? 2,
      patronesAprendidos: patrones
        ? {
            criterioUsos: patrones.criterioUsos ?? {},
            totalCalculos: Object.values<number>(
              patrones.criterioUsos ?? {},
            ).reduce((a: number, b: number) => a + b, 0),
          }
        : null,
    };
  }

  async actualizarPreferencias(
    usuarioId: string,
    dto: {
      criterioPrincipal?: string;
      maxCaminataMetros?: number;
      maxTransbordos?: number;
    },
  ) {
    return this.prisma.userPreference.upsert({
      where: { userId: BigInt(usuarioId) },
      update: {
        ...(dto.criterioPrincipal !== undefined && {
          preferredCriteria: dto.criterioPrincipal,
        }),
        ...(dto.maxCaminataMetros !== undefined && {
          maxWalkingMeters: dto.maxCaminataMetros,
        }),
        ...(dto.maxTransbordos !== undefined && {
          maxTransfers: dto.maxTransbordos,
        }),
      },
      create: {
        userId: BigInt(usuarioId),
        preferredCriteria: dto.criterioPrincipal ?? 'FASTEST',
        maxWalkingMeters: dto.maxCaminataMetros ?? 500,
        maxTransfers: dto.maxTransbordos ?? 2,
      },
    });
  }

  // Llamado automáticamente cada vez que el pasajero calcula una ruta
  async registrarUsoRuta(
    usuarioId: string,
    criterioUsado: string,
  ): Promise<{ criterioPrincipalAprendido: string }> {
    const criterioMap: Record<string, string> = {
      rapida: 'FASTEST',
      economica: 'LEAST_COST',
      caminata: 'LEAST_WALKING',
    };
    const criterioNormalizado = criterioMap[criterioUsado] ?? criterioUsado;

    const pref = await this.prisma.userPreference.findUnique({
      where: { userId: BigInt(usuarioId) },
    });

    const patrones = (pref?.learnedPatterns as any) ?? { criterioUsos: {} };
    patrones.criterioUsos = patrones.criterioUsos ?? {};
    patrones.criterioUsos[criterioNormalizado] =
      (patrones.criterioUsos[criterioNormalizado] ?? 0) + 1;

    // El criterio más utilizado se convierte en el preferido
    const criterioPrincipalAprendido = Object.entries<number>(
      patrones.criterioUsos,
    ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'FASTEST';

    await this.prisma.userPreference.upsert({
      where: { userId: BigInt(usuarioId) },
      update: {
        learnedPatterns: patrones,
        preferredCriteria: criterioPrincipalAprendido,
      },
      create: {
        userId: BigInt(usuarioId),
        preferredCriteria: criterioPrincipalAprendido,
        maxWalkingMeters: 500,
        maxTransfers: 2,
        learnedPatterns: patrones,
      },
    });

    return { criterioPrincipalAprendido };
  }
}
