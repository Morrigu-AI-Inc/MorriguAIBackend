import { Test, TestingModule } from '@nestjs/testing';
import { QuickbooksQueryController } from './quickbooks_query.controller';

describe('QuickbooksQueryController', () => {
  let controller: QuickbooksQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickbooksQueryController],
    }).compile();

    controller = module.get<QuickbooksQueryController>(QuickbooksQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
