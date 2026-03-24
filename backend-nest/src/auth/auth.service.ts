import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone || '',
      city: dto.city || '',
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    if (!user.isActive) return null;

    return user;
  }

  async login(user: any) {
    await this.usersService.updateLastLogin(user.id);
    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      // Check if token is blacklisted
      const blacklisted = await this.cacheManager.get(`bl_${refreshToken}`);
      if (blacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET', 'default-refresh-secret'),
      });

      const user = await this.usersService.findById(payload.user_id || payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      // Blacklist old refresh token
      await this.cacheManager.set(`bl_${refreshToken}`, '1', 7 * 24 * 60 * 60 * 1000);

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.cacheManager.set(`bl_${refreshToken}`, '1', 7 * 24 * 60 * 60 * 1000);
    return { message: 'Successfully logged out' };
  }

  private async generateTokens(user: any) {
    const payload = { user_id: user.id, email: user.email, role: user.role };

    const access = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET', 'default-secret'),
      expiresIn: `${this.config.get('JWT_ACCESS_LIFETIME_MINUTES', '15')}m`,
    });

    const refresh = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET', 'default-refresh-secret'),
      expiresIn: `${this.config.get('JWT_REFRESH_LIFETIME_DAYS', '7')}d`,
    });

    return { access, refresh };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
