import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CrearInternoDto {
  @IsString()
  @IsNotEmpty()
  busLineId!: string;

  @IsNumber()
  @Min(1)
  number!: number;

  @IsString()
  @IsOptional()
  plateNumber?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
