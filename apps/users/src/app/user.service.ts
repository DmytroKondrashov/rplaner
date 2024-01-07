import bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Collection,
  Db,
  InsertOneResult,
  MongoClient,
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

  formJWTPayload(username, id) {
    return {
      username,
      id: id.toString()
    }
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
      throw new BadRequestException
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
}
