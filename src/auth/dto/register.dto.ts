import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsISO8601()
  @IsOptional()
  birthDate?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
