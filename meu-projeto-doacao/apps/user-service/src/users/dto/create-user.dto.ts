import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserStatus, UserReputation } from '../../../generated/prisma';

/**
 * DTO para criação de usuário
 * Usado no endpoint POST /users
 */
export class CreateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsEnum(UserReputation)
  @IsOptional()
  reputation?: UserReputation;
}
