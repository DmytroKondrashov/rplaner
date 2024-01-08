import { Post, Controller, Get, Inject, Body, Query } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { Token } from './decorators/token.decorator';
import { CreateListDto } from './dtos/create.list.dto';
import { GetListDto } from './dtos/get.list.dto';

@Controller('lists')
export class ListsController {
  constructor(
    @Inject('PLANS_SERVICE') private readonly plansClient: ClientProxy,
  ) {}

  @Post('new')
  async newList(
    @Body() data: CreateListDto,
    @Token() token: string,
    ): Promise<string> {
    try {
      const listName = data.listName;
      return this.plansClient.send<string>({cmd: 'newList'}, { listName, token }).toPromise();
    } catch (error) {
      console.error('Error in /lists/new request:', error.message);
    }
  }

  @Get('list')
  async getList(
    @Query() { listName }: GetListDto,
  ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'getList'}, listName).toPromise();
    } catch (error) {
      console.error('Error in /list request:', error.message);
    }
  }
}
