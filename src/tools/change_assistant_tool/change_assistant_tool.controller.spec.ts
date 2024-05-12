import { Test, TestingModule } from '@nestjs/testing';
import { ChangeAssistantToolController } from './change_assistant_tool.controller';

describe('ChangeAssistantToolController', () => {
  let controller: ChangeAssistantToolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeAssistantToolController],
    }).compile();

    controller = module.get<ChangeAssistantToolController>(ChangeAssistantToolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
