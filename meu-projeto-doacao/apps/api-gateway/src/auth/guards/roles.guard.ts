import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard - Guard para verificar roles do usuário
 * Uso: @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin', 'moderator')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Busca as roles necessárias dos metadados da rota
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não há roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtém o usuário do request (já validado pelo JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Verifica se o usuário tem alguma das roles necessárias
    return requiredRoles.some((role) => {
      if (role === 'admin') return user.isAdmin;
      if (role === 'moderator') return user.isModerator;
      return user.roles?.includes(role);
    });
  }
}
