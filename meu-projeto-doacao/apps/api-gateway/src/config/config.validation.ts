import * as Joi from 'joi';

/**
 * Schema de validação para variáveis de ambiente do API Gateway
 * Garante que todas as variáveis necessárias estejam presentes e válidas
 */
export const apiGatewayConfigValidation = Joi.object({
  // Ambiente
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Porta do API Gateway
  PORT: Joi.number().default(3000),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().uri().default('amqp://admin:admin@localhost:5672'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // CORS
  CORS_ORIGIN: Joi.string().default('*'),
});
