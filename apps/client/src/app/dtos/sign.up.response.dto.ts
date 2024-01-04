import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class SignUpResponseDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
