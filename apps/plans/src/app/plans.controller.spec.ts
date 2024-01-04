import { Test, TestingModule } from '@nestjs/testing';

import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [PlansService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<PlansController>(PlansController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
