import { IsArray, IsEnum, IsOptional, IsString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalculateEstimateDto } from './calculate-estimate.dto';

export class SaveEstimateDto extends CalculateEstimateDto {
  @ApiPropertyOptional({ enum: ['new', 'renovation'] })
  @IsOptional()
  @IsString()
  project_type?: string;

  @ApiPropertyOptional({ enum: ['apartment', 'villa', 'house', 'penthouse'] })
  @IsOptional()
  @IsString()
  property_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  style?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  guest_email?: string;
}
