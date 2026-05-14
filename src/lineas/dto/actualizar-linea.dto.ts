import { PartialType } from '@nestjs/mapped-types';
import { CrearLineaDto } from './crear-linea.dto';

/**
 * DTO para actualizar una línea existente.
 * Extiende CrearLineaDto con todos los campos opcionales,
 * permitiendo actualizar solo los campos necesarios (PATCH semántico).
 */
export class ActualizarLineaDto extends PartialType(CrearLineaDto) {}
