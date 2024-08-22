import { Test, TestingModule } from '@nestjs/testing';
import { ImportyetiService } from './importyeti.service';

describe('ImportyetiService', () => {
  let service: ImportyetiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportyetiService],
    }).compile();

    service = module.get<ImportyetiService>(ImportyetiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
