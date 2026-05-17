import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CrearFavoritoDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsNumber()
  fromLat: number;

  @IsNumber()
  fromLng: number;

  @IsString()
  @IsOptional()
  fromLabel?: string;

  @IsNumber()
  toLat: number;

  @IsNumber()
  toLng: number;

  @IsString()
  @IsOptional()
  toLabel?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
