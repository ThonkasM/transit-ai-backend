import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para iniciar un nuevo viaje en el sistema.
 * Vincula un conductor con su vehículo y la ruta que va a recorrer.
 */
export class IniciarViajeDto {
  /** ID del conductor que realizará el viaje */
  @IsString()
  @IsNotEmpty()
  driverId: string;

  /** ID del interno (vehículo) que se usará en el viaje */
  @IsString()
  @IsNotEmpty()
  internoId: string;

  /** ID de la ruta que seguirá el conductor en este viaje */
  @IsString()
  @IsNotEmpty()
  routeId: string;
}
