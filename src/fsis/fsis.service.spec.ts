import { Test, TestingModule } from '@nestjs/testing';
import { FsisService } from './fsis.service';

describe('FsisService', () => {
  let service: FsisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsisService],
    }).compile();

    service = module.get<FsisService>(FsisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
