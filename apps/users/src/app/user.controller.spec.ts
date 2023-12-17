import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const userController = app.get<UserController>(UserController);
      expect(userController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
