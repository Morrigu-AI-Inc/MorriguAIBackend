import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionPageController } from './get_notion_page.controller';

describe('GetNotionPageController', () => {
  let controller: GetNotionPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionPageController],
    }).compile();

    controller = module.get<GetNotionPageController>(GetNotionPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
