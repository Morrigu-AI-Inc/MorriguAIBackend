import { Test, TestingModule } from '@nestjs/testing';
import { WebscraperService } from './webscraper.service';

describe('WebscraperService', () => {
  let service: WebscraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebscraperService],
    }).compile();

    service = module.get<WebscraperService>(WebscraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
