import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'users_queue',
    },
  });
  await app.listen();
}

bootstrap();
