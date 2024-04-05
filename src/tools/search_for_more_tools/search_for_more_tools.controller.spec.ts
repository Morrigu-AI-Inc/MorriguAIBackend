import { Test, TestingModule } from '@nestjs/testing';
import { SearchForMoreToolsController } from './search_for_more_tools.controller';

describe('SearchForMoreToolsController', () => {
  let controller: SearchForMoreToolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchForMoreToolsController],
    }).compile();

    controller = module.get<SearchForMoreToolsController>(SearchForMoreToolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
