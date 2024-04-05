import { Test, TestingModule } from '@nestjs/testing';
import { FunctionCallsController } from './function-calls.controller';

describe('FunctionCallsController', () => {
  let controller: FunctionCallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunctionCallsController],
    }).compile();

    controller = module.get<FunctionCallsController>(FunctionCallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
