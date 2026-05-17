import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class ActualizarUsuarioDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
