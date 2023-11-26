import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('USERS_SERVICE') private client: ClientProxy,
    private readonly appService: AppService
  ) {}

  // It doesn't seem to be necessary
  // @Client({ transport: Transport.RMQ })
  // async onApplicationBootstrap() {
  //   await this.client.connect();
  // }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/users')
  async getUsers(): Promise<string> {
    try {
      return this.client.send<string>({cmd: 'getUsers'}, {}).toPromise();
    } catch (error) {
      console.error('Error in /users request:', error.message);
    }

  }
}
