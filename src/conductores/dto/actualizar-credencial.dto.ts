import { IsEnum } from 'class-validator';
import { CredentialStatus } from '@prisma/client';

export class ActualizarCredencialDto {
  @IsEnum(CredentialStatus, {
    message: `status debe ser uno de: ${Object.values(CredentialStatus).join(', ')}`,
  })
  status!: CredentialStatus;
}
