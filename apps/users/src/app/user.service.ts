import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
// import { Db, MongoClient } from 'mongodb';
import * as mongo from 'mongodb'

@Injectable()
export class UserService {
  private readonly collection: mongo.Collection;

  constructor(
    private readonly configService: ConfigService,
    @Inject('MONGO_SERVICE') private client: ClientProxy,
  ) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async getUsers() {
    try {
      return this.client.send<string>({cmd: 'findAll'}, {}).toPromise();
    } catch (error) {
      console.error('Error in /users request:', error.message);
    }
  }
}
