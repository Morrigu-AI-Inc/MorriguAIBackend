import { Test, TestingModule } from '@nestjs/testing';
import { CreatePurchaseOrderController } from './create_purchase_order.controller';

describe('CreatePurchaseOrderController', () => {
  let controller: CreatePurchaseOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatePurchaseOrderController],
    }).compile();

    controller = module.get<CreatePurchaseOrderController>(CreatePurchaseOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
