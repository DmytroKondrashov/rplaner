import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty()
  @IsString()
  listName: string;
}
