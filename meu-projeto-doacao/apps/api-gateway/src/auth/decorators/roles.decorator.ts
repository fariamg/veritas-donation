import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para definir roles necessárias para acessar uma rota
 * Uso: @Roles('admin', 'moderator')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
