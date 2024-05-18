import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
  imports: [DbModule]
})
export class ShipmentModule {}
