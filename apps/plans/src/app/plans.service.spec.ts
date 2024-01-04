import { Test } from '@nestjs/testing';

import { PlansService } from './plans.service';

describe('AppService', () => {
  let service: PlansService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PlansService],
    }).compile();

    service = app.get<PlansService>(PlansService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
