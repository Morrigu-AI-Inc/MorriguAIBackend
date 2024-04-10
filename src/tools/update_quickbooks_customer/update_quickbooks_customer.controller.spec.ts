import { Test, TestingModule } from '@nestjs/testing';
import { UpdateQuickbooksCustomerController } from './update_quickbooks_customer.controller';

describe('UpdateQuickbooksCustomerController', () => {
  let controller: UpdateQuickbooksCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateQuickbooksCustomerController],
    }).compile();

    controller = module.get<UpdateQuickbooksCustomerController>(UpdateQuickbooksCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
