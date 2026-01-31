import {
  Controller,
  Get,
  Query,
  Param,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RpcToHttpExceptionInterceptor } from '../interceptors/rpc-to-http-exception.interceptor';

/**
 * Interface para query params de busca de logs
 */
interface AuditLogsQueryDto {
  limit?: number;
}

interface AuditLogsByDateQueryDto {
  startDate: string;
  endDate: string;
  limit?: number;
}

/**
 * Audit Controller - API Gateway
 * Expõe endpoints HTTP para consulta de logs de auditoria
 * APENAS para administradores
 */
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(RpcToHttpExceptionInterceptor)
export class AuditController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
  ) {}

  /**
   * GET /api/audit/users/:userId
   * Retorna logs de auditoria de um usuário específico
   * Inclui ações executadas pelo usuário e ações sobre o usuário
   */
  @Get('users/:userId')
  async getLogsByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;

    return await firstValueFrom(
      this.userServiceClient
        .send({ cmd: 'get_audit_logs_by_user' }, { userId, limit: parsedLimit })
        .pipe(timeout(10000))
    );
  }

  /**
   * GET /api/audit/actions/:action
   * Retorna logs de auditoria por ação específica
   * Ações disponíveis: USER_CREATED, USER_UPDATED, USER_DELETED, etc.
   */
  @Get('actions/:action')
  async getLogsByAction(
    @Param('action') action: string,
    @Query('limit') limit?: string
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;

    return await firstValueFrom(
      this.userServiceClient
        .send(
          { cmd: 'get_audit_logs_by_action' },
          { action, limit: parsedLimit }
        )
        .pipe(timeout(10000))
    );
  }

  /**
   * GET /api/audit/date-range
   * Retorna logs de auditoria por período
   * Query params: startDate (ISO string), endDate (ISO string), limit (opcional)
   */
  @Get('date-range')
  async getLogsByDateRange(@Query() query: AuditLogsByDateQueryDto) {
    const { startDate, endDate, limit = 100 } = query;

    if (!startDate || !endDate) {
      throw new Error('startDate e endDate são obrigatórios');
    }

    return await firstValueFrom(
      this.userServiceClient
        .send(
          { cmd: 'get_audit_logs_by_date_range' },
          {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            limit,
          }
        )
        .pipe(timeout(10000))
    );
  }

  /**
   * GET /api/audit/recent
   * Retorna os logs mais recentes (últimas 24 horas)
   * Útil para monitoramento em tempo real
   */
  @Get('recent')
  async getRecentLogs(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return await firstValueFrom(
      this.userServiceClient
        .send(
          { cmd: 'get_audit_logs_by_date_range' },
          {
            startDate: yesterday,
            endDate: now,
            limit: parsedLimit,
          }
        )
        .pipe(timeout(10000))
    );
  }

  /**
   * GET /api/audit/login-attempts
   * Retorna tentativas de login (sucesso e falha)
   * Útil para análise de segurança
   */
  @Get('login-attempts')
  async getLoginAttempts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;

    // Busca tanto sucessos quanto falhas
    const [successLogs, failedLogs] = await Promise.all([
      firstValueFrom(
        this.userServiceClient
          .send(
            { cmd: 'get_audit_logs_by_action' },
            { action: 'USER_LOGIN_SUCCESS', limit: parsedLimit / 2 }
          )
          .pipe(timeout(10000))
      ),
      firstValueFrom(
        this.userServiceClient
          .send(
            { cmd: 'get_audit_logs_by_action' },
            { action: 'USER_LOGIN_FAILED', limit: parsedLimit / 2 }
          )
          .pipe(timeout(10000))
      ),
    ]);

    // Combina e ordena por data (mais recente primeiro)
    const combined = [...successLogs, ...failedLogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return combined.slice(0, parsedLimit);
  }

  /**
   * GET /api/audit/security-events
   * Retorna eventos de segurança críticos
   * (bloqueios, desbloqueios, hard deletes, mudanças de senha)
   */
  @Get('security-events')
  async getSecurityEvents(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;

    const securityActions = [
      'USER_ACCOUNT_LOCKED',
      'USER_ACCOUNT_UNLOCKED',
      'USER_HARD_DELETED',
      'USER_PASSWORD_CHANGED',
      'USER_EMAIL_CHANGED',
      'USER_ROLE_CHANGED',
    ];

    // Busca logs de todas as ações de segurança em paralelo
    const logsPromises = securityActions.map((action) =>
      firstValueFrom(
        this.userServiceClient
          .send(
            { cmd: 'get_audit_logs_by_action' },
            { action, limit: Math.ceil(parsedLimit / securityActions.length) }
          )
          .pipe(timeout(10000))
      ).catch(() => [])
    );

    const allLogs = await Promise.all(logsPromises);

    // Combina e ordena por data
    const combined = allLogs
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return combined.slice(0, parsedLimit);
  }

  /**
   * GET /api/audit/stats
   * Retorna estatísticas de auditoria
   * Útil para dashboards administrativos
   */
  @Get('stats')
  async getAuditStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Busca logs das últimas 24h e 7 dias
    const [logs24h, logs7d] = await Promise.all([
      firstValueFrom(
        this.userServiceClient
          .send(
            { cmd: 'get_audit_logs_by_date_range' },
            { startDate: last24h, endDate: now, limit: 1000 }
          )
          .pipe(timeout(10000))
      ),
      firstValueFrom(
        this.userServiceClient
          .send(
            { cmd: 'get_audit_logs_by_date_range' },
            { startDate: last7d, endDate: now, limit: 5000 }
          )
          .pipe(timeout(10000))
      ),
    ]);

    // Calcula estatísticas
    const stats = {
      last24Hours: {
        total: logs24h.length,
        userCreated: logs24h.filter((l) => l.action === 'USER_CREATED').length,
        userUpdated: logs24h.filter((l) => l.action === 'USER_UPDATED').length,
        userDeleted: logs24h.filter((l) => l.action === 'USER_DELETED').length,
        loginSuccess: logs24h.filter((l) => l.action === 'USER_LOGIN_SUCCESS')
          .length,
        loginFailed: logs24h.filter((l) => l.action === 'USER_LOGIN_FAILED')
          .length,
        accountLocked: logs24h.filter((l) => l.action === 'USER_ACCOUNT_LOCKED')
          .length,
      },
      last7Days: {
        total: logs7d.length,
        userCreated: logs7d.filter((l) => l.action === 'USER_CREATED').length,
        userUpdated: logs7d.filter((l) => l.action === 'USER_UPDATED').length,
        userDeleted: logs7d.filter((l) => l.action === 'USER_DELETED').length,
        loginSuccess: logs7d.filter((l) => l.action === 'USER_LOGIN_SUCCESS')
          .length,
        loginFailed: logs7d.filter((l) => l.action === 'USER_LOGIN_FAILED')
          .length,
        accountLocked: logs7d.filter((l) => l.action === 'USER_ACCOUNT_LOCKED')
          .length,
      },
      topUsers: this.getTopUsers(logs7d, 10),
      suspiciousActivity: this.detectSuspiciousActivity(logs24h),
    };

    return stats;
  }

  /**
   * Método auxiliar para identificar usuários mais ativos
   */
  private getTopUsers(logs: any[], limit: number) {
    const userCounts = logs.reduce((acc, log) => {
      const userId = log.userID || log.metadata?.targetUserId;
      if (userId) {
        acc[userId] = (acc[userId] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(userCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([userId, count]) => ({ userId, actionsCount: count }));
  }

  /**
   * Método auxiliar para detectar atividades suspeitas
   */
  private detectSuspiciousActivity(logs: any[]) {
    const suspicious = [];

    // Múltiplas tentativas de login falhadas do mesmo email
    const failedLogins = logs.filter((l) => l.action === 'USER_LOGIN_FAILED');
    const emailCounts = failedLogins.reduce((acc, log) => {
      const email = log.metadata?.email;
      if (email) {
        acc[email] = (acc[email] || 0) + 1;
      }
      return acc;
    }, {});

    Object.entries(emailCounts).forEach(([email, count]) => {
      if ((count as number) >= 3) {
        suspicious.push({
          type: 'MULTIPLE_FAILED_LOGINS',
          email,
          count,
          severity: 'HIGH',
        });
      }
    });

    // Múltiplos hard deletes em curto período
    const hardDeletes = logs.filter((l) => l.action === 'USER_HARD_DELETED');
    if (hardDeletes.length >= 5) {
      suspicious.push({
        type: 'MULTIPLE_HARD_DELETES',
        count: hardDeletes.length,
        severity: 'CRITICAL',
      });
    }

    // Múltiplas contas bloqueadas
    const accountLocks = logs.filter((l) => l.action === 'USER_ACCOUNT_LOCKED');
    if (accountLocks.length >= 3) {
      suspicious.push({
        type: 'MULTIPLE_ACCOUNT_LOCKS',
        count: accountLocks.length,
        severity: 'MEDIUM',
      });
    }

    return suspicious;
  }
}
