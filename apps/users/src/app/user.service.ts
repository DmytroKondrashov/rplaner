import bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Collection,
  Db,
  DeleteResult,
  InsertOneResult,
  MongoClient,
  ObjectId,
  OptionalId,
  WithId,
} from 'mongodb';
import { SignInDto } from './dtos/sign.in.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign.up.dto';

@Injectable()
export class UserService {
  database: Db;
  client: MongoClient;
  saltRounds = 10;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService
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

  findOne(collection: string, query): Promise<WithId<Document>> {
    return this.collection(collection).findOne(query);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findAll(collection: string): any {
    return this.collection(collection).find().toArray();
  }


  deleteOne(collection: string, query): Promise<DeleteResult> {
    return this.collection(collection).deleteOne(query);
  }

  insertOne(
    collection: string,
    data,
  ): Promise<InsertOneResult<Document>> {
    const insertedData = data as OptionalId<Document>;
    return this.collection(collection).insertOne(insertedData);
  }

  async signJWTToken(payload) {
    return this.jwtService.signAsync(payload, {secret: this.configService.get('JWT_KEY')});
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

  formJWTPayload(username, id) {
    return {
      username,
      id: id.toString()
    }
  }

  getUserIdFromToken(token: string): string {
    const data = Buffer.from(token, 'base64')
      .toString('ascii')
      .match(/"id":"(.+)",/)[0];
    const clearedId = JSON.parse(`{${data.slice(0, -1)}}`);
    return clearedId.id;
  }

  async getUsers() {
    // This is not working for now, maybe refactor later
    // try {
    //   return this.client.send<string>({cmd: 'findAll'}, {}).toPromise();
    // } catch (error) {
    //   console.error('Error in /users request:', error.message);
    // }
    const users = await this.findAll('users');
    users.map(user => delete user.password);
    return users;
  }

  async getUserProfile(query) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userProfile = await this.findOne('users', query) as any;
    delete userProfile.password;
    return userProfile;
  }

  async login(data: SignInDto) {
    const { email, password } = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await this.findOne('users', { email });
    if (!user) {
      throw new NotFoundException();
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }
    const payload = this.formJWTPayload(user.userName, user._id)

    return {
      access_token: await this.signJWTToken(payload),
    };
  }

  async signUp(data: SignUpDto) {
    const existingUser = await this.findOne('users', {email: data.email});
    if (existingUser) {
      throw new BadRequestException('A user with this email allready exist!')
    } else {
      const hash = await bcrypt.hash(data.password, this.saltRounds);
      delete data.passwordConfirmation;
      data.password = hash;
      await this.insertOne('users', data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdUser = await this.findOne('users', { userName: data.userName }) as any;
      delete createdUser.password;
      const payload = this.formJWTPayload(createdUser.userName, createdUser._id)
  
      return {
        token: await this.signJWTToken(payload),
        user: createdUser
      }
    }
  }

  async edit(query) {
    const { data, token } = query;
    const currentUserId = this.getUserIdFromToken(token)
    try {
      await this.updateOne('users', {_id: new ObjectId(currentUserId)}, data)
      return this.getUserProfile({_id: new ObjectId(currentUserId)})
    } catch (error) {
      return 'Some error occured while updating user'
    }
  }

  async deleteUser(data) {
    const { id, token } = data;
    const userId = this.getUserIdFromToken(token);
    if (userId === id) {
      try {
        await this.deleteOne('users', { _id: new ObjectId(id) });
        return 'User was successfully deleted'
      } catch (error) {
        return 'Some error occured while deleting user'
      }
    } else {
      throw new BadRequestException('You can only unsubscribe yourself')
    }
  }
}
