// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
// import { FindCursor, WithId } from 'mongodb';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: 'getUsers'})
  getUsers(): Promise<unknown> {
    // return 'Users microservice - getUsers';
    return this.userService.getUsers();
  }
}
