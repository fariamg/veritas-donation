import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

/**
 * PrismaService - Serviço de Banco de Dados
 * Configurado com Prisma Client Extension para automaticamente omitir campos sensíveis
 * (passwordHash, twoFactorSecret, twoFactorBackupCodes) em todas as queries de usuário
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Client estendido com omissão automática de campos sensíveis
   * Este é o client padrão que deve ser usado em toda a aplicação
   * para garantir que dados sensíveis nunca sejam expostos acidentalmente
   */
  private _extendedClient = this.$extends({
    query: {
      user: {
        async create({ args, query }) {
          args.omit = {
            passwordHash: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
            ...args.omit,
          };
          return query(args);
        },
        async update({ args, query }) {
          args.omit = {
            passwordHash: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
            ...args.omit,
          };
          return query(args);
        },
        async findUnique({ args, query }) {
          args.omit = {
            passwordHash: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
            ...args.omit,
          };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.omit = {
            passwordHash: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
            ...args.omit,
          };
          return query(args);
        },
        async findMany({ args, query }) {
          args.omit = {
            passwordHash: true,
            twoFactorSecret: true,
            twoFactorBackupCodes: true,
            ...args.omit,
          };
          return query(args);
        },
      },
    },
  });

  get user() {
    return this._extendedClient.user as any;
  }
}
