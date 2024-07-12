import { Test, TestingModule } from '@nestjs/testing';
import { FsisMpiSearchService } from './fsis_mpi_search.service';

describe('FsisMpiSearchService', () => {
  let service: FsisMpiSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsisMpiSearchService],
    }).compile();

    service = module.get<FsisMpiSearchService>(FsisMpiSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
