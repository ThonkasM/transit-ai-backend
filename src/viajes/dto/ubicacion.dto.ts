import { IsString, IsNumber, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';

export class UbicacionDto {
  @IsString()
  @IsNotEmpty()
  tripId!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitud!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitud!: number;

  /** Rumbo en grados (0-360°), 0 = Norte */
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  heading?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  speed?: number;
}
