import { Test, TestingModule } from '@nestjs/testing';
import { BedrockController } from './bedrock.controller';

describe('BedrockController', () => {
  let controller: BedrockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BedrockController],
    }).compile();

    controller = module.get<BedrockController>(BedrockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
