import * as Joi from 'joi';

/**
 * Schema de validação para variáveis de ambiente do User Service
 * Garante que todas as variáveis necessárias estejam presentes e válidas
 */
export const userServiceConfigValidation = Joi.object({
  // Ambiente
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().uri().default('amqp://admin:admin@localhost:5672'),

  // Database (Prisma)
  DATABASE_URL: Joi.string().required(),

  // Prefetch Count para RabbitMQ (quantas mensagens processar simultaneamente)
  RABBITMQ_PREFETCH_COUNT: Joi.number().default(1),
});
