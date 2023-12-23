import { Controller } from '@nestjs/common';

import { MongoService } from './mongo.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @MessagePattern({cmd: 'findAll'})
  findAll(): unknown {
    return this.mongoService.findAll('users');
  }
}
