import { Test, TestingModule } from '@nestjs/testing';
import { SearchPropertyController } from './search_property.controller';

describe('SearchPropertyController', () => {
  let controller: SearchPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchPropertyController],
    }).compile();

    controller = module.get<SearchPropertyController>(SearchPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
