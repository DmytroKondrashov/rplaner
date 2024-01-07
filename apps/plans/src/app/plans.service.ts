import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, InsertOneResult, MongoClient, OptionalId, WithId } from 'mongodb';

@Injectable()
export class PlansService {
  database: Db;
  client: MongoClient;

  constructor(
    private readonly configService: ConfigService,
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

  getUserIdFromToken(token: string): string {
    const data = Buffer.from(token, 'base64')
      .toString('ascii')
      .match(/"id":"(.+)",/)[0];
    const clearedId = JSON.parse(`{${data.slice(0, -1)}}`);
    return clearedId.id;
  }

  collection(collectionName: string): Collection<Document> {
    return this.database.collection(collectionName);
  }

  insertOne(
    collection: string,
    data,
  ): Promise<InsertOneResult<Document>> {
    const insertedData = data as OptionalId<Document>;
    return this.collection(collection).insertOne(insertedData);
  }

  findOne(collection: string, query): Promise<WithId<Document>> {
    return this.collection(collection).findOne(query);
  }

  async createList(data) {
    const { listName, token } = data;
    console.log(listName)
    const userId = this.getUserIdFromToken(token);
    const existingList = await this.findOne('lists', { name: listName });
    if (existingList) {
      throw new BadRequestException
    } else {
      await this.insertOne('lists', { listName, userId });
      return this.findOne('lists', { listName, userId });
    }
  }
}
