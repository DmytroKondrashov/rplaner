import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, DeleteResult, InsertOneResult, MongoClient, ObjectId, OptionalId, WithId } from 'mongodb';

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findAll(collection: string): any {
      return this.collection(collection).find().toArray();
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

  async createList(data) {
    const { listName, token } = data;
    const userId = this.getUserIdFromToken(token);
    const existingList = await this.findOne('lists', { name: listName });
    if (existingList) {
      throw new BadRequestException('List with this name allready exist!')
    } else {
      await this.insertOne('lists', { listName, userId });
      return this.findOne('lists', { listName, userId });
    }
  }

  async getList(listName) {
    return this.findOne('lists', { listName });
  }


  async editList(data) {
    const { id, listName, token } = data;
    const userId = this.getUserIdFromToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingList = await this.findOne('lists', { _id: new ObjectId(id) }) as any;
    if (userId === existingList.userId) {
      try {
        await this.updateOne('lists', {_id: new ObjectId(id)}, { listName })
        return this.findOne('lists', { _id: new ObjectId(id) })
      } catch (error) {
        return 'Some error occured while updating the list'
      }
    } else {
      throw new BadRequestException('You can only modify the lists that belongs to you')
    }
  }

  async getLists(token) {
    const userId = this.getUserIdFromToken(token);
    const collection = this.collection('lists');
    return collection.find({ userId }).toArray();
  }

  async deleteList(data) {
    const { id, token } = data;
    const userId = this.getUserIdFromToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list = await this.findOne('lists', { _id: new ObjectId(id) }) as any;
    if (userId === list.userId) {
      try {
        await this.deleteOne('lists', { _id: new ObjectId(id) });
        return 'List was successfully deleted'
      } catch (error) {
        return 'Some error occured while deleting list'
      }
    } else {
      throw new BadRequestException('You can only delete your own lists')
    }
  }

  async cretePlan(data) {
    const { listId, content, orderNumber } = data
    try {
      const createdList = await this.insertOne('plans', { listId, content, orderNumber });
      return this.findOne('plans', { _id: createdList.insertedId })
    } catch (error) {
      return 'Some error occured while creating plan'
    }
  }
}
