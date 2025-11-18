import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, IUser, UpdateUserDto } from '@shared';
import { UserReputation, UserStatus } from 'apps/user-service/generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo usuário
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, username, status, reputation } = createUserDto;

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

    // Cria o usuário
    return this.prisma.user.create({
      data: {
        email,
        username,
        status: status ?? UserStatus.PENDING_VERIFICATION,
        reputation: reputation ?? UserReputation.NEUTRAL,
      },
    });
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
    await this.findOne(id);

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

    // Remove propriedades undefined para não sobrescrever com null
    const dataToUpdate = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  /**
   * Remove um usuário (soft delete alterando status para INACTIVE e marcando deletedAt)
   */
  async remove(id: string): Promise<UserEntity> {
    // Verifica se o usuário existe
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Remove um usuário permanentemente do banco de dados
   */
  async hardDelete(id: string): Promise<void> {
    // Verifica se o usuário existe
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
