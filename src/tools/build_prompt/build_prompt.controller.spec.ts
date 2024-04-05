import { Test, TestingModule } from '@nestjs/testing';
import { BuildPromptController } from './build_prompt.controller';

describe('BuildPromptController', () => {
  let controller: BuildPromptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildPromptController],
    }).compile();

    controller = module.get<BuildPromptController>(BuildPromptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
