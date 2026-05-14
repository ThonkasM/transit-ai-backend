import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TransferStatus } from '@prisma/client';

export class DecidirTrasboardoDto {
  @IsEnum(TransferStatus)
  status: TransferStatus;

  @IsString()
  @IsNotEmpty()
  decidedById: string;

  @IsString()
  @IsOptional()
  toTripId?: string;
}
