import { Test, TestingModule } from '@nestjs/testing';
import { OperatingModelService } from './operating-model.service';

describe('OperatingModelService', () => {
  let service: OperatingModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperatingModelService],
    }).compile();

    service = module.get<OperatingModelService>(OperatingModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
