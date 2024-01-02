import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ClientProxy } from '@nestjs/microservices';
// import { Db, MongoClient } from 'mongodb';
import {
  Collection,
  Db,
  MongoClient,
} from 'mongodb';

@Injectable()
export class UserService {
  database: Db;
  client: MongoClient;

  constructor(
    private readonly configService: ConfigService,
    // @Inject('MONGO_SERVICE') private client: ClientProxy,
  ) {}

  public async onModuleInit(): Promise<void> {
    const connectionUrl = this.configService.get('MONGODB_CONNECTOIN_STRING');
    const dbName = this.configService.get('MONGODB_DATABASE_NAME');

    this.client = new MongoClient(connectionUrl);
    this.database = this.client.db(dbName);
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  collection(collectionName: string): Collection<Document> {
    return this.database.collection(collectionName);
  }

  findAll(collection: string): unknown {
    return this.collection(collection).find().toArray();
  }

  async getUsers() {
    // This is not working for now, maybe refactor later
    // try {
    //   return this.client.send<string>({cmd: 'findAll'}, {}).toPromise();
    // } catch (error) {
    //   console.error('Error in /users request:', error.message);
    // }
    return this.findAll('users');
  }
}
