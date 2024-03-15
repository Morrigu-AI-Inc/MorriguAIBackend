import { Test, TestingModule } from '@nestjs/testing';
import { PromptflagService } from './promptflag.service';

describe('PromptflagService', () => {
  let service: PromptflagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptflagService],
    }).compile();

    service = module.get<PromptflagService>(PromptflagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
