import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LineasModule } from './lineas/lineas.module';
import { InternosModule } from './internos/internos.module';
import { ConductoresModule } from './conductores/conductores.module';
import { RutasModule } from './rutas/rutas.module';
import { ParadasModule } from './paradas/paradas.module';
import { ViajesModule } from './viajes/viajes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TurnosModule } from './turnos/turnos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { TerminalesModule } from './terminales/terminales.module';
import { IncidentesModule } from './incidentes/incidentes.module';
import { TrasboardosModule } from './trasbordos/trasbordos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { PreferenciasModule } from './preferencias/preferencias.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { AuthModule } from './auth/auth.module';
import { TarifasModule } from './tarifas/tarifas.module';

@Module({
  imports: [
    PrismaModule,
    LineasModule,
    InternosModule,
    ConductoresModule,
    RutasModule,
    ParadasModule,
    ViajesModule,
    UsuariosModule,
    TurnosModule,
    AsignacionesModule,
    TerminalesModule,
    IncidentesModule,
    TrasboardosModule,
    NotificacionesModule,
    PreferenciasModule,
    FavoritosModule,
    AuthModule,
    TarifasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
