import { Test, TestingModule } from '@nestjs/testing';
import { PrompthistoryController } from './prompthistory.controller';

describe('PrompthistoryController', () => {
  let controller: PrompthistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrompthistoryController],
    }).compile();

    controller = module.get<PrompthistoryController>(PrompthistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
