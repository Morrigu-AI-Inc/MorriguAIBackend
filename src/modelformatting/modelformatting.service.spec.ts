import { Test, TestingModule } from '@nestjs/testing';
import { ModelformattingService } from './modelformatting.service';

describe('ModelformattingService', () => {
  let service: ModelformattingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelformattingService],
    }).compile();

    service = module.get<ModelformattingService>(ModelformattingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
