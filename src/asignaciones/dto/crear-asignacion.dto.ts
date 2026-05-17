import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CrearAsignacionDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  internoId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsString()
  @IsOptional()
  assignedById?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
