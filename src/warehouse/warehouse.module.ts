import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  imports: [DbModule],
})
export class WarehouseModule {}
