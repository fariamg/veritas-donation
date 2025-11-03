import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO para requisição de login
 */
export class LoginRequestDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}

/**
 * DTO para dados públicos do usuário
 */
export class UserDto {
  id: string;
  email: string;
  username: string;
  name: string;
}

/**
 * DTO para resposta de login
 */
export class LoginResponseDto {
  access_token: string;
  user: UserDto;
}
