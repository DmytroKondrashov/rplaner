import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
