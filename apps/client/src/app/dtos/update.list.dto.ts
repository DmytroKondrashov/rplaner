import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateListDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  listName: string;
}
