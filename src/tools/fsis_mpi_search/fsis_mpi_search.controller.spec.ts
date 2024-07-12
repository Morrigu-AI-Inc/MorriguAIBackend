import { Test, TestingModule } from '@nestjs/testing';
import { FsisMpiSearchController } from './fsis_mpi_search.controller';
import { FsisMpiSearchService } from './fsis_mpi_search.service';

describe('FsisMpiSearchController', () => {
  let controller: FsisMpiSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FsisMpiSearchController],
      providers: [FsisMpiSearchService],
    }).compile();

    controller = module.get<FsisMpiSearchController>(FsisMpiSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
