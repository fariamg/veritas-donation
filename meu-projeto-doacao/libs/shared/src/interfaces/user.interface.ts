/**
 * Interface de User compartilhada entre microserviços
 * Representa o contrato de dados do usuário
 */
export interface IUser {
  id: string;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
  status:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED'
    | 'PENDING_VERIFICATION'
    | 'BLOCKED';
  reputation: 'TRUSTED' | 'GOOD' | 'NEUTRAL' | 'WARNING' | 'DANGEROUS';
  isAdmin: boolean;
  isModerator: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  password?: string; // Opcional - usado apenas internamente para validação, nunca deve ser exposto
  name?: string; // Opcional - nome completo do usuário
  roles?: string[]; // Opcional - roles para autorização
}
