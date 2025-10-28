
import { Logger, ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('ApiGateway');

  const app = await NestFactory.create(AppModule);

  // Obtém o ConfigService
  const configService = app.get(ConfigService);

  // Configura ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // LIMPA CAMPOS NÃO DEFINIDOS NO DTO
      //forbidNonWhitelisted: true, 
      transform: true, // CONVERTE TIPOS AUTOMATICAMENTE (ex: string p/ number)
    })
  );

  // Habilita CORS usando configuração
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  await app.listen(port);

  logger.log(`🚀 Environment: ${nodeEnv}`);
  logger.log(
    `🚀 API Gateway is running on: http://localhost:${port}/${globalPrefix}`
  );
  logger.log(`📡 Connected to microservices via RabbitMQ`);
}

bootstrap();
