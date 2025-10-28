import { Module } from '@nestjs/common';
// Module: Decorator para definir módulo NestJS
// Agrupa controllers, providers e exports relacionados

import { JwtModule } from '@nestjs/jwt';
// JwtModule: Módulo do NestJS para trabalhar com JSON Web Tokens
// Fornece JwtService para:
//   - sign(): Gerar tokens
//   - verify(): Validar tokens
//   - decode(): Decodificar tokens

import { PassportModule } from '@nestjs/passport';
// PassportModule: Integração do Passport.js com NestJS
// Passport: Biblioteca de autenticação Node.js mais popular
// Suporta múltiplas estratégias (JWT, OAuth, Local, etc)

import { ConfigModule, ConfigService } from '@nestjs/config';
// ConfigModule: Gerencia variáveis de ambiente
// ConfigService: Lê valores do .env de forma tipada

import { AuthService } from './auth.service';
// AuthService: Service com lógica de autenticação
//   - login()
//   - validateUser()
//   - generateToken()

import { AuthController } from './auth.controller';
// AuthController: Controller com endpoints HTTP
//   - POST /api/auth/login
//   - POST /api/auth/register (futuro)

import { JwtStrategy } from './strategies/jwt.strategy';
// JwtStrategy: Estratégia Passport para validar JWT
// Implementa como extrair e validar tokens de requests

import { SharedInfraModule } from '../shared-infra/shared-infra.module';
// SharedInfraModule: Módulo compartilhado
// Fornece ClientProxy para comunicação com User Service via RabbitMQ

/**
 * AuthModule - Módulo de Autenticação
 * Centraliza toda a lógica de autenticação e autorização do API Gateway
 * Usa JWT para tokens stateless
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ // acessa de forma assíncrona as variáveis de ambiente
      imports: [ConfigModule], // importa ConfigModule para usar ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // chave secreta do JWT p assinar tokens
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d', // tempo de expiração do token
        },
      }),
      inject: [ConfigService],
    }),
    SharedInfraModule.registerUserServiceClient(), // registra cliente RabbitMQ para User Service
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
