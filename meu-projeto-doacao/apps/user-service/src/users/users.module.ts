import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { AuditLogService } from '../audit/audit-log.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuditLogService],
  exports: [UsersService], // Exporta para ser usado em outros módulos (ex: AuthModule)
})
export class UsersModule {}
