import { Test, TestingModule } from '@nestjs/testing';
import { BrandedFoodController } from './branded_food.controller';
import { BrandedFoodService } from './branded_food.service';

describe('BrandedFoodController', () => {
  let controller: BrandedFoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandedFoodController],
      providers: [BrandedFoodService],
    }).compile();

    controller = module.get<BrandedFoodController>(BrandedFoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
