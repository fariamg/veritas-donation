import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, IUser, UpdateUserDto } from '@shared';
import { UserReputation, UserStatus } from 'apps/user-service/generated/prisma';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class UsersService {
  // Constante para definir o número de rounds do bcrypt
  private readonly BCRYPT_SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  /**
   * Cria um novo usuário
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {
      email,
      username,
      password,
      status,
      reputation,
      isAdmin,
      isModerator,
    } = createUserDto;

    // REGRA DE NEGÓCIO: Apenas ADMIN e MODERADOR podem ter email/senha
    // Doadores anônimos usam apenas wallets blockchain
    if ((email || password) && !isAdmin && !isModerator) {
      throw new ConflictException(
        'Apenas administradores e moderadores podem ter email/senha. Doadores devem usar carteiras blockchain.'
      );
    }

    // Se é ADMIN ou MODERADOR, email e senha são obrigatórios
    if ((isAdmin || isModerator) && (!email || !password)) {
      throw new ConflictException(
        'Administradores e moderadores devem ter email e senha cadastrados.'
      );
    }

    // Verifica se o email já existe
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Verifica se o username já existe
    if (username) {
      const existingUser: IUser | null = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        throw new ConflictException('Username já está em uso');
      }
    }

    // Hash da senha usando bcrypt
    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
    }

    // Cria o usuário com a senha hasheada
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        isAdmin: isAdmin ?? false,
        isModerator: isModerator ?? false,
        status: status ?? UserStatus.PENDING_VERIFICATION,
        reputation: reputation ?? UserReputation.NEUTRAL,
      },
    });

    // Registra criação no log de auditoria
    await this.auditLogService.logUserCreated(
      newUser.id,
      undefined, // createdBy (pode ser passado como parâmetro se necessário)
      {
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        isModerator: newUser.isModerator,
        status: newUser.status,
      }
    );

    return newUser;
  }

  /**
   * Retorna todos os usuários (com paginação)
   */
  async findAll(page: number = 1, limit: number = 10): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;

    return this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retorna um usuário pelo ID
   */
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  /**
   * Retorna um usuário pelo email
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retorna um usuário pelo email com o passwordHash
   * Este método é usado APENAS para autenticação interna
   * NUNCA expor o passwordHash ao cliente!
   */
  async findByEmailWithPassword(
    email: string
  ): Promise<(UserEntity & { passwordHash?: string }) | null> {
    // Usa raw query para incluir o passwordHash (que é omitido pelo middleware)
    const users = await this.prisma.$queryRaw<
      Array<UserEntity & { password_hash?: string }>
    >`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

    if (!users || users.length === 0) {
      return null;
    }

    // Mapeia password_hash (snake_case do banco) para passwordHash (camelCase)
    const user = users[0];
    return {
      ...user,
      passwordHash: user.password_hash,
    } as UserEntity & { passwordHash?: string };
  }

  /**
   * Retorna um usuário pelo username
   */
  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Verifica se o usuário existe
    const currentUser = await this.findOne(id);

    // REGRA DE NEGÓCIO: Apenas ADMIN e MODERADOR podem ter email/senha
    if (
      (updateUserDto.email || updateUserDto.password) &&
      !currentUser.isAdmin &&
      !currentUser.isModerator
    ) {
      throw new ConflictException(
        'Apenas administradores e moderadores podem ter email/senha.'
      );
    }

    // Verifica unicidade de email
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          NOT: { id },
        },
      });
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Verifica unicidade de username
    if (updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: updateUserDto.username,
          NOT: { id },
        },
      });
      if (existingUser) {
        throw new ConflictException('Username já está em uso');
      }
    }

    // Prepara os dados para atualização
    const dataToUpdate: any = {};

    // Se uma nova senha foi fornecida, faz o hash antes de salvar
    if (updateUserDto.password) {
      dataToUpdate.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        this.BCRYPT_SALT_ROUNDS
      );
    }

    // Adiciona os outros campos (exceto password, já tratado acima)
    Object.entries(updateUserDto).forEach(([key, value]) => {
      if (key !== 'password' && value !== undefined) {
        dataToUpdate[key] = value;
      }
    });

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Detecta campos alterados para auditoria
    const changedFields: string[] = [];
    const oldValues: Record<string, any> = {};
    const newValues: Record<string, any> = {};

    Object.entries(updateUserDto).forEach(([key, value]) => {
      if (value !== undefined && key !== 'password') {
        const oldValue = currentUser[key as keyof UserEntity];
        if (oldValue !== value) {
          changedFields.push(key);
          oldValues[key] = oldValue;
          newValues[key] = value;
        }
      }
    });

    // Registra mudança de senha separadamente (sem expor valores)
    if (updateUserDto.password) {
      changedFields.push('password');
      await this.auditLogService.logPasswordChanged(id, id);
    }

    // Registra mudança de email separadamente
    if (updateUserDto.email && currentUser.email !== updateUserDto.email) {
      await this.auditLogService.logEmailChanged(
        id,
        currentUser.email || '',
        updateUserDto.email,
        id
      );
    }

    // Registra atualização geral
    if (changedFields.length > 0) {
      await this.auditLogService.logUserUpdated(
        id,
        id, // updatedBy (pode ser passado como parâmetro se necessário)
        changedFields,
        oldValues,
        newValues
      );
    }

    return updatedUser;
  }

  /**
   * Remove um usuário (soft delete alterando status para INACTIVE e marcando deletedAt)
   */
  async remove(id: string, deletedBy?: string): Promise<UserEntity> {
    // Verifica se o usuário existe
    await this.findOne(id);

    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
      },
    });

    // Registra soft delete no log de auditoria
    await this.auditLogService.logUserDeleted(id, deletedBy || id);

    return deletedUser;
  }

  /**
   * Remove um usuário permanentemente do banco de dados
   */
  async hardDelete(id: string, deletedBy?: string): Promise<void> {
    // Verifica se o usuário existe
    const user = await this.findOne(id);

    // Registra hard delete ANTES de deletar (pois depois não terá mais acesso aos dados)
    await this.auditLogService.logUserHardDeleted(id, deletedBy || id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Registra tentativa de login falhada
   * Bloqueia conta temporariamente após 5 tentativas
   */
  async recordFailedLogin(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) return;

    const now = new Date();
    const attempts = user.loginFailedAttempts + 1;
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION_MINUTES = 30;

    // Se já está bloqueado, não faz nada
    if (user.accountLockedUntil && user.accountLockedUntil > now) {
      return;
    }

    // Se atingiu o máximo de tentativas, bloqueia a conta
    if (attempts >= MAX_ATTEMPTS) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginFailedAttempts: attempts,
          loginFailedLastAt: now,
          accountLockedUntil: new Date(
            now.getTime() + LOCK_DURATION_MINUTES * 60 * 1000 // Retorna em ms
          ),
          status: UserStatus.SUSPENDED,
        },
      });
      // Registra bloqueio de conta
      await this.auditLogService.logAccountLocked(
        user.id,
        email,
        `Máximo de ${MAX_ATTEMPTS} tentativas de login falhadas atingido`
      );
    } else {
      // Incrementa contador de tentativas falhadas
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginFailedAttempts: attempts,
          loginFailedLastAt: now,
        },
      });
    }
  }

  /**
   * Reseta contador de tentativas de login após login bem-sucedido
   */
  async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginFailedAttempts: 0,
        loginFailedLastAt: null,
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * Verifica se a conta está bloqueada
   */
  async isAccountLocked(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;

    const now = new Date();
    if (user.accountLockedUntil && user.accountLockedUntil > now) {
      return true;
    }

    // Se o período de bloqueio expirou, desbloqueia automaticamente
    if (user.accountLockedUntil && user.accountLockedUntil <= now) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accountLockedUntil: null,
          loginFailedAttempts: 0,
          status: UserStatus.ACTIVE,
        },
      });

      // Registra desbloqueio automático
      await this.auditLogService.logAccountUnlocked(user.id, email);

      return false;
    }

    return false;
  }
}
