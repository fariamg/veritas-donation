import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { userServiceConfigValidation } from '../config/config.validation';

/**
 * Root module do User Service
 * Importa ConfigModule globalmente e UsersModule necessário para o microserviço
 */
@Module({
  imports: [
    // ConfigModule global com validação
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: userServiceConfigValidation,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}
