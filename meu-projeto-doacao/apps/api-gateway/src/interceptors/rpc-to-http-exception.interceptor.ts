import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interceptor para converter erros RPC em HttpException
 * Captura erros vindos de microsserviços e os converte em respostas HTTP apropriadas
 */
@Injectable()
export class RpcToHttpExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Se o erro já tem formato RPC com statusCode
        if (error && typeof error === 'object' && 'statusCode' in error) {
          const { statusCode, message, error: errorName } = error;
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode,
                  message,
                  error: errorName || 'Microservice Error',
                },
                statusCode || HttpStatus.INTERNAL_SERVER_ERROR
              )
          );
        }

        // Se o erro é uma string simples
        if (typeof error === 'string') {
          return throwError(
            () => new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
          );
        }

        // Para outros tipos de erro
        return throwError(
          () =>
            new HttpException(
              error?.message || 'Erro ao comunicar com o serviço',
              error?.status || HttpStatus.SERVICE_UNAVAILABLE
            )
        );
      })
    );
  }
}
