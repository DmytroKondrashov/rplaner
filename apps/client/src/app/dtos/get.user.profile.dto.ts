import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  userName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string;
}
