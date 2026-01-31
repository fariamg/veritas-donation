import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditController } from './audit.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuditController],
  providers: [AuditLogService, PrismaService],
  exports: [AuditLogService],
})
export class AuditModule {}
