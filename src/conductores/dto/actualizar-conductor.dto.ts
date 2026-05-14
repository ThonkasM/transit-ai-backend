import { PartialType } from '@nestjs/mapped-types';
import { CrearConductorDto } from './crear-conductor.dto';

/**
 * DTO para actualizar un conductor existente.
 * Todos los campos son opcionales para soportar actualizaciones parciales (PATCH).
 */
export class ActualizarConductorDto extends PartialType(CrearConductorDto) {}
