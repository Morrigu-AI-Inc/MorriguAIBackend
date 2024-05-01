import { Test, TestingModule } from '@nestjs/testing';
import { HiringPlanController } from './hiring-plan.controller';

describe('HiringPlanController', () => {
  let controller: HiringPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiringPlanController],
    }).compile();

    controller = module.get<HiringPlanController>(HiringPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
