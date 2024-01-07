import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetListDto {
  @ApiProperty()
  @IsString()
  list: string;
}
