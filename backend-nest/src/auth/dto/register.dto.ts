import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
