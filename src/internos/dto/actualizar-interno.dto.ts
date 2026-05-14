import { PartialType } from '@nestjs/mapped-types';
import { CrearInternoDto } from './crear-interno.dto';

/**
 * DTO para actualizar un interno existente.
 * Todos los campos son opcionales para soportar actualizaciones parciales (PATCH).
 */
export class ActualizarInternoDto extends PartialType(CrearInternoDto) {}
