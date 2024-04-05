import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionBlockChildrenController } from './get_notion_block_children.controller';

describe('GetNotionBlockChildrenController', () => {
  let controller: GetNotionBlockChildrenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionBlockChildrenController],
    }).compile();

    controller = module.get<GetNotionBlockChildrenController>(GetNotionBlockChildrenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
