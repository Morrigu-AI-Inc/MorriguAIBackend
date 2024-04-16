import { Module } from '@nestjs/common';
import { CreateInvoiceController } from './create_invoice.controller';

@Module({
  controllers: [CreateInvoiceController]
})
export class CreateInvoiceModule {}
