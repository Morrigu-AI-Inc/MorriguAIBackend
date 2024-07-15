import { Test, TestingModule } from '@nestjs/testing';
import { UsdaDataController } from './usda_data.controller';
import { UsdaDataService } from './usda_data.service';

describe('UsdaDataController', () => {
  let controller: UsdaDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsdaDataController],
      providers: [UsdaDataService],
    }).compile();

    controller = module.get<UsdaDataController>(UsdaDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
