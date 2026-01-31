import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JwtStrategy - Estratégia de autenticação JWT
 * Valida e decodifica tokens JWT em requisições protegidas
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Método chamado após validação do token
   * O payload decodificado é anexado ao request.user
   */
  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      isAdmin: payload.isAdmin || false,
      isModerator: payload.isModerator || false,
      roles: payload.roles || [],
    };
  }
}
