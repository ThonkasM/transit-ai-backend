import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

/**
 * Función de arranque de la aplicación NestJS.
 * Configura todos los middlewares globales necesarios antes de iniciar el servidor.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend (cualquier origen en desarrollo)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Habilitar validación global de DTOs con class-validator
  // whitelist: true elimina propiedades no declaradas en el DTO
  // forbidNonWhitelisted: true lanza error si llegan propiedades extra
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Convierte tipos automáticamente (ej: string "123" a number 123)
    }),
  );

  // Configurar el adaptador de Socket.IO para los WebSocket Gateways
  // Necesario para que los Gateways funcionen correctamente con NestJS
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  // Mostrar la URL al iniciar para facilitar el desarrollo
  console.log(`🚍 Transit AI Backend corriendo en: http://localhost:${port}`);
  console.log(`🔌 WebSocket disponible en: ws://localhost:${port}/viajes`);
}

bootstrap();
