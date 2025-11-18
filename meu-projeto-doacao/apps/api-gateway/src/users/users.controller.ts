import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// ClientProxy: Classe do NestJS para enviar mensagens via RabbitMQ
// É um "proxy" que abstrai a comunicação com o message broker

import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
// RxJS: Biblioteca de programação reativa (modelo de programação para lidar com fluxos de dados e eventos assíncronos de forma que o sistema reaja automaticamente a mudanças, sem a necessidade de esperar uma sequência de tarefas)
// firstValueFrom: Converte Observable em Promise (async/await)
// timeout: Cancela operação após X ms

import {
  USER_MESSAGE_PATTERNS,
  CreateUserDto,
  UpdateUserDto,
  FindAllUsersQueryDto,
  IUser,
} from '@shared';
import { RpcToHttpExceptionInterceptor } from '../interceptors/rpc-to-http-exception.interceptor';

/**
 * Users Controller - API Gateway
 * Recebe HTTP e encaminha via RabbitMQ para o User Service
 * Usa RpcToHttpExceptionInterceptor para converter erros RPC em HTTP automaticamente
 */
@Controller('users') // Rota base: /api/users
@UseInterceptors(RpcToHttpExceptionInterceptor)
// Aplica interceptor que converte erros RPC em HTTP automaticamente
// Exemplo: RpcException({status: 404}) → HttpException(404)
export class UsersController {
  // Injeção do ClientProxy para comunicação com o User Service
  // ClientProxy é um proxy para enviar mensagens via RabbitMQ
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
  ) {}

  /**
   * POST /api/users
   * Cria um novo usuário
   * Valida dados com CreateUserDto via ValidationPipe
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await firstValueFrom(
      // firstValueFrom: Converte Observable RxJS em Promise
      // O ClientProxy retorna Observable, mas queremos async/await
      this.userServiceClient
        .send(
          // .send(): Envia mensagem e ESPERA resposta (Request-Response pattern)
          USER_MESSAGE_PATTERNS.CREATE_USER,
          // Constante definida em @shared: 'create_user'
          // É o "canal" no RabbitMQ que o User Service está escutando
          createUserDto
        )
        .pipe(timeout(5000))
      // Se não receber resposta em 5 segundos, lança TimeoutError
      // Protege contra microserviços travados
    );
  }

  /**
   * GET /api/users
   * Lista todos os usuários com paginação
   * Valida query params com FindAllUsersQueryDto
   */
  @Get()
  async findAll(@Query() query: FindAllUsersQueryDto): Promise<IUser[]> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.FIND_ALL_USERS, query)
        .pipe(timeout(5000))
    );
  }

  /**
   * GET /api/users/:id
   * Retorna um usuário específico pelo ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IUser> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.FIND_USER_BY_ID, { id })
        .pipe(timeout(5000))
    );
  }

  /**
   * GET /api/users/email/:email
   * Retorna um usuário específico pelo email
   */
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<IUser> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.FIND_USER_BY_EMAIL, { email })
        .pipe(timeout(5000))
    );
  }

  /**
   * GET /api/users/username/:username
   * Retorna um usuário específico pelo username
   */
  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<IUser> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.FIND_USER_BY_USERNAME, { username })
        .pipe(timeout(5000))
    );
  }

  /**
   * PATCH /api/users/:id
   * Atualiza um usuário
   * Valida dados com UpdateUserDto via ValidationPipe
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.UPDATE_USER, { id, ...updateUserDto })
        .pipe(timeout(5000))
    );
  }

  /**
   * DELETE /api/users/:id
   * Remove um usuário (soft delete)
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IUser> {
    return await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.DELETE_USER, { id })
        .pipe(timeout(5000))
    );
  }

  /**
   * DELETE /api/users/:id/hard
   * Remove permanentemente um usuário
   */
  @Delete(':id/hard')
  async hardDelete(@Param('id') id: string): Promise<void> {
    await firstValueFrom(
      this.userServiceClient
        .send(USER_MESSAGE_PATTERNS.HARD_DELETE_USER, { id })
        .pipe(timeout(5000))
    );
  }
}
