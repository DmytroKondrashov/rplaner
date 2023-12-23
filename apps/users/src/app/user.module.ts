import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  // imports: [MongoModule.forRoot('mongodb://localhost', 'rplaner')],
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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
})
export class UserModule {}
