import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { JourneyCriteria } from '@prisma/client';

export class ActualizarPreferenciaDto {
  @IsEnum(JourneyCriteria)
  @IsOptional()
  preferredCriteria?: JourneyCriteria;

  @IsNumber()
  @IsOptional()
  maxWalkMeters?: number;

  @IsNumber()
  @IsOptional()
  maxTransfers?: number;

  @IsOptional()
  learnedPatterns?: any;
}
