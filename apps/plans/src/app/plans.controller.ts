// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { MessagePattern } from '@nestjs/microservices';
import { WithId } from 'mongodb';

@Controller()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @MessagePattern({ cmd: 'getLists' })
  getLists(token: string): Promise<WithId<Document>[]> {
    return this.plansService.getLists(token);
  }

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

  @MessagePattern({ cmd: 'deleteList' })
  deleteList(data: string) {
    return this.plansService.deleteList(data);
  }

  @MessagePattern({ cmd: 'cretePlan' })
  createPlan(data: string) {
    return this.plansService.cretePlan(data);
  }

  @MessagePattern({ cmd: 'getPlans' })
  getPlans(data: string) {
    return this.plansService.getPlans(data);
  }
}
