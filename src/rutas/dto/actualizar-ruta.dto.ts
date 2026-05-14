import { PartialType } from '@nestjs/mapped-types';
import { CrearRutaDto } from './crear-ruta.dto';

/**
 * DTO para actualizar una ruta existente.
 * Todos los campos son opcionales para soportar actualizaciones parciales (PATCH).
 */
export class ActualizarRutaDto extends PartialType(CrearRutaDto) {}
