import { Test, TestingModule } from '@nestjs/testing';

import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MongoController],
      providers: [MongoService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<MongoController>(MongoController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
