import { Test, TestingModule } from '@nestjs/testing';
import { QuickbooksUpdateController } from './quickbooks_update.controller';

describe('QuickbooksUpdateController', () => {
  let controller: QuickbooksUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickbooksUpdateController],
    }).compile();

    controller = module.get<QuickbooksUpdateController>(QuickbooksUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
