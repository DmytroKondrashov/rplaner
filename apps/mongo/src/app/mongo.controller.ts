import { Controller, Inject } from '@nestjs/common';

import { MongoService } from './mongo.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class MongoController {
  constructor(
    private readonly mongoService: MongoService,
    @Inject('MONGO_SERVICE') private client: ClientProxy,
  ) {}

  @MessagePattern({cmd: 'findAll'})
  // @MessagePattern('#')
  findAll(): unknown {
    return this.mongoService.findAll('users');
  }
}
