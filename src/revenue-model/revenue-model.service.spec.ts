import { Test, TestingModule } from '@nestjs/testing';
import { RevenueModelService } from './revenue-model.service';

describe('RevenueModelService', () => {
  let service: RevenueModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevenueModelService],
    }).compile();

    service = module.get<RevenueModelService>(RevenueModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
