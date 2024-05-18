import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  imports: [DbModule],
})
export class InventoryModule {}
