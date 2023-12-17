import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongoModule.forRoot('mongodb://localhost', 'rplaner')],
  controllers: [UserController],
  providers: [UserService, ConfigService],
})
export class UserModule {}
