import { Test, TestingModule } from '@nestjs/testing';
import { CreateInvoiceController } from './create_invoice.controller';

describe('CreateInvoiceController', () => {
  let controller: CreateInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateInvoiceController],
    }).compile();

    controller = module.get<CreateInvoiceController>(CreateInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
