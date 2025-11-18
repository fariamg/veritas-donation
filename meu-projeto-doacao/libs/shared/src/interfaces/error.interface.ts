/**
 * Interfaces para padronização de erros entre microsserviços
 */

export interface IRpcError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface IRpcErrorResponse {
  status: number;
  message: string;
  error?: string;
}
