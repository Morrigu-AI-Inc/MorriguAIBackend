import { Test, TestingModule } from '@nestjs/testing';
import { UseraclsService } from './useracls.service';

describe('UseraclsService', () => {
  let service: UseraclsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UseraclsService],
    }).compile();

    service = module.get<UseraclsService>(UseraclsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
