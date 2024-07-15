import { Test, TestingModule } from '@nestjs/testing';
import { UsdaDataService } from './usda_data.service';

describe('UsdaDataService', () => {
  let service: UsdaDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsdaDataService],
    }).compile();

    service = module.get<UsdaDataService>(UsdaDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
