import { Test, TestingModule } from '@nestjs/testing';
import { ProductEntryController } from './product_entry.controller';

describe('ProductEntryController', () => {
  let controller: ProductEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductEntryController],
    }).compile();

    controller = module.get<ProductEntryController>(ProductEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
