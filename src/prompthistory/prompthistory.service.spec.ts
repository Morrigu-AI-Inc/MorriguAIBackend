import { Test, TestingModule } from '@nestjs/testing';
import { PrompthistoryService } from './prompthistory.service';

describe('PrompthistoryService', () => {
  let service: PrompthistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrompthistoryService],
    }).compile();

    service = module.get<PrompthistoryService>(PrompthistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
