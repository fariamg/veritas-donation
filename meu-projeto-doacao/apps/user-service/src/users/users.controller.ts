import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
// MessagePattern: Decorator para escutar mensagens RabbitMQ
// Payload: Extrai dados da mensagem (equivalente ao @Body do HTTP)
import { UsersService } from './users.service';
import {
  USER_MESSAGE_PATTERNS,
  CreateUserDto,
  UpdateUserDto,
  FindAllUsersQueryDto,
  IUser,
} from '@shared';

/**
 * Users Controller - Microserviço
 * Responde a Message Patterns via RabbitMQ
 * Usa DTOs compartilhados para tipagem dos dados recebidos
 */
@Controller() // SEM ROTA - Não é HTTP controller!
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Injeta o service que tem a lógica de negócio + Prisma

  /**
   * Pattern: create_user
   * Cria um novo usuário
   * Recebe CreateUserDto já validado pelo Gateway
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.CREATE_USER)
  async create(@Payload() data: CreateUserDto): Promise<IUser> {
    // @Payload(): Extrai 'data' da mensagem RabbitMQ
    // Equivalente ao @Body() em HTTP
    // Dados já foram validados pelo Gateway, aqui apenas tipamos
    return this.usersService.create(data);
  }

  /**
   * Pattern: find_all_users
   * Lista todos os usuários com paginação
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_ALL_USERS)
  async findAll(@Payload() data: FindAllUsersQueryDto): Promise<IUser[]> {
    const { page = 1, limit = 10 } = data;
    return this.usersService.findAll(page, limit);
  }

  /**
   * Pattern: find_user_by_id
   * Retorna um usuário específico pelo ID
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_USER_BY_ID)
  async findOne(@Payload() data: { id: string }): Promise<IUser> {
    return this.usersService.findOne(data.id);
  }

  /**
   * Pattern: find_user_by_email
   * Retorna um usuário específico pelo email
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_USER_BY_EMAIL)
  async findByEmail(@Payload() data: { email: string }): Promise<IUser> {
    return this.usersService.findByEmail(data.email);
  }

  /**
   * Pattern: find_user_by_username
   * Retorna um usuário específico pelo username
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_USER_BY_USERNAME)
  async findByUsername(@Payload() data: { username: string }): Promise<IUser> {
    return this.usersService.findByUsername(data.username);
  }

  /**
   * Pattern: update_user
   * Atualiza um usuário
   * Recebe UpdateUserDto já validado pelo Gateway
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_USER)
  async update(
    @Payload() data: { id: string } & UpdateUserDto
  ): Promise<IUser> {
    const { id, ...updateData } = data;
    return this.usersService.update(id, updateData);
  }

  /**
   * Pattern: delete_user
   * Remove um usuário (soft delete)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.DELETE_USER)
  async remove(@Payload() data: { id: string }): Promise<IUser> {
    return this.usersService.remove(data.id);
  }

  /**
   * Pattern: hard_delete_user
   * Remove permanentemente um usuário do banco de dados
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.HARD_DELETE_USER)
  async hardDelete(@Payload() data: { id: string }): Promise<void> {
    return this.usersService.hardDelete(data.id);
  }
}
