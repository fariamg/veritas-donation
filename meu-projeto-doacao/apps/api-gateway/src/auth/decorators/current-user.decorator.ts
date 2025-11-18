import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator customizado para obter o usuário autenticado
 * Uso: @CurrentUser() user: any
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
