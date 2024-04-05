import { Test, TestingModule } from '@nestjs/testing';
import { SearchForMoreToolsService } from './search_for_more_tools.service';

describe('SearchForMoreToolsService', () => {
  let service: SearchForMoreToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchForMoreToolsService],
    }).compile();

    service = module.get<SearchForMoreToolsService>(SearchForMoreToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
