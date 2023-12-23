import { Module } from '@nestjs/common';

import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongoModule.forRoot('mongodb://localhost', 'rplaner')],
  controllers: [MongoController],
  providers: [MongoService, ConfigService],
})
export class AppModule {}
