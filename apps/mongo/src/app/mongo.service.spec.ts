import { Test } from '@nestjs/testing';

import { MongoService } from './mongo.service';

describe('AppService', () => {
  let service: MongoService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [MongoService],
    }).compile();

    service = app.get<MongoService>(MongoService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
