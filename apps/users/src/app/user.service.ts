import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import * as mongo from 'mongodb'
import { InjectDb } from 'nest-mongodb';

@Injectable()
export class UserService {
  private readonly collection: mongo.Collection;

  constructor(
    private readonly configService: ConfigService,
    @InjectDb() private readonly db: Db
  ) {
    this.collection = this.db.collection('users');
  }

  database: Db;
  client: MongoClient;

  public async onModuleInit(): Promise<void> {
    const connectionUrl = this.configService.get('MONGODB_CONNECTOIN_STRING');
    const dbName = this.configService.get('MONGODB_DATABASE_NAME');

    this.client = new MongoClient(connectionUrl);
    this.database = this.client.db(dbName);
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  // collection(collectionName: string): Collection<Document> {
  //   return this.database.collection(collectionName);
  // }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async getUsers() {
    console.log('=============================================')
    const result = await this.collection.find({}).toArray();
    console.log(this.db.collection)
    console.log(this.configService.get('MONGODB_DATABASE_NAME'))
    return result;  
    // return 'true';
  }
}
