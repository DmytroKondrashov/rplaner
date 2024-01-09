// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { MessagePattern } from '@nestjs/microservices';
import { WithId } from 'mongodb';

@Controller()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @MessagePattern({ cmd: 'newList' })
  createList(data: string): Promise<WithId<Document>> {
    return this.plansService.createList(data);
  }

  @MessagePattern({ cmd: 'getList' })
  getList(listName: string): Promise<WithId<Document>> {
    return this.plansService.getList(listName);
  }

  @MessagePattern({ cmd: 'editList' })
  editList(data: string) {
    return this.plansService.editList(data);
  }
}
