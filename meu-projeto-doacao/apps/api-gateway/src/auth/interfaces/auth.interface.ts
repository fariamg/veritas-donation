/**
 * Interface para o payload JWT
 */
export interface IJwtPayload {
  sub: string; // ID do usuário
  email: string;
  username: string;
  roles?: string[];
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
