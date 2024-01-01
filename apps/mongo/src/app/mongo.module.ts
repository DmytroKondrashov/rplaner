import { Module } from '@nestjs/common';

import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongoModule.forRoot('mongodb://localhost', 'rplaner'),
    ClientsModule.register([
      {
        name: 'MONGO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'mongo_queue',
        },
      },
    ]),
  ],
  controllers: [MongoController],
  providers: [MongoService, ConfigService],
})
export class AppModule {}
