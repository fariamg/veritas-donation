import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para criação de usuário
 * Usado no Gateway para validação via ValidationPipe
 * e no Service para tipagem dos dados recebidos
 */
export class CreateUserDto {
  @IsOptional()
  @IsString({ message: 'Username deve ser uma string' })
  @MinLength(3, { message: 'Username deve ter no mínimo 3 caracteres' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password deve ser uma string' })
  @MinLength(6, { message: 'Password deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(
    ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BLOCKED'],
    {
      message: 'Status inválido',
    }
  )
  status?:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED'
    | 'PENDING_VERIFICATION'
    | 'BLOCKED';

  @IsOptional()
  @IsEnum(['TRUSTED', 'GOOD', 'NEUTRAL', 'WARNING', 'DANGEROUS'], {
    message: 'Reputation inválida',
  })
  reputation?: 'TRUSTED' | 'GOOD' | 'NEUTRAL' | 'WARNING' | 'DANGEROUS';

  @IsOptional()
  isAdmin?: boolean;

  @IsOptional()
  isModerator?: boolean;
}

/**
 * DTO para atualização de usuário
 * Todos os campos são opcionais (partial update)
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username deve ser uma string' })
  @MinLength(3, { message: 'Username deve ter no mínimo 3 caracteres' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password deve ser uma string' })
  @MinLength(6, { message: 'Password deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(
    ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BLOCKED'],
    {
      message: 'Status inválido',
    }
  )
  status?:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED'
    | 'PENDING_VERIFICATION'
    | 'BLOCKED';

  @IsOptional()
  @IsEnum(['TRUSTED', 'GOOD', 'NEUTRAL', 'WARNING', 'DANGEROUS'], {
    message: 'Reputation inválida',
  })
  reputation?: 'TRUSTED' | 'GOOD' | 'NEUTRAL' | 'WARNING' | 'DANGEROUS';
}

/**
 * DTO para query params de listagem de usuários
 * Valida paginação (page e limit)
 */
export class FindAllUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page deve ser um número inteiro' })
  @Min(1, { message: 'Page deve ser no mínimo 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit deve ser um número inteiro' })
  @Min(1, { message: 'Limit deve ser no mínimo 1' })
  @Max(100, { message: 'Limit deve ser no máximo 100' })
  limit?: number = 10;
}
