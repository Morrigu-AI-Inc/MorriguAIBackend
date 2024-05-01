import { Test, TestingModule } from '@nestjs/testing';
import { DemandGenerationController } from './demand-generation.controller';

describe('DemandGenerationController', () => {
  let controller: DemandGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandGenerationController],
    }).compile();

    controller = module.get<DemandGenerationController>(DemandGenerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
