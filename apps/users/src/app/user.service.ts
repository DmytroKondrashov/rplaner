import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import * as mongo from 'mongodb'

@Injectable()
export class UserService {
  private readonly collection: mongo.Collection;

  constructor(private readonly configService: ConfigService) {}

  database: Db;
  client: MongoClient;

  public async onModuleInit(): Promise<void> {
    const connectionUrl = this.configService.get('MONGODB_CONNECTOIN_STRING');
    const dbName = this.configService.get('MONGODB_DATABASE_NAME');

    this.client = new MongoClient(connectionUrl);
    this.database = this.client.db(dbName);
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async getUsers() {
    const collection = this.database.collection('users');
    const result = await collection.find({}).toArray();
    return result;  
  }
}
