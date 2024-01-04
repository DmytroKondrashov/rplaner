import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PlansModule } from './app/plans.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PlansModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'plans_queue',
    },
  });
  await app.listen();
}

bootstrap();
