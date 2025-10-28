import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SharedInfraModule } from '../shared-infra/shared-infra.module';

/**
 * Users Module - API Gateway
 * Usa SharedInfraModule para configuração centralizada do cliente RabbitMQ (pq tipo se mudar a URL n precisa mudar em todos os modules)
 */
@Module({
  imports: [SharedInfraModule.registerUserServiceClient()],
  controllers: [UsersController],
})
export class UsersModule {}
