import { Test, TestingModule } from '@nestjs/testing';
import { AnthropicController } from './anthropic.controller';

describe('AnthropicController', () => {
  let controller: AnthropicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthropicController],
    }).compile();

    controller = module.get<AnthropicController>(AnthropicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
