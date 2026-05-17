import { IsNumber, IsString, IsOptional, IsBoolean, Min } from 'class-validator';

export class ActualizarTarifaDto {
  @IsString()
  @IsOptional()
  routeId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  passengerType?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
