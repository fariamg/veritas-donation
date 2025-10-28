import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { apiGatewayConfigValidation } from '../config/config.validation';

// Módulo principal do API Gateway
@Module({
  imports: [
    // ConfigModule global com validação
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigService disponível em todos os módulos
      envFilePath: ['.env', '.env.local'], // Carrega variáveis de ambiente
      validationSchema: apiGatewayConfigValidation, // Valida o schema
      validationOptions: {
        allowUnknown: true, // Permite variáveis extras (útil para CI/CD)
        abortEarly: false, // Mostra todos os erros de validação de uma vez
      },
    }),
    AuthModule, // Módulo de autenticação
    UsersModule,
    // CampaignsModule,  // TODO: Adicionar quando criar
    // PaymentsModule,   // TODO: Adicionar quando criar
  ],
})
export class AppModule {}
