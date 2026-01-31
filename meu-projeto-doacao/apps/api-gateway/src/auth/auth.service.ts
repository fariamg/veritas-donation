import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
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
   * @param password - Senha em texto plano
   * @returns Usuário sem a senha
   */
  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<IUser, 'password'>> {
    try {
      // Busca o usuário pelo email no user-service COM passwordHash
      const user = await firstValueFrom<IUser & { passwordHash?: string }>(
        this.userServiceClient
          .send(USER_MESSAGE_PATTERNS.FIND_USER_BY_EMAIL_WITH_PASSWORD, {
            email,
          })
          .pipe(timeout(5000))
      );

      // Valida se usuário existe e tem senha cadastrada
      if (!user || !user.passwordHash) {
        return null;
      }

      // Compara a senha fornecida com o hash armazenado usando bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (isPasswordValid) {
        // Remove campos sensíveis do objeto retornado
        const { passwordHash, ...result } = user;
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
    // Verifica se a conta está bloqueada
    const isLocked = await firstValueFrom<boolean>(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.IS_ACCOUNT_LOCKED, { email })
        .pipe(timeout(5000))
    );

    if (isLocked) {
      throw new UnauthorizedException(
        'Conta temporariamente bloqueada devido a múltiplas tentativas de login falhadas. Tente novamente em 30 minutos.'
      );
    }

    const user = await this.validateUser(email, password);

    if (!user) {
      // Registra tentativa de login falhada
      await firstValueFrom(
        this.userServiceClient
          .send(USER_MESSAGE_PATTERNS.RECORD_FAILED_LOGIN, { email })
          .pipe(timeout(5000))
      ).catch(() => {
        /* Ignora erros ao registrar falha */
      });

      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Reseta contador de tentativas falhadas após login bem-sucedido
    await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.RESET_FAILED_LOGIN_ATTEMPTS, {
          userId: user.id,
        })
        .pipe(timeout(5000))
    ).catch(() => {
      /* Ignora erros ao resetar contador */
    });

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
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
