import { Test, TestingModule } from '@nestjs/testing';
import { BbsubsService } from './bbsubs.service';

describe('BbsubsService', () => {
  let service: BbsubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BbsubsService],
    }).compile();

    service = module.get<BbsubsService>(BbsubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
