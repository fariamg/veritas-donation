
import { Logger, ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';import helmet from 'helmet'; // Segurança HTTP headers
import * as compression from 'compression'; // Compressão gzip
import rateLimit from 'express-rate-limit'; // Rate limiting

async function bootstrap() {
  const logger = new Logger('ApiGateway');

  const app = await NestFactory.create(AppModule);

  // Obtém o ConfigService
  const configService = app.get(ConfigService);

  //  Protege contra ataques comuns
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    // Remove header "X-Powered-By: Express"
    hidePoweredBy: true,
  }));

  //  Reduz tamanho das respostas
  app.use(compression());

  // Previne DDoS/brute-force
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 requisições por IP
      message: 'Muitas requisições, tente novamente mais tarde',
      standardHeaders: true, // Header RateLimit-*
      legacyHeaders: false,
    })
  );

  // Configura ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // LIMPA CAMPOS NÃO DEFINIDOS NO DTO
      forbidNonWhitelisted: true, 
      transform: true, // CONVERTE TIPOS AUTOMATICAMENTE (ex: string p/ number)
    })
  );

  // Habilita CORS usando configuração
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
