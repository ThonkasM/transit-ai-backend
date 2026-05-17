import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { IncidentType } from '@prisma/client';

export class CrearIncidenteDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsString()
  @IsOptional()
  tripId?: string;

  @IsEnum(IncidentType)
  type: IncidentType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  requestStopTracking?: boolean;
}
