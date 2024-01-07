import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ListDto {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  listName: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
