import { Test, TestingModule } from '@nestjs/testing';
import { BuildPromptService } from './build_prompt.service';

describe('BuildPromptService', () => {
  let service: BuildPromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildPromptService],
    }).compile();

    service = module.get<BuildPromptService>(BuildPromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
