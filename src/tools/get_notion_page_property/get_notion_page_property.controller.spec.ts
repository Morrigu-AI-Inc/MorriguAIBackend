import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionPagePropertyController } from './get_notion_page_property.controller';

describe('GetNotionPagePropertyController', () => {
  let controller: GetNotionPagePropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionPagePropertyController],
    }).compile();

    controller = module.get<GetNotionPagePropertyController>(GetNotionPagePropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
