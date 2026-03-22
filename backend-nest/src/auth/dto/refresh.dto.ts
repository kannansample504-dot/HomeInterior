import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
