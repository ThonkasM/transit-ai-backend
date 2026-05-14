import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { TerminalType } from '@prisma/client';

export class CrearTerminalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TerminalType)
  type: TerminalType;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  busLineId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
