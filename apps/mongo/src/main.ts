import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MongoModule } from 'nest-mongodb';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MongoModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'mongo_queue',
    },
  });
  await app.listen();
}

bootstrap();
