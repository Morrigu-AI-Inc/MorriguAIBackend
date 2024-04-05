import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionBlockController } from './get_notion_block.controller';

describe('GetNotionBlockController', () => {
  let controller: GetNotionBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionBlockController],
    }).compile();

    controller = module.get<GetNotionBlockController>(GetNotionBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
