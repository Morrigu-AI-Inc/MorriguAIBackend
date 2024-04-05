import { Test, TestingModule } from '@nestjs/testing';
import { FunctionCallsService } from './function-calls.service';

describe('FunctionCallsService', () => {
  let service: FunctionCallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionCallsService],
    }).compile();

    service = module.get<FunctionCallsService>(FunctionCallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
