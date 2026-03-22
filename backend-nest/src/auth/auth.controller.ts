import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Request() req, @Body() _dto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and blacklist refresh token' })
  async logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refresh_token);
  }
}
