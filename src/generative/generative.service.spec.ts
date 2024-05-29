import { Test, TestingModule } from '@nestjs/testing';
import { GenerativeService } from './generative.service';

describe('GenerativeService', () => {
  let service: GenerativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerativeService],
    }).compile();

    service = module.get<GenerativeService>(GenerativeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
