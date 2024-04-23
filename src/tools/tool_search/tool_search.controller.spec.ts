import { Test, TestingModule } from '@nestjs/testing';
import { ToolSearchController } from './tool_search.controller';

describe('ToolSearchController', () => {
  let controller: ToolSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolSearchController],
    }).compile();

    controller = module.get<ToolSearchController>(ToolSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
