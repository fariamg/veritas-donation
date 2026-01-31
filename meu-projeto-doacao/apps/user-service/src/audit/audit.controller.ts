import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuditLogService, AuditAction } from './audit-log.service';

/**
 * Padrões de mensagem para auditoria
 */
export const AUDIT_MESSAGE_PATTERNS = {
  GET_LOGS_BY_USER: { cmd: 'get_audit_logs_by_user' },
  GET_LOGS_BY_ACTION: { cmd: 'get_audit_logs_by_action' },
  GET_LOGS_BY_DATE_RANGE: { cmd: 'get_audit_logs_by_date_range' },
} as const;

/**
 * Audit Controller - Microserviço
 * Responde a Message Patterns via RabbitMQ para consultas de auditoria
 */
@Controller()
export class AuditController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Pattern: get_audit_logs_by_user
   * Retorna logs de auditoria de um usuário específico
   */
  @MessagePattern(AUDIT_MESSAGE_PATTERNS.GET_LOGS_BY_USER)
  async getLogsByUser(
    @Payload() data: { userId: string; limit?: number }
  ): Promise<any[]> {
    return this.auditLogService.getLogsByUser(data.userId, data.limit);
  }

  /**
   * Pattern: get_audit_logs_by_action
   * Retorna logs de auditoria por ação específica
   */
  @MessagePattern(AUDIT_MESSAGE_PATTERNS.GET_LOGS_BY_ACTION)
  async getLogsByAction(
    @Payload() data: { action: AuditAction; limit?: number }
  ): Promise<any[]> {
    return this.auditLogService.getLogsByAction(data.action, data.limit);
  }

  /**
   * Pattern: get_audit_logs_by_date_range
   * Retorna logs de auditoria por período
   */
  @MessagePattern(AUDIT_MESSAGE_PATTERNS.GET_LOGS_BY_DATE_RANGE)
  async getLogsByDateRange(
    @Payload() data: { startDate: Date; endDate: Date; limit?: number }
  ): Promise<any[]> {
    return this.auditLogService.getLogsByDateRange(
      new Date(data.startDate),
      new Date(data.endDate),
      data.limit
    );
  }
}
