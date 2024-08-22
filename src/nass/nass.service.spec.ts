import { Test, TestingModule } from '@nestjs/testing';
import { NassService } from './nass.service';

describe('NassService', () => {
  let service: NassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NassService],
    }).compile();

    service = module.get<NassService>(NassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
