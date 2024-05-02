import { Test, TestingModule } from '@nestjs/testing';
import { SalesVolumeService } from './sales-volume.service';

describe('SalesVolumeService', () => {
  let service: SalesVolumeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesVolumeService],
    }).compile();

    service = module.get<SalesVolumeService>(SalesVolumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
