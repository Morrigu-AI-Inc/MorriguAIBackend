import { Test, TestingModule } from '@nestjs/testing';
import { OperatingModelController } from './operating-model.controller';

describe('OperatingModelController', () => {
  let controller: OperatingModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperatingModelController],
    }).compile();

    controller = module.get<OperatingModelController>(OperatingModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
