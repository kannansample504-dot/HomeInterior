import { IsArray, IsEnum, IsInt, IsString, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RoomInput {
  @ApiProperty({ enum: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'home_office'] })
  @IsString()
  room_type: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  @Max(10)
  count: number;
}

export class CalculateEstimateDto {
  @ApiProperty({ type: [RoomInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomInput)
  rooms: RoomInput[];

  @ApiProperty({ enum: ['basic', 'standard', 'premium', 'luxury'] })
  @IsEnum(['basic', 'standard', 'premium', 'luxury'])
  tier: string;
}
