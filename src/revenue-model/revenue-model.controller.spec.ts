import { Test, TestingModule } from '@nestjs/testing';
import { RevenueModelController } from './revenue-model.controller';

describe('RevenueModelController', () => {
  let controller: RevenueModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueModelController],
    }).compile();

    controller = module.get<RevenueModelController>(RevenueModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
