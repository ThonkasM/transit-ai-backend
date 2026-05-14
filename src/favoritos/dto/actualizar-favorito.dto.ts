import { PartialType } from '@nestjs/mapped-types';
import { CrearFavoritoDto } from './crear-favorito.dto';

export class ActualizarFavoritoDto extends PartialType(CrearFavoritoDto) {}
