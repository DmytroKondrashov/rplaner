import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ListsController } from './lists.controller';
import { PlansController } from './plans.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'users_queue',
        },
      },
      {
        name: 'PLANS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'plans_queue',
        },
      },
    ]),
  ],
  controllers: [UsersController, ListsController, PlansController],
  providers: [JwtService, ConfigService,  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class ClientModule {}
