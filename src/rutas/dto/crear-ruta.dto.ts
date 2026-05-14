import { IsString, IsOptional, IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WaypointDto {
  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}

export class CrearRutaDto {
  @IsString()
  @IsNotEmpty()
  busLineId!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  @IsOptional()
  waypoints?: WaypointDto[] = [];
}
