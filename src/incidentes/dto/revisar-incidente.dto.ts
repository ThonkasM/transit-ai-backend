import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { IncidentStatus } from '@prisma/client';

export class RevisarIncidenteDto {
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @IsString()
  @IsNotEmpty()
  reviewedById: string;

  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
