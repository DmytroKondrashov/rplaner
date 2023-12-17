import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3000;
  // await app.listen(port);
  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  // );
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
