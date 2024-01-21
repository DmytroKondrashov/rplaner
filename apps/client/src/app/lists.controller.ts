import { Post, Controller, Get, Inject, Body, Query, Delete, Param } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { Token } from './decorators/token.decorator';
import { CreateListDto } from './dtos/create.list.dto';
import { GetListDto } from './dtos/get.list.dto';
import { UpdateListDto } from './dtos/update.list.dto';

@Controller('lists')
export class ListsController {
  constructor(
    @Inject('PLANS_SERVICE') private readonly plansClient: ClientProxy,
  ) {}

  @Get('index')
  async getLists(
    @Token() token: string,
  ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'getLists'}, token).toPromise();
    } catch (error) {
      console.error('Error in /lists request:', error.message);
    }
  }

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

  @Post('edit')
  async editList(
    @Body()
    {
      id,
      listName,
    }: UpdateListDto,
    @Token() token: string,
    ): Promise<string> {
    try {
      return this.plansClient.send<string>({cmd: 'editList'}, { id, listName, token }).toPromise();
    } catch (error) {
      console.error('Error in /lists/new request:', error.message);
    }
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Token() token: string,
    ) {
    try {
      return this.plansClient.send<string>({cmd: 'deleteList'}, { id, token }).toPromise();
    } catch (error) {
      console.error('Error in /plans/delete request:', error.message);
    }
  }
}
