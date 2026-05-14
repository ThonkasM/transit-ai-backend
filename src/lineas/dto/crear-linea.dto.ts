import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CrearLineaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  /** Color en formato hexadecimal (ej: "#00d992") */
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color debe ser un hex válido (#RRGGBB)' })
  @IsOptional()
  color?: string = '#00d992';

  @IsString()
  @IsNotEmpty()
  adminId!: string;
}
