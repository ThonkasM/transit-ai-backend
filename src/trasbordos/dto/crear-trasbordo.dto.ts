import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CrearTrasboardoDto {
  @IsString()
  @IsNotEmpty()
  fromTripId: string;

  @IsString()
  @IsOptional()
  toTripId?: string;

  @IsString()
  @IsOptional()
  stopId?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
