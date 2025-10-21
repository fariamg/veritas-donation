import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  get extended() {
    return this.$extends({
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
  }
}
