// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
// import { FindCursor, WithId } from 'mongodb';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }

  @MessagePattern({cmd: 'getUsers'})
  getUsers(): Promise<unknown> {
    // return 'Users microservice - getUsers';
    return this.appService.getUsers();
  }
}
