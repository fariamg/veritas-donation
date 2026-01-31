import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { SharedInfraModule } from '../shared-infra/shared-infra.module';

@Module({
  imports: [SharedInfraModule],
  controllers: [AuditController],
})
export class AuditModule {}
