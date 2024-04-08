import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyGetCustomersController } from './shopify_get_customers.controller';

describe('ShopifyGetCustomersController', () => {
  let controller: ShopifyGetCustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyGetCustomersController],
    }).compile();

    controller = module.get<ShopifyGetCustomersController>(ShopifyGetCustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
