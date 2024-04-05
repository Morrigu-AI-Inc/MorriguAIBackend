import { Test, TestingModule } from '@nestjs/testing';
import { GetToolDescriptionController } from './get_tool_description.controller';

describe('GetToolDescriptionController', () => {
  let controller: GetToolDescriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetToolDescriptionController],
    }).compile();

    controller = module.get<GetToolDescriptionController>(
      GetToolDescriptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
