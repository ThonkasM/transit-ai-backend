import { IsString, IsOptional, IsEnum } from 'class-validator';

/**
 * Enum de roles disponibles en el sistema de transporte.
 * Refleja los roles definidos en el schema de Prisma.
 */
export enum RolUsuario {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
}

/**
 * DTO para actualizar el perfil de un usuario.
 * No permite cambiar email ni credenciales OAuth por seguridad.
 * Solo se pueden actualizar datos de perfil y rol.
 */
export class ActualizarUsuarioDto {
  /** Nombre completo del usuario */
  @IsString()
  @IsOptional()
  name?: string;

  /** Número de teléfono del usuario para contacto */
  @IsString()
  @IsOptional()
  phone?: string;

  /** URL de la foto de perfil del usuario */
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  /** Rol del usuario en el sistema (ADMIN, DRIVER, PASSENGER) */
  @IsEnum(RolUsuario)
  @IsOptional()
  role?: RolUsuario;
}
