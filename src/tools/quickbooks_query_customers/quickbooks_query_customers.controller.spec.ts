import { Test, TestingModule } from '@nestjs/testing';
import { QuickbooksQueryCustomersController } from './quickbooks_query_customers.controller';

describe('QuickbooksQueryCustomersController', () => {
  let controller: QuickbooksQueryCustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickbooksQueryCustomersController],
    }).compile();

    controller = module.get<QuickbooksQueryCustomersController>(QuickbooksQueryCustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
