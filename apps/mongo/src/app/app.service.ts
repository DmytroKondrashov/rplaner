import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
