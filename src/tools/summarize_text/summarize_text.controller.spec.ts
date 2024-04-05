import { Test, TestingModule } from '@nestjs/testing';
import { SummarizeTextController } from './summarize_text.controller';

describe('SummarizeTextController', () => {
  let controller: SummarizeTextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummarizeTextController],
    }).compile();

    controller = module.get<SummarizeTextController>(SummarizeTextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
