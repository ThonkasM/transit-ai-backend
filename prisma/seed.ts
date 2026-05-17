// @ts-nocheck — tipos se regeneran tras `prisma migrate dev`
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const url = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/transit_ai_db';
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── USUARIOS ────────────────────────────────────────────────
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@transit.bo' },
    update: {},
    create: {
      email: 'superadmin@transit.bo',
      name: 'Super Admin',
      passwordHash: '$2b$10$Vv2k4nsrgiUsERAWeovVRODeW.fpQ1lgoDUYQxqpNc/E2iTEEQmzG', // admin123
      role: 'SUPERADMIN',
      isActive: true,
    },
  });

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin.linea8@transit.bo' },
    update: {},
    create: {
      email: 'admin.linea8@transit.bo',
      name: 'Carlos Mamani',
      passwordHash: '$2b$10$Vv2k4nsrgiUsERAWeovVRODeW.fpQ1lgoDUYQxqpNc/E2iTEEQmzG', // admin123
      role: 'ADMIN',
      phone: '77123456',
      isActive: true,
      createdById: superadmin.id,
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin.linea25@transit.bo' },
    update: {},
    create: {
      email: 'admin.linea25@transit.bo',
      name: 'Rosa Torrico',
      passwordHash: '$2b$10$Vv2k4nsrgiUsERAWeovVRODeW.fpQ1lgoDUYQxqpNc/E2iTEEQmzG', // admin123
      role: 'ADMIN',
      phone: '76543210',
      isActive: true,
      createdById: superadmin.id,
    },
  });

  const userDriver1 = await prisma.user.upsert({
    where: { email: 'chofer1@transit.bo' },
    update: {},
    create: {
      email: 'chofer1@transit.bo',
      name: 'Pedro Flores',
      passwordHash: '$2b$10$biyJIJekR2ojMqfzL5K2IuRktDLZTScdtQOxax0c1bAz5sbKUT3pW', // chofer123
      role: 'DRIVER',
      phone: '71234567',
      isActive: true,
    },
  });

  const userDriver2 = await prisma.user.upsert({
    where: { email: 'chofer2@transit.bo' },
    update: {},
    create: {
      email: 'chofer2@transit.bo',
      name: 'Juan Quispe',
      passwordHash: '$2b$10$biyJIJekR2ojMqfzL5K2IuRktDLZTScdtQOxax0c1bAz5sbKUT3pW', // chofer123
      role: 'DRIVER',
      phone: '72345678',
      isActive: true,
    },
  });

  const userDriver3 = await prisma.user.upsert({
    where: { email: 'chofer3@transit.bo' },
    update: {},
    create: {
      email: 'chofer3@transit.bo',
      name: 'Mario Vaca',
      passwordHash: '$2b$10$biyJIJekR2ojMqfzL5K2IuRktDLZTScdtQOxax0c1bAz5sbKUT3pW', // chofer123
      role: 'DRIVER',
      phone: '73456789',
      isActive: true,
    },
  });

  const citizen1 = await prisma.user.upsert({
    where: { email: 'ciudadano1@gmail.com' },
    update: {},
    create: {
      email: 'ciudadano1@gmail.com',
      name: 'Ana Gutiérrez',
      passwordHash: '$2b$10$TfEVFP1buSzq.KSUzjno0OlbuP1m4NMzdBgWPBb7LWmhO/aA8u.CK', // pasajero123
      role: 'CITIZEN',
      phone: '70000001',
      isActive: true,
    },
  });

  const citizen2 = await prisma.user.upsert({
    where: { email: 'ciudadano2@gmail.com' },
    update: {},
    create: {
      email: 'ciudadano2@gmail.com',
      name: 'Luis Pedraza',
      passwordHash: '$2b$10$TfEVFP1buSzq.KSUzjno0OlbuP1m4NMzdBgWPBb7LWmhO/aA8u.CK', // pasajero123
      role: 'CITIZEN',
      phone: '70000002',
      isActive: true,
    },
  });

  console.log('✅ Usuarios creados');

  // ── LÍNEAS DE BUS ───────────────────────────────────────────
  const linea8 = await prisma.busLine.upsert({
    where: { code: 'L8' },
    update: {},
    create: {
      name: 'Línea 8',
      code: 'L8',
      description: 'Ruta Villa 1ro de Mayo - Plan 3000',
      color: '#E53935',
      isActive: true,
      adminId: admin1.id,
    },
  });

  const linea25 = await prisma.busLine.upsert({
    where: { code: 'L25' },
    update: {},
    create: {
      name: 'Línea 25',
      code: 'L25',
      description: 'Ruta Equipetrol - Mercado Los Pozos',
      color: '#1E88E5',
      isActive: true,
      adminId: admin2.id,
    },
  });

  console.log('✅ Líneas creadas');

  // ── TERMINALES ──────────────────────────────────────────────
  const terminalPlan3000 = await prisma.terminal.upsert({
    where: { id: 'terminal-plan-3000' },
    update: {},
    create: {
      id: 'terminal-plan-3000',
      name: 'Terminal Plan 3000',
      type: 'TERMINAL',
      latitude: -17.7742,
      longitude: -63.1611,
      address: 'Plan 3000, Santa Cruz de la Sierra',
      isActive: true,
      busLineId: linea8.id,
    },
  });

  await prisma.terminal.upsert({
    where: { id: 'terminal-villa-1ro' },
    update: {},
    create: {
      id: 'terminal-villa-1ro',
      name: 'Terminal Villa 1ro de Mayo',
      type: 'TERMINAL',
      latitude: -17.8012,
      longitude: -63.1894,
      address: 'Villa 1ro de Mayo, Santa Cruz de la Sierra',
      isActive: true,
      busLineId: linea8.id,
    },
  });

  await prisma.terminal.upsert({
    where: { id: 'garaje-linea25' },
    update: {},
    create: {
      id: 'garaje-linea25',
      name: 'Garaje Línea 25',
      type: 'GARAGE',
      latitude: -17.7489,
      longitude: -63.2341,
      address: 'Equipetrol Norte, Santa Cruz de la Sierra',
      isActive: true,
      busLineId: linea25.id,
    },
  });

  console.log('✅ Terminales creadas');

  // ── INTERNOS (vehículos) ────────────────────────────────────
  const interno1 = await prisma.interno.upsert({
    where: { plateNumber: 'SCZ-1234' },
    update: {},
    create: {
      busLineId: linea8.id,
      number: 12,
      plateNumber: 'SCZ-1234',
      model: 'Mercedes Benz OF-1721',
      capacity: 45,
      isActive: true,
    },
  });

  const interno2 = await prisma.interno.upsert({
    where: { plateNumber: 'SCZ-5678' },
    update: {},
    create: {
      busLineId: linea8.id,
      number: 15,
      plateNumber: 'SCZ-5678',
      model: 'Volkswagen 17.210',
      capacity: 42,
      isActive: true,
    },
  });

  const interno3 = await prisma.interno.upsert({
    where: { plateNumber: 'SCZ-9012' },
    update: {},
    create: {
      busLineId: linea25.id,
      number: 7,
      plateNumber: 'SCZ-9012',
      model: 'Agrale MA 17.0',
      capacity: 40,
      isActive: true,
    },
  });

  console.log('✅ Internos creados');

  // ── CHOFERES ────────────────────────────────────────────────
  const chofer1 = await prisma.driver.upsert({
    where: { userId: userDriver1.id },
    update: {},
    create: {
      userId: userDriver1.id,
      busLineId: linea8.id,
      licenseNumber: 'LP-001234',
      isActive: true,
      credentialStatus: 'ACTIVE',
    },
  });

  const chofer2 = await prisma.driver.upsert({
    where: { userId: userDriver2.id },
    update: {},
    create: {
      userId: userDriver2.id,
      busLineId: linea8.id,
      licenseNumber: 'SC-005678',
      isActive: true,
      credentialStatus: 'ACTIVE',
    },
  });

  const chofer3 = await prisma.driver.upsert({
    where: { userId: userDriver3.id },
    update: {},
    create: {
      userId: userDriver3.id,
      busLineId: linea25.id,
      licenseNumber: 'SC-009012',
      isActive: true,
      credentialStatus: 'PENDING',
    },
  });

  console.log('✅ Choferes creados');

  // ── PARADAS ─────────────────────────────────────────────────
  const stopPlan3000 = await prisma.stop.upsert({
    where: { id: 'stop-plan3000' },
    update: {},
    create: { id: 'stop-plan3000', name: 'Plan 3000 - Terminal', latitude: -17.7742, longitude: -63.1611 },
  });
  const stopAv6 = await prisma.stop.upsert({
    where: { id: 'stop-av6' },
    update: {},
    create: { id: 'stop-av6', name: 'Av. 6 de Agosto', latitude: -17.7801, longitude: -63.1720 },
  });
  const stop2doAnillo = await prisma.stop.upsert({
    where: { id: 'stop-2doanillo' },
    update: {},
    create: { id: 'stop-2doanillo', name: '2do Anillo', latitude: -17.7845, longitude: -63.1823 },
  });
  const stopMercadoLos = await prisma.stop.upsert({
    where: { id: 'stop-mercadolos' },
    update: {},
    create: { id: 'stop-mercadolos', name: 'Mercado Los Pozos', latitude: -17.7889, longitude: -63.1901 },
  });
  const stopPlaza24 = await prisma.stop.upsert({
    where: { id: 'stop-plaza24' },
    update: {},
    create: { id: 'stop-plaza24', name: 'Plaza 24 de Septiembre', latitude: -17.7894, longitude: -63.1853 },
  });
  const stopVilla1ro = await prisma.stop.upsert({
    where: { id: 'stop-villa1ro' },
    update: {},
    create: { id: 'stop-villa1ro', name: 'Villa 1ro de Mayo - Terminal', latitude: -17.8012, longitude: -63.1894 },
  });
  const stopEquipetrol = await prisma.stop.upsert({
    where: { id: 'stop-equipetrol' },
    update: {},
    create: { id: 'stop-equipetrol', name: 'Equipetrol Norte', latitude: -17.7489, longitude: -63.2341 },
  });
  const stop3erAnillo = await prisma.stop.upsert({
    where: { id: 'stop-3eranillo' },
    update: {},
    create: { id: 'stop-3eranillo', name: '3er Anillo Externo', latitude: -17.7612, longitude: -63.2101 },
  });
  const stopCanoto = await prisma.stop.upsert({
    where: { id: 'stop-canoto' },
    update: {},
    create: { id: 'stop-canoto', name: 'Mercado Cañoto', latitude: -17.7823, longitude: -63.1834 },
  });

  console.log('✅ Paradas creadas');

  // ── RUTAS ───────────────────────────────────────────────────
  const ruta8ida = await prisma.route.upsert({
    where: { id: 'ruta-8-ida' },
    update: {},
    create: {
      id: 'ruta-8-ida',
      busLineId: linea8.id,
      name: 'Línea 8 - Ida (Plan 3000 → Villa 1ro)',
      waypoints: JSON.stringify([
        { lat: -17.7742, lng: -63.1611 },
        { lat: -17.7801, lng: -63.1720 },
        { lat: -17.7845, lng: -63.1823 },
        { lat: -17.7889, lng: -63.1901 },
        { lat: -17.8012, lng: -63.1894 },
      ]),
      isActive: true,
    },
  });

  const ruta8vuelta = await prisma.route.upsert({
    where: { id: 'ruta-8-vuelta' },
    update: {},
    create: {
      id: 'ruta-8-vuelta',
      busLineId: linea8.id,
      name: 'Línea 8 - Vuelta (Villa 1ro → Plan 3000)',
      waypoints: JSON.stringify([
        { lat: -17.8012, lng: -63.1894 },
        { lat: -17.7889, lng: -63.1901 },
        { lat: -17.7894, lng: -63.1853 },
        { lat: -17.7845, lng: -63.1823 },
        { lat: -17.7742, lng: -63.1611 },
      ]),
      isActive: true,
    },
  });

  const ruta25 = await prisma.route.upsert({
    where: { id: 'ruta-25' },
    update: {},
    create: {
      id: 'ruta-25',
      busLineId: linea25.id,
      name: 'Línea 25 - Equipetrol → Cañoto',
      waypoints: JSON.stringify([
        { lat: -17.7489, lng: -63.2341 },
        { lat: -17.7612, lng: -63.2101 },
        { lat: -17.7823, lng: -63.1834 },
      ]),
      isActive: true,
    },
  });

  console.log('✅ Rutas creadas');

  // ── ROUTE STOPS ─────────────────────────────────────────────
  const routeStopsData = [
    { routeId: ruta8ida.id, stopId: stopPlan3000.id, orderIndex: 1, estimatedMinutesFromStart: 0 },
    { routeId: ruta8ida.id, stopId: stopAv6.id, orderIndex: 2, estimatedMinutesFromStart: 5 },
    { routeId: ruta8ida.id, stopId: stop2doAnillo.id, orderIndex: 3, estimatedMinutesFromStart: 12 },
    { routeId: ruta8ida.id, stopId: stopMercadoLos.id, orderIndex: 4, estimatedMinutesFromStart: 18 },
    { routeId: ruta8ida.id, stopId: stopVilla1ro.id, orderIndex: 5, estimatedMinutesFromStart: 28 },
    { routeId: ruta8vuelta.id, stopId: stopVilla1ro.id, orderIndex: 1, estimatedMinutesFromStart: 0 },
    { routeId: ruta8vuelta.id, stopId: stopPlaza24.id, orderIndex: 2, estimatedMinutesFromStart: 6 },
    { routeId: ruta8vuelta.id, stopId: stop2doAnillo.id, orderIndex: 3, estimatedMinutesFromStart: 14 },
    { routeId: ruta8vuelta.id, stopId: stopPlan3000.id, orderIndex: 4, estimatedMinutesFromStart: 25 },
    { routeId: ruta25.id, stopId: stopEquipetrol.id, orderIndex: 1, estimatedMinutesFromStart: 0 },
    { routeId: ruta25.id, stopId: stop3erAnillo.id, orderIndex: 2, estimatedMinutesFromStart: 8 },
    { routeId: ruta25.id, stopId: stopCanoto.id, orderIndex: 3, estimatedMinutesFromStart: 20 },
  ];

  for (const rs of routeStopsData) {
    await prisma.routeStop.upsert({
      where: { routeId_stopId: { routeId: rs.routeId, stopId: rs.stopId } },
      update: {},
      create: rs,
    });
  }

  console.log('✅ RouteStops creados');

  // ── TURNOS ──────────────────────────────────────────────────
  const turno1 = await prisma.shift.upsert({
    where: { id: 'turno-chofer1-manana' },
    update: {},
    create: {
      id: 'turno-chofer1-manana',
      driverId: chofer1.id,
      internoId: interno1.id,
      routeId: ruta8ida.id,
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
      startTime: '05:30',
      endTime: '13:30',
      isActive: true,
    },
  });

  const turno2 = await prisma.shift.upsert({
    where: { id: 'turno-chofer2-tarde' },
    update: {},
    create: {
      id: 'turno-chofer2-tarde',
      driverId: chofer2.id,
      internoId: interno2.id,
      routeId: ruta8vuelta.id,
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5, 6]),
      startTime: '13:30',
      endTime: '21:30',
      isActive: true,
    },
  });

  await prisma.shift.upsert({
    where: { id: 'turno-chofer3-manana' },
    update: {},
    create: {
      id: 'turno-chofer3-manana',
      driverId: chofer3.id,
      internoId: interno3.id,
      routeId: ruta25.id,
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]),
      startTime: '06:00',
      endTime: '14:00',
      isActive: true,
    },
  });

  console.log('✅ Turnos creados');

  // ── ASIGNACIÓN DIARIA ───────────────────────────────────────
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  await prisma.dailyAssignment.upsert({
    where: { date_internoId: { date: hoy, internoId: interno1.id } },
    update: {},
    create: {
      date: hoy,
      internoId: interno1.id,
      routeId: ruta8ida.id,
      assignedById: admin1.id,
      notes: 'Turno normal - mañana',
      isActive: true,
    },
  });

  await prisma.dailyAssignment.upsert({
    where: { date_internoId: { date: hoy, internoId: interno3.id } },
    update: {},
    create: {
      date: hoy,
      internoId: interno3.id,
      routeId: ruta25.id,
      assignedById: admin2.id,
      notes: 'Turno normal - mañana',
      isActive: true,
    },
  });

  console.log('✅ Asignaciones diarias creadas');

  // ── TARIFAS ──────────────────────────────────────────────────
  await prisma.fare.upsert({
    where: { id: 'fare-8-adult' },
    update: {},
    create: {
      id: 'fare-8-adult',
      routeId: ruta8ida.id,
      amount: 2.50,
      currency: 'BOB',
      passengerType: 'ADULT',
      isActive: true,
    },
  });

  await prisma.fare.upsert({
    where: { id: 'fare-8-student' },
    update: {},
    create: {
      id: 'fare-8-student',
      routeId: ruta8ida.id,
      amount: 1.50,
      currency: 'BOB',
      passengerType: 'STUDENT',
      isActive: true,
    },
  });

  await prisma.fare.upsert({
    where: { id: 'fare-25-adult' },
    update: {},
    create: {
      id: 'fare-25-adult',
      routeId: ruta25.id,
      amount: 2.00,
      currency: 'BOB',
      passengerType: 'ADULT',
      isActive: true,
    },
  });

  console.log('✅ Tarifas creadas');

  // ── PREFERENCIAS DE USUARIOS ────────────────────────────────
  await prisma.userPreference.upsert({
    where: { userId: citizen1.id },
    update: {},
    create: {
      userId: citizen1.id,
      preferredCriteria: 'FASTEST',
      maxWalkMeters: 400,
      maxTransfers: 1,
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: citizen2.id },
    update: {},
    create: {
      userId: citizen2.id,
      preferredCriteria: 'LESS_WALKING',
      maxWalkMeters: 200,
      maxTransfers: 2,
    },
  });

  console.log('✅ Preferencias creadas');

  // ── VIAJES FAVORITOS ────────────────────────────────────────
  const favExistente = await prisma.savedJourney.findFirst({
    where: { userId: citizen1.id, alias: 'Casa → Trabajo' },
  });
  if (!favExistente) {
    await prisma.savedJourney.create({
      data: {
        userId: citizen1.id,
        alias: 'Casa → Trabajo',
        fromLat: -17.7742,
        fromLng: -63.1611,
        fromLabel: 'Plan 3000',
        toLat: -17.7894,
        toLng: -63.1853,
        toLabel: 'Plaza 24 de Septiembre',
        isActive: true,
      },
    });
  }

  console.log('✅ Favoritos creados');

  // ── NOTIFICACIONES ──────────────────────────────────────────
  const notif1Existente = await prisma.notification.findFirst({
    where: { title: 'Bienvenido a Transit AI' },
  });
  if (!notif1Existente) {
    await prisma.notification.create({
      data: {
        title: 'Bienvenido a Transit AI',
        body: 'El sistema de transporte inteligente de Santa Cruz está activo.',
        type: 'ANNOUNCEMENT',
        targetRole: 'CITIZEN',
        createdById: superadmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const notif2Existente = await prisma.notification.findFirst({
    where: { targetUserId: userDriver3.id },
  });
  if (!notif2Existente) {
    await prisma.notification.create({
      data: {
        title: 'Recuerda verificar tu licencia',
        body: 'Tu credencial está pendiente de aprobación.',
        type: 'SYSTEM',
        targetUserId: userDriver3.id,
        createdById: admin2.id,
      },
    });
  }

  console.log('✅ Notificaciones creadas');

  console.log('\n✅ Seed completado exitosamente');
  console.log('─────────────────────────────────────────');
  console.log(`  Usuarios:       8`);
  console.log(`  Líneas:         2  (L8, L25)`);
  console.log(`  Terminales:     3`);
  console.log(`  Internos:       3`);
  console.log(`  Choferes:       3`);
  console.log(`  Paradas:        9`);
  console.log(`  Rutas:          3`);
  console.log(`  RouteStops:     12`);
  console.log(`  Turnos:         3`);
  console.log(`  Asignaciones:   2`);
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
