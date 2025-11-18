
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('UserService');

  // Cria o microserviço com transporte RabbitMQ
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'user_service_queue',
        queueOptions: {
          durable: true, // A fila persiste após restart do RabbitMQ
        },
        // Prefetch: quantas mensagens o worker processa simultaneamente
        prefetchCount: Number(process.env.RABBITMQ_PREFETCH_COUNT) || 1,
      },
    }
  );

  // Obtém o ConfigService para logging
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Configura ValidationPipe global para validar DTOs automaticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Lança erro se receber propriedades extras
      transform: true, // Transforma os payloads em instâncias dos DTOs
    })
  );

  await app.listen();
  logger.log(`🚀 Environment: ${nodeEnv}`);
  logger.log(
    '🚀 User Service microservice is listening on RabbitMQ queue: user_service_queue'
  );
}

bootstrap();
