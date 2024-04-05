import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionCommentsController } from './get_notion_comments.controller';

describe('GetNotionCommentsController', () => {
  let controller: GetNotionCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionCommentsController],
    }).compile();

    controller = module.get<GetNotionCommentsController>(GetNotionCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
