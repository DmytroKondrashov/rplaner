import { Test } from '@nestjs/testing';

import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ClientService],
    }).compile();

    service = app.get<ClientService>(ClientService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
