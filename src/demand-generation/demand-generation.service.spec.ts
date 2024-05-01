import { Test, TestingModule } from '@nestjs/testing';
import { DemandGenerationService } from './demand-generation.service';

describe('DemandGenerationService', () => {
  let service: DemandGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandGenerationService],
    }).compile();

    service = module.get<DemandGenerationService>(DemandGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
