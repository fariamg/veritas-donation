import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Enum para ações de auditoria
 */
export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_HARD_DELETED = 'USER_HARD_DELETED',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  USER_ACCOUNT_LOCKED = 'USER_ACCOUNT_LOCKED',
  USER_ACCOUNT_UNLOCKED = 'USER_ACCOUNT_UNLOCKED',
  USER_PASSWORD_CHANGED = 'USER_PASSWORD_CHANGED',
  USER_EMAIL_CHANGED = 'USER_EMAIL_CHANGED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
}

/**
 * Interface para dados de auditoria
 */
export interface AuditLogData {
  userId?: string; // ID do usuário que executou a ação (pode ser null para ações do sistema)
  action: AuditAction;
  entity: string; // Ex: 'User', 'UserProfile', 'UserWallet'
  entityId?: string; // ID da entidade afetada
  description: string;
  metadata?: Record<string, any>; // Dados adicionais (ex: campos alterados, valores antigos/novos)
  ipAddress?: string;
}

/**
 * AuditLogService - Serviço de Auditoria
 * Registra todas as ações importantes no sistema para rastreabilidade e compliance
 */
@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um registro de auditoria
   * @param data Dados da auditoria
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userID: data.userId,
          action: data.action,
          entity: data.entity,
          description: data.description,
          metadata: data.metadata || null,
          ipAddress: data.ipAddress,
        },
      });
    } catch (error) {
      // Em caso de erro, não queremos interromper o fluxo principal
      // Apenas logamos o erro (em produção, enviar para serviço de logs)
      console.error('Erro ao criar log de auditoria:', error);
    }
  }

  /**
   * Registra criação de usuário
   */
  async logUserCreated(
    userId: string,
    createdBy?: string,
    metadata?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: createdBy,
      action: AuditAction.USER_CREATED,
      entity: 'User',
      entityId: userId,
      description: `Usuário ${userId} foi criado`,
      metadata: {
        ...metadata,
        targetUserId: userId,
      },
      ipAddress,
    });
  }

  /**
   * Registra atualização de usuário
   */
  async logUserUpdated(
    userId: string,
    updatedBy: string,
    changedFields: string[],
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: updatedBy,
      action: AuditAction.USER_UPDATED,
      entity: 'User',
      entityId: userId,
      description: `Usuário ${userId} foi atualizado. Campos alterados: ${changedFields.join(
        ', '
      )}`,
      metadata: {
        targetUserId: userId,
        changedFields,
        oldValues,
        newValues,
      },
      ipAddress,
    });
  }

  /**
   * Registra soft delete de usuário
   */
  async logUserDeleted(
    userId: string,
    deletedBy: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: deletedBy,
      action: AuditAction.USER_DELETED,
      entity: 'User',
      entityId: userId,
      description: `Usuário ${userId} foi desativado (soft delete)`,
      metadata: {
        targetUserId: userId,
        deleteType: 'soft',
      },
      ipAddress,
    });
  }

  /**
   * Registra hard delete de usuário
   */
  async logUserHardDeleted(
    userId: string,
    deletedBy: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: deletedBy,
      action: AuditAction.USER_HARD_DELETED,
      entity: 'User',
      entityId: userId,
      description: `Usuário ${userId} foi permanentemente removido do sistema`,
      metadata: {
        targetUserId: userId,
        deleteType: 'hard',
        warning: 'Ação irreversível',
      },
      ipAddress,
    });
  }

  /**
   * Registra login bem-sucedido
   */
  async logLoginSuccess(
    userId: string,
    email: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: AuditAction.USER_LOGIN_SUCCESS,
      entity: 'User',
      entityId: userId,
      description: `Login bem-sucedido para ${email}`,
      metadata: {
        email,
        timestamp: new Date().toISOString(),
      },
      ipAddress,
    });
  }

  /**
   * Registra tentativa de login falhada
   */
  async logLoginFailed(
    email: string,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_LOGIN_FAILED,
      entity: 'User',
      description: `Tentativa de login falhada para ${email}. Motivo: ${reason}`,
      metadata: {
        email,
        reason,
        timestamp: new Date().toISOString(),
      },
      ipAddress,
    });
  }

  /**
   * Registra bloqueio de conta
   */
  async logAccountLocked(
    userId: string,
    email: string,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: AuditAction.USER_ACCOUNT_LOCKED,
      entity: 'User',
      entityId: userId,
      description: `Conta ${email} foi bloqueada. Motivo: ${reason}`,
      metadata: {
        email,
        reason,
        lockDuration: '30 minutos',
      },
      ipAddress,
    });
  }

  /**
   * Registra desbloqueio de conta
   */
  async logAccountUnlocked(
    userId: string,
    email: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: AuditAction.USER_ACCOUNT_UNLOCKED,
      entity: 'User',
      entityId: userId,
      description: `Conta ${email} foi desbloqueada`,
      metadata: {
        email,
      },
      ipAddress,
    });
  }

  /**
   * Registra mudança de senha
   */
  async logPasswordChanged(
    userId: string,
    changedBy: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: changedBy,
      action: AuditAction.USER_PASSWORD_CHANGED,
      entity: 'User',
      entityId: userId,
      description: `Senha do usuário ${userId} foi alterada`,
      metadata: {
        targetUserId: userId,
        isSelfChange: userId === changedBy,
      },
      ipAddress,
    });
  }

  /**
   * Registra mudança de email
   */
  async logEmailChanged(
    userId: string,
    oldEmail: string,
    newEmail: string,
    changedBy: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: changedBy,
      action: AuditAction.USER_EMAIL_CHANGED,
      entity: 'User',
      entityId: userId,
      description: `Email do usuário ${userId} foi alterado de ${oldEmail} para ${newEmail}`,
      metadata: {
        targetUserId: userId,
        oldEmail,
        newEmail,
      },
      ipAddress,
    });
  }

  /**
   * Registra mudança de roles
   */
  async logRoleChanged(
    userId: string,
    oldRoles: string[],
    newRoles: string[],
    changedBy: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: changedBy,
      action: AuditAction.USER_ROLE_CHANGED,
      entity: 'User',
      entityId: userId,
      description: `Roles do usuário ${userId} foram alteradas`,
      metadata: {
        targetUserId: userId,
        oldRoles,
        newRoles,
        added: newRoles.filter((r) => !oldRoles.includes(r)),
        removed: oldRoles.filter((r) => !newRoles.includes(r)),
      },
      ipAddress,
    });
  }

  /**
   * Busca logs de auditoria por usuário
   */
  async getLogsByUser(userId: string, limit: number = 100) {
    return this.prisma.auditLog.findMany({
      where: {
        OR: [
          { userID: userId }, // Ações executadas pelo usuário
          {
            metadata: {
              path: ['targetUserId'],
              equals: userId,
            },
          }, // Ações sobre o usuário
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Busca logs de auditoria por ação
   */
  async getLogsByAction(action: AuditAction, limit: number = 100) {
    return this.prisma.auditLog.findMany({
      where: {
        action,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Busca logs de auditoria por período
   */
  async getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
