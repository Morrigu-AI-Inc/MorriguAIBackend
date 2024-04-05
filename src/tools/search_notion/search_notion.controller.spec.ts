import { Test, TestingModule } from '@nestjs/testing';
import { SearchNotionController } from './search_notion.controller';

describe('SearchNotionController', () => {
  let controller: SearchNotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchNotionController],
    }).compile();

    controller = module.get<SearchNotionController>(SearchNotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
