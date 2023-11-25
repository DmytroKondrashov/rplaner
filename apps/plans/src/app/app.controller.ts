// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }

  @MessagePattern('getPlans')
  getPlans(): string {
    return 'Plans microservice - getPlans';
  }
}
