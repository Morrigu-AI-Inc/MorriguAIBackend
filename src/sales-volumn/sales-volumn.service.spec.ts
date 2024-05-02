import { Test, TestingModule } from '@nestjs/testing';
import { SalesVolumnService } from './sales-volumn.service';

describe('SalesVolumnService', () => {
  let service: SalesVolumnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesVolumnService],
    }).compile();

    service = module.get<SalesVolumnService>(SalesVolumnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
