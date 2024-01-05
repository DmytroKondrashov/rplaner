import { Module } from '@nestjs/common';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

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
  controllers: [ClientController],
  providers: [ClientService, JwtService, ConfigService,  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class ClientModule {}
