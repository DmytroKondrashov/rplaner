import { Test, TestingModule } from '@nestjs/testing';

import { ClientController } from './users.controller';
import { ClientService } from './client.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<ClientController>(ClientController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
