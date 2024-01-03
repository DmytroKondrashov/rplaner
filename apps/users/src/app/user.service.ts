import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Collection,
  Db,
  MongoClient,
  WithId,
} from 'mongodb';
import { SignInDto } from './dtos/sign.in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  database: Db;
  client: MongoClient;

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

  async login(data: SignInDto) {
    const { userName, password } = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await this.findOne('users', { userName });
    if (!user) {
      throw new NotFoundException();
    }
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.userName };

    return {
      access_token: await this.jwtService.signAsync(payload, {secret: `${process.env.JWT_KEY}`}),
    };
  }
}
