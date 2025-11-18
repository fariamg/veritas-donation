import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * Filtro de exceções RPC para microsserviços
 * Converte exceções padrão em RpcException com formato consistente
 */
@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Internal server error';

    // Se já é uma RpcException, apenas repassa
    if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object' && error !== null) {
        return throwError(() => error);
      }
      return throwError(() => ({
        statusCode: status,
        message: error,
      }));
    }

    // Para outros erros, cria um formato consistente
    return throwError(() => ({
      statusCode: status,
      message,
      error: exception.name || 'Error',
    }));
  }
}
