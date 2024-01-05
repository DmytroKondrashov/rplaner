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

  async createList(listName) {
    const existingList = await this.findOne('lists', { name: listName });
    if (existingList) {
      throw new BadRequestException
    } else {
      await this.insertOne('lists', listName);
      return this.findOne('lists', listName);
    }
  }
}
