import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

/**
 * AuthController - Controller de Autenticação
 * Expõe endpoints HTTP para login e autenticação
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Realiza o login do usuário
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
