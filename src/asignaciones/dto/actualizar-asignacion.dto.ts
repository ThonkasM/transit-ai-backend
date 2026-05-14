import { PartialType } from '@nestjs/mapped-types';
import { CrearAsignacionDto } from './crear-asignacion.dto';

export class ActualizarAsignacionDto extends PartialType(CrearAsignacionDto) {}
