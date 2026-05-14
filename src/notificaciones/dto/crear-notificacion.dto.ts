import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { NotificationType, Role } from '@prisma/client';

export class CrearNotificacionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  data?: any;

  @IsEnum(Role)
  @IsOptional()
  targetRole?: Role;

  @IsString()
  @IsOptional()
  targetUserId?: string;

  @IsString()
  @IsOptional()
  createdById?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;
}
