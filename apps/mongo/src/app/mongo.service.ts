import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as mongo from 'mongodb'
import {
  AggregateOptions,
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  MongoClient,
  OptionalId,
  WithId,
} from 'mongodb';


@Injectable()
export class MongoService {
  // private readonly collection: mongo.Collection;

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

  // async getUsers() {
  //   const collection = this.database.collection('users');
  //   const result = await collection.find({}).toArray();
  //   return result;  
  // }

  collection(collectionName: string): Collection<Document> {
    return this.database.collection(collectionName);
  }

  findOne(collection: string, query): Promise<WithId<Document>> {
    return this.collection(collection).findOne(query);
  }

  async findSeveral(collectionName: string, fieldsName: string, values: unknown[]) {
    const collection = this.collection(collectionName);
    return collection.find({ [fieldsName]: { $in: values } }).toArray();
    // Use commented uot solution only if the existing one will cause strange errors on tests
    // const skills = await Promise.all(
    //   values.map(async (value) => {
    //     return await this.findOne(collectionName, { [fieldsName]: value });
    //   }),
    // );
    // return skills;
  }

  findAll(collection: string): unknown {
    return this.collection(collection).find();
  }

  aggregate(collection: string, aggregateOptions: AggregateOptions[]) {
    return this.collection(collection).aggregate(aggregateOptions);
  }

  insertOne(
    collection: string,
    data,
  ): Promise<InsertOneResult<Document>> {
    const insertedData = data as OptionalId<Document>;
    return this.collection(collection).insertOne(insertedData);
  }

  updateOne(
    collection: string,
    query,
    data,
  ): Promise<unknown> {
    return this.collection(collection).updateOne(
      query,
      { $set: data },
      { upsert: true },
    );
  }

  deleteOne(collection: string, query): Promise<DeleteResult> {
    return this.collection(collection).deleteOne(query);
  }
}
