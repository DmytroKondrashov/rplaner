import { Injectable } from '@nestjs/common';

@Injectable()
export class PlansService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
