import { Test, TestingModule } from '@nestjs/testing';
import { HiringPlanService } from './hiring-plan.service';

describe('HiringPlanService', () => {
  let service: HiringPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiringPlanService],
    }).compile();

    service = module.get<HiringPlanService>(HiringPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
