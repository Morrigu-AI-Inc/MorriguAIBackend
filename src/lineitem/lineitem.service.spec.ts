import { Test, TestingModule } from '@nestjs/testing';
import { LineitemService } from './lineitem.service';

describe('LineitemService', () => {
  let service: LineitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineitemService],
    }).compile();

    service = module.get<LineitemService>(LineitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
