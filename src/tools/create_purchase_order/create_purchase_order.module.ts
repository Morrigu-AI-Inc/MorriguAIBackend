import { Module } from '@nestjs/common';
import { CreatePurchaseOrderController } from './create_purchase_order.controller';

@Module({
  controllers: [CreatePurchaseOrderController]
})
export class CreatePurchaseOrderModule {}
