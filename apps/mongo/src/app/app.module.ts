import { Module } from '@nestjs/common';

import { MongoController } from './app.controller';
import { MongoService } from './app.service';

@Module({
  imports: [],
  controllers: [MongoController],
  providers: [MongoService],
})
export class AppModule {}
