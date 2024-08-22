import { Test, TestingModule } from '@nestjs/testing';
import { ObjectmatcherService } from './objectmatcher.service';

describe('ObjectmatcherService', () => {
  let service: ObjectmatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectmatcherService],
    }).compile();

    service = module.get<ObjectmatcherService>(ObjectmatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
