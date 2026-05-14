import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO para registrar un nuevo conductor en el sistema.
 * Vincula a un usuario existente con una línea de transporte.
 */
export class CrearConductorDto {
  /** ID del usuario (de la tabla User) que será el conductor */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /** ID de la línea de transporte a la que está asignado el conductor */
  @IsString()
  @IsNotEmpty()
  busLineId: string;

  /** ID del interno (vehículo) asignado al conductor (opcional, se puede asignar después) */
  @IsString()
  @IsOptional()
  internoId?: string;

  /** Número de licencia de conducir del conductor */
  @IsString()
  @IsOptional()
  licenseNumber?: string;
}
