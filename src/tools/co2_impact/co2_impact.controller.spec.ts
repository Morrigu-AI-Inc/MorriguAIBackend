import { Test, TestingModule } from '@nestjs/testing';
import { Co2ImpactController } from './co2_impact.controller';

describe('Co2ImpactController', () => {
  let controller: Co2ImpactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Co2ImpactController],
    }).compile();

    controller = module.get<Co2ImpactController>(Co2ImpactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
