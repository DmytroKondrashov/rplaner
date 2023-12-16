import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongoModule.forRoot('mongodb://localhost', 'rplaner')],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
