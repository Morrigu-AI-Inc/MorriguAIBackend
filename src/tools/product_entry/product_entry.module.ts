import { Module } from '@nestjs/common';
import { ProductEntryController } from './product_entry.controller';

@Module({
  controllers: [ProductEntryController]
})
export class ProductEntryModule {}
