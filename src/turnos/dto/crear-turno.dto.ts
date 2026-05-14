import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CrearTurnoDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsString()
  @IsNotEmpty()
  internoId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsArray()
  daysOfWeek: number[];

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
