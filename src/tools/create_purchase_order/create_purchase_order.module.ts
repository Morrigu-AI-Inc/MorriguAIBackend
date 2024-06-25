import { Module } from '@nestjs/common';
import { CreatePurchaseOrderController } from './create_purchase_order.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [CreatePurchaseOrderController],
  imports: [DbModule]
})
export class CreatePurchaseOrderModule {}
