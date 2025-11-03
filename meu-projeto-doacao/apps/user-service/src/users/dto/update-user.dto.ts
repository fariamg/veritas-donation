import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserStatus } from '../../../generated/prisma';

/**
 * DTO para atualização de usuário
 * Usado no endpoint PATCH /users/:id
 * Todos os campos são opcionais
 */
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
