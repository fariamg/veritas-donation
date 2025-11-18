import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * SharedInfraModule - Centraliza a configuração de clientes de microsserviços
 * Este módulo pode ser importado por qualquer feature module que precise
 * se comunicar com outros microsserviços via RabbitMQ
 */
@Module({})
export class SharedInfraModule {
  /**
   * Registra o cliente do User Service
   * Uso: SharedInfraModule.registerUserServiceClient()
   */
  static registerUserServiceClient(): DynamicModule {
    return {
      module: SharedInfraModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'USER_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  configService.get<string>(
                    'RABBITMQ_URL',
                    'amqp://admin:admin@localhost:5672'
                  ),
                ],
                queue: 'user_service_queue',
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  /**
   * Registra o cliente do Campaign Service (para uso futuro)
   * Uso: SharedInfraModule.registerCampaignServiceClient()
   */
  static registerCampaignServiceClient(): DynamicModule {
    return {
      module: SharedInfraModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'CAMPAIGN_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  configService.get<string>(
                    'RABBITMQ_URL',
                    'amqp://admin:admin@localhost:5672'
                  ),
                ],
                queue: 'campaign_service_queue',
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  /**
   * Registra o cliente do Payment Service (para uso futuro)
   * Uso: SharedInfraModule.registerPaymentServiceClient()
   */
  static registerPaymentServiceClient(): DynamicModule {
    return {
      module: SharedInfraModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'PAYMENT_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  configService.get<string>(
                    'RABBITMQ_URL',
                    'amqp://admin:admin@localhost:5672'
                  ),
                ],
                queue: 'payment_service_queue',
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  /**
   * Registra múltiplos clientes de uma vez
   * Uso: SharedInfraModule.registerMultipleClients(['USER_SERVICE', 'CAMPAIGN_SERVICE'])
   */
  static registerMultipleClients(
    services: Array<'USER_SERVICE' | 'CAMPAIGN_SERVICE' | 'PAYMENT_SERVICE'>
  ): DynamicModule {
    const serviceQueueMap = {
      USER_SERVICE: 'user_service_queue',
      CAMPAIGN_SERVICE: 'campaign_service_queue',
      PAYMENT_SERVICE: 'payment_service_queue',
    };

    return {
      module: SharedInfraModule,
      imports: [
        ClientsModule.registerAsync(
          services.map((serviceName) => ({
            name: serviceName,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  configService.get<string>(
                    'RABBITMQ_URL',
                    'amqp://admin:admin@localhost:5672'
                  ),
                ],
                queue: serviceQueueMap[serviceName],
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          }))
        ),
      ],
      exports: [ClientsModule],
    };
  }
}
