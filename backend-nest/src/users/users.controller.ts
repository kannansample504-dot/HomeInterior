import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: User) {
    const { password, ...result } = user;
    return result;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.update(user.id, dto);
    const { password, ...result } = updated;
    return result;
  }
}
