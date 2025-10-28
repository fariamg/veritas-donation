import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { USER_MESSAGE_PATTERNS, IUser } from '@shared';
import { LoginResponseDto } from './dto/login.dto';

/**
 * AuthService - Serviço de Autenticação
 * Gerencia login, validação de credenciais e geração de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Valida as credenciais do usuário
   * @param email - Email do usuário
   * @param password - Senha (em produção, deve ser hasheada)
   * @returns Usuário sem a senha
   */
  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<IUser, 'password'>> { //TODO: acho que n precisa desse omit
    try {
      // Busca o usuário pelo email no user-service
      const user = await firstValueFrom<IUser>(
        this.userServiceClient
          .send(USER_MESSAGE_PATTERNS.FIND_USER_BY_EMAIL, { email })
          .pipe(timeout(5000))
      );

      // TODO: Em produção, comparar hash da senha com bcrypt
      // Para desenvolvimento, comparação simples (NÃO USE EM PRODUÇÃO!)
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Realiza o login e gera um token JWT
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Token de acesso e informações do usuário
   */
  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    };
  }

  /**
   * Valida um token JWT
   * @param token - Token JWT
   * @returns Payload do token se válido
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
