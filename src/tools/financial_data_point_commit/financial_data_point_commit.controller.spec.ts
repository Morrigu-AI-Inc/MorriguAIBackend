import { Test, TestingModule } from '@nestjs/testing';
import { FinancialDataPointCommitController } from './financial_data_point_commit.controller';

describe('FinancialDataPointCommitController', () => {
  let controller: FinancialDataPointCommitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialDataPointCommitController],
    }).compile();

    controller = module.get<FinancialDataPointCommitController>(FinancialDataPointCommitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
