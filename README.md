# transit-ai-backend

Backend del sistema de transporte público inteligente Transit AI. API REST + WebSocket en tiempo real construida con NestJS, Prisma y SQLite (migrable a PostgreSQL).

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| **NestJS** | 11 | Framework principal del servidor |
| **TypeScript** | 5.7 | Lenguaje tipado |
| **Prisma** | 7 | ORM para base de datos |
| **SQLite** | — | Base de datos de desarrollo |
| **Socket.IO** | 4 | WebSocket para ubicación en tiempo real |
| **class-validator** | 0.15 | Validación de datos entrantes |
| **Passport + JWT** | — | Autenticación (preparado) |

---

## Requisitos previos

- **Node.js** >= 18
- **npm** >= 9

No requiere instalar PostgreSQL ni ninguna base de datos externa para desarrollo — SQLite crea el archivo automáticamente.

---

## Instalación y primer arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo .env (ya incluido con SQLite por defecto)
# Si no existe, créalo con:
echo DATABASE_URL="file:./dev.db" > .env

# 3. Crear las tablas en la base de datos
npx prisma migrate dev --name init

# 4. Generar el cliente de Prisma
npx prisma generate

# 5. Iniciar en modo desarrollo (auto-reload)
npm run start:dev
```

El servidor estará disponible en: **http://localhost:3000**
El WebSocket estará disponible en: **ws://localhost:3000/viajes**

---

## Comandos disponibles

```bash
npm run start:dev    # Desarrollo con auto-reload
npm run start:prod   # Producción (requiere build previo)
npm run build        # Compilar a JavaScript
npm run lint         # Revisar errores de código

npx prisma studio    # Interfaz visual de la base de datos
npx prisma migrate dev --name <nombre>  # Aplicar cambios al schema
npx prisma generate  # Regenerar cliente Prisma
```

---

## Cambiar a PostgreSQL

1. Editar `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // cambiar de "sqlite"
   }
   ```

2. Editar `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/transit_ai_db"
   ```

3. Aplicar migración:
   ```bash
   npx prisma migrate dev --name postgres-init
   ```

---

## Estructura del proyecto

```
src/
├── main.ts                        # Punto de entrada — configura CORS, validación, WebSocket
├── app.module.ts                  # Módulo raíz — importa todos los módulos
├── prisma/
│   ├── prisma.service.ts          # Conexión a la base de datos (Prisma Client)
│   └── prisma.module.ts           # Módulo global de Prisma
├── usuarios/                      # Gestión de usuarios
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   ├── usuarios.module.ts
│   └── dto/
├── lineas/                        # Líneas de bus
│   ├── lineas.controller.ts
│   ├── lineas.service.ts
│   ├── lineas.module.ts
│   └── dto/
├── internos/                      # Vehículos/unidades por línea
│   ├── internos.controller.ts
│   ├── internos.service.ts
│   ├── internos.module.ts
│   └── dto/
├── conductores/                   # Conductores vinculados a usuarios
│   ├── conductores.controller.ts
│   ├── conductores.service.ts
│   ├── conductores.module.ts
│   └── dto/
├── rutas/                         # Recorridos con waypoints GPS
│   ├── rutas.controller.ts
│   ├── rutas.service.ts
│   ├── rutas.module.ts
│   └── dto/
├── paradas/                       # Paradas dentro de una ruta
│   ├── paradas.controller.ts
│   ├── paradas.service.ts
│   ├── paradas.module.ts
│   └── dto/
└── viajes/                        # Viajes activos + WebSocket GPS en tiempo real
    ├── viajes.controller.ts
    ├── viajes.service.ts
    ├── viajes.gateway.ts          # WebSocket Gateway
    ├── viajes.module.ts
    └── dto/
```

---

## Endpoints REST

> **Base URL:** `http://localhost:3000`
> Todas las respuestas tienen el formato: `{ "exito": true, "datos": {...}, "mensaje": "..." }`

---

### Usuarios — `/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/usuarios` | Listar todos los usuarios (filtrar con `?role=DRIVER`) |
| `GET` | `/usuarios/:id` | Obtener usuario por ID |
| `PATCH` | `/usuarios/:id` | Actualizar datos del usuario |
| `DELETE` | `/usuarios/:id` | Eliminar usuario (soft delete) |

---

### Líneas de bus — `/lineas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/lineas` | Listar todas las líneas activas |
| `GET` | `/lineas/:id` | Obtener línea por ID |
| `POST` | `/lineas` | Crear nueva línea |
| `PATCH` | `/lineas/:id` | Actualizar línea |
| `DELETE` | `/lineas/:id` | Eliminar línea (soft delete) |

**Body para POST/PATCH:**
```json
{
  "nombre": "Línea 1 - Centro",
  "codigo": "L1",
  "descripcion": "Ruta principal del centro",
  "color": "#00d992",
  "adminId": "uuid-del-usuario-admin"
}
```

---

### Internos (Vehículos) — `/internos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/internos` | Listar internos (filtrar con `?busLineId=uuid`) |
| `GET` | `/internos/:id` | Obtener interno por ID |
| `POST` | `/internos` | Registrar nuevo interno |
| `PATCH` | `/internos/:id` | Actualizar interno |
| `DELETE` | `/internos/:id` | Eliminar interno (soft delete) |

**Body para POST/PATCH:**
```json
{
  "busLineId": "uuid-de-la-linea",
  "number": 5,
  "plateNumber": "ABC-1234",
  "model": "Mercedes Benz O-500",
  "capacity": 45
}
```

---

### Conductores — `/conductores`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/conductores` | Listar conductores (filtrar con `?busLineId=uuid`) |
| `GET` | `/conductores/:id` | Obtener conductor con info del usuario |
| `POST` | `/conductores` | Crear perfil de conductor |
| `PATCH` | `/conductores/:id` | Actualizar conductor |
| `DELETE` | `/conductores/:id` | Eliminar conductor (soft delete) |
| `PATCH` | `/conductores/:id/credencial` | Cambiar estado de credencial |

**Body para credencial:**
```json
{ "estado": "ACTIVE" }
```
Estados válidos: `PENDING`, `ACTIVE`, `REVOKED`

---

### Rutas — `/rutas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/rutas` | Listar rutas (filtrar con `?busLineId=uuid`) |
| `GET` | `/rutas/:id` | Obtener ruta con todas sus paradas |
| `POST` | `/rutas` | Crear ruta |
| `PATCH` | `/rutas/:id` | Actualizar ruta |
| `DELETE` | `/rutas/:id` | Eliminar ruta (soft delete) |

**Body para POST/PATCH:**
```json
{
  "busLineId": "uuid-de-la-linea",
  "nombre": "Ruta Centro - Norte",
  "waypoints": [
    { "lat": -17.7833, "lng": -63.1821 },
    { "lat": -17.7750, "lng": -63.1750 }
  ]
}
```

---

### Paradas — `/paradas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/paradas` | Listar paradas (filtrar con `?routeId=uuid`) |
| `GET` | `/paradas/:id` | Obtener parada por ID |
| `POST` | `/paradas` | Crear parada |
| `PATCH` | `/paradas/:id` | Actualizar parada |
| `DELETE` | `/paradas/:id` | Eliminar parada |

**Body para POST/PATCH:**
```json
{
  "routeId": "uuid-de-la-ruta",
  "nombre": "Av. Cañoto / 1er Anillo",
  "latitud": -17.7833,
  "longitud": -63.1821,
  "orderIndex": 1
}
```

---

### Viajes — `/viajes`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/viajes/activos` | Listar viajes activos con conductor e interno |
| `GET` | `/viajes/:id` | Obtener viaje con últimas 10 ubicaciones |
| `POST` | `/viajes/iniciar` | Iniciar un nuevo viaje |
| `PATCH` | `/viajes/:id/finalizar` | Marcar viaje como completado |
| `PATCH` | `/viajes/:id/cancelar` | Cancelar un viaje activo |

**Body para iniciar:**
```json
{
  "driverId": "uuid-del-conductor",
  "internoId": "uuid-del-interno",
  "routeId": "uuid-de-la-ruta"
}
```

---

## WebSocket — Ubicación en tiempo real

**URL de conexión:** `ws://localhost:3000/viajes`

### Eventos que el cliente envía al servidor

| Evento | Payload | Descripción |
|---|---|---|
| `unirse-viaje` | `{ tripId: "uuid" }` | Suscribirse a las actualizaciones de un viaje |
| `ubicacion-conductor` | Ver abajo | El conductor envía su posición GPS |
| `finalizar-viaje` | `{ tripId: "uuid" }` | El conductor finaliza el viaje |

**Payload de `ubicacion-conductor`:**
```json
{
  "tripId": "uuid-del-viaje",
  "latitud": -17.7833,
  "longitud": -63.1821,
  "heading": 90,
  "speed": 35.5
}
```

### Eventos que el servidor emite al cliente

| Evento | Descripción |
|---|---|
| `ubicacion-actualizada` | Nueva ubicación del conductor (broadcast a todos en el viaje) |
| `viaje-finalizado` | El viaje fue marcado como completado |

### Ejemplo con JavaScript

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/viajes');

// Suscribirse a un viaje
socket.emit('unirse-viaje', { tripId: 'uuid-del-viaje' });

// Escuchar ubicaciones en tiempo real
socket.on('ubicacion-actualizada', (datos) => {
  console.log('Nueva ubicación:', datos);
  // { tripId, latitud, longitud, heading, speed, recordedAt }
});
```

---

## Variables de entorno

Archivo `.env` en la raíz del proyecto:

```env
# Base de datos activa
# SQLite (desarrollo):
DATABASE_URL="file:./dev.db"

# PostgreSQL (producción):
# DATABASE_URL="postgresql://postgres:CONTRASEÑA@localhost:5432/transit_ai_db"

# Puerto del servidor (opcional, por defecto 3000)
# PORT=3001

# JWT (para autenticación, pendiente de implementar)
# JWT_SECRET=tu_secreto_muy_seguro
# JWT_EXPIRES_IN=15m
```

---

## Estado actual

- [x] PrismaService con conexión a SQLite
- [x] CRUD completo: Usuarios, Líneas, Internos, Conductores, Rutas, Paradas
- [x] Viajes: iniciar, finalizar, cancelar, listar activos
- [x] WebSocket Gateway para ubicación GPS en tiempo real
- [x] Validación global de DTOs con class-validator
- [x] Soft delete en todas las entidades
- [x] CORS habilitado para el frontend
- [ ] Autenticación Google OAuth
- [ ] Guards JWT en rutas protegidas
- [ ] Notificaciones push
- [ ] Turnos (Shift) CRUD
- [ ] Audit Log automático
