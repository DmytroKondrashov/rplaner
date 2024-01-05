// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @MessagePattern({ cmd: 'newList' })
  createList(data: string): unknown {
    return this.plansService.createList(data);
  }
}
