import { Test, TestingModule } from '@nestjs/testing';
import { BrandedFoodService } from './branded_food.service';

describe('BrandedFoodService', () => {
  let service: BrandedFoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandedFoodService],
    }).compile();

    service = module.get<BrandedFoodService>(BrandedFoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
