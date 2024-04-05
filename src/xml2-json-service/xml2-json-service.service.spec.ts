import { Test, TestingModule } from '@nestjs/testing';
import { Xml2JsonServiceService } from './xml2-json-service.service';

describe('Xml2JsonServiceService', () => {
  let service: Xml2JsonServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Xml2JsonServiceService],
    }).compile();

    service = module.get<Xml2JsonServiceService>(Xml2JsonServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
